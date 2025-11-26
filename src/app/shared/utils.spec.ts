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
import { dateStringToIso, findFormlyFieldIterativeByKey, findQuantityFieldsByProp } from './utils';

describe('test utils', () => {
  describe('findFormlyFieldIterativeByKey', () => {
    let fields: FormlyFieldConfig[];
    let configFromFuts: FormlyFieldConfig[];

    beforeEach(() => {
      fields = [
        {
          key: 'A',
          type: 'inputA',
          fieldGroup: [
            {
              key: 'B',
              type: 'inputB',
              fieldGroup: [
                {
                  key: 'C',
                  type: 'inputC',
                  fieldGroup: [
                    {
                      key: 'D',
                      type: 'inputD',
                    }, // Deeply nested field
                  ],
                },
                {
                  key: 'E',
                  type: 'inputE',
                },
              ],
            },
          ],
        },
        { key: 'F', type: 'inputF' },
        { key: 'F', type: 'inputXXX' },
      ];
      configFromFuts = [
        {
          key: 'isDead.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'radio-button-coding',
              props: {
                options: [
                  {
                    code: 'NASK',
                    display: 'not asked',
                    designations: [
                      {
                        language: 'de',
                        value: 'nicht erhoben',
                      },
                    ],
                    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                  },
                  {
                    code: 'ASKU',
                    display: 'asked but unknown',
                    designations: [
                      {
                        language: 'de',
                        value: 'nicht ermittelbar',
                      },
                    ],
                    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                  },
                  {
                    code: 'no',
                    display: 'Nein',
                    designations: [],
                    system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                  },
                  {
                    code: 'yes',
                    display: 'Ja',
                    designations: [],
                    system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                  },
                ],
                required: true,
                clearable: true,
                defaultCode: 'NASK',
                label: 'Ist die Person verstorben?',
                importSpec: {
                  importKey: 'C.death',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_isDead',
            },
            {
              key: 'deathDate.answer',
              fieldGroup: [
                {
                  key: 'valueDate',
                  type: 'input',
                  props: {
                    placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                    label: 'Sterbedatum',
                    enableWhen: [
                      {
                        path: 'parent.parent',
                        op: '=',
                        value: 'yes',
                      },
                    ],
                    importSpec: {
                      importKey: 'C.deathDate',
                      multi: false,
                    },
                  },
                  wrappers: ['form-field'],
                  className: 'LinkId_deathDate',
                },
              ],
            },
          ],
        },
        {
          key: 'hospitalized.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'radio-button-coding',
              props: {
                options: [
                  {
                    code: 'NASK',
                    display: 'not asked',
                    designations: [
                      {
                        language: 'de',
                        value: 'nicht erhoben',
                      },
                    ],
                    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                  },
                  {
                    code: 'ASKU',
                    display: 'asked but unknown',
                    designations: [
                      {
                        language: 'de',
                        value: 'nicht ermittelbar',
                      },
                    ],
                    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                  },
                  {
                    code: 'no',
                    display: 'Nein',
                    designations: [],
                    system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                  },
                  {
                    code: 'yes',
                    display: 'Ja',
                    designations: [],
                    system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                  },
                ],
                required: true,
                clearable: true,
                defaultCode: 'NASK',
                label: 'Ist bzw. wurde die Person ins Krankenhaus aufgenommen?',
                importSpec: {
                  importKey: 'C.hospitalized',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_hospitalized',
            },
            {
              key: 'repeat-section-1',
              type: 'repeat-section',
              fieldGroupClassName: 'REPEATED LinkId_hospitalizedGroup',
              props: {
                required: true,
                enableWhen: [
                  {
                    path: 'parent',
                    op: '=',
                    value: 'yes',
                  },
                ],
              },
              fieldArray: {
                fieldGroup: [
                  {
                    key: 'hospitalizedGroup',
                    fieldGroup: [
                      {
                        key: 'hospitalizedEncounter.answer',
                        fieldGroup: [
                          {
                            key: 'Hospitalization',
                            fieldGroupClassName: 'ITEM_REFERENCE',
                            className: 'LinkId_hospitalizedEncounter',
                            fieldGroup: [
                              {
                                key: 'serviceType',
                                fieldGroupClassName: 'REF_ELEMENT',
                                fieldGroup: [
                                  {
                                    key: 'answer.valueCoding',
                                    type: 'autocomplete-coding',
                                    props: {
                                      options: [
                                        {
                                          code: '0100',
                                          display: 'Innere Medizin',
                                          designations: [],
                                          system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                        },
                                        {
                                          code: '0102',
                                          display: 'Schwerpunkt Geriatrie',
                                          designations: [],
                                          system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                          breadcrumb: 'Innere Medizin',
                                        },
                                      ],
                                      required: true,
                                      clearable: true,
                                      label: 'Station',
                                      importSpec: {
                                        importKey: 'C.hospitalized.serviceType',
                                        multi: false,
                                      },
                                    },
                                    validators: {
                                      validation: ['codingValidator'],
                                    },
                                    className: 'hospitalizationServiceType',
                                  },
                                ],
                              },
                              {
                                key: 'period',
                                fieldGroup: [
                                  {
                                    key: 'start',
                                    fieldGroupClassName: 'REF_ELEMENT',
                                    fieldGroup: [
                                      {
                                        key: 'answer.valueDate',
                                        type: 'input',
                                        props: {
                                          required: true,
                                          placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                                          label: 'Aufnahmedatum',
                                          importSpec: {
                                            importKey: 'C.hospitalized.start',
                                            multi: false,
                                          },
                                        },
                                        className: 'hospitalizationStartDate',
                                      },
                                    ],
                                  },
                                  {
                                    key: 'end',
                                    fieldGroupClassName: 'REF_ELEMENT',
                                    fieldGroup: [
                                      {
                                        key: 'answer.valueDate',
                                        type: 'input',
                                        props: {
                                          required: false,
                                          placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                                          label: 'Entlassdatum',
                                          importSpec: {
                                            importKey: 'C.hospitalized.end',
                                            multi: false,
                                          },
                                        },
                                        className: 'hospitalizationEndDate',
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                key: 'serviceProvider.answer',
                                fieldGroupClassName: 'REF_ELEMENT',
                                fieldGroup: [
                                  {
                                    key: 'Organization',
                                    props: {
                                      label: 'Einrichtung',
                                    },
                                    wrappers: ['panel'],
                                    className: 'LinkId_hospitalizedEncounter',
                                    fieldGroup: [
                                      {
                                        key: 'copyNotifiedPersonCurrentAddress',
                                        type: 'checkbox',
                                        defaultValue: false,
                                        props: {
                                          label: 'Einrichtung aus "Betroffene Person" / "Derzeitiger Aufenthaltsort" übernehmen',
                                        },
                                      },
                                      {
                                        key: 'name.answer.valueString',
                                        type: 'input',
                                        props: {
                                          required: true,
                                          label: 'Name der EinrichtungBBB',
                                          importSpec: {
                                            importKey: 'C.hospitalized.name',
                                            multi: false,
                                          },
                                        },
                                        wrappers: ['form-field'],
                                        className: 'institutionName',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              className: 'REPEATER LinkId_hospitalizedGroup',
            },
          ],
        },
      ];
    });

    it('should return undefined for a non-existing field (Z)', () => {
      const result = findFormlyFieldIterativeByKey(fields, 'Z');
      expect(result).toBeUndefined();
    });

    it('should find a top-level field (A)', () => {
      const result = findFormlyFieldIterativeByKey(fields, 'A');
      expect(result?.type).toBe('inputA');
    });

    it('should find a deeply nested field (D)', () => {
      const result = findFormlyFieldIterativeByKey(fields, 'D');
      expect(result?.type).toBe('inputD');
    });

    it('should find a mid-level field (E)', () => {
      const result = findFormlyFieldIterativeByKey(fields, 'E');
      expect(result?.type).toBe('inputE');
    });

    it('if duplicate key, the first element found is returned', () => {
      const result = findFormlyFieldIterativeByKey(fields, 'F');
      expect(result?.type).toBe('inputXXX');
    });

    it('can return a deep nested config field from futs config', () => {
      const result = findFormlyFieldIterativeByKey(configFromFuts, 'copyNotifiedPersonCurrentAddress');
      expect(result?.type).toBe('checkbox');
    });
  });

  describe('findQuantityFieldsByProp', () => {
    it('finds fields with quantity prop and returns map with Quantities', () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'a', props: { quantity: { unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' } } },
        { key: 'b', props: { quantity: { unit: 'kg', system: 'http://unitsofmeasure.org', code: 'kg' } } },
        { key: 'c', props: { quantity: { unit: undefined, system: 'http://unitsofmeasure.org', code: 'kg' } } },
      ];
      const result = findQuantityFieldsByProp(fields);
      expect(result.size).toBe(3);
      expect(result.get('a')).toEqual({ value: 0, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' });
      expect(result.get('b')).toEqual({ value: 0, unit: 'kg', system: 'http://unitsofmeasure.org', code: 'kg' });
      expect(result.get('c')).toEqual({ value: 0, unit: undefined, system: 'http://unitsofmeasure.org', code: 'kg' });
    });

    it('finds nested fields with quantity prop and returns quantity object', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'parent',
          fieldGroup: [{ key: 'child', props: { quantity: { unit: 'ml', system: 'http://unitsofmeasure.org', code: 'ml' } } }],
        },
      ];
      const result = findQuantityFieldsByProp(fields);
      expect(result.size).toBe(1);
      expect(result.get('child')).toEqual({ value: 0, unit: 'ml', system: 'http://unitsofmeasure.org', code: 'ml' });
    });

    it('returns empty map when no matching fields can be found', () => {
      const fields: FormlyFieldConfig[] = [{ key: 'x', props: {} }];
      const result = findQuantityFieldsByProp(fields);
      expect(result.size).toBe(0);
    });
  });

  describe('dateStringToIso', () => {
    it('returns empty string for undefined', () => {
      expect(dateStringToIso(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(dateStringToIso('')).toBe('');
    });

    it('parses full date dd.mm.yyyy', () => {
      expect(dateStringToIso('01.03.2025')).toBe('2025-03-01');
    });

    it('parses full date with single-digit day and month d.m.yyyy', () => {
      expect(dateStringToIso('1.3.2025')).toBe('2025-03-01');
    });

    it('parses month and year mm.yyyy', () => {
      expect(dateStringToIso('03.2025')).toBe('2025-03-01');
    });

    it('parses month and year with single-digit month m.yyyy', () => {
      expect(dateStringToIso('3.2025')).toBe('2025-03-01');
    });

    it('parses year only yyyy', () => {
      expect(dateStringToIso('2025')).toBe('2025-01-01');
    });

    it('returns empty string for invalid format (e.g. 2025/03/01)', () => {
      expect(dateStringToIso('2025/03/01')).toBe('');
    });

    it('returns empty string for random string', () => {
      expect(dateStringToIso('hello world')).toBe('');
    });

    it('trims whitespace before parsing', () => {
      expect(dateStringToIso(' 1.3.2025 ')).toBe('2025-03-01');
    });
  });
});
