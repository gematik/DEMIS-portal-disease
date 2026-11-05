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

import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MockBuilder, MockRender } from 'ng-mocks';
import { NGXLogger } from 'ngx-logger';
import { firstValueFrom, lastValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock, type MockedObject, vi } from 'vitest';

import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { EXAMPLE_MSVD } from 'src/test/shared/data/test-values';
import { DiseaseNotification } from '../api/notification';
import { environment } from '../environments/environment';
import { NotificationType } from './demis-types';
import { Ifsg61Service } from './ifsg61.service';
import { FileService } from './legacy/file.service';

export const mainConfig = {
  production: false,
  gatewayPaths: {
    main: '/gateway/disease/notification/disease',
    disease_6_1: '/6.1',
    disease_7_3_non_nominal: '/7.3/non_nominal',
  },
  futsPaths: {
    baseUrl: '/translation/ui-data-model/v6/fhir',
    diseaseBase: '/disease',
    notificationCategories_6_1: '/6.1',
    disease_7_3: '/7.3/non_nominal',
    notificationCategories_7_3: '/7.3',
    questionnaire: '/questionnaire',
    questionnaire_6_1: '/6.1/questionnaire',
    questionnaire_7_3: '/7.3/questionnaire',
  },
  featureFlags: {
    FEATURE_FLAG_NON_NOMINAL_NOTIFICATION: true,
    FEATURE_FLAG_DISEASE_STRICT: false,
  },
  ngxLoggerConfig: environment.defaultLoggerConfiguration,
};

