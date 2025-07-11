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
import { Ifsg61Service } from './ifsg61.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgressService } from './shared/progress.service';
import { NGXLogger } from 'ngx-logger';
import { FileService } from './legacy/file.service';
import { MatDialog } from '@angular/material/dialog';
import { HelpersService } from './shared/helpers.service';
import { environment } from '../environments/environment';
import { MockBuilder } from 'ng-mocks';
import { NotificationType } from './demis-types';

export const mainConfig = {
  production: false,
  gatewayPaths: {
    main: '/gateway/notification/api/ng/notification/disease',
    disease_6_1: '/6.1',
    disease_7_3_non_nominal: '/7.3/non_nominal',
  },
  futsPaths: {
    main: '/fhir-ui-data-model-translation/disease',
    notificationCategories_6_1: '/6.1',
    disease_7_3: '/7.3/non_nominal',
    notificationCategories_7_3: '/7.3',
    questionnaire: '/questionnaire',
    questionnaire_6_1: '/6.1/questionnaire',
    questionnaire_7_3: '/7.3/questionnaire',
  },
  pathToFuts: '/fhir-ui-data-model-translation',
  featureFlags: {
    FEATURE_FLAG_NON_NOMINAL_NOTIFICATION: true,
  },
  ngxLoggerConfig: {
    level: 1,
    disableConsoleLogging: false,
  },
};

describe('Ifsg61Service', () => {
  let service: Ifsg61Service;
  let httpMock: HttpTestingController;

  describe('FEATURE_FLAG_NON_NOMINAL_NOTIFICATION == true', () => {
    beforeEach(() => {
      environment.diseaseConfig = mainConfig;
      return MockBuilder(Ifsg61Service)
        .keep(HttpClientTestingModule)
        .mock(ProgressService)
        .mock(NGXLogger)
        .mock(FileService)
        .mock(MatDialog)
        .mock(HelpersService);
    });

    beforeEach(() => {
      service = TestBed.inject(Ifsg61Service);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created with correct ff', () => {
      expect(service).toBeTruthy();
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION).toBeTrue();
    });

    it('getCodeValueSet calls right url', () => {
      service.getCodeValueSet('test-system').subscribe();
      const req = httpMock.expectOne(`${environment.pathToFuts}/ValueSet?system=test-system`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('getDiseaseOptions calls pathToNotificationCategories7_3 when NotificationType === NonNominalNotification7_3', () => {
      service.getDiseaseOptions(NotificationType.NonNominalNotification7_3).subscribe();
      const req = httpMock.expectOne(environment.pathToNotificationCategories7_3);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('getDiseaseOptions calls pathToNotificationCategories6_1 when NotificationType === NominalNotification6_1', () => {
      service.getDiseaseOptions(NotificationType.NominalNotification6_1).subscribe();
      const req = httpMock.expectOne(environment.pathToNotificationCategories6_1);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire7_3 when NotificationType === NonNominalNotification7_3', () => {
      service.getQuestionnaire('testName', NotificationType.NonNominalNotification7_3).subscribe();
      const req = httpMock.expectOne(`${environment.pathToDiseaseQuestionnaire7_3}/testName/formly`);
      expect(req.request.method).toBe('GET');
      req.flush({ questionnaireConfigs: [], conditionConfigs: [], commonConfig: [] });
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire6_1 when NotificationType === NominalNotification6_1', () => {
      service.getQuestionnaire('testName', NotificationType.NominalNotification6_1).subscribe();
      const req = httpMock.expectOne(`${environment.pathToDiseaseQuestionnaire6_1}/testName/formly`);
      expect(req.request.method).toBe('GET');
      req.flush({ questionnaireConfigs: [], conditionConfigs: [], commonConfig: [] });
    });

    it('postMessage calls pathToGatewayDiseaseNonNominal when NotificationType === NonNominalNotification7_3', () => {
      service.postMessage({} as any, NotificationType.NonNominalNotification7_3).subscribe();
      const req = httpMock.expectOne(environment.pathToGatewayDiseaseNonNominal);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('postMessage calls pathToGatewayDisease when NotificationType === NominalNotification6_1', () => {
      service.postMessage({} as any, NotificationType.NominalNotification6_1).subscribe();
      const req = httpMock.expectOne(environment.pathToGatewayDisease);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    afterEach(() => {
      httpMock.verify();
    });
  });

  describe('FEATURE_FLAG_NON_NOMINAL_NOTIFICATION == false', () => {
    beforeEach(() => {
      environment.diseaseConfig = mainConfig;
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = false;
      return MockBuilder(Ifsg61Service)
        .keep(HttpClientTestingModule)
        .mock(ProgressService)
        .mock(NGXLogger)
        .mock(FileService)
        .mock(MatDialog)
        .mock(HelpersService);
    });

    beforeEach(() => {
      service = TestBed.inject(Ifsg61Service);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created with correct ff', () => {
      expect(service).toBeTruthy();
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION).toBeFalse();
    });

    it('getDiseaseOptions calls pathToDisease when NotificationType === NonNominalNotification7_3', () => {
      service.getDiseaseOptions(NotificationType.NonNominalNotification7_3).subscribe();
      const req = httpMock.expectOne(environment.pathToDisease);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire when NotificationType === NonNominalNotification7_3', () => {
      service.getQuestionnaire('testName', NotificationType.NonNominalNotification7_3).subscribe();
      const req = httpMock.expectOne(`${environment.pathToDiseaseQuestionnaire}/testName/formly`);
      expect(req.request.method).toBe('GET');
      req.flush({ questionnaireConfigs: [], conditionConfigs: [], commonConfig: [] });
    });

    it('postMessage calls pathToGatewayDisease when NotificationType === NonNominalNotification7_3', () => {
      service.postMessage({} as any, NotificationType.NonNominalNotification7_3).subscribe();
      const req = httpMock.expectOne(environment.pathToGatewayDisease);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
