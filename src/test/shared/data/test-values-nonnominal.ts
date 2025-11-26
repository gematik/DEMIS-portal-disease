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

export const EXAMPLE_TOXP_SHORT = {
  questionnaireConfigs: [
    {
      template: 'Toxoplasma gondii; Meldepflicht nur bei konnatalen Infektionen: spezifische klinische und epidemiologische Angaben',
      className: 'QUESTIONNAIRE-TITLE',
    },
    {
      fieldGroup: [
        {
          key: 'motherEvidence.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
              props: {
                options: [
                  {
                    code: '261665006',
                    display: 'Unbekannt',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '1631000175102',
                    display: 'Patient not asked (contextual qualifier) (qualifier value)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Patient/Patientin nicht gefragt',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '373066001',
                    display: 'Yes (qualifier value)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Ja',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '373067005',
                    display: 'No (qualifier value)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Nein',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                ],
                required: true,
                clearable: true,
                label: 'Lag bei der Mutter eine klinische Symptomatik vor?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_motherEvidence',
            },
          ],
        },
        {
          key: 'newbornEvidence.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-multi-coding',
              props: {
                options: [
                  {
                    code: '261665006',
                    display: 'Unbekannt',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '276654001',
                    display: 'Angeborene Fehlbildung',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '276550000',
                    display: 'Prolonged newborn physiological jaundice (finding)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Anhaltende Gelbsucht (Ikterus) bei Neugeborenem',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '271737000',
                    display: 'Anemia (disorder)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Blutarmut (Anämie)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '46627006',
                    display: 'Chorioretinitis (disorder)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Chorioretinale Entzündung',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '386661006',
                    display: 'Fieber',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '230745008',
                    display: 'Hydrocephalus (disorder)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Hydrocephalus',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '91175000',
                    display: 'Krampfanfall',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '36760000',
                    display: 'Hepatosplenomegalie',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Leber- und Milzvergrößerung (Hepatosplenomegalie)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '1148757008',
                    display: 'Mikrozephalie',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Mikrozephalus',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '125369001:733928003=128319008',
                    display: 'Verkalkungen, intrakraniell',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '74964007',
                    display: 'Andere',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Other (qualifier value)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                ],
                required: true,
                clearable: true,
                label: 'Welche Symptomatik liegt bzw. lag beim Neugeborenen vor?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_newbornEvidence',
            },
          ],
        },
        {
          key: 'pregnancyWeek.answer',
          fieldGroup: [
            {
              key: 'pregnancyWeek',
              type: 'input',
              props: {
                required: true,
                label: 'In welcher Schwangerschaftswoche fand die Geburt statt?',
                type: 'number',
                min: 1,
                max: 42,
                step: 1,
              },
              validators: {
                validation: ['nonBlankValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_pregnancyWeek',
            },
          ],
        },
        {
          key: 'newbornWeight.answer',
          fieldGroup: [
            {
              key: 'newbornWeight',
              type: 'input',
              props: {
                required: true,
                label: 'Welches Gewicht hatte das Neugeborene bei der Geburt (Angabe in Gramm)?',
                quantity: {
                  system: 'http://unitsofmeasure.org',
                  unit: 'gram',
                },
                type: 'number',
                min: 1000,
                max: 5000,
                step: 0.01,
              },
              validators: {
                validation: ['nonBlankValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_newbornWeight',
            },
          ],
        },
        {
          key: 'newbornStatus.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
              props: {
                options: [
                  {
                    code: '261665006',
                    display: 'Unbekannt',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '281050002',
                    display: 'Lebendgeburt',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '276506001',
                    display: 'Tod von Neugeborenem',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '237364002',
                    display: 'Totgeburt',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                ],
                required: true,
                clearable: true,
                label: 'Wie ist der Gesundheitszustand des Neugeborenen jetzt bzw. zum Zeitpunkt der Geburt?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_newbornStatus',
            },
          ],
        },
        {
          key: 'infectionRiscDuringPregnancy.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
              props: {
                options: [
                  {
                    code: '261665006',
                    display: 'Unbekannt',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '1631000175102',
                    display: 'Patient not asked (contextual qualifier) (qualifier value)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Patient/Patientin nicht gefragt',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '184082004+77386006',
                    display: 'Auslandsaufenthalt während der Schwangerschaft',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '102432000',
                    display: 'Exposure to polluted soil (event)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Kontakt mit kontaminierter Erde',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '102432000:{47429007=260787004}',
                    display: 'Kontakt zu mit Erde kontaminierten Gegenständen',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '444071008:{47429007=448169003}',
                    display: 'Körperlicher Kontakt mit Katzen',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '133261000119105:{47429007=39477002,47429007=448169003}',
                    display: 'Körperlicher Kontakt mit Katzenkot',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '781249001:{47429007=415555003}',
                    display: 'Verzehr von mit Erde kontaminierter Produkte (z.B. rohes Gemüse)',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '781249001:{47429007=(228067006+28647000)}',
                    display: 'Verzehr von nicht durchgegartem Fleisch',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '74964007',
                    display: 'Andere',
                    designations: [
                      {
                        language: 'en-US',
                        value: 'Other (qualifier value)',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                ],
                required: true,
                clearable: true,
                label: 'Lag während der Schwangerschaft eines der folgenden Infektionsrisiken vor?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_infectionRiscDuringPregnancy',
            },
            {
              key: 'infectionRiscCountry.answer',
              fieldGroup: [
                {
                  key: 'valueCoding',
                  type: 'autocomplete-coding',
                  props: {
                    options: [
                      {
                        code: '261665006',
                        display: 'Unbekannt',
                        designations: [],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '1631000175102',
                        display: 'Patient not asked (contextual qualifier) (qualifier value)',
                        designations: [
                          {
                            language: 'de-DE',
                            value: 'Patient/Patientin nicht gefragt',
                          },
                        ],
                        system: 'http://snomed.info/sct',
                      },
                      {
                        code: '34051000087100:{370130000=41277001}',
                        display: 'Staatenlos',
                        designations: [],
                        system: 'http://snomed.info/sct',
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
                    ],
                    required: true,
                    clearable: true,
                    label: 'Welches Land wurde während der Schwangerschaft besucht?',
                    enableWhen: [
                      {
                        path: 'parent.parent',
                        op: '=',
                        value: '184082004+77386006',
                      },
                    ],
                  },
                  validators: {
                    validation: ['codingValidator'],
                  },
                  wrappers: ['form-field'],
                  className: 'LinkId_infectionRiscCountry',
                },
              ],
            },
          ],
        },
        {
          key: 'countryOriginMother.answer',
          fieldGroup: [
            {
              key: 'valueCoding',
              type: 'autocomplete-coding',
              props: {
                options: [
                  {
                    code: '261665006',
                    display: 'Unbekannt',
                    designations: [],
                    system: 'http://snomed.info/sct',
                  },
                  {
                    code: '1631000175102',
                    display: 'Patient not asked (contextual qualifier) (qualifier value)',
                    designations: [
                      {
                        language: 'de-DE',
                        value: 'Patient/Patientin nicht gefragt',
                      },
                    ],
                    system: 'http://snomed.info/sct',
                  },
                ],
                required: true,
                clearable: true,
                label: 'Welches ist das Herkunftsland der Mutter?',
              },
              validators: {
                validation: ['codingValidator'],
              },
              wrappers: ['form-field'],
              className: 'LinkId_countryOriginMother',
            },
          ],
        },
      ],
      fieldGroupClassName: 'QUESTIONS',
    },
  ],
  conditionConfigs: [
    {
      template: 'Toxoplasma gondii; Meldepflicht nur bei konnatalen Infektionen',
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
