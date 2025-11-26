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

import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
import { DiseaseNotification, NotifiedPersonBasicInfo } from '../../api/notification';
import { NotificationType } from '../demis-types';

describe('FileService', () => {
  let service: FileService;

  const notificationNominal: DiseaseNotification = {
    notifiedPerson: {
      info: {
        firstname: 'Max',
        lastname: 'Meier',
        birthDate: '1998-11-05',
      } as NotifiedPersonBasicInfo,
    },
  } as DiseaseNotification;

  const notificationFollowUp: DiseaseNotification = {
    notifiedPersonAnonymous: {
      birthDate: '1998-11',
      gender: 'MALE',
      residenceAddress: {
        zip: '123',
      },
    },
  } as DiseaseNotification;

  const notification_NonNominal_7_3: DiseaseNotification = {
    notifiedPerson: {
      info: {
        firstname: 'Max',
        lastname: 'Meier',
        birthDate: '1998-11-05',
        gender: 'MALE',
        residenceAddress: {
          zip: '123',
        },
      } as NotifiedPersonBasicInfo,
    },
  } as DiseaseNotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileService);
  });

  it('returns file name for nominal notification type', () => {
    const fileName = service.getFileNameByNotificationType('12345', NotificationType.NominalNotification6_1, notificationNominal);
    expect(fileName).toMatch(/^\d{12} Meier, Max 981105\.pdf$/);
  });

  it('returns file name for §7.3 non-nominal notification type', () => {
    const fileName = service.getFileNameByNotificationType('ABC123XYZ', NotificationType.NonNominalNotification7_3, notification_NonNominal_7_3);
    expect(fileName).not.toContain('Max');
    expect(fileName).not.toContain('Meier');
    expect(fileName).not.toContain('9811');
    expect(fileName).toMatch(/^\d{12}-ABC123XYZ\.pdf$/);
  });

  it('returns file name for follow-up notification type', () => {
    const fileName = service.getFileNameByNotificationType('ABC123XYZ', NotificationType.FollowUpNotification6_1, notificationFollowUp);
    expect(fileName).not.toContain('Max');
    expect(fileName).not.toContain('Meier');
    expect(fileName).not.toContain('981105');
    expect(fileName).toMatch(/^\d{12}-ABC123XYZ\.pdf$/);
  });
});
