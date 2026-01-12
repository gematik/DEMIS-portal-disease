/*
    Copyright (c) 2026 gematik GmbH
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

import { formatItems, makeFieldSequence } from './format-items';
import { Quantity } from '../api/notification';
import { FIELDS } from '../test/shared/data/format-item-fields';

describe('utils', () => {
  it('should give the correct sequence numbers', () => {
    makeFieldSequence(FIELDS);
    expect(42).toEqual(42);
  });
});

describe('formatItems', () => {
  it('formats quantities correctly', () => {
    const quantityFields = new Map<string, Quantity>();
    quantityFields.set('q1', { value: 0, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' });
    const model = { q1: { answer: { q1: 42 } } };
    const result = formatItems(model, quantityFields);
    expect(result).toEqual([
      {
        linkId: 'q1',
        answer: [{ valueQuantity: { value: 42, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' } }],
      },
    ]);
  });

  it('formats nested question with quantity correctly', () => {
    const quantityFields = new Map<string, Quantity>();
    quantityFields.set('therapyPeriodOther', { value: 0, unit: 'days', system: 'http://unitsofmeasure.org', code: 'days' });
    const model = {
      therapy: {
        answer: {
          valueCoding: {
            code: '373066001',
            display: 'Ja',
            designations: [
              {
                language: 'de-DE',
                value: 'Ja',
              },
            ],
            system: 'http://snomed.info/sct',
          },
          therapyPeriodOther: {
            answer: {
              therapyPeriodOther: '66',
            },
          },
          medicationOther: {
            answer: {
              valueCoding: [
                {
                  code: '764147003',
                  display: 'Cephalosporin',
                  designations: [],
                  system: 'http://snomed.info/sct',
                  selected: true,
                },
              ],
            },
          },
        },
      },
    };
    const result = formatItems(model, quantityFields);
    expect(result as any).toEqual([
      {
        linkId: 'therapy',
        answer: [
          {
            valueCoding: {
              code: '373066001',
              display: 'Ja',
              designations: null,
              system: 'http://snomed.info/sct',
            },
            item: [
              {
                linkId: 'therapyPeriodOther',
                answer: [
                  {
                    valueQuantity: {
                      value: '66',
                      unit: 'days',
                      system: 'http://unitsofmeasure.org',
                      code: 'days',
                    },
                  },
                ],
              },
              {
                linkId: 'medicationOther',
                answer: [
                  {
                    valueCoding: {
                      code: '764147003',
                      display: 'Cephalosporin',
                      designations: null,
                      system: 'http://snomed.info/sct',
                      selected: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('ignores quantities with empty map', () => {
    const quantityFields = new Map<string, Quantity>();
    const model = { q1: { answer: { q1: 42 } } };
    const result = formatItems(model, quantityFields);
    expect(result).toEqual([
      {
        linkId: 'q1',
        answer: [{ item: [{ linkId: 'q1' }] }],
      },
    ]);
  });

  it('ignores quantity mapping when no quantityMap', () => {
    const model = { q1: { answer: { q1: 42 } } };
    const result = formatItems(model, undefined);
    // @ts-ignore
    expect(result).toEqual([
      {
        linkId: 'q1',
        answer: [{ item: [{ linkId: 'q1' }] }],
      },
    ]);
  });

  it('formats boolean answers', () => {
    const model = { myBool: true };
    const result = formatItems(model);
    expect(result).toEqual([{ linkId: 'myBool', answer: [{ valueBoolean: true }] }]);
  });

  it('transforms valueString', () => {
    const model = { q1: { answer: { valueString: 'myValue' } } };
    const result = formatItems(model);
    expect(result).toEqual([{ linkId: 'q1', answer: [{ valueString: 'myValue' }] }]);
  });

  it('transforms nested components', () => {
    const model = {
      parent: {
        answer: [
          {
            valueString: 'Example string',
            child: { answer: { valueString: 'Example value' } },
          },
        ],
      },
    };
    const result = formatItems(model);
    expect(result[0].linkId).toBe('parent');
    expect(result[0].answer![0].valueString).toBe('Example string');
    expect(result[0].answer![0].item![0]).toEqual({
      linkId: 'child',
      answer: [{ valueString: 'Example value' }],
    });
  });

  it('should throw an error if model is undefined', () => {
    expect(() => formatItems(undefined as any)).toThrow();
  });

  it('should handle nested items and answers', () => {
    const model = {
      parent: {
        answer: {
          valueString: 'Example string',
          child: { answer: { valueBoolean: false } },
        },
      },
    };
    const result = formatItems(model);
    expect(result).toEqual([
      {
        linkId: 'parent',
        answer: [
          {
            valueString: 'Example string',
            item: [{ linkId: 'child', answer: [{ valueBoolean: false }] }],
          },
        ],
      },
    ]);
  });

  it('process body as Array sets items', () => {
    const model = {
      parent: [{ child1: { answer: { valueString: 'theValue' } } }, { child2: { answer: { valueBoolean: true } } }],
    };
    const result = formatItems(model);
    expect(result).toEqual([
      {
        linkId: 'parent',
        item: [
          { linkId: 'child1', answer: [{ valueString: 'theValue' }] },
          { linkId: 'child2', answer: [{ valueBoolean: true }] },
        ],
      },
    ]);
  });

  it('processes other children when theres ist no answer property', () => {
    const model = {
      parent: {
        child1: { answer: { valueString: 'theValue' } },
        child2: { answer: { valueBoolean: true } },
      },
    };
    const result = formatItems(model);
    expect(result).toEqual([
      {
        linkId: 'parent',
        item: [
          { linkId: 'child1', answer: [{ valueString: 'theValue' }] },
          { linkId: 'child2', answer: [{ valueBoolean: true }] },
        ],
      },
    ]);
  });

  it('should handle empty model', () => {
    const model = {};
    const result = formatItems(model);
    expect(result).toEqual([]);
  });

  it('returns entry, when key starts with value', () => {
    const model = { valueString: 'theValue' };
    const result = formatItems(model);
    expect(result).toEqual([{ valueString: 'theValue' }] as any);
  });
});
