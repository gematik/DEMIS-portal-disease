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

import { FormlyFieldConfig } from '@ngx-formly/core';
import { EnableWhen } from '../demis-types';
import { NotifiedPersonAddressInfo } from '../../api/notification';

export async function sleep(durationInMillies: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, durationInMillies);
  });
}

export function now1() {
  return (Math.floor(Date.now() / 100) % 600) / 10;
}

export function isPromise(val: any | Promise<any>): val is Promise<any> {
  return val && (<Promise<any>>val).then !== undefined;
}

export function dateStringToIso(s?: string): string {
  if (!s) {
    return '';
  }
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
  if (match) {
    const dString = `${match[3]}-${match[2]}-${match[1]}`;
    const date = new Date(dString);
    return date.toISOString();
  } else {
    return '';
  }
}

function enableOnEvery(fc: FormlyFieldConfig): boolean {
  const behavior: string = fc.props?.['enableBehavior'] || 'ANY';
  switch (behavior) {
    case 'ANY':
      return false;
    case 'ALL':
      return true;
    default:
      console.warn(`Unknown enableBehavior: ${behavior}`);
      return false;
  }
}

function compileEnableWhen(enableWhen: EnableWhen, fc: FormlyFieldConfig): (ffc: FormlyFieldConfig) => boolean {
  function getValue(ffc: FormlyFieldConfig, props: string[]): string | undefined {
    let result: any | undefined = ffc;
    for (let i = 0; i < props.length && result; i++) {
      result = result[props[i]];
    }
    return result;
  }

  function evaluateCondition(condition: any, ffc: FormlyFieldConfig): boolean {
    const value = getValue(ffc, condition.props);
    switch (condition.op) {
      case '=':
        return value === condition.value;
      case '!=':
        return value !== condition.value;
      default:
        console.warn(`Unknown enable-when operator: ${condition.op}`);
        return false;
    }
  }

  const conditions = enableWhen.map(ew => ({
    props: [...ew.path.split('.'), 'model', 'valueCoding', 'code'],
    op: ew.op,
    value: ew.value,
  }));

  const every: boolean = enableOnEvery(fc);

  return (ffc: FormlyFieldConfig) => {
    if (every) {
      return conditions.every(condition => evaluateCondition(condition, ffc));
    } else {
      return conditions.some(condition => evaluateCondition(condition, ffc));
    }
  };
}

/*
 * As we can not put expressions in string form inside the transmitted formly JSON
 * (our CSP-Header does not eval-uation of strings), we put a simple object of type 'EnableWhen'
 * into 'props.enableWhen'. This object (it is a kind of syntax tree for very simple expressions)
 * is converted into a function and then stored in fieldconfig expressions property.
 */
export function createExpressions(configs: FormlyFieldConfig[]): void {
  function createExpression(fc: FormlyFieldConfig) {
    const enableWhen = fc?.props?.['enableWhen'];
    if (enableWhen) {
      fc.expressions = fc.expressions || {};
      const enabledCondition = compileEnableWhen(enableWhen, fc);
      fc.expressions['hide'] = (field: FormlyFieldConfig) => !enabledCondition(field);
    }

    /*
     * A general solution instead the specific 'enableWhen'.
     * IMHO a more expressive language should be used instead the
     * crude EnableWhen type (though that is engineered according to sound
     * object-oriented design principles with best practices...)
     */
    // const secureExpressions = fc.props?.['SECURE_EXPRESSIONS']
    // if (secureExpressions) {
    //   fc.expressions = fc.expressions || {}
    //   for (const key of Object.keys(secureExpressions)) {
    //     fc.expressions[key] = compileSecureExpression(secureExpressions[key])
    //   }
    // }

    if (fc?.fieldGroup) {
      createExpressions(fc.fieldGroup);
    }
    if (fc?.fieldArray) {
      createExpression(fc.fieldArray as FormlyFieldConfig);
    }
  }

  if (configs) {
    configs.forEach(fc => createExpression(fc));
  }
}

export function combinePaths(a: string, b: string | number | (string | number)[] | undefined): string {
  const effectiveB = b ? b.toString() : '';
  if (a === '') {
    return effectiveB;
  }
  if (effectiveB === '') return a;
  else return `${a}.${b}`;
}

const baseCollator = Intl.Collator(undefined, { sensitivity: 'base' });

export function equalIgnoreCase(a: string, b: string): boolean {
  return baseCollator.compare(a, b) === 0;
}

export function isAddressPartlyFilled(address: NotifiedPersonAddressInfo): boolean {
  //country is set by default so only other fields matter
  return !!Object.keys(address).filter(key => key !== 'country').length;
}

export function findFormlyFieldIterativeByKey(rootFields: FormlyFieldConfig[], key: string): FormlyFieldConfig | undefined {
  const stack = [...rootFields]; // Stack mit allen Wurzel-Feldern

  while (stack.length > 0) {
    const field = stack.pop(); // Nächstes Feld aus dem Stack nehmen
    if (!field) continue;
    if (field.key === key) return field; // Feld gefunden!
    if (field.fieldGroup) {
      stack.push(...field.fieldGroup);
    }
    if (field.fieldArray) {
      if (typeof field.fieldArray === 'function') {
        stack.push(field.fieldArray(field));
      } else {
        stack.push(field.fieldArray);
      }
    }
  }
  return undefined;
}
