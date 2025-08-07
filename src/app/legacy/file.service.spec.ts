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
import { FileService } from './file.service';
import { NotifiedPersonBasicInfo } from '../../api/notification';
import { NotificationType } from '../demis-types';

describe('FileService', () => {
  let service: FileService;

  const notifiedPersonFull: NotifiedPersonBasicInfo = {
    firstname: 'Max',
    lastname: 'Meier',
    birthDate: '1998-11-05',
  } as NotifiedPersonBasicInfo;

  const notifiedPersonEmptyBirthday: NotifiedPersonBasicInfo = {
    firstname: 'Max',
    lastname: 'Meier',
    birthDate: '',
  } as NotifiedPersonBasicInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileService);
  });

  it('returns file name with given birthday for nominal notification type', () => {
    const fileName = service.getFileNameByNotificationType(notifiedPersonFull, NotificationType.NominalNotification6_1, '12345');

    expect(fileName).toMatch(/^\d{12} Meier, Max 981105\.pdf$/);
  });

  it('returns file name with empty birthday for nominal notification type', () => {
    const fileName = service.getFileNameByNotificationType(notifiedPersonEmptyBirthday, NotificationType.NominalNotification6_1, '12345');

    expect(fileName).toMatch(/^\d{12} Meier, Max\.pdf$/);
  });

  it('returns file name for non-nominal notification type', () => {
    const fileName = service.getFileNameByNotificationType(notifiedPersonFull, NotificationType.NonNominalNotification7_3, 'ABC123XYZ');

    expect(fileName).not.toContain('Max');
    expect(fileName).not.toContain('Meier');
    expect(fileName).not.toContain('981105');
    expect(fileName).toMatch(/^\d{12}-ABC123XYZ\.pdf$/);
  });

  it('returns file name  with empty notificationId for non-nominal notification type', () => {
    const fileName = service.getFileNameByNotificationType(notifiedPersonFull, NotificationType.NonNominalNotification7_3, '');

    expect(fileName).not.toContain('Max');
    expect(fileName).not.toContain('Meier');
    expect(fileName).not.toContain('981105');
    expect(fileName).toMatch(/^\d{12}-\.pdf$/);
  });
});
