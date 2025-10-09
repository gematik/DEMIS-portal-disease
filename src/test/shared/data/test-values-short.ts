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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

export const EXAMPLE_MSVD_SHORT = {
  questionnaireConfigs: [
    {
      template: 'Masern: spezifische klinische und epidemiologische Angaben',
      className: 'QUESTIONNAIRE-TITLE',
    },
    {
      fieldGroup: [
        {
          key: 'immunization.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
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
                label: 'Wurde die betroffene Person jemals in Bezug auf die Krankheit geimpft?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_immunization',
            },
            {
              key: 'repeat-section-1',
              type: 'repeat-section',
              fieldGroupClassName: 'REPEATED LinkId_immunizationRef',
              props: {
                required: false,
                itemName: 'Impfinformationen',
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
                    key: 'immunizationRef.answer',
                    fieldGroup: [
                      {
                        key: 'Immunization',
                        fieldGroupClassName: 'ITEM_REFERENCE',
                        className: 'LinkId_immunizationRef',
                        fieldGroup: [
                          {
                            key: 'vaccineCode',
                            fieldGroupClassName: 'REF_ELEMENT',
                            fieldGroup: [
                              {
                                key: 'answer.valueCoding',
                                type: 'autocomplete-coding',
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
                                      code: '2241000221103',
                                      display: 'Masern-Mumps-Röteln-Lebendvirusimpfstoff (Priorix,M-M-RVAXPRO)',
                                      designations: [
                                        {
                                          language: 'en-US',
                                          value:
                                            'Vaccine product containing only live attenuated Measles morbillivirus and Mumps orthorubulavirus and Rubella virus antigens (medicinal product)',
                                        },
                                      ],
                                      system: 'http://snomed.info/sct',
                                    },
                                    {
                                      code: '2251000221101',
                                      display: 'Masern-Mumps-Röteln-Varizellen-Lebendvirusimpfstoff (Priorix-Tetra, ProQuad)',
                                      designations: [
                                        {
                                          language: 'en-US',
                                          value:
                                            'Vaccine product containing only live attenuated Measles morbillivirus and Mumps orthorubulavirus and Rubella virus and Human alphaherpesvirus 3 antigens (medicinal product)',
                                        },
                                      ],
                                      system: 'http://snomed.info/sct',
                                    },
                                    {
                                      code: '836382004',
                                      display: 'Masern-Totimpfstoff',
                                      designations: [
                                        {
                                          language: 'en-US',
                                          value: 'Vaccine product containing Measles morbillivirus antigen (medicinal product)',
                                        },
                                      ],
                                      system: 'http://snomed.info/sct',
                                    },
                                    {
                                      code: '1252703004',
                                      display: 'MM: Masern-Kombinationsimpfstoff mit Mumps',
                                      designations: [
                                        {
                                          language: 'en-US',
                                          value: 'Vaccine product containing only Measles morbillivirus and Mumps orthorubulavirus (medicinal product)',
                                        },
                                      ],
                                      system: 'http://snomed.info/sct',
                                    },
                                    {
                                      code: '871766009',
                                      display: 'Monovalenter Masern-Impfstoff (Ma)',
                                      designations: [
                                        {
                                          language: 'en-US',
                                          value: 'Vaccine product containing only live attenuated Measles morbillivirus antigen (medicinal product)',
                                        },
                                      ],
                                      system: 'http://snomed.info/sct',
                                    },
                                    {
                                      code: '74964007',
                                      display: 'andere/sonstige',
                                      designations: [
                                        {
                                          language: 'en-US',
                                          value: 'Other (qualifier value)',
                                        },
                                        {
                                          language: 'de-DE',
                                          value: 'andere',
                                        },
                                      ],
                                      system: 'http://snomed.info/sct',
                                    },
                                  ],
                                  required: true,
                                  clearable: true,
                                  label: 'Verabreichter Impfstoff',
                                },
                                validators: {
                                  validation: ['codingValidator'],
                                },
                                className: 'vaccine',
                              },
                            ],
                          },
                          {
                            key: 'occurrence',
                            fieldGroupClassName: 'REF_ELEMENT',
                            fieldGroup: [
                              {
                                key: 'answer.valueDate',
                                type: 'input',
                                props: {
                                  required: true,
                                  placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                                  label: 'Datum der Impfung',
                                },
                                className: 'vaccinationDate',
                              },
                            ],
                          },
                          {
                            key: 'note',
                            fieldGroupClassName: 'REF_ELEMENT',
                            fieldGroup: [
                              {
                                key: 'answer.valueString',
                                type: 'textarea',
                                props: {
                                  label: 'Hinweis zur Impfung',
                                },
                                className: 'note',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              className: 'REPEATER LinkId_immunizationRef',
            },
          ],
        },
        {
          key: 'onsetOfExanthem.answer',
          fieldGroup: [
            {
              key: 'valueDate',
              type: 'input',
              props: {
                placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                label: 'Exanthembeginn',
              },
              wrappers: ['form-field'],
              className: 'LinkId_onsetOfExanthem',
            },
          ],
        },
        {
          key: 'pregnancy.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
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
                label: 'Besteht bei der betroffenen Person eine Schwangerschaft?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_pregnancy',
            },
            {
              key: 'pregnancyWeek.answer',
              fieldGroup: [
                {
                  key: 'valueCoding',
                  type: 'autocomplete-coding',
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
                        code: '1',
                        display: '1',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '2',
                        display: '2',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '3',
                        display: '3',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '4',
                        display: '4',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '5',
                        display: '5',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '6',
                        display: '6',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '7',
                        display: '7',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '8',
                        display: '8',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '9',
                        display: '9',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '10',
                        display: '10',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '11',
                        display: '11',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '12',
                        display: '12',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '13',
                        display: '13',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '14',
                        display: '14',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '15',
                        display: '15',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '16',
                        display: '16',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '17',
                        display: '17',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '18',
                        display: '18',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '19',
                        display: '19',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '20',
                        display: '20',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '21',
                        display: '21',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '22',
                        display: '22',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '23',
                        display: '23',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '24',
                        display: '24',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '25',
                        display: '25',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '26',
                        display: '26',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '27',
                        display: '27',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '28',
                        display: '28',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '29',
                        display: '29',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '30',
                        display: '30',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '31',
                        display: '31',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '32',
                        display: '32',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '33',
                        display: '33',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '34',
                        display: '34',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '35',
                        display: '35',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '36',
                        display: '36',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '37',
                        display: '37',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '38',
                        display: '38',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '39',
                        display: '39',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '40',
                        display: '40',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '41',
                        display: '41',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '42',
                        display: '42',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '43',
                        display: '43',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '44',
                        display: '44',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '45',
                        display: '45',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '46',
                        display: '46',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '47',
                        display: '47',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '48',
                        display: '48',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                      {
                        code: '49',
                        display: '49',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                      },
                    ],
                    required: true,
                    clearable: true,
                    defaultCode: 'NASK',
                    label: 'Schwangerschaftswoche',
                    enableWhen: [
                      {
                        path: 'parent.parent',
                        op: '=',
                        value: 'yes',
                      },
                    ],
                  },
                  validators: {
                    validation: ['codingValidator'],
                  },
                  wrappers: ['form-field'],
                  className: 'LinkId_pregnancyWeek',
                },
              ],
            },
          ],
        },
        {
          key: 'outbreak.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
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
                label: 'Kann der gemeldete Fall einem Ausbruch zugeordnet werden?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_outbreak',
            },
            {
              key: 'outbreakNote.answer',
              fieldGroup: [
                {
                  key: 'valueString',
                  type: 'textarea',
                  props: {
                    label: 'Fallbezogene Zusatzinformationen zum Ausbruch',
                    enableWhen: [
                      {
                        path: 'parent.parent',
                        op: '=',
                        value: 'yes',
                      },
                    ],
                  },
                  wrappers: ['form-field'],
                  className: 'LinkId_outbreakNote',
                },
              ],
            },
            {
              key: 'outbreakNotificationId.answer',
              fieldGroup: [
                {
                  key: 'valueReference',
                  type: 'input',
                  props: {
                    required: false,
                    label: 'Notification-Id der zugehörigen Ausbruchsmeldung',
                    enableWhen: [
                      {
                        path: 'parent.parent',
                        op: '=',
                        value: 'yes',
                      },
                    ],
                  },
                  className: 'LinkId_outbreakNotificationId',
                },
              ],
            },
          ],
        },
      ],
      fieldGroupClassName: 'QUESTIONS',
    },
  ],
  commonConfig: [
    {
      template: 'Meldetatbestandsübergreifende klinische und epidemiologische Angaben',
      className: 'QUESTIONNAIRE-TITLE',
    },
    {
      fieldGroup: [
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
          key: 'militaryAffiliation.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
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
                    code: 'noReferenceToBundeswehr',
                    display: 'Kein Bezug zur BW',
                    designations: [],
                    system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
                  },
                  {
                    code: 'civilPersonActiveInBundeswehr',
                    display: 'Zivilperson tätig/untergebracht in Einrichtung der BW',
                    designations: [],
                    system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
                  },
                  {
                    code: 'memberOfBundeswehr',
                    display: 'Soldat/BW-Angehöriger',
                    designations: [],
                    system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
                  },
                ],
                required: true,
                clearable: true,
                defaultCode: 'NASK',
                label: 'Besteht eine Zugehörigkeit zur Bundeswehr?',
                importSpec: {
                  importKey: 'C.military',
                  multi: false,
                },
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_militaryAffiliation',
            },
          ],
        },
        {
          key: 'labSpecimenTaken.answer',
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
                label: 'Wurde ein Labor mit der Durchführung einer Erregerdiagnostik beauftragt?',
                importSpec: {
                  importKey: 'C.lab',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_labSpecimenTaken',
            },
            {
              key: 'labSpecimenLab.answer',
              fieldGroup: [
                {
                  key: 'Organization',
                  props: {
                    label: 'Einrichtung',
                    enableWhen: [
                      {
                        path: 'parent.parent',
                        op: '=',
                        value: 'yes',
                      },
                    ],
                  },
                  wrappers: ['panel'],
                  className: 'LinkId_labSpecimenLab',
                  fieldGroup: [
                    {
                      key: 'name.answer.valueString',
                      type: 'input',
                      props: {
                        required: true,
                        label: 'Name der Einrichtung',
                        importSpec: {
                          importKey: 'C.lab.name',
                          multi: false,
                        },
                      },
                      wrappers: ['form-field'],
                      className: 'institutionName',
                    },
                    {
                      key: 'address',
                      props: {
                        label: 'Adresse',
                      },
                      wrappers: ['panel'],
                      fieldGroup: [
                        {
                          key: 'street.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Straße',
                            importSpec: {
                              importKey: 'C.lab.street',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'street',
                        },
                        {
                          key: 'houseNumber.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Hausnummer',
                            importSpec: {
                              importKey: 'C.lab.houseNumber',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'houseNumber',
                        },
                        {
                          key: 'postalCode.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Postleitzahl',
                            importSpec: {
                              importKey: 'C.lab.zip',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'zip',
                        },
                        {
                          key: 'city.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Stadt',
                            importSpec: {
                              importKey: 'C.lab.city',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'city',
                        },
                        {
                          key: 'country.answer.valueCoding',
                          type: 'autocomplete-coding',
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
                                code: 'DE',
                                display: 'Germany',
                                designations: [
                                  {
                                    language: 'de-DE',
                                    value: 'Deutschland',
                                  },
                                ],
                                system: 'urn:iso:std:iso:3166',
                              },
                              {
                                code: 'AF',
                                display: 'Afghanistan',
                                designations: [
                                  {
                                    language: 'de-DE',
                                    value: 'Afghanistan',
                                  },
                                ],
                                system: 'urn:iso:std:iso:3166',
                              },
                              {
                                code: 'AL',
                                display: 'Albania',
                                designations: [
                                  {
                                    language: 'de-DE',
                                    value: 'Albanien',
                                  },
                                ],
                                system: 'urn:iso:std:iso:3166',
                              },
                              {
                                code: 'DZ',
                                display: 'Algeria',
                                designations: [
                                  {
                                    language: 'de-DE',
                                    value: 'Algerien',
                                  },
                                ],
                                system: 'urn:iso:std:iso:3166',
                              },
                              {
                                code: 'ZW',
                                display: 'Zimbabwe',
                                designations: [
                                  {
                                    language: 'de-DE',
                                    value: 'Simbabwe',
                                  },
                                ],
                                system: 'urn:iso:std:iso:3166',
                              },
                            ],
                            clearable: true,
                            label: 'Land',
                            importSpec: {
                              importKey: 'C.lab.country',
                              multi: false,
                            },
                          },
                          validators: {
                            validation: ['codingValidator'],
                          },
                          className: 'country',
                        },
                      ],
                    },
                    {
                      key: 'contact',
                      props: {
                        label: 'Ansprechpartner',
                      },
                      wrappers: ['panel'],
                      fieldGroup: [
                        {
                          key: 'name.prefix.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Titel',
                            importSpec: {
                              importKey: 'C.lab.prefix',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'prefix',
                        },
                        {
                          key: 'name.given.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Vorname',
                            importSpec: {
                              importKey: 'C.lab.given',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'firstname',
                        },
                        {
                          key: 'name.family.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Nachname',
                            importSpec: {
                              importKey: 'C.lab.family',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'lastname',
                        },
                      ],
                    },
                    {
                      key: 'telecom',
                      props: {
                        label: 'Kontaktmöglichkeiten',
                      },
                      wrappers: ['panel'],
                      fieldGroup: [
                        {
                          key: 'phone.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Telefonnummer',
                            importSpec: {
                              importKey: 'C.lab.phone',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'phoneNo',
                        },
                        {
                          key: 'email.answer.valueString',
                          type: 'input',
                          props: {
                            label: 'Email',
                            importSpec: {
                              importKey: 'C.lab.email',
                              multi: false,
                            },
                          },
                          wrappers: ['form-field'],
                          className: 'email',
                        },
                      ],
                    },
                  ],
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
                                        {
                                          code: '0103',
                                          display: 'Schwerpunkt Kardiologie',
                                          designations: [],
                                          system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                          breadcrumb: 'Innere Medizin',
                                        },
                                        {
                                          code: '0104',
                                          display: 'Schwerpunkt Nephrologie',
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
                                        id: 'copyNotifiedPersonCurrentAddress',
                                        type: 'checkbox',
                                        defaultValue: false,
                                        props: {
                                          label: 'Adresse von "Betroffene Person" / "Derzeitiger Aufenthaltsort"',
                                          required: false,
                                        },
                                      },
                                      {
                                        key: 'name.answer.valueString',
                                        type: 'input',
                                        props: {
                                          required: true,
                                          label: 'Name der Einrichtung',
                                          importSpec: {
                                            importKey: 'C.hospitalized.name',
                                            multi: false,
                                          },
                                        },
                                        wrappers: ['form-field'],
                                        className: 'institutionName',
                                      },
                                      {
                                        key: 'address',
                                        props: {
                                          label: 'Adresse',
                                        },
                                        wrappers: ['panel'],
                                        fieldGroup: [
                                          {
                                            key: 'street.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Straße',
                                              importSpec: {
                                                importKey: 'C.hospitalized.street',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'street',
                                          },
                                          {
                                            key: 'houseNumber.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Hausnummer',
                                              importSpec: {
                                                importKey: 'C.hospitalized.houseNumber',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'houseNumber',
                                          },
                                          {
                                            key: 'postalCode.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Postleitzahl',
                                              importSpec: {
                                                importKey: 'C.hospitalized.zip',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'zip',
                                          },
                                          {
                                            key: 'city.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Stadt',
                                              importSpec: {
                                                importKey: 'C.hospitalized.city',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'city',
                                          },
                                          {
                                            key: 'country.answer.valueCoding',
                                            type: 'autocomplete-coding',
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
                                                  code: 'DE',
                                                  display: 'Germany',
                                                  designations: [
                                                    {
                                                      language: 'de-DE',
                                                      value: 'Deutschland',
                                                    },
                                                  ],
                                                  system: 'urn:iso:std:iso:3166',
                                                },
                                                {
                                                  code: 'DZ',
                                                  display: 'Algeria',
                                                  designations: [
                                                    {
                                                      language: 'de-DE',
                                                      value: 'Algerien',
                                                    },
                                                  ],
                                                  system: 'urn:iso:std:iso:3166',
                                                },
                                                {
                                                  code: 'AS',
                                                  display: 'American Samoa',
                                                  designations: [
                                                    {
                                                      language: 'de-DE',
                                                      value: 'Amerikanisch-Samoa',
                                                    },
                                                  ],
                                                  system: 'urn:iso:std:iso:3166',
                                                },
                                                {
                                                  code: 'AD',
                                                  display: 'Andorra',
                                                  designations: [
                                                    {
                                                      language: 'de-DE',
                                                      value: 'Andorra',
                                                    },
                                                  ],
                                                  system: 'urn:iso:std:iso:3166',
                                                },
                                                {
                                                  code: 'GB',
                                                  display: 'United Kingdom of Great Britain and Northern Ireland',
                                                  designations: [
                                                    {
                                                      language: 'de-DE',
                                                      value: 'Vereinigtes Königreich',
                                                    },
                                                  ],
                                                  system: 'urn:iso:std:iso:3166',
                                                },
                                              ],
                                              clearable: true,
                                              label: 'Land',
                                              importSpec: {
                                                importKey: 'C.hospitalized.country',
                                                multi: false,
                                              },
                                            },
                                            validators: {
                                              validation: ['codingValidator'],
                                            },
                                            className: 'country',
                                          },
                                        ],
                                      },
                                      {
                                        key: 'contact',
                                        props: {
                                          label: 'Ansprechperson',
                                        },
                                        wrappers: ['panel'],
                                        fieldGroup: [
                                          {
                                            key: 'copyNotifierContact',
                                            id: 'copyNotifierContact',
                                            type: 'checkbox',
                                            defaultValue: false,
                                            props: {
                                              label: 'Ansprechperson von "Meldende Person" / "Ansprechperson (Melder)" übernehmen',
                                            },
                                          },
                                          {
                                            key: 'name.prefix.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Titel',
                                              importSpec: {
                                                importKey: 'C.hospitalized.prefix',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'prefix',
                                          },
                                          {
                                            key: 'name.given.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Vorname',
                                              importSpec: {
                                                importKey: 'C.hospitalized.given',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'firstname',
                                          },
                                          {
                                            key: 'name.family.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Nachname',
                                              importSpec: {
                                                importKey: 'C.hospitalized.family',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'lastname',
                                          },
                                        ],
                                      },
                                      {
                                        key: 'telecom',
                                        props: {
                                          label: 'Kontaktmöglichkeiten',
                                        },
                                        wrappers: ['panel'],
                                        fieldGroup: [
                                          {
                                            key: 'phone.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Telefonnummer',
                                              importSpec: {
                                                importKey: 'C.hospitalized.phone',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'phoneNo',
                                          },
                                          {
                                            key: 'email.answer.valueString',
                                            type: 'input',
                                            props: {
                                              label: 'Email',
                                              importSpec: {
                                                importKey: 'C.hospitalized.email',
                                                multi: false,
                                              },
                                            },
                                            wrappers: ['form-field'],
                                            className: 'email',
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
                ],
              },
              className: 'REPEATER LinkId_hospitalizedGroup',
            },
          ],
        },
        {
          key: 'infectProtectFacility.answer',
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
                label:
                  'Ist die betroffene Person in einer für den Infektionsschutz relevanten Einrichtung tätig, betreut oder untergebracht? (Die für den Infektionsschutz relevanten Einrichtungen sind im Infektionsschutzgesetz definiert. Dazu zählen u.a. Einrichtungen gemäß § 23 IfSG (z.B. Krankenhäuser, ärztliche Praxen, Dialyseeinrichtungen und Rettungsdienste), gemäß § 33 IfSG (z.B. Kitas, Kinderhorte, Schulen, Heime und Ferienlager) und gemäß §§ 35-36 IfSG (Pflegeeinrichtungen, Obdachlosunterkünfte, Einrichtungen zur gemeinschaftlichen Unterbringung von Asylsuchenden, sonstige Massenunterkünfte, Justizvollzugsanstalten).)',
                importSpec: {
                  importKey: 'C.IPF',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_infectProtectFacility',
            },
            {
              key: 'repeat-section-2',
              type: 'repeat-section',
              fieldGroupClassName: 'REPEATED LinkId_infectProtectFacilityGroup',
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
                    key: 'infectProtectFacilityGroup',
                    fieldGroup: [
                      {
                        key: 'infectProtectFacilityType.answer',
                        fieldGroup: [
                          {
                            key: 'valueCoding',
                            type: 'autocomplete-coding',
                            props: {
                              options: [
                                {
                                  code: 'medFacility',
                                  display: 'Medizinische Einrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Medical facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Medizinische Einrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                },
                                {
                                  code: 'hospital',
                                  display: 'Krankenhaus',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Hospital',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Krankenhaus',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'outpatSurgery',
                                  display: 'Einrichtung für ambulantes Operieren',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Facility for outpatient surgery',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Einrichtung für ambulantes Operieren',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'prevCareRehab',
                                  display: 'Vorsorge- oder Reha-Einrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Preventive care or rehab facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Vorsorge- oder Reha-Einrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'dialysisFacility',
                                  display: 'Dialyseeinrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Dialysis facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Dialyseeinrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'dayHospital',
                                  display: 'Tagesklinik',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Day hospital',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Tagesklinik',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'maternity',
                                  display: 'Entbindungseinrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Maternity',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Entbindungseinrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'physicianOffice',
                                  display: 'Arztpraxis',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: "Physician's office",
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Arztpraxis',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'dentalSurgery',
                                  display: 'Zahnarztpraxis',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Dental surgery',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Zahnarztpraxis',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'psycFacility',
                                  display: 'Psychotherapeutische Praxis',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Psychotherapeutic facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Psychotherapeutische Praxis',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'othMedPractice',
                                  display: 'Sonstige Heilberufepraxis',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other health professional practice',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige Heilberufepraxis',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'medFacPHA',
                                  display: 'Medizinische Einrichtung des ÖGDs',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Public health medical facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Medizinische Einrichtung des ÖGDs',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'emResServ',
                                  display: 'Rettungsdienst',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Emergency rescue service',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Rettungsdienst',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'civDisFacility',
                                  display: 'Einrichtungen des Zivil- und Katastrophenschutzes',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Facility for civil Protection and Disaster Assistance',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Einrichtungen des Zivil- und Katastrophenschutzes',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'othMedFacility',
                                  display: 'Sonstige medizinische Einrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other medical facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige medizinische Einrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Medizinische Einrichtung',
                                },
                                {
                                  code: 'childCareFacility',
                                  display: 'Gemeinschaftseinrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Child care facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Gemeinschaftseinrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                },
                                {
                                  code: 'kindergarten',
                                  display: 'Kindertageseinrichtung (z. B. Kita)',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Kindergarten etc',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Kindertageseinrichtung (z. B. Kita)',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'childDayNursery',
                                  display: 'Kindertagespflege',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Child day nursery',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Kindertagespflege',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'school',
                                  display: 'Schule',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'School',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Schule',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'childHome',
                                  display: 'Kinderheim o.ä.',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: "Children's home etc",
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Kinderheim o.ä.',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'holidayCamp',
                                  display: 'Ferienlager',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Holiday camp',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Ferienlager',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'childDayCare',
                                  display: 'Kinderhort',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Child daycare center',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Kinderhort',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'othEdFac',
                                  display: 'sonstige Ausbildungseinrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other educational facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'sonstige Ausbildungseinrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'othChildCareFac',
                                  display: 'Sonstige Kinderbetreuungseinrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other child care facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige Kinderbetreuungseinrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftseinrichtung',
                                },
                                {
                                  code: 'housingFacility',
                                  display: 'Gemeinschaftsunterkunft',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Housing facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Gemeinschaftsunterkunft',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                },
                                {
                                  code: 'nursingHome',
                                  display: 'voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Nursing home',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'elderlyCareHome',
                                  display: 'Einrichtung zur Betreuung/Unterbringung älterer Menschen',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Elderly care home',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Einrichtung zur Betreuung/Unterbringung älterer Menschen',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb:
                                    'Gemeinschaftsunterkunft|voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
                                },
                                {
                                  code: 'disabledCareHome',
                                  display: 'Einrichtung zur Betreuung/Unterbringung behinderter Menschen',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Disabled care home',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Einrichtung zur Betreuung/Unterbringung behinderter Menschen',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb:
                                    'Gemeinschaftsunterkunft|voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
                                },
                                {
                                  code: 'assistedCareHome',
                                  display: 'Einrichtung zur Betreuung/Unterbringung pflegebedürftiger Menschen',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Assisted care home',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Einrichtung zur Betreuung/Unterbringung pflegebedürftiger Menschen',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb:
                                    'Gemeinschaftsunterkunft|voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
                                },
                                {
                                  code: 'homelessShelter',
                                  display: 'Obdachlosenunterkunft',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Homeless shelter',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Obdachlosenunterkunft',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'migrantAccom',
                                  display: 'Migrantenunterkunft',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Migrant accommodation',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Migrantenunterkunft',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'prison',
                                  display: 'Justizvollzugsanstalt',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Prison',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Justizvollzugsanstalt',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'othMassAccom',
                                  display: 'Sonstige Massenunterkunft',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other mass accommodation',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige Massenunterkunft',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'outpatICServ',
                                  display: 'Ambulanter Intensivpflegedienst',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Outpatient intensive care service',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Ambulanter Intensivpflegedienst',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'othOutpatCareS',
                                  display: 'Sonstiger ambulanter Pflegedienst',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other outpatient care service',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstiger ambulanter Pflegedienst',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'othBloodRiskFac',
                                  display: 'Sonstige Einrichtung mit Blutübertragungsrisiko',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other facility with blood-borne transmission risk',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige Einrichtung mit Blutübertragungsrisiko',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Gemeinschaftsunterkunft',
                                },
                                {
                                  code: 'othHygRelFacility',
                                  display: 'Sonstige hygienerelevante Einrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other hygiene-relevant facility',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige hygienerelevante Einrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                },
                                {
                                  code: 'othAccom',
                                  display: 'Andere Unterkunft',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other accommodation',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Andere Unterkunft',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                },
                                {
                                  code: 'hotel',
                                  display: 'Hotel o.ä.',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Hotel etc',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Hotel o.ä.',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Andere Unterkunft',
                                },
                                {
                                  code: 'holidayHome',
                                  display: 'Ferienwohnung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Holiday home',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Ferienwohnung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Andere Unterkunft',
                                },
                                {
                                  code: 'camping',
                                  display: 'Campingplatz o.ä.',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Camping facility etc',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Campingplatz o.ä.',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Andere Unterkunft',
                                },
                                {
                                  code: 'ship',
                                  display: 'Schiff o.ä.',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Ship etc',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Schiff o.ä.',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Andere Unterkunft',
                                },
                                {
                                  code: 'foodEstablmt',
                                  display: 'Lebensmittelbetrieb',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Food establishment',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Lebensmittelbetrieb',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                },
                                {
                                  code: 'laboratory',
                                  display: 'Erregerdiagnostische Untersuchungsstelle',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Laboratory',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Erregerdiagnostische Untersuchungsstelle',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                },
                                {
                                  code: 'publicHealthLab',
                                  display: 'Medizinaluntersuchungsamt',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Public health laboratory',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Medizinaluntersuchungsamt',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
                                },
                                {
                                  code: 'refLab',
                                  display: 'Einrichtung der Spezialdiagnostik',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Reference laboratory',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Einrichtung der Spezialdiagnostik',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
                                },
                                {
                                  code: 'hospitalLab',
                                  display: 'Krankenhauslabor',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Hospital laboratory',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Krankenhauslabor',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
                                },
                                {
                                  code: 'pathology',
                                  display: 'Pathologisch-anatomische Einrichtung',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Pathology',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Pathologisch-anatomische Einrichtung',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
                                },
                                {
                                  code: 'othPublicLab',
                                  display: 'Sonstige öffentliche Untersuchungsstelle',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other public laboratory',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige öffentliche Untersuchungsstelle',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
                                },
                                {
                                  code: 'othPrivatLab',
                                  display: 'Sonstige private Untersuchungsstelle',
                                  designations: [
                                    {
                                      language: 'en-US',
                                      value: 'Other private laboratory',
                                    },
                                    {
                                      language: 'de-DE',
                                      value: 'Sonstige private Untersuchungsstelle',
                                    },
                                  ],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                                  breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
                                },
                              ],
                              required: false,
                              clearable: true,
                              label: 'Art der Einrichtung',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.IPF.type',
                                multi: false,
                              },
                            },
                            validators: {
                              validation: ['codingValidator'],
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_infectProtectFacilityType',
                          },
                        ],
                      },
                      {
                        key: 'infectProtectFacilityBegin.answer',
                        fieldGroup: [
                          {
                            key: 'valueDate',
                            type: 'input',
                            props: {
                              placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                              label: 'Beginn',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.IPF.startDate',
                                multi: false,
                              },
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_infectProtectFacilityBegin',
                          },
                        ],
                      },
                      {
                        key: 'infectProtectFacilityEnd.answer',
                        fieldGroup: [
                          {
                            key: 'valueDate',
                            type: 'input',
                            props: {
                              placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                              label: 'Ende',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.IPF.endDate',
                                multi: false,
                              },
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_infectProtectFacilityEnd',
                          },
                        ],
                      },
                      {
                        key: 'infectProtectFacilityRole.answer',
                        fieldGroup: [
                          {
                            key: 'valueCoding',
                            type: 'radio-button-coding',
                            props: {
                              options: [
                                {
                                  code: 'employment',
                                  display: 'Tätigkeit',
                                  designations: [],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationAssociation',
                                },
                                {
                                  code: 'care',
                                  display: 'Betreuung',
                                  designations: [],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationAssociation',
                                },
                                {
                                  code: 'accommodation',
                                  display: 'Unterbringung',
                                  designations: [],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/organizationAssociation',
                                },
                              ],
                              required: true,
                              clearable: true,
                              label: 'In welcher Beziehung steht die Person zur Einrichtung?',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.IPF.role',
                                multi: false,
                              },
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_infectProtectFacilityRole',
                          },
                        ],
                      },
                      {
                        key: 'infectProtectFacilityOrganization.answer',
                        fieldGroup: [
                          {
                            key: 'Organization',
                            props: {
                              label: 'Einrichtung',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                            },
                            wrappers: ['panel'],
                            className: 'LinkId_infectProtectFacilityOrganization',
                            fieldGroup: [
                              {
                                key: 'name.answer.valueString',
                                type: 'input',
                                props: {
                                  required: true,
                                  label: 'Name der Einrichtung',
                                  importSpec: {
                                    importKey: 'C.IPF.name',
                                    multi: false,
                                  },
                                },
                                wrappers: ['form-field'],
                                className: 'institutionName',
                              },
                              {
                                key: 'address',
                                props: {
                                  label: 'Adresse',
                                },
                                wrappers: ['panel'],
                                fieldGroup: [
                                  {
                                    key: 'street.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Straße',
                                      importSpec: {
                                        importKey: 'C.IPF.street',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'street',
                                  },
                                  {
                                    key: 'houseNumber.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Hausnummer',
                                      importSpec: {
                                        importKey: 'C.IPF.houseNumber',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'houseNumber',
                                  },
                                  {
                                    key: 'postalCode.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Postleitzahl',
                                      importSpec: {
                                        importKey: 'C.IPF.zip',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'zip',
                                  },
                                  {
                                    key: 'city.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Stadt',
                                      importSpec: {
                                        importKey: 'C.IPF.city',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'city',
                                  },
                                  {
                                    key: 'country.answer.valueCoding',
                                    type: 'autocomplete-coding',
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
                                          code: 'DE',
                                          display: 'Germany',
                                          designations: [
                                            {
                                              language: 'de-DE',
                                              value: 'Deutschland',
                                            },
                                          ],
                                          system: 'urn:iso:std:iso:3166',
                                        },
                                        {
                                          code: 'AF',
                                          display: 'Afghanistan',
                                          designations: [
                                            {
                                              language: 'de-DE',
                                              value: 'Afghanistan',
                                            },
                                          ],
                                          system: 'urn:iso:std:iso:3166',
                                        },
                                      ],
                                      clearable: true,
                                      label: 'Land',
                                      importSpec: {
                                        importKey: 'C.IPF.country',
                                        multi: false,
                                      },
                                    },
                                    validators: {
                                      validation: ['codingValidator'],
                                    },
                                    className: 'country',
                                  },
                                ],
                              },
                              {
                                key: 'contact',
                                props: {
                                  label: 'Ansprechpartner',
                                },
                                wrappers: ['panel'],
                                fieldGroup: [
                                  {
                                    key: 'name.prefix.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Titel',
                                      importSpec: {
                                        importKey: 'C.IPF.prefix',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'prefix',
                                  },
                                  {
                                    key: 'name.given.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Vorname',
                                      importSpec: {
                                        importKey: 'C.IPF.given',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'firstname',
                                  },
                                  {
                                    key: 'name.family.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Nachname',
                                      importSpec: {
                                        importKey: 'C.IPF.family',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'lastname',
                                  },
                                ],
                              },
                              {
                                key: 'telecom',
                                props: {
                                  label: 'Kontaktmöglichkeiten',
                                },
                                wrappers: ['panel'],
                                fieldGroup: [
                                  {
                                    key: 'phone.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Telefonnummer',
                                      importSpec: {
                                        importKey: 'C.IPF.phone',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'phoneNo',
                                  },
                                  {
                                    key: 'email.answer.valueString',
                                    type: 'input',
                                    props: {
                                      label: 'Email',
                                      importSpec: {
                                        importKey: 'C.IPF.email',
                                        multi: false,
                                      },
                                    },
                                    wrappers: ['form-field'],
                                    className: 'email',
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
              className: 'REPEATER LinkId_infectProtectFacilityGroup',
            },
          ],
        },
        {
          key: 'placeExposure.answer',
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
                label: 'Ist der wahrscheinliche Expositionsort bekannt?',
                importSpec: {
                  importKey: 'C.exposure',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_placeExposure',
            },
            {
              key: 'repeat-section-3',
              type: 'repeat-section',
              fieldGroupClassName: 'REPEATED LinkId_placeExposureGroup',
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
                    key: 'placeExposureGroup',
                    fieldGroup: [
                      {
                        key: 'placeExposureBegin.answer',
                        fieldGroup: [
                          {
                            key: 'valueDate',
                            type: 'input',
                            props: {
                              placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                              label: 'Beginn',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.exposure.startDate',
                                multi: false,
                              },
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_placeExposureBegin',
                          },
                        ],
                      },
                      {
                        key: 'placeExposureEnd.answer',
                        fieldGroup: [
                          {
                            key: 'valueDate',
                            type: 'input',
                            props: {
                              placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                              label: 'Ende',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.exposure.endDate',
                                multi: false,
                              },
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_placeExposureEnd',
                          },
                        ],
                      },
                      {
                        key: 'placeExposureRegion.answer',
                        fieldGroup: [
                          {
                            key: 'valueCoding',
                            type: 'autocomplete-coding',
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
                                  code: '31000005',
                                  display: 'Afrika',
                                  designations: [],
                                  system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                                },
                              ],
                              required: true,
                              clearable: true,
                              defaultCode: 'NASK',
                              label: 'Geografische Region',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.exposure.region',
                                multi: false,
                              },
                            },
                            validators: {
                              validation: ['codingValidator'],
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_placeExposureRegion',
                          },
                        ],
                      },
                      {
                        key: 'placeExposureHint.answer',
                        fieldGroup: [
                          {
                            key: 'valueString',
                            type: 'textarea',
                            props: {
                              label: 'Anmerkungen zum Expositionsort',
                              enableWhen: [
                                {
                                  path: 'parent.parent.parent.parent.parent',
                                  op: '=',
                                  value: 'yes',
                                },
                              ],
                              importSpec: {
                                importKey: 'C.exposure.hint',
                                multi: false,
                              },
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_placeExposureHint',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              className: 'REPEATER LinkId_placeExposureGroup',
            },
          ],
        },
        {
          key: 'organDonation.answer',
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
                label: 'Hat die Person in den letzten 6 Monaten Blut, Organe, Gewebe oder Zellen gespendet?',
                importSpec: {
                  importKey: 'C.organDonor',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_organDonation',
            },
          ],
        },
        {
          key: 'additionalInformation.answer',
          fieldGroup: [
            {
              key: 'valueString',
              type: 'textarea',
              props: {
                label: 'Wichtige Zusatzinformationen',
                importSpec: {
                  importKey: 'C.importantInfo',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_additionalInformation',
            },
          ],
        },
      ],
      fieldGroupClassName: 'QUESTIONS',
    },
  ],
  conditionConfigs: [
    {
      template: 'Masern',
      className: 'QUESTIONNAIRE-TITLE',
    },
    {
      fieldGroup: [
        {
          key: 'recordedDate',
          fieldGroup: [
            {
              key: 'answer.valueDate',
              type: 'input',
              props: {
                placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                label: 'Datum Diagnosestellung',
                importSpec: {
                  importKey: 'D.diagnosis',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_recordedDate',
            },
          ],
        },
        {
          key: 'onset',
          fieldGroup: [
            {
              key: 'answer.valueDate',
              type: 'input',
              props: {
                placeholder: 'TT.MM.JJJJ | MM.JJJJ | JJJJ',
                label: 'Erkrankungsbeginn',
                importSpec: {
                  importKey: 'D.start',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_onset',
            },
          ],
        },
        {
          key: 'evidence',
          fieldGroup: [
            {
              key: 'answer.valueCoding',
              type: 'autocomplete-multi-coding',
              props: {
                options: [
                  {
                    code: '85919009',
                    display: 'Darm-Komplikation',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Disorder of intestine (disorder)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '65363002',
                    display: 'Entzündung des Mittelohrs (Otitis media)',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Otitis media (disorder)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '386661006',
                    display: 'Fieber',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Fever (finding)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '45170000',
                    display: 'Gehirnentzündung (Enzephalitis)',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Encephalitis (disorder)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '247471006:{363698007=181469002}',
                    display: 'Hautausschlag, generalisiert, makulopapulös',
                    designations: [
                      {
                        language: 'en-US',
                        value:
                          '247471006 | Maculopapular eruption (disorder) | : {363698007 | Finding site (attribute) | = 181469002 | Entire skin (body structure) |}',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '7180009',
                    display: 'Hirnhautentzündung (Meningitis)',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Meningitis (disorder)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '49727002',
                    display: 'Husten',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Cough (finding)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '233604007',
                    display: 'Lungenentzündung (Pneumonie)',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Pneumonia (disorder)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '193894004',
                    display: 'Rötung der Bindehaut',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Conjunctival hyperemia (finding)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '64611009',
                    display: 'wässriger Schnupfen (Katarrh)',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Catarrhal nasal discharge (disorder)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                ],
                required: false,
                clearable: true,
                defaultCode: 'NASK',
                label: 'Symptome und -Manifestationen',
                importSpec: {
                  importKey: 'D.symptoms',
                  multi: true,
                },
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_evidence',
            },
          ],
        },
        {
          key: 'note',
          fieldGroup: [
            {
              key: 'answer.valueString',
              type: 'input',
              props: {
                label: 'Diagnosehinweise',
                importSpec: {
                  importKey: 'D.note',
                  multi: false,
                },
              },
              wrappers: ['form-field'],
              className: 'LinkId_note',
            },
          ],
        },
      ],
      fieldGroupClassName: 'QUESTIONS',
    },
  ],
};
