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

import { AddressType, DiseaseStatus } from '../../../api/notification';
import { GERMANY_COUNTRY_CODE, ZIP_CODE_DEFAULT } from '../../legacy/common-utils';
import { NotificationType } from '../../demis-types';
import { environment } from '../../../environments/environment';
import StatusEnum = DiseaseStatus.StatusEnum;

export class HexHexDummy {
  getDummy(type: NotificationType) {
    if (type === NotificationType.NonNominalNotification7_3) {
      // §7.3 is a strict-only feature
      return this.maxHivDummy;
    }
    if (environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT && type === NotificationType.FollowUpNotification6_1) {
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
    if (environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT && type === NotificationType.NominalNotification6_1) {
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
              usage: 'work',
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
      tabDiseaseCondition: this.maxMasernDummy.tabDiseaseCondition,
      tabQuestionnaire: {
        'repeat-section-1': [
          {
            infectionPathRisk: {
              answer: {
                valueCoding: {
                  code: '16090731000119102',
                  display: 'Berufliche Exposition',
                  designations: null,
                  system: 'http://snomed.info/sct',
                },
                medicinalWorkerNote: {
                  answer: {
                    valueString: '',
                  },
                },
              },
            },
          },
        ],
        firstDiagnosisGER: {
          answer: {
            valueCoding: {
              code: '261665006',
              display: 'Unbekannt',
              designations: null,
              system: 'http://snomed.info/sct',
            },
            lastNegTest: {
              answer: {
                valueDate: '',
              },
            },
            firstPosTest: {
              answer: {
                valueDate: '',
              },
            },
          },
        },
        firstDiagnosisAbroad: {
          answer: {
            valueCoding: {
              code: '261665006',
              display: 'Unbekannt',
              designations: null,
              system: 'http://snomed.info/sct',
            },
          },
        },
        countryOrigin: {
          answer: {
            valueCoding: {
              code: '261665006',
              display: 'Unbekannt',
              designations: null,
              system: 'http://snomed.info/sct',
            },
            countryOriginOfInfection: {
              answer: {
                valueCoding: {
                  code: '261665006',
                  display: 'Unbekannt',
                  designations: null,
                  system: 'http://snomed.info/sct',
                },
              },
            },
          },
        },
        stadiumHIVD: {
          answer: {
            valueCoding: {
              code: '261665006',
              display: 'Unbekannt',
              designations: null,
              system: 'http://snomed.info/sct',
            },
          },
        },
        coinfections: {
          answer: {
            valueCoding: [
              {
                code: '261665006',
                display: 'Unbekannt',
                designations: null,
                system: 'http://snomed.info/sct',
                selected: true,
              },
            ],
          },
        },
        hivPrEPStatusHIVD: {
          answer: {
            valueCoding: {
              code: '261665006',
              display: 'Unbekannt',
              designations: null,
              system: 'http://snomed.info/sct',
            },
          },
        },
        sexWork: {
          answer: {
            valueCoding: [
              {
                code: '261665006',
                display: 'Unbekannt',
                designations: null,
                system: 'http://snomed.info/sct',
                selected: true,
              },
            ],
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
            valueString: 'Strikt sein und ein bisschen verrückt sein! Sagt die Frau zu dem Mann: "Hey Schatzi, was wollen wir mehr?"',
          },
        },
        isDead: {
          answer: {
            valueCoding: {
              code: '373066001',
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
              code: '373066001',
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
                              system: 'http://fhir.de/CodeSystem/dkgev/Fachabteilungsschluessel-erweitert',
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
                              system: 'http://fhir.de/CodeSystem/dkgev/Fachabteilungsschluessel-erweitert',
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
              code: '373066001',
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
              code: '373066001',
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
              code: '373066001',
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
              code: '373066001',
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
            },
            pregnancyWeek: {
              answer: {
                valueString: '15',
                pregnancyWeek: 15,
              },
            },
          },
        },
        outbreak: {
          answer: {
            valueCoding: {
              code: '373066001',
              display: 'Ja',
              designations: [],
              system: 'http://snomed.info/sct',
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
}
