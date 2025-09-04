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

import { TestBed } from '@angular/core/testing';
import { ProcessFormService } from './process-form-service';
import { ExtendedSalutationEnum } from '../../legacy/common-utils';
import { environment } from 'src/environments/environment';

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
        info: { birthDate: '01.01.2000' },
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

    const result = service.createNotification(model);
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
      recordedDate: { answer: { valueDate: '01.01.2024' } },
      onset: { answer: { valueDate: '01.01.2024' } },
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

  describe('birthDate handling with FEATURE_FLAG_DISEASE_DATEPICKER', () => {
    it('should preserve ISO format birthDate when FEATURE_FLAG_DISEASE_DATEPICKER is active', () => {
      // Spy auf environment.featureFlags
      spyOnProperty(environment, 'featureFlags', 'get').and.returnValue({ FEATURE_FLAG_DISEASE_DATEPICKER: true });

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

      const result = service.createNotification(model);
      expect(result.notifiedPerson?.info.birthDate).toBe('2000-01-01');
    });

    it('should preserve year-only ISO format birthDate when FEATURE_FLAG_DISEASE_DATEPICKER is active', () => {
      // Spy auf environment.featureFlags
      spyOnProperty(environment, 'featureFlags', 'get').and.returnValue({ FEATURE_FLAG_DISEASE_DATEPICKER: true });

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

      const result = service.createNotification(model);
      expect(result.notifiedPerson?.info.birthDate).toBe('2000');
    });

    it('should preserve year-month ISO format birthDate when FEATURE_FLAG_DISEASE_DATEPICKER is active', () => {
      // Spy auf environment.featureFlags
      spyOnProperty(environment, 'featureFlags', 'get').and.returnValue({ FEATURE_FLAG_DISEASE_DATEPICKER: true });

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

      const result = service.createNotification(model);
      expect(result.notifiedPerson?.info.birthDate).toBe('2000-01');
    });

    it('should convert German format birthDate when FEATURE_FLAG_DISEASE_DATEPICKER is inactive', () => {
      // Spy auf environment.featureFlags
      spyOnProperty(environment, 'featureFlags', 'get').and.returnValue({ FEATURE_FLAG_DISEASE_DATEPICKER: false });

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
          info: { birthDate: '01.01.2000' }, // German format
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

      const result = service.createNotification(model);
      expect(result.notifiedPerson?.info.birthDate).toBe('2000-01-01');
    });

    it('should not process birthDate when FEATURE_FLAG_DISEASE_DATEPICKER is inactive and birthDate is already in ISO format', () => {
      // Spy auf environment.featureFlags
      spyOnProperty(environment, 'featureFlags', 'get').and.returnValue({ FEATURE_FLAG_DISEASE_DATEPICKER: false });

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

      const result = service.createNotification(model);
      // Da dateStringToIso bei bereits ISO-formatierten Daten einen leeren String zurückgibt,
      // erwarten wir hier einen leeren String (was das Problem ist, das behoben wurde)
      expect(result.notifiedPerson?.info.birthDate).toBe('');
    });
  });
});
