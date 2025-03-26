/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { matchesRegExp } from '../../legacy/notification-form-validation-module';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ErrorMessage } from '../../shared/error-message';
import { isArray, merge } from 'lodash-es';
import { equalIgnoreCase, isPromise, sleep } from '../../shared/utils';
import { DemisCoding } from '../../demis-types';
import { FormGroup } from '@angular/forms';
import { AddressType } from '../../../api/notification';

export type ClipboardRules = Record<string, (key: string, partialModel: any) => any | Promise<any>>;

type ImportSpec = { importKey: string; multi?: boolean };

const FORMLY_PATH_PROPERTY_NAME = '_formlyPathKeys_';

export interface ImportTargetComponent {
  afterTransfer(importKey: string, value: any): Promise<ErrorMessage[]>;

  get formlyConfigFields(): FormlyFieldConfig[];

  get model(): any;

  get form(): FormGroup<{}>;

  get storage(): Record<string, any>;
}

function keyPath(ffc: FormlyFieldConfig): string {
  return `${ffc.props?.[FORMLY_PATH_PROPERTY_NAME]}`;
}

async function setModelValue(model: any, path: string, values: any[], multi: boolean, isMultiSelectComponent: boolean) {
  const keys = path.split('.');
  const length = keys.length - 2; // ignore "answer.valueXxx"
  let index = 0;
  let m = model;

  while (m && index < length) {
    const key = keys[index];
    if (key.endsWith('[0]')) {
      const baseKey = key.substring(0, key.length - 3);

      if (index === length - 1) {
        if (multi) {
          m[baseKey] = values.map(v => ({ answer: v }));
          return;
        }
      }

      if (!m[baseKey]) {
        m[baseKey] = [];
      }
      m = m[baseKey];
      if (!isArray(m)) {
        console.error('expected an array in model %o at index %s in path %o', model, index, keys);
        throw new ErrorMessage('E0004');
      }

      if (m.length === 0 || !m[0]) {
        m[0] = {};
        await sleep(0); // give formly a chance to catch up
      }
      m = m[0];
    } else {
      if (!m[key]) {
        m[key] = {};
      }
      m = m[key];
    }

    index++;
  }

  if (values.length > 0) {
    if (isMultiSelectComponent) {
      m.answer = {
        valueCoding: values.map(v => v.valueCoding),
      };
    } else {
      m.answer = values[0];
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ImportFieldValuesService {
  constructor(
    public dialog: MatDialog,
    private logger: NGXLogger
  ) {}

  async getClipboardKVs(): Promise<string[][]> {
    const raw = await window.navigator.clipboard.readText();
    if (!matchesRegExp(/^URL .*/, raw)) {
      throw 'invalid clipboard: it does not start with "URL "';
    }
    const urlParams = raw.substring(4);
    const kvs: string[][] = decodeURI(urlParams)
      .split('&')
      .map(s => s.split('=').map(s => s.trim()));
    if (kvs.length === 0) {
      throw 'empty parameter list';
    }
    return kvs;
  }

  /**
   * Transfers the parameters from the clipboard to the form.
   * @param pasteTarget ImportTargetComponent
   * @param keyValuePairs string[][] - Array of key-value-pairs containing the import key and a value
   * @param clipboardRules ClipboardRules - Mapping from import-key to formly-path
   */
  async fillModelFromKVs(pasteTarget: ImportTargetComponent, keyValuePairs: string[][], clipboardRules: ClipboardRules): Promise<ErrorMessage[]> {
    const problems: ErrorMessage[] = [];

    function combinePaths(a: string, b: string | number | (string | number)[] | undefined): string {
      const effectiveB = b ? b.toString() : '';
      if (a === '') {
        return effectiveB;
      }
      if (effectiveB === '') return a;
      else return `${a}.${b}`;
    }

    async function checkClipboardForEveryFormField(ivs: ImportFieldValuesService, fieldConfig: FormlyFieldConfig, path: string, keyValuePairs: string[][]) {
      const importSpec: ImportSpec | undefined = fieldConfig.props?.['importSpec'];
      if (importSpec) {
        fieldConfig.props![FORMLY_PATH_PROPERTY_NAME] = path;
        const kvp = keyValuePairs.find(kvp => kvp[0] === importSpec.importKey);
        if (kvp) {
          try {
            await ivs.executeAction(pasteTarget, importSpec.importKey, kvp[1], fieldConfig);
          } catch (e) {
            if (e instanceof ErrorMessage) {
              // a non-matching code should not break the processing but the code flow requires to throw an error, so we filter it out here.
              if (e.code !== 'E0007') problems.push(e);
            }
          }
        }
      }

      if (fieldConfig.fieldGroup) {
        for (const childConfig of fieldConfig.fieldGroup) {
          await checkClipboardForEveryFormField(ivs, childConfig, combinePaths(path, childConfig.key), keyValuePairs);
        }
      }

      if (fieldConfig.fieldArray) {
        await checkClipboardForEveryFormField(ivs, fieldConfig.fieldArray as FormlyFieldConfig, path + '[0]', keyValuePairs);
      }
    }

    // the first two pages are still hardcoded formly-configs that were taken from the old code.
    // The rest of the form will be loaded when the disease code was set. For now we will only process the legacy values
    // that are person or facility specific
    const legacyValues = [...keyValuePairs];
    for (let [importKey, rawValue] of legacyValues) {
      if (!importKey) {
        continue;
      }
      if (rawValue === '') {
        continue;
      }
      if (rawValue === undefined) {
        problems.push(new ErrorMessage('E0001', importKey));
        continue;
      }

      //the facility type is the only field using value coding in the legacy forms. special handling necessary!
      if (importKey === 'F.type') {
        await this.executeAction(pasteTarget, 'F.type', rawValue, pasteTarget.formlyConfigFields[0].fieldGroup![0].fieldGroup![4].fieldGroup![3]);
      }

      if (importKey.startsWith('P.c.')) {
        pasteTarget.model.tabPatient.currentAddress.fromClipboard = true;
      }

      if (
        (pasteTarget.model.tabPatient.currentAddressType !== AddressType.SubmittingFacility &&
          !legacyValues.find(val => val[0] === 'P.c.type' && val[1] === 'submittingFacility')) ||
        !importKey.startsWith('P.c.') ||
        importKey === 'P.c.type'
      ) {
        if (clipboardRules[importKey]) {
          // this are the legacy rules
          const fn = clipboardRules[importKey];
          const promiseOrStruct = fn(rawValue, pasteTarget.model);
          if (isPromise(promiseOrStruct)) {
            const struct = await promiseOrStruct;
            merge(pasteTarget.model, struct);
            await pasteTarget.afterTransfer(importKey, rawValue);
            await sleep(0);
          } else {
            merge(pasteTarget.model, promiseOrStruct);
            await pasteTarget.afterTransfer(importKey, rawValue);
            await sleep(0);
          }
        } else {
          //unknown import key, just continue
          continue;
        }
      }
    }

    //if disease code is provided, it has to be set on page 3, so that the other parts of the form will be fetched from the backend
    const diseaseCode = keyValuePairs.find(kvp => kvp[0] === 'D.code');
    if (diseaseCode) {
      //get formly config of disease code form field
      const fc: FormlyFieldConfig = pasteTarget.formlyConfigFields[0].fieldGroup![2].fieldGroup!.find(g => g.id === 'disease-choice')!;
      fc.props![FORMLY_PATH_PROPERTY_NAME] = 'tabDiseaseChoice.diseaseChoice.answer.valueCoding';
      try {
        await this.executeAction(pasteTarget, diseaseCode[0], diseaseCode[1], fc);
      } catch (e) {
        console.error(e);
        problems.push(new ErrorMessage('E0003', diseaseCode[0], '' + e));
      }
    }

    //now the form should be completely loaded and the dynamic part (rest of page 3, page 4,5,6,...) can be processed.
    //so let's go recursively through these forms and see if there is a import value for a specific field and set it.
    if (pasteTarget.formlyConfigFields[0] && pasteTarget.formlyConfigFields[0].fieldGroup) {
      const fieldGroup = pasteTarget.formlyConfigFields[0].fieldGroup;
      for (let i = 2; i < fieldGroup.length; i++) {
        await checkClipboardForEveryFormField(
          this,
          fieldGroup[i],
          `${fieldGroup[i].key}`,
          keyValuePairs.filter(kvp => kvp[0] !== 'D.code')
        );
      }
    }

    pasteTarget.form.markAllAsTouched();
    delete pasteTarget.model?.tabPatient?.currentAddress?.fromClipboard;
    return problems;
  }

  private async executeAction(target: ImportTargetComponent, importKey: string, rawValue: string, ffc: FormlyFieldConfig) {
    const keys = keyPath(ffc).split('.');
    const valueType = keys[keys.length - 1];

    switch (valueType) {
      case 'valueDate':
        const valueDates = this.internValueDates(rawValue, ffc);
        await this.assignToModel(ffc, target.model, valueDates);
        break;
      case 'valueString':
        const valueStrings = this.internValueStrings(rawValue, ffc);
        await this.assignToModel(ffc, target.model, valueStrings);
        break;
      case 'valueCoding':
        const valueCodings = this.internValueCoding(rawValue, ffc);
        await this.assignToModel(ffc, target.model, valueCodings);
        break;
      default:
        throw new ErrorMessage('E0000', valueType, importKey);
        break;
    }

    await target.afterTransfer(importKey, rawValue);
  }

  internValueDates(rawValue: string, ffc: FormlyFieldConfig): { valueDate: string }[] {
    return rawValue.split(',').map(s => ({ valueDate: s.trim() }));
  }

  internValueStrings(rawValue: string, ffc: FormlyFieldConfig): { valueString: string }[] {
    return [{ valueString: rawValue.trim() }];
  }

  internValueCoding(rawValue: string, ffc: FormlyFieldConfig): { valueCoding: DemisCoding }[] {
    const options = ffc.props?.options as DemisCoding[] | undefined;
    if (!options) {
      throw new ErrorMessage('E0008', `${keyPath(ffc)}`);
    } else {
      return rawValue
        .split(',')
        .map(code => code.trim())
        .map(code => {
          const demisCoding = options.find((dc: DemisCoding) => equalIgnoreCase(dc.code, code));
          if (!demisCoding) throw new ErrorMessage('E0007', code, `${keyPath(ffc)}`);
          return { valueCoding: demisCoding };
        });
    }
  }

  async assignToModel(ffc: FormlyFieldConfig, model: any, values: any[]) {
    const path = keyPath(ffc);
    const importSpec: ImportSpec = ffc.props?.['importSpec'];
    await setModelValue(model, path, values, !!importSpec.multi, ffc.type === 'autocomplete-multi-coding');
  }
}
