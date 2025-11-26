/*
    Copyright (c) 2025 gematik GmbH
    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
    European Commission – subsequent versions of the EUPL (the "Licence").
    You may not use this work except in compliance with the Licence.
    You find a copy of the Licence in the "Licence" file or at
    https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
    Unless required by applicable law or agreed to in writing,
    software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
    In case of changes by gematik find details in the "Readme" file.
    See the Licence for the specific language governing permissions and limitations under the Licence.
    *******
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { FormlyFieldConfig } from '@ngx-formly/core';
import { EnableWhen } from '../demis-types';
import { NotifiedPersonAddressInfo, Quantity } from '../../api/notification';

export async function sleep(durationInMillies: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, durationInMillies);
  });
}

export function isPromise(val: any | Promise<any>): val is Promise<any> {
  return val && (<Promise<any>>val).then !== undefined;
}

/**
 * Converts a date string in one of the supported formats (DD.MM.YYYY, MM.YYYY, or YYYY)
 * into a standardized ISO date string (YYYY-MM-DD).
 * - Supports 1- or 2-digit days and months.
 * - Returns an empty string if the input is invalid or doesn't match any expected format.
 * - Assumes the input is valid and correctly formatted.
 *
 * Examples:
 *   "03.04.2025"   → "2025-04-03"
 *   "3.4.2025"   → "2025-04-03"
 *   "4.2025"     → "2025-04-01"
 *   "2025"       → "2025-01-01"
 *
 * @deprecated Use the generic Datepicker with its auto conversion from Portal-Core instead
 *
 *@param s The input date string.
 *@returns An ISO-formatted date string or an empty string.
 */
export function dateStringToIso(s?: string): string {
  if (!s) return '';
  const trimmed = s.trim();

  // Format: D.M.YYYY or DD.MM.YYYY → YYYY-MM-DD
  const fullDateMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.test(trimmed);
  if (fullDateMatch) {
    const [day, month, year] = trimmed.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Format: M.YYYY or MM.YYYY → YYYY-MM-01
  if (/^(\d{1,2})\.(\d{4})$/.test(trimmed)) {
    const [month, year] = trimmed.split('.');
    return `${year}-${month.padStart(2, '0')}-01`;
  }

  // Format: YYYY → YYYY-01-01
  if (/^\d{4}$/.test(s)) {
    return `${s}-01-01`;
  }

  return '';
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

/**
 * Finds all fields with a 'quantity' prop in the given root fields and returns a map
 * where the keys are the field keys and the values are initialized Quantity objects.
 * Necessary for §7.3 notifications
 * @param rootFields
 */
export function findQuantityFieldsByProp(rootFields: FormlyFieldConfig[]): Map<string, Quantity> {
  const stack = [...rootFields];
  const quantityFields = new Map<string, Quantity>();

  while (stack.length > 0) {
    const field = stack.pop();
    if (!field) continue;
    if (field.props && field.props['quantity']) {
      quantityFields.set(field.key!.toString(), {
        value: 0,
        unit: field.props['quantity'].unit,
        system: field!.props['quantity'].system,
        code: field!.props['quantity'].code,
      });
    }
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
  return quantityFields;
}
