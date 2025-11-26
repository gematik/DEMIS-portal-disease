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

export const FIELDS = [
  {
    key: 'tabDiseaseCommon',
    props: {
      label: 'Klinische und epidemiologische Angaben',
      disabled: false,
    },
    fieldGroup: [
      {
        template: 'Meldetatbestandsübergreifende klinische und epidemiologische Angaben',
        className: 'QUESTIONNAIRE-TITLE',
        props: {
          disabled: false,
        },
        id: 'formly_184_template__0',
        hooks: {},
        modelOptions: {},
        validation: {
          messages: {},
        },
        resetOnHide: true,
        type: 'formly-template',
        wrappers: [],
        expressions: {},
        expressionProperties: {},
      },
      {
        fieldGroup: [
          {
            key: 'isDead.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Verstorben',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_isDead',
                id: 'formly_194_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
              {
                key: 'deathDate.answer',
                fieldGroup: [
                  {
                    key: 'valueDate',
                    type: 'input',
                    props: {
                      placeholder: 'dd.mm.yyyy',
                      label: 'Datum des Todes',
                      enableWhen: [
                        {
                          path: 'parent.parent',
                          op: '=',
                          value: 'yes',
                        },
                      ],
                      disabled: false,
                      hidden: true,
                    },
                    validators: {
                      validation: ['date123'],
                    },
                    wrappers: ['form-field'],
                    className: 'LinkId_deathDate',
                    defaultValue: '',
                    expressions: {},
                    id: 'formly_195_input_valueDate_0',
                    hooks: {},
                    modelOptions: {},
                    validation: {
                      messages: {},
                    },
                    resetOnHide: true,
                    hide: true,
                    expressionProperties: {},
                  },
                ],
                props: {
                  disabled: false,
                },
                id: 'formly_194__deathDate.answer_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                type: 'formly-group',
                wrappers: [],
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_192__isDead.answer_0',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
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
                      code: 'noReferenceToBundeswehr',
                      display: 'Kein Bezug zur BW',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'memberOfBundeswehr',
                      display: 'Soldat/BW-Angehöriger',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'civilPersonActiveInBundeswehr',
                      display: 'Zivilperson tätig/untergebracht in Einrichtung der BW',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Zugehörigkeit zur Bundeswehr',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_militaryAffiliation',
                id: 'formly_196_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_195__militaryAffiliation.answer_1',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'labSpecimenTaken.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Laborbeauftragung',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_labSpecimenTaken',
                id: 'formly_198_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
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
                      disabled: false,
                      hidden: true,
                    },
                    wrappers: ['panel'],
                    className: 'LinkId_labSpecimenLab',
                    fieldGroup: [
                      {
                        key: 'name.answer.valueString',
                        type: 'input',
                        props: {
                          label: 'Name der Einrichtung',
                          disabled: false,
                        },
                        wrappers: ['form-field'],
                        className: 'LinkId_labSpecimenLab',
                        defaultValue: '',
                        id: 'formly_203_input_name.answer.valueString_0',
                        hooks: {},
                        modelOptions: {},
                        validation: {
                          messages: {},
                        },
                        resetOnHide: true,
                        expressions: {},
                        expressionProperties: {},
                      },
                      {
                        key: 'address',
                        props: {
                          label: 'Adresse',
                          disabled: false,
                        },
                        wrappers: ['panel'],
                        fieldGroup: [
                          {
                            key: 'line.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Straße und Hausnummer',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_206_input_line.answer.valueString_0',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                          {
                            key: 'postalCode.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Postleitzahl',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_206_input_postalCode.answer.valueString_1',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                          {
                            key: 'city.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Stadt',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_206_input_city.answer.valueString_2',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                        ],
                        id: 'formly_203__address_1',
                        hooks: {},
                        modelOptions: {},
                        validation: {
                          messages: {},
                        },
                        resetOnHide: true,
                        type: 'formly-group',
                        expressions: {},
                        expressionProperties: {},
                      },
                      {
                        key: 'contact',
                        props: {
                          label: 'Ansprechpartner',
                          disabled: false,
                        },
                        wrappers: ['panel'],
                        fieldGroup: [
                          {
                            key: 'name.prefix.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Titel',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_209_input_name.prefix.answer.valueString_0',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                          {
                            key: 'name.given.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Vorname',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_209_input_name.given.answer.valueString_1',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                          {
                            key: 'name.family.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Nachname',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_209_input_name.family.answer.valueString_2',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                        ],
                        id: 'formly_206__contact_2',
                        hooks: {},
                        modelOptions: {},
                        validation: {
                          messages: {},
                        },
                        resetOnHide: true,
                        type: 'formly-group',
                        expressions: {},
                        expressionProperties: {},
                      },
                      {
                        key: 'telecom',
                        props: {
                          label: 'Kontaktmöglichkeiten',
                          disabled: false,
                        },
                        wrappers: ['panel'],
                        fieldGroup: [
                          {
                            key: 'phone.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Telefonnummer',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_211_input_phone.answer.valueString_0',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                          {
                            key: 'email.answer.valueString',
                            type: 'input',
                            props: {
                              label: 'Email',
                              disabled: false,
                            },
                            wrappers: ['form-field'],
                            className: 'LinkId_labSpecimenLab',
                            defaultValue: '',
                            id: 'formly_211_input_email.answer.valueString_1',
                            hooks: {},
                            modelOptions: {},
                            validation: {
                              messages: {},
                            },
                            resetOnHide: true,
                            expressions: {},
                            expressionProperties: {},
                          },
                        ],
                        id: 'formly_209__telecom_3',
                        hooks: {},
                        modelOptions: {},
                        validation: {
                          messages: {},
                        },
                        resetOnHide: true,
                        type: 'formly-group',
                        expressions: {},
                        expressionProperties: {},
                      },
                    ],
                    expressions: {},
                    id: 'formly_199__Organization_0',
                    hooks: {},
                    modelOptions: {},
                    validation: {
                      messages: {},
                    },
                    resetOnHide: true,
                    type: 'formly-group',
                    hide: true,
                    expressionProperties: {},
                  },
                ],
                props: {
                  disabled: false,
                },
                id: 'formly_198__labSpecimenLab.answer_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                type: 'formly-group',
                wrappers: [],
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_196__labSpecimenTaken.answer_2',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'hospitalized.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Aufnahme in ein Krankenhaus',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_hospitalized',
                id: 'formly_213_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
              {
                key: 'hospitalizedGroup',
                type: 'repeat-section',
                fieldGroupClassName: 'ITEM_GROUP REPEATED LinkId_hospitalizedGroup',
                props: {
                  itemName: 'itemName_2',
                  enableWhen: [
                    {
                      path: 'parent',
                      op: '=',
                      value: 'yes',
                    },
                  ],
                  label: '',
                  disabled: false,
                  hidden: true,
                },
                fieldArray: {
                  fieldGroup: [
                    {
                      key: 'hospitalizedEncounter.answer',
                      fieldGroup: [
                        {
                          key: 'Hospitalization',
                          fieldGroupClassName: 'ITEM_REFERENCE',
                          className: 'LinkId_hospitalizationRef',
                          fieldGroup: [
                            {
                              key: 'serviceType',
                              fieldGroupClassName: 'REF_ELEMENT',
                              className: 'LinkId_hospitalizationRef',
                              fieldGroup: [
                                {
                                  key: 'answer.valueCoding',
                                  type: 'autocomplete-coding',
                                  props: {
                                    options: [
                                      {
                                        code: '3000',
                                        display: 'Kinder-und Jugendpsychiatrie',
                                        designations: [],
                                        system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                      },
                                      {
                                        code: '2150',
                                        display: 'Schwerpunkt Thoraxchirurgie Intensivmedizin',
                                        designations: [],
                                        system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                      },
                                      {
                                        code: '0156',
                                        display: 'Schwerpunkt Schlaganfallpatienten',
                                        designations: [],
                                        system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                      },
                                      {
                                        code: '0910',
                                        display: 'Schwerpunkt Pädiatrie',
                                        designations: [],
                                        system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                      },
                                      {
                                        code: '3628',
                                        display: 'Schwerpunkt Neurologie',
                                        designations: [],
                                        system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                                      },
                                    ],
                                    required: true,
                                    clearable: true,
                                    label: 'Art',
                                  },
                                },
                              ],
                            },
                            {
                              key: 'period',
                              className: 'LinkId_hospitalizationRef',
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
                                        label: 'Aufnahmedatum',
                                      },
                                      className: 'LinkId_hospitalizationRef',
                                      validators: {
                                        validation: ['date123'],
                                      },
                                      defaultValue: '',
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
                                        label: 'Entlassdatum',
                                      },
                                      className: 'LinkId_hospitalizationRef',
                                      validators: {
                                        validation: ['date123'],
                                      },
                                      defaultValue: '',
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
                                      key: 'name.answer.valueString',
                                      type: 'input',
                                      props: {
                                        label: 'Name der Einrichtung',
                                      },
                                      wrappers: ['form-field'],
                                      className: 'LinkId_hospitalizedEncounter',
                                      defaultValue: '',
                                    },
                                    {
                                      key: 'address',
                                      props: {
                                        label: 'Adresse',
                                      },
                                      wrappers: ['panel'],
                                      fieldGroup: [
                                        {
                                          key: 'line.answer.valueString',
                                          type: 'input',
                                          props: {
                                            label: 'Straße und Hausnummer',
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
                                        },
                                        {
                                          key: 'postalCode.answer.valueString',
                                          type: 'input',
                                          props: {
                                            label: 'Postleitzahl',
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
                                        },
                                        {
                                          key: 'city.answer.valueString',
                                          type: 'input',
                                          props: {
                                            label: 'Stadt',
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
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
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
                                        },
                                        {
                                          key: 'name.given.answer.valueString',
                                          type: 'input',
                                          props: {
                                            label: 'Vorname',
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
                                        },
                                        {
                                          key: 'name.family.answer.valueString',
                                          type: 'input',
                                          props: {
                                            label: 'Nachname',
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
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
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
                                        },
                                        {
                                          key: 'email.answer.valueString',
                                          type: 'input',
                                          props: {
                                            label: 'Email',
                                          },
                                          wrappers: ['form-field'],
                                          className: 'LinkId_hospitalizedEncounter',
                                          defaultValue: '',
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
                defaultValue: [],
                expressions: {},
                id: 'formly_213_repeat-section_hospitalizedGroup_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                wrappers: [],
                fieldGroup: [],
                hide: true,
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_211__hospitalized.answer_3',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'infectProtectFacility.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label:
                    'Tätigkeit, Betreuung oder Unterbringung in Einrichtungen mit Relevanz für den Infektionsschutz (siehe § 23 Abs. 3 IfSG, §35 Abs. 1 IfSG oder §36 Abs. 1 IfSG)',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_infectProtectFacility',
                id: 'formly_215_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
              {
                key: 'infectProtectFacilityGroup',
                type: 'repeat-section',
                fieldGroupClassName: 'ITEM_GROUP REPEATED LinkId_infectProtectFacilityGroup',
                props: {
                  itemName: 'itemName_3',
                  enableWhen: [
                    {
                      path: 'parent',
                      op: '=',
                      value: 'yes',
                    },
                  ],
                  label: '',
                  disabled: false,
                  hidden: true,
                },
                fieldArray: {
                  fieldGroup: [
                    {
                      key: 'infectProtectFacilityBegin.answer',
                      fieldGroup: [
                        {
                          key: 'valueDate',
                          type: 'input',
                          props: {
                            placeholder: 'dd.mm.yyyy',
                            label: 'Beginn der Tätigkeit/Betreuung/Unterbringung',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          validators: {
                            validation: ['date123'],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_infectProtectFacilityBegin',
                          defaultValue: '',
                          expressions: {},
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
                            placeholder: 'dd.mm.yyyy',
                            label: 'Ende der Tätigkeit/Betreuung/Unterbringung',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          validators: {
                            validation: ['date123'],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_infectProtectFacilityEnd',
                          defaultValue: '',
                          expressions: {},
                        },
                      ],
                    },
                    {
                      key: 'infectProtectFacilityRole.answer',
                      fieldGroup: [
                        {
                          key: 'valueCoding',
                          type: 'autocomplete-coding',
                          props: {
                            options: [
                              {
                                code: 'accommodation',
                                display: 'Unterbringung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/organizationAssociation',
                              },
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
                            ],
                            required: true,
                            clearable: true,
                            label: 'Rolle',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_infectProtectFacilityRole',
                          expressions: {},
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
                                path: 'parent.parent.parent.parent',
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
                                label: 'Name der Einrichtung',
                              },
                              wrappers: ['form-field'],
                              className: 'LinkId_infectProtectFacilityOrganization',
                              defaultValue: '',
                            },
                            {
                              key: 'address',
                              props: {
                                label: 'Adresse',
                              },
                              wrappers: ['panel'],
                              fieldGroup: [
                                {
                                  key: 'line.answer.valueString',
                                  type: 'input',
                                  props: {
                                    label: 'Straße und Hausnummer',
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
                                },
                                {
                                  key: 'postalCode.answer.valueString',
                                  type: 'input',
                                  props: {
                                    label: 'Postleitzahl',
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
                                },
                                {
                                  key: 'city.answer.valueString',
                                  type: 'input',
                                  props: {
                                    label: 'Stadt',
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
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
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
                                },
                                {
                                  key: 'name.given.answer.valueString',
                                  type: 'input',
                                  props: {
                                    label: 'Vorname',
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
                                },
                                {
                                  key: 'name.family.answer.valueString',
                                  type: 'input',
                                  props: {
                                    label: 'Nachname',
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
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
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
                                },
                                {
                                  key: 'email.answer.valueString',
                                  type: 'input',
                                  props: {
                                    label: 'Email',
                                  },
                                  wrappers: ['form-field'],
                                  className: 'LinkId_infectProtectFacilityOrganization',
                                  defaultValue: '',
                                },
                              ],
                            },
                          ],
                          expressions: {},
                        },
                      ],
                    },
                  ],
                },
                defaultValue: [],
                expressions: {},
                id: 'formly_215_repeat-section_infectProtectFacilityGroup_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                wrappers: [],
                fieldGroup: [],
                hide: true,
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_213__infectProtectFacility.answer_4',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'placeExposure.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Wahrscheinlicher Expositionsort bekannt',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_placeExposure',
                id: 'formly_217_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
              {
                key: 'placeExposureGroup',
                type: 'repeat-section',
                fieldGroupClassName: 'ITEM_GROUP REPEATED LinkId_placeExposureGroup',
                props: {
                  itemName: 'itemName_4',
                  enableWhen: [
                    {
                      path: 'parent',
                      op: '=',
                      value: 'yes',
                    },
                  ],
                  label: '',
                  disabled: false,
                  hidden: true,
                },
                fieldArray: {
                  fieldGroup: [
                    {
                      key: 'placeExposureBegin.answer',
                      fieldGroup: [
                        {
                          key: 'valueDate',
                          type: 'input',
                          props: {
                            placeholder: 'dd.mm.yyyy',
                            label: 'Beginn des Aufenthalts am wahrscheinlichen Expositionsort/Datum des Aufenthalts',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          validators: {
                            validation: ['date123'],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_placeExposureBegin',
                          defaultValue: '',
                          expressions: {},
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
                            placeholder: 'dd.mm.yyyy',
                            label: 'Ende des Aufenthalts am wahrscheinlichen Expositionsort',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          validators: {
                            validation: ['date123'],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_placeExposureEnd',
                          defaultValue: '',
                          expressions: {},
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
                                code: '41423008',
                                display: 'Ghazni',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                              },
                              {
                                code: '41423009',
                                display: 'Ghor',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                              },
                              {
                                code: '41423010',
                                display: 'Hilmand',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                              },
                              {
                                code: '41423013',
                                display: 'Kabul',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                              },
                            ],
                            required: true,
                            clearable: true,
                            defaultCode: 'NASK',
                            label: 'Wahrscheinlicher Expositionsort',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_placeExposureRegion',
                          expressions: {},
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
                            label: 'Anmerkungen zum Expositonsort',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_placeExposureHint',
                          defaultValue: '',
                          expressions: {},
                        },
                      ],
                    },
                  ],
                },
                defaultValue: [],
                expressions: {},
                id: 'formly_217_repeat-section_placeExposureGroup_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                wrappers: [],
                fieldGroup: [],
                hide: true,
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_215__placeExposure.answer_5',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'organDonation.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Spender für eine Blut-, Organ-, Gewebe- oder Zellspende in den letzten 6 Monaten',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_organDonation',
                id: 'formly_218_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_217__organDonation.answer_6',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'additionalInformation.answer',
            fieldGroup: [
              {
                key: 'valueString',
                type: 'textarea',
                props: {
                  label: 'Wichtige Zusatzinformationen',
                  disabled: false,
                  cols: 1,
                  rows: 1,
                },
                wrappers: ['form-field'],
                className: 'LinkId_additionalInformation',
                defaultValue: '',
                id: 'formly_219_textarea_valueString_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_218__additionalInformation.answer_7',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
        ],
        fieldGroupClassName: 'QUESTIONS',
        props: {},
        id: 'formly_184___1',
        hooks: {},
        modelOptions: {},
        validation: {
          messages: {},
        },
        resetOnHide: true,
        type: 'formly-group',
        wrappers: [],
        expressions: {},
        expressionProperties: {},
      },
    ],
    id: 'formly_182__tabDiseaseCommon_4',
    hooks: {},
    modelOptions: {},
    validation: {
      messages: {},
    },
    resetOnHide: true,
    type: 'formly-group',
    wrappers: [],
    expressions: {},
    expressionProperties: {},
  },
  {
    key: 'tabQuestionnaire',
    props: {
      label: 'Spezifische Angaben',
      disabled: false,
    },
    fieldGroup: [
      {
        template: 'Covid-19-spezifische klinische und epidemiologische Angaben',
        className: 'QUESTIONNAIRE-TITLE',
        props: {
          disabled: false,
        },
        id: 'formly_221_template__0',
        hooks: {},
        modelOptions: {},
        validation: {
          messages: {},
        },
        resetOnHide: true,
        type: 'formly-template',
        wrappers: [],
        expressions: {},
        expressionProperties: {},
      },
      {
        fieldGroup: [
          {
            key: 'infectionSource.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Kontakt zu bestätigtem Fall',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_infectionSource',
                id: 'formly_228_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_227__infectionSource.answer_0',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'infectionEnvironmentSetting.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Infektionsumfeld vorhanden',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_infectionEnvironmentSetting',
                id: 'formly_230_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
              {
                key: 'infectionEnvironmentSettingGroup',
                type: 'repeat-section',
                fieldGroupClassName: 'ITEM_GROUP REPEATED LinkId_infectionEnvironmentSettingGroup',
                props: {
                  itemName: 'itemName_1',
                  enableWhen: [
                    {
                      path: 'parent',
                      op: '=',
                      value: 'yes',
                    },
                  ],
                  label: '',
                  disabled: false,
                  hidden: true,
                },
                fieldArray: {
                  fieldGroup: [
                    {
                      key: 'infectionEnvironmentSettingKind.answer',
                      fieldGroup: [
                        {
                          key: 'valueCoding',
                          type: 'autocomplete-coding',
                          props: {
                            options: [
                              {
                                code: 'ASKU',
                                display: 'nicht ermittelbar',
                                designations: [
                                  {
                                    language: 'de',
                                    value: 'nicht ermittelbar',
                                  },
                                ],
                                system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                              },
                              {
                                code: '444107005+702916001',
                                display: 'Reha-Einrichtung',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 702916001 | Rehabilitation clinic (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '190',
                                display: 'Flugzeug/Flughafen',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '191',
                                display: 'Schiff/Hafen',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '192',
                                display: 'Zug/Bahnhof',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '193',
                                display: 'Fernbus',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '194',
                                display: 'öffentlicher Nahverkehr',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '350',
                                display: 'Passagier/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '351',
                                display: 'Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '110',
                                display: 'Großraumbüro',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '111',
                                display: 'Lebensmittelbereich',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '112',
                                display: 'Baugewerbe',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '113',
                                display: 'Logistikzentrum',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+257656006',
                                display: 'Justizvollzugsanstalt',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 257656006 | Penal institution (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+21753002',
                                display: 'Flugzeug',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 21753002 | Aircraft, device (physical object) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '10',
                                display: 'sonstiges',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+257629009',
                                display: 'Hotel',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257629009 | Hotel (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+405081003',
                                display: 'Freizeitaktivitäten',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 405081003 | Leisure behavior (observable entity) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+108344006',
                                display: 'ambulanter Pflegedienst',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 108344006 | Nursing home AND/OR ambulatory care site (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '360',
                                display: 'Passagier/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '240',
                                display: 'Pflegepersonal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '361',
                                display: 'Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+1348009',
                                display: 'teilstationäre Einrichtung für älterer, behinderter oder pflegebedürftiger Menschen (z.B. Seniorentagesstätte)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 1348009 | Day care center (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+257621007',
                                display: 'Hafen',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257621007 | Harbor (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '120',
                                display: 'medizinische Einrichtung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '241',
                                display: 'sonstiges Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '362',
                                display: 'Patient/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '121',
                                display: 'Pflegeeinrichtung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '363',
                                display: 'Besucher/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '1',
                                display: 'Arbeitsplatz, andere',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '122',
                                display: 'ambulanter Pflegedienst',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '364',
                                display: 'medizinisches Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '2',
                                display: 'Bildungs-/Betreuungseinrichtung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '365',
                                display: 'Pflegepersonal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '123',
                                display: 'Labor',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '3',
                                display: 'Gesundheitseinrichtung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '124',
                                display: 'Reha-Einrichtung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '366',
                                display: 'sonstiges Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '4',
                                display: 'privater Haushalt',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '5',
                                display: 'Einzelhandel',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '6',
                                display: 'Freizeit',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '7',
                                display: 'Gastronomie',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '8',
                                display: 'Veranstaltung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '9',
                                display: 'Transportmittel',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+257603009',
                                display: 'sonstige Bildungs-/Betreuungseinrichtung',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 257603009 | Educational establishment (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '74964007',
                                display: '-andere/sonstige-',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: 'Other (qualifier value)',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+284555002',
                                display: 'Tiergarten, Zoo, Tierpark',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 284555002 | Zoo - place (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '250',
                                display: 'Wohnstätten',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '251',
                                display: 'Alten-/Pflegeheim',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '252',
                                display: 'Wohnheim (Kinder-, Jugend-, Studierenden-)',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '253',
                                display: 'Kaserne',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '254',
                                display: 'Justizvollzugsanstalt',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '255',
                                display: 'Flüchtlings-, Asylbewerberheim',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+261904005',
                                display: 'Labor',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 261904005 | Laboratory (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+224673002',
                                display: 'Schiff',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 224673002 | Ship (physical object) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+702703009',
                                display: 'Demonstration/Kundgebung',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 702703009 | Outdoor public site (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '260',
                                display: 'Übernachtung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '261',
                                display: 'Hotel, Pension, Herberge',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '262',
                                display: 'Kreuzfahrtschiff',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: 'NASK',
                                display: 'nicht erhoben',
                                designations: [
                                  {
                                    language: 'de',
                                    value: 'nicht erhoben',
                                  },
                                ],
                                system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                              },
                              {
                                code: '263',
                                display: 'Zeltplatz, Campingplatz',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '143',
                                display: 'Betreute/-r',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '300',
                                display: 'Betreute/-r',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '301',
                                display: 'Erzieher/-in, Betreuer/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+257659004',
                                display: 'religiöse Veranstaltung (z.B. Gottesdienst)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 257659004 | Place of worship (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '302',
                                display: 'Eltern',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '303',
                                display: 'sonstiges Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+224871002',
                                display: 'Universität',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 224871002 | University (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+285141008',
                                display: 'Arbeitsplatz',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 285141008 | Work environment (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+716367000',
                                display: 'öffentlicher Nahverkehr',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 716367000 | Transportation by public transport (procedure) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '150',
                                display: 'als Kunde',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '151',
                                display: 'als Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+257689006',
                                display: 'Gastronomie (Speisegaststätte/Kantine/Imbiss/Restaurant)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257689006 | Restaurant (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '310',
                                display: 'Schüler/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '311',
                                display: 'Lehrkraft',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+272379006+14468000',
                                display: 'Sportveranstaltung',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 272379006 | Event (event) | + 14468000 | Sports activity (observable entity) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '312',
                                display: 'Eltern',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '313',
                                display: 'sonstiges Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+257692005',
                                display: 'Wohnheim (Kinder-, Jugend-, Studierenden-)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257692005 | Rooming house (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+257628001',
                                display: 'Pension, Herberge',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257628001 | Hostel (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+257698009',
                                display: 'Schule',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257698009 | School (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '160',
                                display: 'Sport',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+22232009',
                                display: 'Krankenhaus',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 22232009 | Hospital (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '161',
                                display: 'Chor',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '162',
                                display: 'Verein',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '320',
                                display: 'Betreute/-r',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '321',
                                display: 'Erzieher/-in, Ausbilder/-in, Betreuer/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '200',
                                display: 'Patient/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '322',
                                display: 'sonstiges Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '201',
                                display: 'medizinisches Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '202',
                                display: 'Pflegepersonal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '323',
                                display: 'Passagier/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '203',
                                display: 'sonstiges Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '324',
                                display: 'Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '204',
                                display: 'Besucher/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+14468000',
                                display: 'Sport',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 14468000 | Sports activity (observable entity) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+42665001',
                                display: 'vollstationäre Einrichtung für älterer, behinderter oder pflegebedürftiger Menschen (z.B. Alten-/Pflegeheim)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 42665001 | Nursing home (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+257622000',
                                display: 'medizinische Einrichtung (außer Krankenhaus)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 257622000 | Healthcare facility (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+5549007',
                                display: 'Gemeinschaftsunterkünfte (z.B. Flüchtlings-, Asylbewerberheim)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 5549007 | Living in temporary quarters (finding) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+22674006',
                                display: 'Fernbus',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 22674006 | Motor bus, device (physical object) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '170',
                                display: 'als Gast',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '171',
                                display: 'als Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+224683003',
                                display: 'Kaserne',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 224683003 | Military accommodation (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '330',
                                display: 'Passagier/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+62193008',
                                display: 'Zug',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 62193008 | Railway train, device (physical object) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '331',
                                display: 'Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+257562009',
                                display: 'Flughafen',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257562009 | Airport (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+257658007',
                                display: 'Musikveranstaltung/Konzert',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 257658007 | Entertainment establishment (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+262044003',
                                display: 'Kreuzfahrtschiff',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 262044003 | Passenger vessel (physical object) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+394777002',
                                display: 'Ambulante Behandlungseinrichtung (Praxis, andere)',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 394777002 | Health encounter sites (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '180',
                                display: 'private Feier/Treffen',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '181',
                                display: 'Sportveranstaltung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '182',
                                display: 'Musikveranstaltung/Konzert',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+413817003',
                                display: 'Kita',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 413817003 | Child day care center (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '183',
                                display: 'religiöse Veranstaltung (z.B. Gottesdienst)',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+310205006',
                                display: 'privater Haushalt',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 310205006 | Private residential home (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '184',
                                display: 'Demonstration/Kundgebung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+161093007',
                                display: 'Zeltplatz, Campingplatz',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 161093007 | Camping vacation (finding) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '185',
                                display: 'Karneval',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '186',
                                display: 'Messe',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '340',
                                display: 'Passagier/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '220',
                                display: 'Betreute/-r',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '341',
                                display: 'Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '221',
                                display: 'Pflegepersonal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '101',
                                display: 'Kita',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '222',
                                display: 'sonstiges Personal',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '102',
                                display: 'Schule',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '223',
                                display: 'Besucher/-in',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '103',
                                display: 'sonstige Bildungs-/Betreuungseinrichtung',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '104',
                                display: 'Universität',
                                designations: [],
                                system: 'https://demis.rki.de/fhir/CodeSystem/infectionEnvironmentSetting',
                              },
                              {
                                code: '444107005+264362003+160481000',
                                display: 'private Feier/Treffen',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value:
                                      '444107005 | Exposure to communicable disease (navigational concept) | + 264362003 | Home (environment) |+ 160481000 | Social group (observable entity) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                              {
                                code: '444107005+257701001',
                                display: 'Einzelhandel',
                                designations: [
                                  {
                                    language: 'en-US',
                                    value: '444107005 | Exposure to communicable disease (navigational concept) | + 257701001 | Shop (environment) |',
                                  },
                                ],
                                system: 'http://snomed.info/sct',
                              },
                            ],
                            required: false,
                            clearable: true,
                            label: 'Wahrscheinliches Infektionsumfeld',
                            enableWhen: [
                              {
                                path: 'parent.parent.parent.parent',
                                op: '=',
                                value: 'yes',
                              },
                            ],
                          },
                          wrappers: ['form-field'],
                          className: 'LinkId_infectionEnvironmentSettingKind',
                          expressions: {},
                        },
                      ],
                    },
                  ],
                },
                defaultValue: [],
                expressions: {},
                id: 'formly_230_repeat-section_infectionEnvironmentSettingGroup_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                wrappers: [],
                fieldGroup: [],
                hide: true,
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_228__infectionEnvironmentSetting.answer_1',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'immunization.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: true,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Wurde die betroffene Person jemals in Bezug auf die Krankheit geimpft?',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_immunization',
                id: 'formly_232_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
              {
                key: 'immunizationRef.answer',
                type: 'repeat-section',
                fieldGroupClassName: 'ITEM_GROUP REPEATED LinkId_immunizationRef',
                props: {
                  itemName: 'Impfinformationen',
                  label: 'Impfinformationen',
                  enableWhen: [
                    {
                      path: 'parent',
                      op: '=',
                      value: 'yes',
                    },
                  ],
                  disabled: false,
                  hidden: true,
                },
                fieldArray: {
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
                                    code: 'EU/1/21/1618',
                                    display: 'Nuvaxovid (NVX-CoV2373)',
                                    designations: [],
                                    system: 'https://ec.europa.eu/health/documents/community-register/html/',
                                  },
                                  {
                                    code: 'EU/1/20/1525',
                                    display: 'COVID-19 Vaccine Janssen',
                                    designations: [],
                                    system: 'https://ec.europa.eu/health/documents/community-register/html/',
                                  },
                                  {
                                    code: 'EU/1/21/1529',
                                    display: 'Vaxzevria (COVID-19 Vaccine AstraZeneca)',
                                    designations: [],
                                    system: 'https://ec.europa.eu/health/documents/community-register/html/',
                                  },
                                  {
                                    code: 'EU/1/20/1528',
                                    display: 'Comirnaty',
                                    designations: [],
                                    system: 'https://ec.europa.eu/health/documents/community-register/html/',
                                  },
                                  {
                                    code: 'EU/1/20/1507',
                                    display: 'Spikevax (COVID-19 Vaccine Moderna)',
                                    designations: [],
                                    system: 'https://ec.europa.eu/health/documents/community-register/html/',
                                  },
                                  {
                                    code: 'EU/1/21/1624',
                                    display: 'Valneva',
                                    designations: [],
                                    system: 'https://ec.europa.eu/health/documents/community-register/html/',
                                  },
                                  {
                                    code: 'otherVaccine',
                                    display: 'Anderer Impfstoff',
                                    designations: [],
                                    system: 'https://demis.rki.de/fhir/CodeSystem/vaccine',
                                  },
                                ],
                                required: true,
                                clearable: true,
                                label: 'Verabreichter Impfstoff',
                              },
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
                                label: 'Datum der Impfung',
                              },
                              validators: {
                                validation: ['date123'],
                              },
                              defaultValue: '',
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
                              defaultValue: '',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                defaultValue: [],
                expressions: {},
                id: 'formly_232_repeat-section_immunizationRef.answer_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                wrappers: [],
                fieldGroup: [],
                hide: true,
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_230__immunization.answer_2',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'reason.answer',
            fieldGroup: [
              {
                key: 'valueCoding',
                type: 'autocomplete-coding',
                props: {
                  options: [
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'becauseOfOtherReason',
                      display: 'Hospitalisiert aufgrund einer anderen Ursache als der gemeldeten Krankheit',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationReason',
                    },
                    {
                      code: 'becauseOfDisease',
                      display: 'Hospitalisiert aufgrund der gemeldeten Krankheit',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationReason',
                    },
                    {
                      code: 'forIsolation',
                      display: 'Hospitalisiert zur Isolierung',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationReason',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: false,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Grund der Hospitalisierung',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_reason',
                id: 'formly_233_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_232__reason.answer_3',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
          {
            key: 'infectionRiskKind.answer',
            type: 'repeat-section',
            fieldGroupClassName: 'ITEM_GROUP REPEATED LinkId_infectionRiskKind',
            props: {
              itemName: 'Welche Risikofaktoren liegen bei der betroffenen Person vor?',
              label: 'Welche Risikofaktoren liegen bei der betroffenen Person vor?',
              disabled: false,
            },
            fieldArray: {
              fieldGroup: [
                {
                  key: 'valueCoding',
                  type: 'autocomplete-coding',
                  props: {
                    options: [
                      {
                        code: '86569001',
                        display: 'Postpartum (weniger als 6 Wochen)',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Postpartum state (finding)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: 'ASKU',
                        display: 'nicht ermittelbar',
                        designations: [
                          {
                            language: 'de',
                            value: 'nicht ermittelbar',
                          },
                        ],
                        system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                      },
                      {
                        code: '260413007',
                        display: 'keine',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'None (qualifier value)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '49601007',
                        display: 'Herz-Kreislauf-Erkrankung (inkl. Bluthochdruck)',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Disorder of cardiovascular system (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '234532001',
                        display: 'Immundefizienz, inkl. HIV',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Immunodeficiency disorder (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '77386006',
                        display: 'Schwangerschaft',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Pregnancy (finding)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '44054006',
                        display: 'Diabetes Typ 2',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Diabetes mellitus type 2 (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '90708001',
                        display: 'Nierenerkrankung',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Kidney disease (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: 'NASK',
                        display: 'nicht erhoben',
                        designations: [
                          {
                            language: 'de',
                            value: 'nicht erhoben',
                          },
                        ],
                        system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                      },
                      {
                        code: '118940003',
                        display: 'neurologische/neuromuskuläre Erkrankung',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Disorder of nervous system (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '363346000',
                        display: 'Krebserkrankung',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Malignant neoplastic disease (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '46635009',
                        display: 'Diabetes Typ 1',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Diabetes mellitus type 1 (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '235856003',
                        display: 'Lebererkrankung',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Disorder of liver (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '413839001',
                        display: 'Chronische Lungenerkrankung (z.B. COPD)',
                        designations: [
                          {
                            language: 'en-US',
                            value: 'Chronic lung disease (disorder)',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                    ],
                    required: false,
                    clearable: true,
                    defaultCode: 'NASK',
                    label: 'Welche Risikofaktoren liegen bei der betroffenen Person vor?',
                  },
                  wrappers: ['form-field'],
                  className: 'LinkId_infectionRiskKind',
                },
                {
                  key: 'trimester.answer',
                  fieldGroup: [
                    {
                      key: 'valueCoding',
                      type: 'autocomplete-coding',
                      props: {
                        options: [
                          {
                            code: '255248002',
                            display: '3. Trimester',
                            designations: [
                              {
                                language: 'en-US',
                                value: 'Third trimester (qualifier value)',
                              },
                            ],
                            system: 'http://snomed.info/sct',
                          },
                          {
                            code: 'ASKU',
                            display: 'nicht ermittelbar',
                            designations: [
                              {
                                language: 'de',
                                value: 'nicht ermittelbar',
                              },
                            ],
                            system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                          },
                          {
                            code: '255247007',
                            display: '2. Trimester',
                            designations: [
                              {
                                language: 'en-US',
                                value: 'Second trimester (qualifier value)',
                              },
                            ],
                            system: 'http://snomed.info/sct',
                          },
                          {
                            code: '255246003',
                            display: '1. Trimester',
                            designations: [
                              {
                                language: 'en-US',
                                value: 'First trimester (qualifier value)',
                              },
                            ],
                            system: 'http://snomed.info/sct',
                          },
                          {
                            code: 'NASK',
                            display: 'nicht erhoben',
                            designations: [
                              {
                                language: 'de',
                                value: 'nicht erhoben',
                              },
                            ],
                            system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                          },
                        ],
                        required: false,
                        clearable: true,
                        defaultCode: 'NASK',
                        label: 'Trimester',
                        enableWhen: [
                          {
                            path: 'parent.parent',
                            op: '=',
                            value: '77386006',
                          },
                        ],
                      },
                      wrappers: ['form-field'],
                      className: 'LinkId_trimester',
                      expressions: {},
                    },
                  ],
                },
              ],
            },
            defaultValue: [],
            id: 'formly_233_repeat-section_infectionRiskKind.answer_4',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            wrappers: [],
            fieldGroup: [],
            expressions: {},
            expressionProperties: {},
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
                      code: 'no',
                      display: 'Nein',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'ASKU',
                      display: 'nicht ermittelbar',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht ermittelbar',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                    {
                      code: 'yes',
                      display: 'Ja',
                      designations: [],
                      system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
                    },
                    {
                      code: 'NASK',
                      display: 'nicht erhoben',
                      designations: [
                        {
                          language: 'de',
                          value: 'nicht erhoben',
                        },
                      ],
                      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
                    },
                  ],
                  required: false,
                  clearable: true,
                  defaultCode: 'NASK',
                  label: 'Kann der gemeldete Fall einem Ausbruch zugeordnet werden?',
                  disabled: false,
                },
                wrappers: ['form-field'],
                className: 'LinkId_outbreak',
                id: 'formly_236_autocomplete-coding_valueCoding_0',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                expressions: {},
                expressionProperties: {},
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
                      disabled: false,
                      cols: 1,
                      rows: 1,
                      hidden: true,
                    },
                    wrappers: ['form-field'],
                    className: 'LinkId_outbreakNote',
                    defaultValue: '',
                    expressions: {},
                    id: 'formly_237_textarea_valueString_0',
                    hooks: {},
                    modelOptions: {},
                    validation: {
                      messages: {},
                    },
                    resetOnHide: true,
                    hide: true,
                    expressionProperties: {},
                  },
                ],
                props: {
                  disabled: false,
                },
                id: 'formly_236__outbreakNote.answer_1',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                type: 'formly-group',
                wrappers: [],
                expressions: {},
                expressionProperties: {},
              },
              {
                key: 'outbreakNotificationId.answer',
                fieldGroup: [
                  {
                    key: 'valueString',
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
                      disabled: false,
                      hidden: true,
                    },
                    className: 'LinkId_outbreakNotificationId',
                    defaultValue: '',
                    expressions: {},
                    id: 'formly_238_input_valueString_0',
                    hooks: {},
                    modelOptions: {},
                    validation: {
                      messages: {},
                    },
                    resetOnHide: true,
                    wrappers: ['form-field'],
                    hide: true,
                    expressionProperties: {},
                  },
                ],
                props: {
                  disabled: false,
                },
                id: 'formly_237__outbreakNotificationId.answer_2',
                hooks: {},
                modelOptions: {},
                validation: {
                  messages: {},
                },
                resetOnHide: true,
                type: 'formly-group',
                wrappers: [],
                expressions: {},
                expressionProperties: {},
              },
            ],
            props: {
              disabled: false,
            },
            id: 'formly_233__outbreak.answer_5',
            hooks: {},
            modelOptions: {},
            validation: {
              messages: {},
            },
            resetOnHide: true,
            type: 'formly-group',
            wrappers: [],
            expressions: {},
            expressionProperties: {},
          },
        ],
        fieldGroupClassName: 'QUESTIONS',
        props: {},
        id: 'formly_221___1',
        hooks: {},
        modelOptions: {},
        validation: {
          messages: {},
        },
        resetOnHide: true,
        type: 'formly-group',
        wrappers: [],
        expressions: {},
        expressionProperties: {},
      },
    ],
    id: 'formly_219__tabQuestionnaire_5',
    hooks: {},
    modelOptions: {},
    validation: {
      messages: {},
    },
    resetOnHide: true,
    type: 'formly-group',
    wrappers: [],
    expressions: {},
    expressionProperties: {},
  },
];
