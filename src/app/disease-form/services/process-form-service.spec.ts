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

import { TestBed } from '@angular/core/testing';
import { ProcessFormService } from './process-form-service';
import { ExtendedSalutationEnum } from '../../legacy/common-utils';
import { NotificationType } from '../../demis-types';

describe('ProcessFormService', () => {
  let service: ProcessFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcessFormService],
    });
    service = TestBed.inject(ProcessFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a DiseaseNotification with trimmed and formatted data', () => {
    const model: any = {
      tabDiseaseChoice: {
        diseaseChoice: { answer: { valueCoding: { code: 'COVID19' } } },
        clinicalStatus: { answer: { valueString: 'active' } },
        statusNoteGroup: {
          statusNote: { answer: { valueString: 'note' } },
          initialNotificationId: { answer: { valueString: 'initId' } },
        },
      },
      tabNotifier: {
        address: { street: 'Teststr. 1' },
        contact: { salutation: ExtendedSalutationEnum.Mr },
        contacts: { emailAddresses: [], phoneNumbers: [] },
        facilityInfo: { organizationType: { answer: { valueCoding: { code: 'hospital' } } } },
        oneTimeCode: '1234',
      },
      tabPatient: {
        info: { birthDate: '2000-01-01' },
        currentAddressType: 'primaryAsCurrent',
        residenceAddress: { city: 'Berlin' },
        currentAddress: { city: 'Berlin' },
        currentAddressInstitutionName: 'Klinik',
        residenceAddressType: 'home',
        contacts: { emailAddresses: [], phoneNumbers: [] },
      },
      tabDiseaseCondition: {},
      tabDiseaseCommon: undefined,
      tabQuestionnaire: [],
    };

    const result = service.createNotification(model, NotificationType.NominalNotification6_1);
    expect(result.status.category).toBe('COVID19');
    expect(result.common).toEqual(undefined);
    expect(result.notifiedPerson?.info.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}/); // ISO-Format
  });

  it('addAddressType should add type and institutionName', () => {
    const address = { city: 'Berlin' } as any;
    const result = (service as any).addAddressType(address, 'home', 'Klinik');
    expect(result.addressType).toBe('home');
    expect(result.additionalInfo).toBe('Klinik');
  });

  it('makeCondition should return formatted condition', () => {
    const condition = {
      recordedDate: { answer: { valueDate: '2024-01-01' } },
      onset: { answer: { valueDate: '2024-01-01' } },
      note: { answer: { valueString: 'test' } },
      evidence: { answer: { valueCoding: { code: 'lab' } } },
      verificationStatus: { answer: { valueCoding: { code: 'confirmed' } } },
    };
    const result = (service as any).makeCondition(condition);
    expect(result.recordedDate).toBe('2024-01-01');
    expect(result.verificationStatus).toBe('confirmed');
  });

  it('answer should handle arrays and undefined', () => {
    const condition = {
      test: [{ answer: { valueString: 'a' } }, { answer: { valueString: 'b' } }],
    };
    const result = (service as any).answer(condition, 'test', 'valueString');
    expect(result).toEqual(['a', 'b']);
    expect((service as any).answer(undefined, 'test', 'valueString')).toBeUndefined();
  });

  describe('transformNotifiedPerson', () => {
    it('should call transformAnonymousPerson for FollowUpNotification6_1', () => {
      const model: any = {
        tabPatient: {
          info: { gender: 'MALE', birthDate: '2000-01-01' },
          residenceAddress: { country: 'DE', zip: '12345' },
        },
      };

      const result = (service as any).transformNotifiedPerson(model, NotificationType.FollowUpNotification6_1);
      expect(result.notifiedPersonAnonymous).toBeDefined();
      expect(result.notifiedPersonAnonymous.gender).toBe('MALE');
      expect(result.notifiedPersonAnonymous.birthDate).toBe('2000-01-01');
      expect(result.notifiedPersonAnonymous.residenceAddress.country).toBe('DE');
    });

    it('should call transformNotifiedPersonNotByName for NonNominalNotification7_3', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'John', lastName: 'Doe', birthDate: '2000-01-01' },
          residenceAddress: { city: 'Berlin', street: 'Teststr. 1' },
          residenceAddressType: 'home',
        },
      };

      const result = (service as any).transformNotifiedPerson(model, NotificationType.NonNominalNotification7_3);
      expect(result.notifiedPerson).toBeDefined();
      expect(result.notifiedPerson.info.firstName).toBe('John');
      expect(result.notifiedPerson.residenceAddress.city).toBe('Berlin');
      expect(result.notifiedPerson.residenceAddress.addressType).toBe('home');
    });

    it('should call transformNominalPerson for NominalNotification6_1', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'Jane', lastName: 'Smith', birthDate: '1990-05-15' },
          currentAddressType: 'primaryAsCurrent',
          residenceAddress: { city: 'Munich', street: 'Hauptstr. 10' },
          currentAddress: { city: 'Munich', street: 'Hauptstr. 10' },
          residenceAddressType: 'home',
          contacts: { emailAddresses: [{ value: 'test@example.com' }], phoneNumbers: [] },
        },
      };

      const result = (service as any).transformNotifiedPerson(model, NotificationType.NominalNotification6_1);
      expect(result.notifiedPerson).toBeDefined();
      expect(result.notifiedPerson.info.firstName).toBe('Jane');
      expect(result.notifiedPerson.currentAddress).toBeDefined();
      expect(result.notifiedPerson.residenceAddress).toBeDefined();
      expect(result.notifiedPerson.contacts.length).toBe(1);
    });
  });

  describe('transformNotifiedPersonNotByName', () => {
    it('should transform person with residence address', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'John', lastName: 'Doe', birthDate: '1985-03-20', gender: 'MALE' },
          residenceAddress: { city: 'Berlin', street: 'Teststr. 1', zip: '10115', country: 'DE' },
          residenceAddressType: 'home',
        },
      };

      const result = (service as any).transformNotifiedPersonNotByName(model);
      expect(result.notifiedPerson).toBeDefined();
      expect(result.notifiedPerson.info).toEqual(model.tabPatient.info);
      expect(result.notifiedPerson.residenceAddress.city).toBe('Berlin');
      expect(result.notifiedPerson.residenceAddress.addressType).toBe('home');
    });

    it('should handle different address types', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'Jane', lastName: 'Smith' },
          residenceAddress: { city: 'Munich', street: 'Hauptstr. 5' },
          residenceAddressType: 'primary',
        },
      };

      const result = (service as any).transformNotifiedPersonNotByName(model);
      expect(result.notifiedPerson.residenceAddress.addressType).toBe('primary');
    });
  });

  describe('transformNominalPerson', () => {
    it('should use residence address as current address when primaryAsCurrent is set', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'Max', lastName: 'Mustermann', birthDate: '1980-12-25' },
          currentAddressType: 'primaryAsCurrent',
          residenceAddress: { city: 'Frankfurt', street: 'Bahnhofstr. 10', zip: '60311' },
          currentAddress: { city: 'Different', street: 'Other St.' },
          residenceAddressType: 'home',
          currentAddressInstitutionName: 'Hospital Frankfurt',
          contacts: { emailAddresses: [{ value: 'max@example.com' }], phoneNumbers: [{ value: '+4912345678' }] },
        },
      };

      const result = (service as any).transformNominalPerson(model);
      expect(result.notifiedPerson).toBeDefined();
      expect(result.notifiedPerson.currentAddress.city).toBe('Frankfurt');
      expect(result.notifiedPerson.currentAddress.addressType).toBe('primaryAsCurrent');
      expect(result.notifiedPerson.currentAddress.additionalInfo).toBe('Hospital Frankfurt');
      expect(result.notifiedPerson.residenceAddress.city).toBe('Frankfurt');
      expect(result.notifiedPerson.contacts.length).toBe(2);
    });

    it('should use separate current address when not primaryAsCurrent', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'Anna', lastName: 'Schmidt' },
          currentAddressType: 'temporary',
          residenceAddress: { city: 'Berlin', street: 'Hauptstr. 1' },
          currentAddress: { city: 'Hamburg', street: 'Nebenstr. 5' },
          residenceAddressType: 'home',
          currentAddressInstitutionName: 'Clinic Hamburg',
          contacts: { emailAddresses: [], phoneNumbers: [] },
        },
      };

      const result = (service as any).transformNominalPerson(model);
      expect(result.notifiedPerson.currentAddress.city).toBe('Hamburg');
      expect(result.notifiedPerson.currentAddress.addressType).toBe('temporary');
      expect(result.notifiedPerson.currentAddress.additionalInfo).toBe('Clinic Hamburg');
      expect(result.notifiedPerson.residenceAddress.city).toBe('Berlin');
    });

    it('should handle contacts correctly', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'Tom', lastName: 'Mueller' },
          currentAddressType: 'primaryAsCurrent',
          residenceAddress: { city: 'Cologne' },
          currentAddress: { city: 'Cologne' },
          residenceAddressType: 'home',
          contacts: {
            emailAddresses: [{ value: 'email1@test.com' }, { value: 'email2@test.com' }],
            phoneNumbers: [{ value: '+491234567890' }],
          },
        },
      };

      const result = (service as any).transformNominalPerson(model);
      expect(result.notifiedPerson.contacts.length).toBe(3);
      expect(result.notifiedPerson.contacts[0].value).toBe('email1@test.com');
      expect(result.notifiedPerson.contacts[2].value).toBe('+491234567890');
    });

    it('should handle empty contacts', () => {
      const model: any = {
        tabPatient: {
          info: { firstName: 'Lisa', lastName: 'Weber' },
          currentAddressType: 'primaryAsCurrent',
          residenceAddress: { city: 'Stuttgart' },
          currentAddress: { city: 'Stuttgart' },
          residenceAddressType: 'home',
          contacts: { emailAddresses: [], phoneNumbers: [] },
        },
      };

      const result = (service as any).transformNominalPerson(model);
      expect(result.notifiedPerson.contacts.length).toBe(0);
    });
  });

  describe('transformAnonymousPerson', () => {
    it('should create anonymous person with all fields', () => {
      const model: any = {
        tabPatient: {
          info: { gender: 'FEMALE', birthDate: '1995-07-15' },
          residenceAddress: { country: 'DE', zip: '50667' },
        },
      };

      const result = (service as any).transformAnonymousPerson(model);
      expect(result.notifiedPersonAnonymous).toBeDefined();
      expect(result.notifiedPersonAnonymous.gender).toBe('FEMALE');
      expect(result.notifiedPersonAnonymous.birthDate).toBe('1995-07-15');
      expect(result.notifiedPersonAnonymous.residenceAddress.country).toBe('DE');
      expect(result.notifiedPersonAnonymous.residenceAddress.zip).toBe('50667');
      expect(result.notifiedPersonAnonymous.residenceAddress.addressType).toBe('primary');
    });

    it('should handle undefined birthDate', () => {
      const model: any = {
        tabPatient: {
          info: { gender: 'MALE', birthDate: null },
          residenceAddress: { country: 'AT', zip: '1010' },
        },
      };

      const result = (service as any).transformAnonymousPerson(model);
      expect(result.notifiedPersonAnonymous.birthDate).toBeUndefined();
      expect(result.notifiedPersonAnonymous.gender).toBe('MALE');
    });

    it('should handle undefined gender', () => {
      const model: any = {
        tabPatient: {
          info: { gender: null },
          residenceAddress: { country: 'AT', zip: '1010' },
        },
      };

      const result = (service as any).transformAnonymousPerson(model);
      expect(result.notifiedPersonAnonymous.gender).toBeUndefined();
    });
    it('should handle undefined zip', () => {
      const model: any = {
        tabPatient: {
          info: { gender: 'other', birthDate: '2000-01-01' },
          residenceAddress: { country: 'CH', zip: null },
        },
      };

      const result = (service as any).transformAnonymousPerson(model);
      expect(result.notifiedPersonAnonymous.residenceAddress.zip).toBeUndefined();
      expect(result.notifiedPersonAnonymous.residenceAddress.country).toBe('CH');
    });

    it('should always set addressType to Primary', () => {
      const model: any = {
        tabPatient: {
          info: { gender: 'diverse', birthDate: '1988-11-30' },
          residenceAddress: { country: 'FR', zip: '75001' },
        },
      };

      const result = (service as any).transformAnonymousPerson(model);
      expect(result.notifiedPersonAnonymous.residenceAddress.addressType).toBe('primary');
    });

    it('should handle empty birthDate string', () => {
      const model: any = {
        tabPatient: {
          info: { gender: 'FEMALE', birthDate: '' },
          residenceAddress: { country: 'DE', zip: '10115' },
        },
      };

      const result = (service as any).transformAnonymousPerson(model);
      expect(result.notifiedPersonAnonymous.birthDate).toBeUndefined();
    });
  });

  describe('birthDate handling', () => {
    it('should preserve ISO format birthDate', () => {
      const model: any = {
        tabDiseaseChoice: {
          diseaseChoice: { answer: { valueCoding: { code: 'COVID19' } } },
          clinicalStatus: { answer: { valueString: 'active' } },
          statusNoteGroup: {
            statusNote: { answer: { valueString: 'note' } },
            initialNotificationId: { answer: { valueString: 'initId' } },
          },
        },
        tabNotifier: {
          address: { street: 'Teststr. 1' },
          contact: { salutation: ExtendedSalutationEnum.Mr },
          contacts: { emailAddresses: [], phoneNumbers: [] },
          facilityInfo: { organizationType: { answer: { valueCoding: { code: 'hospital' } } } },
          oneTimeCode: '1234',
        },
        tabPatient: {
          info: { birthDate: '2000-01-01' }, // Already in ISO format
          currentAddressType: 'primaryAsCurrent',
          residenceAddress: { city: 'Berlin' },
          currentAddress: { city: 'Berlin' },
          currentAddressInstitutionName: 'Klinik',
          residenceAddressType: 'home',
          contacts: { emailAddresses: [], phoneNumbers: [] },
        },
        tabDiseaseCondition: {},
        tabDiseaseCommon: undefined,
        tabQuestionnaire: [],
      };

      const result = service.createNotification(model, NotificationType.NominalNotification6_1);
      expect(result.notifiedPerson?.info.birthDate).toBe('2000-01-01');
    });

    it('should preserve year-only ISO format birthDate', () => {
      const model: any = {
        tabDiseaseChoice: {
          diseaseChoice: { answer: { valueCoding: { code: 'COVID19' } } },
          clinicalStatus: { answer: { valueString: 'active' } },
          statusNoteGroup: {
            statusNote: { answer: { valueString: 'note' } },
            initialNotificationId: { answer: { valueString: 'initId' } },
          },
        },
        tabNotifier: {
          address: { street: 'Teststr. 1' },
          contact: { salutation: ExtendedSalutationEnum.Mr },
          contacts: { emailAddresses: [], phoneNumbers: [] },
          facilityInfo: { organizationType: { answer: { valueCoding: { code: 'hospital' } } } },
          oneTimeCode: '1234',
        },
        tabPatient: {
          info: { birthDate: '2000' }, // Year-only ISO format
          currentAddressType: 'primaryAsCurrent',
          residenceAddress: { city: 'Berlin' },
          currentAddress: { city: 'Berlin' },
          currentAddressInstitutionName: 'Klinik',
          residenceAddressType: 'home',
          contacts: { emailAddresses: [], phoneNumbers: [] },
        },
        tabDiseaseCondition: {},
        tabDiseaseCommon: undefined,
        tabQuestionnaire: [],
      };

      const result = service.createNotification(model, NotificationType.NominalNotification6_1);
      expect(result.notifiedPerson?.info.birthDate).toBe('2000');
    });

    it('should preserve year-month ISO format birthDate', () => {
      const model: any = {
        tabDiseaseChoice: {
          diseaseChoice: { answer: { valueCoding: { code: 'COVID19' } } },
          clinicalStatus: { answer: { valueString: 'active' } },
          statusNoteGroup: {
            statusNote: { answer: { valueString: 'note' } },
            initialNotificationId: { answer: { valueString: 'initId' } },
          },
        },
        tabNotifier: {
          address: { street: 'Teststr. 1' },
          contact: { salutation: ExtendedSalutationEnum.Mr },
          contacts: { emailAddresses: [], phoneNumbers: [] },
          facilityInfo: { organizationType: { answer: { valueCoding: { code: 'hospital' } } } },
          oneTimeCode: '1234',
        },
        tabPatient: {
          info: { birthDate: '2000-01' }, // Year-month ISO format
          currentAddressType: 'primaryAsCurrent',
          residenceAddress: { city: 'Berlin' },
          currentAddress: { city: 'Berlin' },
          currentAddressInstitutionName: 'Klinik',
          residenceAddressType: 'home',
          contacts: { emailAddresses: [], phoneNumbers: [] },
        },
        tabDiseaseCondition: {},
        tabDiseaseCommon: undefined,
        tabQuestionnaire: [],
      };

      const result = service.createNotification(model, NotificationType.NominalNotification6_1);
      expect(result.notifiedPerson?.info.birthDate).toBe('2000-01');
    });
  });
});
