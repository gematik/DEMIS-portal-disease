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

import { AddressType, DiseaseStatus } from '../../../api/notification';
import { GERMANY_COUNTRY_CODE, ZIP_CODE_DEFAULT } from '../../legacy/common-utils';
import { NotificationType } from '../../demis-types';
import { environment } from '../../../environments/environment';
import StatusEnum = DiseaseStatus.StatusEnum;

export class HexHexDummy {
  getDummy(type: NotificationType) {
    if (type === NotificationType.NonNominalNotification7_3) {
      // § 7.3 is a strict-only feature
      return this.maxHivDummy;
    }
    if (type === NotificationType.FollowUpNotification7_3) {
      return {
        ...this.maxHivDummy,
        tabPatient: {
          residenceAddress: {
            zip: '123',
            country: GERMANY_COUNTRY_CODE,
            addressType: AddressType.Primary,
          },
          info: {
            gender: 'MALE',
            birthDate: '01.1970',
          },
        },
      };
    }
    if (environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT === true && type === NotificationType.FollowUpNotification6_1) {
      return {
        ...this.strictMaxMasernDummy,
        tabPatient: {
          residenceAddress: {
            zip: '123',
            country: GERMANY_COUNTRY_CODE,
            addressType: AddressType.Primary,
          },
          info: {
            gender: 'MALE',
            birthDate: '01.1970',
          },
        },
      };
    }
    if (environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT === false && type === NotificationType.FollowUpNotification6_1) {
      return {
        ...this.maxMasernDummy,
        tabPatient: {
          residenceAddress: {
            zip: '123',
            country: GERMANY_COUNTRY_CODE,
            addressType: AddressType.Primary,
          },
          info: {
            gender: 'MALE',
            birthDate: '01.1970',
          },
        },
      };
    }
    if (environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT === true && type === NotificationType.NominalNotification6_1) {
      return this.strictMaxMasernDummy;
    }
    return this.maxMasernDummy;
  }