describe('Ifsg61Service', () => {
  let service: Ifsg61Service;
  let httpClientSpy: MockedObject<HttpClient>;
  let matDialogSpy: MockedObject<MatDialog>;
  let loggerSpy: MockedObject<NGXLogger>;
  let fileServiceSpy: MockedObject<FileService>;
  let messageDialogServiceSpy: MockedObject<MessageDialogService>;

  describe('FEATURE_FLAG_NON_NOMINAL_NOTIFICATION == true', () => {
    beforeEach(() => {
      environment.diseaseConfig = mainConfig;
      return MockBuilder(Ifsg61Service).mock(HttpClient).mock(NGXLogger).mock(FileService).mock(MatDialog).mock(MessageDialogService);
    });

    beforeEach(() => {
      const fixture = MockRender();
      service = fixture.point.injector.get(Ifsg61Service);
      httpClientSpy = fixture.point.injector.get(HttpClient) as MockedObject<HttpClient>;
      matDialogSpy = fixture.point.injector.get(MatDialog) as MockedObject<MatDialog>;
      loggerSpy = fixture.point.injector.get(NGXLogger) as MockedObject<NGXLogger>;
      fileServiceSpy = fixture.point.injector.get(FileService) as MockedObject<FileService>;
      messageDialogServiceSpy = fixture.point.injector.get(MessageDialogService) as MockedObject<MessageDialogService>;
      (messageDialogServiceSpy.showSpinnerDialog as any) = vi.fn();
      (messageDialogServiceSpy.closeSpinnerDialog as any) = vi.fn();
      (messageDialogServiceSpy.showSubmitDialog as any) = vi.fn();
      (messageDialogServiceSpy.showErrorDialog as any) = vi.fn();
      (messageDialogServiceSpy.extractMessageFromError as any) = vi.fn().mockReturnValue('Error');
    });

    it('should be created with correct ff', () => {
      expect(service).toBeTruthy();
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION).toBe(true);
    });

    it('getCodeValueSet calls correct URL', async () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getCodeValueSet('test-system'));
      expect(result).toBeDefined();

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.futsBaseUrl}/ValueSet?system=test-system`, { headers: environment.futsHeaders });
    });

    it('getDiseaseOptions calls pathToNotificationCategories7_3 when NotificationType === NonNominalNotification7_3', async () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getDiseaseOptions(NotificationType.NonNominalNotification7_3));
      expect(result).toBeDefined();

      expect(httpClientSpy.get).toHaveBeenCalledWith(environment.pathToNotificationCategories7_3, { headers: environment.futsHeaders });
    });

    it('getDiseaseOptions calls pathToNotificationCategories6_1 when NotificationType === NominalNotification6_1', async () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getDiseaseOptions(NotificationType.NominalNotification6_1));
      expect(result).toBeDefined();

      expect(httpClientSpy.get).toHaveBeenCalledWith(environment.pathToNotificationCategories6_1, { headers: environment.futsHeaders });
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire7_3 when NotificationType === NonNominalNotification7_3', async () => {
      const mockResponse = {
        questionnaireConfigs: [],
        conditionConfigs: [],
        commonConfig: [],
      };
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getQuestionnaire('testName', NotificationType.NonNominalNotification7_3));
      expect(result).toBeDefined();

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToDiseaseQuestionnaire7_3}/testName/formly`, { headers: environment.futsHeaders });
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire6_1 when NotificationType === NominalNotification6_1', async () => {
      const mockResponse = {
        questionnaireConfigs: [],
        conditionConfigs: [],
        commonConfig: [],
      };
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getQuestionnaire('testName', NotificationType.NominalNotification6_1));
      expect(result).toBeDefined();

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToDiseaseQuestionnaire6_1}/testName/formly`, { headers: environment.futsHeaders });
    });

    it('setFieldDefaults applies correct transformation', async () => {
      // Import test data
      httpClientSpy.get = vi.fn().mockReturnValue(of(EXAMPLE_MSVD));

      await lastValueFrom(service.getQuestionnaire('testName', NotificationType.NominalNotification6_1));

      expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('submitNotification posts to non-nominal url and shows submit dialog on success', () => {
      const mockNotification = {
        notifiedPerson: { info: { firstName: 'John', lastName: 'Doe', birthDate: '1990-01-01' } },
      } as unknown as DiseaseNotification;

      fileServiceSpy.getFileNameByNotificationType = vi.fn().mockReturnValue('test-file.pdf');

      const response = new HttpResponse({
        body: {
          authorEmail: 'author@test.de',
          content: 'base64content',
          notificationId: 'notif-123',
          timestamp: 1712345678901,
        },
      });
      httpClientSpy.post = vi.fn().mockReturnValue(of(response));

      service.submitNotification(mockNotification, NotificationType.NonNominalNotification7_3);

      expect(messageDialogServiceSpy.showSpinnerDialog).toHaveBeenCalledWith({ message: 'Erkrankungsmeldung wird gesendet' });
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.pathToGatewayDiseaseNonNominal,
        JSON.stringify(mockNotification),
        expect.objectContaining({ headers: environment.headers, observe: 'response' })
      );
      expect(fileServiceSpy.getFileNameByNotificationType).toHaveBeenCalledWith('notif-123', NotificationType.NonNominalNotification7_3, mockNotification);

      const submitArgs = vi.mocked(messageDialogServiceSpy.showSubmitDialog as Mock).mock.lastCall![0];
      expect(submitArgs.authorEmail).toBe('author@test.de');
      expect(submitArgs.fileName).toBe('test-file.pdf');
      expect(submitArgs.href).toBe('data:application/actet-stream;base64,base64content');
      expect(submitArgs.notificationId).toBe('notif-123');
      expect(submitArgs.timestamp).toBe(1712345678901);
      expect(messageDialogServiceSpy.closeSpinnerDialog).toHaveBeenCalled();
    });

    it('submitNotification posts to nominal url and shows submit dialog on success', () => {
      const mockNotification = {
        notifiedPerson: { info: { firstName: 'Jane', lastName: 'Doe', birthDate: '1980-02-02' } },
      } as unknown as DiseaseNotification;

      fileServiceSpy.getFileNameByNotificationType = vi.fn().mockReturnValue('nominal-file.pdf');

      const response = new HttpResponse({
        body: {
          authorEmail: 'nominal@test.de',
          content: 'othercontent',
          notificationId: 'notif-456',
          timestamp: 1712345678000,
        },
      });
      httpClientSpy.post = vi.fn().mockReturnValue(of(response));

      service.submitNotification(mockNotification, NotificationType.NominalNotification6_1);

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.pathToGatewayDisease,
        JSON.stringify(mockNotification),
        expect.objectContaining({ headers: environment.headers, observe: 'response' })
      );

      const submitArgs = vi.mocked(messageDialogServiceSpy.showSubmitDialog as Mock).mock.lastCall![0];
      expect(submitArgs.fileName).toBe('nominal-file.pdf');
      expect(submitArgs.href).toBe('data:application/actet-stream;base64,othercontent');
      expect(messageDialogServiceSpy.closeSpinnerDialog).toHaveBeenCalled();
    });

    it('submitNotification shows error dialog on error and closes spinner', () => {
      const mockNotification = { notifiedPerson: { info: {} } } as unknown as DiseaseNotification;
      const httpError = {
        error: {
          message: 'Validation failed',
          validationErrors: [{ field: 'fieldA', message: 'Field A invalid', severity: 'error' }],
        },
      };

      httpClientSpy.post = vi.fn().mockReturnValue(throwError(() => httpError));
      loggerSpy.error = vi.fn();

      service.submitNotification(mockNotification, NotificationType.NominalNotification6_1);

      expect(messageDialogServiceSpy.showSpinnerDialog).toHaveBeenCalled();
      expect(loggerSpy.error).toHaveBeenCalled();
      expect(messageDialogServiceSpy.showErrorDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          errorTitle: 'Meldung konnte nicht zugestellt werden!',
          errors: [{ text: 'Field A invalid', queryString: 'Field A invalid', severity: 'error' }],
        })
      );
      expect(messageDialogServiceSpy.closeSpinnerDialog).toHaveBeenCalled();
    });

    it('extractErrorDetails returns parsed message when no validationErrors are present', () => {
      const err = { error: { message: 'Generic failure' } };
      (messageDialogServiceSpy.extractMessageFromError as Mock).mockReturnValue('Parsed Error');

      const result = (service as any).extractErrorDetails(err);

      expect(messageDialogServiceSpy.extractMessageFromError).toHaveBeenCalledWith(err.error);
      expect(result).toEqual([{ text: 'Parsed Error', queryString: 'Parsed Error' }]);
    });

    it('fetchFollowUpCode calls correct URL with notification category', async () => {
      const mockResponse = [
        { code: 'MSVD', display: 'Masern-Virus' },
        { code: 'MUVD', display: 'Mumps-Virus' },
      ];
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const notificationCategory = 'TEST_CATEGORY';
      const result = await firstValueFrom(service.fetchFollowUpCode(notificationCategory, NotificationType.FollowUpNotification6_1));
      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].code).toBe('MSVD');

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToNotificationCategories6_1}/followup/${notificationCategory}`, {
        headers: environment.futsHeaders,
      });
    });

    it('fetchFollowUpCode returns empty array when no follow-up codes exist', async () => {
      const mockResponse: any[] = [];
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.fetchFollowUpCode('NO_FOLLOWUP_CATEGORY', NotificationType.FollowUpNotification6_1));
      expect(result).toEqual([]);
      expect(result.length).toBe(0);

      expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('fetchFollowUpCode logs error and shows error dialog on HTTP error', async () => {
      const httpError = {
        status: 404,
        statusText: 'Not Found',
        error: { message: 'No follow-up found' },
      };
      httpClientSpy.get = vi.fn().mockReturnValue(throwError(() => httpError));
      loggerSpy.error = vi.fn();

      await expect(firstValueFrom(service.fetchFollowUpCode('INVALID_CATEGORY', NotificationType.FollowUpNotification6_1))).rejects.toEqual(httpError);

      expect(loggerSpy.error).toHaveBeenCalledWith('Error fetching follow up code', httpError);
      expect(messageDialogServiceSpy.showErrorDialog).toHaveBeenCalledWith({
        errorTitle: 'Fehler',
        errors: [
          {
            text: 'Diese Meldekategorie wird für diese Meldungsart nicht unterstützt. Bitte stellen Sie sicher, dass Sie auf eine Meldung nach § 6 Abs. 1 IfSG referenzieren.',
          },
        ],
        redirectToHome: true,
      });
    });

    it('fetchFollowUpCode handles network error and rethrows', async () => {
      const networkError = new Error('Network failure');
      httpClientSpy.get = vi.fn().mockReturnValue(throwError(() => networkError));
      loggerSpy.error = vi.fn();

      await expect(firstValueFrom(service.fetchFollowUpCode('SOME_CATEGORY', NotificationType.FollowUpNotification6_1))).rejects.toBe(networkError);

      expect(loggerSpy.error).toHaveBeenCalledWith('Error fetching follow up code', networkError);
      expect(messageDialogServiceSpy.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('FEATURE_FLAG_NON_NOMINAL_NOTIFICATION == false', () => {
    beforeEach(() => {
      environment.diseaseConfig = { ...mainConfig };
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = false;
      return MockBuilder(Ifsg61Service).mock(HttpClient).mock(NGXLogger).mock(FileService).mock(MatDialog);
    });

    beforeEach(() => {
      const fixture = MockRender();
      service = fixture.point.injector.get(Ifsg61Service);
      httpClientSpy = fixture.point.injector.get(HttpClient) as MockedObject<HttpClient>;
    });

    it('should be created with correct ff', () => {
      expect(service).toBeTruthy();
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION).toBe(false);
    });

    it('getDiseaseOptions calls pathToDisease when NotificationType === NonNominalNotification7_3', async () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getDiseaseOptions(NotificationType.NonNominalNotification7_3));
      expect(result).toBeDefined();

      expect(httpClientSpy.get).toHaveBeenCalledWith(environment.pathToDisease, { headers: environment.futsHeaders });
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire when NotificationType === NonNominalNotification7_3', async () => {
      const mockResponse = {
        questionnaireConfigs: [],
        conditionConfigs: [],
        commonConfig: [],
      };
      httpClientSpy.get = vi.fn().mockReturnValue(of(mockResponse));

      const result = await firstValueFrom(service.getQuestionnaire('testName', NotificationType.NonNominalNotification7_3));
      expect(result).toBeDefined();

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToDiseaseQuestionnaire}/testName/formly`, { headers: environment.futsHeaders });
    });
  });
});
