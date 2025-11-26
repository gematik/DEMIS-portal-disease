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
import { combinePaths } from './shared/utils';
import { Quantity, QuestionnaireResponseAnswer, QuestionnaireResponseItem } from '../api/notification';

/*
 * As the Gateway accepts the answers only in the original sequence in the questionnaire
 * (think of named parameter AND positional parameter at the same time), we have to sort
 */
export function sortItems(items: QuestionnaireResponseItem[] | undefined, subSequence: any) {
  function sequenceNo(item: QuestionnaireResponseItem, subSequence: any): number {
    if (!subSequence) return 0;
    const node = subSequence[item.linkId];
    if (!node) return 0;
    return node.SEQUENCE_NO;
  }

  function recurse(items: QuestionnaireResponseItem[] | undefined, subSequence: any) {
    if (items) {
      items.sort((a, b) => {
        const aSeq: number = sequenceNo(a, subSequence);
        const bSeq: number = sequenceNo(b, subSequence);
        return aSeq - bSeq;
      });

      items.forEach(item => {
        if (item.answer) {
          item.answer.forEach(answer => recurse(answer.item, subSequence[item.linkId]));
        }
        recurse(item.item, subSequence[item.linkId]);
      });
    }
  }

  recurse(items, subSequence);
}

/**
 *
 * @param key the key of the item
 * @param body the body of the item
 * @param quantityFields as Quantity from formly field configuration
 * Formly field configurations contains information about quantity unit and system which is mapped here to the questionnaire response item
 * depending on the key
 */
function handleQuantityField(key: string, body: any, quantityFields?: Map<string, Quantity>): QuestionnaireResponseItem | undefined {
  if (!quantityFields?.size) return undefined;
  const q = quantityFields.get(key);
  if (!q || !body?.answer?.[key]) return undefined;
  return {
    linkId: key,
    answer: [
      {
        valueQuantity: {
          value: body.answer[key],
          unit: q.unit,
          system: q.system,
          code: q.code,
        },
      },
    ],
  };
}

function createItemFromEntry(entry: [string, any], quantityFields?: Map<string, Quantity>): QuestionnaireResponseItem {
  const key: string = entry[0];
  const body: any = entry[1];

  if (key.startsWith('value')) {
    // @todo check why conversion to unknown is needed after using generated api
    return Object.fromEntries([entry]) as unknown as QuestionnaireResponseItem;
  }

  // Handle boolean directly
  if (typeof body === 'boolean') {
    return { linkId: key, answer: [{ valueBoolean: body }] };
  }

  // Handle quantity field
  const quantityItem = handleQuantityField(key, body, quantityFields);
  if (quantityItem) {
    return quantityItem;
  }

  // Create standard item
  const item: QuestionnaireResponseItem = { linkId: key };

  // If body is an array with answer
  if (Array.isArray(body.answer)) {
    if (body.answer.length > 0) {
      item.answer = body.answer.map((x: any) => transformAnswer(x, quantityFields));
    }
    const children = transformChildren(body, quantityFields);
    if (children.length > 0) {
      item.item = children;
    }
    return item;
  }

  // If body is an object with answer
  if (body.answer) {
    let answer = transformAnswer(body.answer, quantityFields);
    item.answer = Array.isArray(answer) ? answer : [answer];
  }

  // If body is an array (but not an answer array)
  if (Array.isArray(body)) {
    const children = body.flatMap(x => transformChildren(x, quantityFields));
    if (children.length > 0) {
      item.item = children;
    }
    return item;
  }

  // Process other children
  const children = transformChildren(body, quantityFields);
  if (children.length > 0) {
    item.item = children;
  }

  return item;
}

export function formatItems(model: any, quantityFields?: Map<string, Quantity>): QuestionnaireResponseItem[] {
  if (!model) throw new Error(model);
  return Object.entries(model).map(entry => createItemFromEntry(entry, quantityFields));
}

function transformAnswer(answer: any, quantityFields?: Map<string, Quantity>): QuestionnaireResponseAnswer {
  //handle multi-select answers
  if (answer && answer.hasOwnProperty('valueCoding') && Array.isArray(answer.valueCoding)) {
    answer = answer.valueCoding.map((v: any) => {
      //remove coding designations from answer
      if (v.designations) {
        v.designations = null;
      }
      return { valueCoding: v };
    });
    return answer;
  }

  let answer1: any = {};
  const entries = Object.entries(answer);
  entries.filter(([k, v]) => k.startsWith('value')).forEach(([k, v]) => (answer1[k] = v));
  const itemEntries = entries.filter(([k, v]) => !k.startsWith('value'));
  if (itemEntries.length > 0) {
    const items = formatItems(Object.fromEntries(itemEntries), quantityFields); //.filter(item => item.item || item.answer)
    if (items.length > 0) {
      answer1.item = items;
    }
  }
  // remove coding designations
  if (answer1.valueCoding && answer1.valueCoding.designations) {
    answer1.valueCoding.designations = null;
  }
  return answer1;
}

function transformChildren(body: any, quantityFields?: Map<string, Quantity>): QuestionnaireResponseItem[] {
  const itemEntries = Object.entries(body).filter(([k, v]) => !k.startsWith('answer'));
  if (itemEntries.length > 0) {
    return formatItems(Object.fromEntries(itemEntries), quantityFields);
  } else {
    return [];
  }
}

const NOISE = ['answer', 'valueString', 'valueDate', 'valueCoding', 'valueReference'];
const LEAF_TYPES = ['autocomplete-coding', 'radio-button_coding', 'select-coding', 'input', 'textarea'];

// a fieldsequence helps with sorting the items in a notification message
export function makeFieldSequence(fields: FormlyFieldConfig[]): any {
  let seq = 0;
  const result: any = {};
  recurseN(fields, '');
  return result;

  function setSequenceNo(path: string) {
    const segments: string[] = path.split('.');
    let p = result;
    segments.forEach(segment => {
      if (!NOISE.includes(segment)) {
        if (!p[segment]) {
          p[segment] = {};
        }
        p = p[segment];
      }
    });
    p.SEQUENCE_NO = ++seq;
  }

  function recurseN(fields: FormlyFieldConfig[], path: string) {
    fields.forEach(field => recurse1(field, path));
  }

  function recurse1(field: FormlyFieldConfig, path: string) {
    if (!field) {
      return;
    }
    const fullPath = combinePaths(path, field.key);
    setSequenceNo(fullPath);
    if (field.fieldGroup) {
      recurseN(field.fieldGroup, fullPath);
    } else if (field.fieldArray) {
      recurse1(field.fieldArray as FormlyFieldConfig, fullPath);
    }
  }
}