  get maxMasernDummy() {
    return {
      tabNotifier: {
        facilityInfo: {
          existsBsnr: true,
          bsnr: '123456789',
          institutionName: 'Kreiskrankenhaus Riedlingen',
          organizationType: {
            answer: {
              valueCoding: {
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
              },
            },
          },
        },
        address: {
          zip: ZIP_CODE_DEFAULT,
          country: GERMANY_COUNTRY_CODE,
          street: 'Im Himmelreich',
          city: 'Frühling',
          houseNumber: '1',
        },
        contact: {
          firstname: 'Test',
          lastname: 'Person',
        },
        contacts: {
          emailAddresses: [
            {
              contactType: 'email',
              value: 't.person@gmail.com',
            },
            {
              contactType: 'email',
              value: 'test.person@kh-rie.de',
            },
          ],
          phoneNumbers: [
            {
              contactType: 'phone',
              value: '01234567',
            },
          ],
        },
      },
      tabPatient: {
        residenceAddress: {
          zip: ZIP_CODE_DEFAULT,
          country: GERMANY_COUNTRY_CODE,
          street: 'Wohnsitzstraße',
          city: 'Berlin',
          houseNumber: '1',
          addressType: AddressType.Primary,
        },
        currentAddressType: 'primaryAsCurrent',
        currentAddress: {
          addressType: AddressType.PrimaryAsCurrent,
        },
        contacts: {
          phoneNumbers: [],
          emailAddresses: [],
        },
        info: {
          gender: 'MALE',
          firstname: ' Max',
          lastname: 'Melderson',
          birthDate: '01.01.1970',
        },
      },
      tabDiseaseChoice: {
        diseaseChoice: {
          answer: {
            valueCoding: {
              code: 'msvd',
              display: 'Masern',
              designations: [],
            },
          },
        },
        clinicalStatus: {
          answer: {
            valueString: StatusEnum.Final,
          },
        },
        statusNoteGroup: {
          statusNote: {
            answer: {
              valueString: 'Wichtiger Hinweis zum Status der betroffenen Person.',
            },
          },
          initialNotificationId: '',
        },
      },
      tabDiseaseCondition: {
        recordedDate: {
          answer: {
            valueDate: '13.01.2023',
          },
        },
        onset: {
          answer: {
            valueDate: '31.12.2022',
          },
        },
        note: {
          answer: {
            valueString: 'Seit Silvester 22 ging es dem Patienten zunehmend schlechter.',
          },
        },
        evidence: [
          {
            answer: {
              valueCoding: {
                code: '49727002',
                display: 'Husten',
                designations: [
                  {
                    language: 'de',
                    value: 'Husten',
                  },
                  {
                    language: 'en-US',
                    value: 'Cough (finding)',
                  },
                ],
                system: 'http://snomed.info/sct',
              },
            },
          },
          {
            answer: {
              valueCoding: {
                code: '386661006',
                display: 'Fieber',
                designations: [
                  {
                    language: 'en-US',
                    value: 'Fever (finding)',
                  },
                  {
                    language: 'de',
                    value: 'Fieber',
                  },
                ],
                system: 'http://snomed.info/sct',
              },
            },
          },
        ],
        verificationStatus: {
          answer: {
            valueCoding: {
              code: 'confirmed',
              display: 'Confirmed',
              designations: [],
              system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
            },
          },
        },
      },
      tabDiseaseCommon: {
        additionalInformation: {
          answer: {
            valueString: 'Es wurde gezaubert!',
          },
        },
        isDead: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            deathDate: {
              answer: {
                valueDate: '03.01.2000',
              },
            },
          },
        },
        militaryAffiliation: {
          answer: {
            valueCoding: {
              code: 'civilPersonActiveInBundeswehr',
              display: 'Zivilperson tätig/untergebracht in Einrichtung der BW',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
            },
          },
        },
        labSpecimenTaken: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            labSpecimenLab: {
              answer: {
                Organization: {
                  name: {
                    answer: {
                      valueString: 'QuickTest Labor 42',
                    },
                  },
                  address: {
                    line: {
                      answer: {
                        valueString: 'Labstrasse 42',
                      },
                    },
                    postalCode: {
                      answer: {
                        valueString: '03348',
                      },
                    },
                    city: {
                      answer: {
                        valueString: 'Laborstadt',
                      },
                    },
                    ...(environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT && {
                      country: {
                        answer: {
                          valueCoding: {
                            code: 'DE',
                            display: 'Deutschland',
                            designations: [
                              {
                                language: 'de-DE',
                                value: 'Deutschland',
                              },
                            ],
                            system: 'urn:iso:std:iso:3166',
                          },
                        },
                      },
                    }),
                  },
                  contact: {
                    name: {
                      prefix: {
                        answer: {
                          valueString: 'Herr',
                        },
                      },
                      given: {
                        answer: {
                          valueString: 'Laslo',
                        },
                      },
                      family: {
                        answer: {
                          valueString: 'Labora',
                        },
                      },
                    },
                  },
                  telecom: {
                    phone: {
                      answer: {
                        valueString: '+123456789',
                      },
                    },
                    email: {
                      answer: {
                        valueString: 'labor42@quicktest.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        hospitalized: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            'repeat-section-1': [
              {
                hospitalizedGroup: {
                  hospitalizedEncounter: {
                    answer: {
                      Hospitalization: {
                        serviceType: {
                          answer: {
                            valueCoding: {
                              code: '0100',
                              display: 'Innere Medizin',
                              designations: [],
                              system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                            },
                          },
                        },
                        period: {
                          start: {
                            answer: {
                              valueDate: '10.01.2023',
                            },
                          },
                          end: {
                            answer: {
                              valueDate: '12.01.2023',
                            },
                          },
                        },
                        serviceProvider: {
                          answer: {
                            Organization: {
                              name: {
                                answer: {
                                  valueString: 'Krankenhaus Riedlingen-Süd',
                                },
                              },
                              address: {
                                line: {
                                  answer: {
                                    valueString: 'Südhospizstraße 23',
                                  },
                                },
                                street: {
                                  answer: {
                                    valueString: 'Südhospizstraße',
                                  },
                                },
                                houseNumber: {
                                  answer: {
                                    valueString: '23',
                                  },
                                },
                                postalCode: {
                                  answer: {
                                    valueString: '21482',
                                  },
                                },
                                city: {
                                  answer: {
                                    valueString: 'Riedlingen',
                                  },
                                },
                                ...(environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT && {
                                  country: {
                                    answer: {
                                      valueCoding: {
                                        code: 'DE',
                                        display: 'Deutschland',
                                        designations: [
                                          {
                                            language: 'de-DE',
                                            value: 'Deutschland',
                                          },
                                        ],
                                        system: 'urn:iso:std:iso:3166',
                                      },
                                    },
                                  },
                                }),
                              },
                              contact: {
                                name: {
                                  prefix: {
                                    answer: {
                                      valueString: 'Dr. Prof.',
                                    },
                                  },
                                  given: {
                                    answer: {
                                      valueString: 'Michael',
                                    },
                                  },
                                  family: {
                                    answer: {
                                      valueString: 'Überseer',
                                    },
                                  },
                                },
                              },
                              telecom: {
                                phone: {
                                  answer: {
                                    valueString: '+123458888',
                                  },
                                },
                                email: {
                                  answer: {
                                    valueString: 'business@kh-ried-sued.com',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              {
                hospitalizedGroup: {
                  hospitalizedEncounter: {
                    answer: {
                      Hospitalization: {
                        serviceType: {
                          answer: {
                            valueCoding: {
                              code: '0108',
                              display: 'Schwerpunkt Pneumologie',
                              designations: [],
                              system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationServiceType',
                            },
                          },
                        },
                        period: {
                          start: {
                            answer: {
                              valueDate: '05.01.2023',
                            },
                          },
                          end: {
                            answer: {
                              valueDate: '06.01.2023',
                            },
                          },
                        },
                        serviceProvider: {
                          answer: {
                            Organization: {
                              name: {
                                answer: {
                                  valueString: 'Krankenhaus Riedlingen-Süd',
                                },
                              },
                              address: {
                                line: {
                                  answer: {
                                    valueString: 'Südhospizstraße 23',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        infectProtectFacility: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            'repeat-section-2': [
              {
                infectProtectFacilityGroup: {
                  infectProtectFacilityBegin: {
                    answer: {
                      valueDate: '17.07.2021',
                    },
                  },
                  infectProtectFacilityOrganization: {
                    answer: {
                      Organization: {
                        name: {
                          answer: {
                            valueString: 'Kita Riedlinger Zwerge',
                          },
                        },
                        address: {
                          line: {
                            answer: {
                              valueString: 'Fleischerstrasse 5',
                            },
                          },
                          postalCode: {
                            answer: {
                              valueString: '21483',
                            },
                          },
                          city: {
                            answer: {
                              valueString: 'Riedlingen-Nord',
                            },
                          },
                          ...(environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT && {
                            country: {
                              answer: {
                                valueCoding: {
                                  code: 'DE',
                                  display: 'Deutschland',
                                  designations: [
                                    {
                                      language: 'de-DE',
                                      value: 'Deutschland',
                                    },
                                  ],
                                  system: 'urn:iso:std:iso:3166',
                                },
                              },
                            },
                          }),
                        },
                        contact: {
                          name: {
                            prefix: {
                              answer: {
                                valueString: '',
                              },
                            },
                            given: {
                              answer: {
                                valueString: 'Margot',
                              },
                            },
                            family: {
                              answer: {
                                valueString: 'Markus',
                              },
                            },
                          },
                        },
                        telecom: {
                          phone: {
                            answer: {
                              valueString: '+999999999999',
                            },
                          },
                          email: {
                            answer: {
                              valueString: 'mmarkus@reid-zwerge.de',
                            },
                          },
                        },
                      },
                    },
                  },
                  infectProtectFacilityType: {
                    answer: {
                      valueCoding: {
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
                      },
                    },
                  },
                  infectProtectFacilityRole: {
                    answer: {
                      valueCoding: {
                        code: 'care',
                        display: 'Betreuung',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/organizationAssociation',
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        placeExposure: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            'repeat-section-3': [
              {
                placeExposureGroup: {
                  placeExposureBegin: {
                    answer: {
                      valueDate: '08.12.2022',
                    },
                  },
                  placeExposureEnd: {
                    answer: {
                      valueDate: '23.12.2022',
                    },
                  },
                  placeExposureHint: {
                    answer: {
                      valueString: 'Kurztrip nach Kabul vor Weihnachten',
                    },
                  },
                  placeExposureRegion: {
                    answer: {
                      valueCoding: {
                        code: '41423013',
                        display: 'Kabul',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                      },
                    },
                  },
                },
              },
              {
                placeExposureGroup: {
                  placeExposureBegin: {
                    answer: {
                      valueDate: '26.12.2022',
                    },
                  },
                  placeExposureEnd: {
                    answer: {
                      valueDate: '30.12.2022',
                    },
                  },
                  placeExposureHint: {
                    answer: {
                      valueString: 'Rückkehr nach Kabul, weil etwas vergessen worden ist.',
                    },
                  },
                  placeExposureRegion: {
                    answer: {
                      valueCoding: {
                        code: '41423013',
                        display: 'Kabul',
                        designations: [],
                        system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        organDonation: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
          },
        },
      },
      tabQuestionnaire: {
        onsetOfExanthem: {
          answer: {
            valueDate: '01.01.2023',
          },
        },
        immunization: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            'repeat-section-1': [
              {
                immunizationRef: {
                  answer: {
                    Immunization: {
                      vaccineCode: {
                        answer: {
                          valueCoding: {
                            code: '2251000221101',
                            display: 'Masern- Mumps-Röteln- Varizellen Lebendvirusimpfstoff (Priorix-Tetra, ProQuad)',
                            designations: [
                              {
                                language: 'en-US',
                                value:
                                  'Vaccine product containing only live attenuated Measles morbillivirus and Mumps orthorubulavirus and Rubella virus and Human alphaherpesvirus 3 antigens (medicinal product)',
                              },
                            ],
                            system: 'http://snomed.info/sct',
                          },
                        },
                      },
                      occurrence: {
                        answer: {
                          valueDate: '12.2011',
                        },
                      },
                      note: {
                        answer: {
                          valueString: 'Die letzte Masernimpfung war schon etwas her.',
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        pregnancy: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            pregnancyWeek: {
              answer: {
                valueCoding: {
                  code: '15',
                  display: '15',
                  designations: [],
                  system: 'https://demis.rki.de/fhir/CodeSystem/pregnancyWeek',
                },
              },
            },
          },
        },
        outbreak: {
          answer: {
            valueCoding: {
              code: 'yes',
              display: 'Ja',
              designations: [],
              system: 'https://demis.rki.de/fhir/CodeSystem/yesOrNoAnswer',
            },
            outbreakNote: {
              answer: {
                valueString: 'Es gab einen Ausbruch der zugeordnet werden konnte. Wir finden leider dessen Meldungs-ID gerade nicht.',
              },
            },
          },
        },
      },
    };
  }

  get maxHivDummy() {
    return {
      tabNotifier: this.maxMasernDummy.tabNotifier,
      tabPatient: {
        residenceAddress: {
          zip: '123',
          country: GERMANY_COUNTRY_CODE,
          addressType: AddressType.Primary,
        },
        info: {
          gender: 'MALE',
          firstname: ' Max',
          lastname: 'Melderson',
          birthDate: '01.01.1970',
        },
      },
      tabDiseaseChoice: {
        diseaseChoice: {
          answer: {
            valueCoding: {
              code: 'hivd',
              display: 'Humanes Immundefizienz-Virus (HIV)',
              designations: [],
            },
          },
        },
        clinicalStatus: {
          answer: {
            valueString: StatusEnum.Final,
          },
        },
        statusNoteGroup: {
          statusNote: {
            answer: {
              valueString: 'Wichtiger Hinweis zum Status der betroffenen Person.',
            },
          },
          initialNotificationId: '',
        },
      },
      tabDiseaseCondition: {
        note: {
          answer: {
            valueString: 'Das war eine schwere Diagnose',
          },
        },
      },
      tabQuestionnaire: {
        'repeat-section-1': [
          {
            countryOfInfection: {
              answer: {
                valueCoding: {
                  code: 'AF',
                  designations: null,
                  display: 'Afghanistan',
                  system: 'urn:iso:std:iso:3166',
                  selected: false,
                },
              },
            },
          },
        ],
        cd4: {
          answer: {
            cd4: '',
          },
        },
        viralLoad: {
          answer: {
            viralLoad: '',
          },
        },
        'repeat-section-2': [
          {
            infectionPathRisk: {
              answer: {
                valueCoding: {
                  code: '472986005',
                  designations: null,
                  display: 'Sexuell aktiv mit Männern',
                  system: 'http://snomed.info/sct',
                  selected: false,
                },
                infectionSource: {
                  answer: {
                    valueCoding: [
                      {
                        code: '472986005',
                        designations: null,
                        display: 'Sexuell aktiv mit Männern',
                        system: 'http://snomed.info/sct',
                        selected: true,
                      },
                    ],
                  },
                },
                infectionSourceSecure: {
                  answer: {
                    valueCoding: {
                      code: '373066001',
                      designations: null,
                      display: 'Ja',
                      system: 'http://snomed.info/sct',
                    },
                  },
                },
              },
            },
          },
        ],
        countryOrigin: {
          answer: {
            valueCoding: {
              code: 'DE',
              designations: null,
              display: 'Deutschland',
              system: 'urn:iso:std:iso:3166',
              selected: false,
            },
          },
        },
        samplingDate: {
          answer: {
            valueDate: '2026-06-26',
          },
        },
        firstDiagnosisGER: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
            },
            lastNegTest: {
              answer: {
                valueDate: '2026-07',
              },
            },
          },
        },
        firstDiagnosisAbroad: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
            },
            firstDiagnosisCountry: {
              answer: {
                valueCoding: {
                  code: 'DE',
                  designations: null,
                  display: 'Deutschland',
                  system: 'urn:iso:std:iso:3166',
                  selected: false,
                },
              },
            },
          },
        },
        genderDefintion: {
          answer: {
            valueCoding: {
              code: '1332082008',
              designations: null,
              display: 'Trans*frau',
              system: 'http://snomed.info/sct',
            },
          },
        },
        stadiumHIVD: {
          answer: {
            valueCoding: {
              code: '91947003',
              designations: null,
              display: 'Asymptomatische HIV-Infektion (CDC-A)',
              system: 'http://snomed.info/sct',
            },
            cdcA: {
              answer: {
                valueCoding: [
                  {
                    code: '111880001',
                    designations: null,
                    display: 'Akute HIV-Infektion',
                    system: 'http://snomed.info/sct',
                    selected: true,
                  },
                ],
              },
            },
          },
        },
        coinfections: {
          answer: {
            valueCoding: [
              {
                code: '1163504003',
                designations: null,
                display: 'Infektion durch Mycoplasma genitalium',
                system: 'http://snomed.info/sct',
                selected: true,
              },
            ],
          },
        },
        hivPrEPStatusHIVD: {
          answer: {
            valueCoding: {
              code: '373067005',
              designations: null,
              display: 'Nein',
              system: 'http://snomed.info/sct',
            },
          },
        },
        sexWorkSold: {
          answer: {
            valueCoding: {
              code: '261665006',
              designations: null,
              display: 'Unbekannt',
              system: 'http://snomed.info/sct',
            },
          },
        },
        sexWorkBought: {
          answer: {
            valueCoding: {
              code: '373067005',
              designations: null,
              display: 'Nein',
              system: 'http://snomed.info/sct',
            },
          },
        },
      },
    };
  }

  get strictMaxMasernDummy() {
    return {
      tabNotifier: this.maxMasernDummy.tabNotifier,
      tabPatient: this.maxMasernDummy.tabPatient,
      tabDiseaseChoice: this.maxMasernDummy.tabDiseaseChoice,
      tabDiseaseCondition: this.maxMasernDummy.tabDiseaseCondition,
      tabDiseaseCommon: {
        additionalInformation: {
          answer: {
            valueString: '',
          },
        },
        isDead: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
            deathDate: {
              answer: {
                valueDate: '2026-05-05',
              },
            },
          },
        },
        militaryAffiliation: {
          answer: {
            valueCoding: {
              code: 'civilPersonActiveInBundeswehr',
              display: 'Zivilperson tätig/untergebracht in Einrichtung der BW',
              designations: null,
              system: 'https://demis.rki.de/fhir/CodeSystem/militaryAffiliation',
            },
          },
        },
        labSpecimenTaken: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
            labSpecimenLab: {
              answer: {
                LaboratoryFacility: {
                  name: {
                    answer: {
                      valueString: 'Lab labor',
                    },
                  },
                  bsnr: {
                    answer: {
                      valueString: '132456789',
                    },
                  },
                  address: {
                    street: {
                      answer: {
                        valueString: 'Labstrasse',
                      },
                    },
                    houseNumber: {
                      answer: {
                        valueString: '12',
                      },
                    },
                    postalCode: {
                      answer: {
                        valueString: '03348',
                      },
                    },
                    city: {
                      answer: {
                        valueString: 'Laborstadt',
                      },
                    },
                    country: {
                      answer: {
                        valueCoding: {
                          code: 'DE',
                          display: 'Deutschland',
                          designations: [
                            {
                              language: 'de-DE',
                              value: 'Deutschland',
                            },
                          ],
                          system: 'urn:iso:std:iso:3166',
                        },
                      },
                    },
                  },
                  contact: {
                    name: {
                      prefix: {
                        answer: {
                          valueString: 'Herr',
                        },
                      },
                      given: {
                        answer: {
                          valueString: 'Laslo',
                        },
                      },
                      family: {
                        answer: {
                          valueString: 'Labora',
                        },
                      },
                    },
                  },
                  telecom: {
                    phone: {
                      answer: {
                        valueString: '+123456789',
                      },
                    },
                    email: {
                      answer: {
                        valueString: 'labor42@quicktest.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        hospitalized: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
            'repeat-section-1': [
              {
                hospitalizedGroup: {
                  hospitalizedEncounter: {
                    answer: {
                      Hospitalization: {
                        serviceProvider: {
                          answer: {
                            Organization: {
                              name: {
                                answer: {
                                  valueString: 'Krankenhaus Riedlingen-Süd',
                                },
                              },
                              address: {
                                street: {
                                  answer: {
                                    valueString: 'Südhospizstraße',
                                  },
                                },
                                houseNumber: {
                                  answer: {
                                    valueString: '23',
                                  },
                                },
                                postalCode: {
                                  answer: {
                                    valueString: '21482',
                                  },
                                },
                                city: {
                                  answer: {
                                    valueString: 'Berlin',
                                  },
                                },
                                country: {
                                  answer: {
                                    valueCoding: {
                                      code: 'DE',
                                      display: 'Deutschland',
                                      designations: [
                                        {
                                          language: 'de-DE',
                                          value: 'Deutschland',
                                        },
                                      ],
                                      system: 'urn:iso:std:iso:3166',
                                    },
                                  },
                                },
                              },
                              contact: {
                                name: {
                                  prefix: {
                                    answer: {
                                      valueString: 'Dr. Prof.',
                                    },
                                  },
                                  given: {
                                    answer: {
                                      valueString: 'Michael',
                                    },
                                  },
                                  family: {
                                    answer: {
                                      valueString: 'Überseer',
                                    },
                                  },
                                },
                                copyNotifierContact: false,
                              },
                              telecom: {
                                phone: {
                                  answer: {
                                    valueString: '+123458888',
                                  },
                                },
                                email: {
                                  answer: {
                                    valueString: 'business@kh-ried-sued.com',
                                  },
                                },
                              },
                              copyNotifiedPersonCurrentAddress: false,
                            },
                          },
                        },
                        serviceType: {
                          answer: {
                            valueCoding: {
                              code: '0100',
                              designations: null,
                              display: 'Innere Medizin',
                              system: 'http://fhir.de/CodeSystem/dkgev/Fachabteilungsschluessel-erweitert',
                              version: '1.5.4',
                              selected: false,
                            },
                          },
                        },
                        reason: {
                          answer: {
                            valueCoding: {
                              code: 'becauseOfOtherReason',
                              designations: null,
                              display: 'Hospitalisiert aufgrund einer anderen Ursache als der gemeldeten Krankheit',
                              system: 'https://demis.rki.de/fhir/CodeSystem/hospitalizationReason',
                              version: '1.0.1',
                              selected: false,
                            },
                          },
                        },
                        period: {
                          start: {
                            answer: {
                              valueDate: '2026-05-05',
                            },
                          },
                          end: {
                            answer: {
                              valueDate: '2026-05-06',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        infectProtectFacility: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
            'repeat-section-2': [
              {
                infectProtectFacilityGroup: {
                  infectProtectFacilityBegin: {
                    answer: {
                      valueDate: '2026-05-05',
                    },
                  },
                  infectProtectFacilityOrganization: {
                    answer: {
                      InfectProtectFacility: {
                        name: {
                          answer: {
                            valueString: 'Krankenhaus Riedlingen-Süd',
                          },
                        },
                        address: {
                          street: {
                            answer: {
                              valueString: 'Südhospizstraße',
                            },
                          },
                          houseNumber: {
                            answer: {
                              valueString: '23',
                            },
                          },
                          postalCode: {
                            answer: {
                              valueString: '21482',
                            },
                          },
                          city: {
                            answer: {
                              valueString: 'Riedlingen',
                            },
                          },
                          country: {
                            answer: {
                              valueCoding: {
                                code: 'DE',
                                display: 'Deutschland',
                                designations: [
                                  {
                                    language: 'de-DE',
                                    value: 'Deutschland',
                                  },
                                ],
                                system: 'urn:iso:std:iso:3166',
                              },
                            },
                          },
                        },
                        contact: {
                          name: {
                            prefix: {
                              answer: {
                                valueString: '',
                              },
                            },
                            given: {
                              answer: {
                                valueString: 'Monica',
                              },
                            },
                            family: {
                              answer: {
                                valueString: 'Paris',
                              },
                            },
                          },
                        },
                        telecom: {
                          phone: {
                            answer: {
                              valueString: '030622659',
                            },
                          },
                          email: {
                            answer: {
                              valueString: 'paris@foo.de',
                            },
                          },
                        },
                        type: {
                          answer: {
                            valueCoding: {
                              breadcrumb: 'Medizinische Einrichtung',
                              code: 'medFacility',
                              designations: null,
                              display: 'Medizinische Einrichtung',
                              system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
                              version: '1.4.2',
                              selected: false,
                            },
                          },
                        },
                      },
                    },
                  },
                  infectProtectFacilityRole: {
                    answer: {
                      valueCoding: {
                        code: 'accommodation',
                        designations: [],
                        display: 'Unterbringung',
                        system: 'https://demis.rki.de/fhir/CodeSystem/organizationAssociation',
                        version: '1.0.1',
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        placeExposure: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
            'repeat-section-3': [
              {
                placeExposureGroup: {
                  placeExposureHint: {
                    answer: {
                      valueString: '',
                    },
                  },
                  placeExposureRegion: {
                    answer: {
                      valueCoding: {
                        code: '31000005',
                        display: 'Afrika',
                        designations: null,
                        system: 'https://demis.rki.de/fhir/CodeSystem/geographicRegion',
                      },
                    },
                  },
                  placeExposureBegin: {
                    answer: {
                      valueDate: '2026-05-05',
                    },
                  },
                },
              },
            ],
          },
        },
        organDonation: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
          },
        },
      },
      tabQuestionnaire: {
        onsetOfExanthem: {
          answer: {
            valueDate: '01.01.2023',
          },
        },
        immunization: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
            'repeat-section-1': [
              {
                immunizationRef: {
                  answer: {
                    Immunization: {
                      note: {
                        answer: {
                          valueString: 'Geimpft in den USA',
                        },
                      },
                      vaccineCode: {
                        answer: {
                          valueCoding: {
                            code: '871766009',
                            designations: [
                              {
                                language: 'de-DE',
                                value: 'Monovalenter Masern-Impfstoff (Ma)',
                                use: {},
                              },
                            ],
                            display: 'Monovalenter Masern-Impfstoff (Ma)',
                            system: 'http://snomed.info/sct',
                            version: 'http://snomed.info/sct/11000274103/version/20251115',
                            selected: false,
                          },
                        },
                      },
                      occurrence: {
                        answer: {
                          valueDate: '2017-01-04',
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        pregnancy: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
            pregnancyWeek: {
              answer: {
                pregnancyWeek: 12,
              },
            },
          },
        },
        outbreak: {
          answer: {
            valueCoding: {
              code: '373066001',
              designations: null,
              display: 'Ja',
              system: 'http://snomed.info/sct',
              version: 'http://snomed.info/sct/11000274103/version/20251115',
            },
          },
        },
      },
    };
  }
}
