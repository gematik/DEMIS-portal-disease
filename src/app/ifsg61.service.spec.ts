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

import { HttpClient, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MockBuilder, MockRender } from 'ng-mocks';
import { NGXLogger } from 'ngx-logger';
import { of, throwError } from 'rxjs';

import { DiseaseNotification } from '../api/notification';
import { environment } from '../environments/environment';
import { NotificationType } from './demis-types';
import { Ifsg61Service } from './ifsg61.service';
import { FileService } from './legacy/file.service';
import { HelpersService } from './shared/helpers.service';
import { ProgressService } from './shared/progress.service';
import { EXAMPLE_MSVD, EXAMPLE_MSVD_FEATURE_FLAG_DISEASE_DATEPICKER } from 'src/test/shared/data/test-values';
import { MessageDialogService } from '@gematik/demis-portal-core-library';

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
    FEATURE_FLAG_PORTAL_SUBMIT: true,
  },
  ngxLoggerConfig: {
    level: 1,
    disableConsoleLogging: false,
  },
};

describe('Ifsg61Service', () => {
  let service: Ifsg61Service;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let progressServiceSpy: jasmine.SpyObj<ProgressService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let helperSpy: jasmine.SpyObj<HelpersService>;
  let messageDialogServiceSpy: jasmine.SpyObj<MessageDialogService>;

  describe('FEATURE_FLAG_NON_NOMINAL_NOTIFICATION == true', () => {
    // Helper function to find fields with valueDate keys
    const findValueDateFields = (configs: any[]): any[] => {
      const fields: any[] = [];
      const traverse = (fc: any) => {
        if (typeof fc.key === 'string' && fc.key.endsWith('valueDate')) {
          fields.push(fc);
        }
        if (fc.fieldGroup) {
          fc.fieldGroup.forEach(traverse);
        }
        if (fc.fieldArray) {
          traverse(fc.fieldArray);
        }
      };
      configs.forEach(traverse);
      return fields;
    };

    beforeEach(() => {
      environment.diseaseConfig = mainConfig;
      return MockBuilder(Ifsg61Service)
        .mock(HttpClient)
        .mock(ProgressService)
        .mock(NGXLogger)
        .mock(FileService)
        .mock(MatDialog)
        .mock(HelpersService)
        .mock(MessageDialogService);
    });

    beforeEach(() => {
      const fixture = MockRender();
      service = fixture.point.injector.get(Ifsg61Service);
      httpClientSpy = fixture.point.injector.get(HttpClient) as jasmine.SpyObj<HttpClient>;
      progressServiceSpy = fixture.point.injector.get(ProgressService) as jasmine.SpyObj<ProgressService>;
      matDialogSpy = fixture.point.injector.get(MatDialog) as jasmine.SpyObj<MatDialog>;
      loggerSpy = fixture.point.injector.get(NGXLogger) as jasmine.SpyObj<NGXLogger>;
      fileServiceSpy = fixture.point.injector.get(FileService) as jasmine.SpyObj<FileService>;
      helperSpy = fixture.point.injector.get(HelpersService) as jasmine.SpyObj<HelpersService>;
      messageDialogServiceSpy = fixture.point.injector.get(MessageDialogService) as jasmine.SpyObj<MessageDialogService>;
      (messageDialogServiceSpy.showSpinnerDialog as any) = jasmine.createSpy('showSpinnerDialog');
      (messageDialogServiceSpy.closeSpinnerDialog as any) = jasmine.createSpy('closeSpinnerDialog');
      (messageDialogServiceSpy.showSubmitDialog as any) = jasmine.createSpy('showSubmitDialog');
      (messageDialogServiceSpy.showErrorDialog as any) = jasmine.createSpy('showErrorDialog');
      (messageDialogServiceSpy.extractMessageFromError as any) = jasmine.createSpy('extractMessageFromError').and.returnValue('Error');
    });

    it('should be created with correct ff', () => {
      expect(service).toBeTruthy();
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION).toBeTrue();
    });

    it('getCodeValueSet calls correct URL', () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getCodeValueSet('test-system').subscribe(result => {
        expect(result).toBeDefined();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToFuts}/ValueSet?system=test-system`, { headers: environment.futsHeaders });
    });

    it('getDiseaseOptions calls pathToNotificationCategories7_3 when NotificationType === NonNominalNotification7_3', () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getDiseaseOptions(NotificationType.NonNominalNotification7_3).subscribe(result => {
        expect(result).toBeDefined();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(environment.pathToNotificationCategories7_3, { headers: environment.futsHeaders });
    });

    it('getDiseaseOptions calls pathToNotificationCategories6_1 when NotificationType === NominalNotification6_1', () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getDiseaseOptions(NotificationType.NominalNotification6_1).subscribe(result => {
        expect(result).toBeDefined();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(environment.pathToNotificationCategories6_1, { headers: environment.futsHeaders });
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire7_3 when NotificationType === NonNominalNotification7_3', () => {
      const mockResponse = {
        questionnaireConfigs: [],
        conditionConfigs: [],
        commonConfig: [],
      };
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getQuestionnaire('testName', NotificationType.NonNominalNotification7_3).subscribe(result => {
        expect(result).toBeDefined();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToDiseaseQuestionnaire7_3}/testName/formly`, { headers: environment.futsHeaders });
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire6_1 when NotificationType === NominalNotification6_1', () => {
      const mockResponse = {
        questionnaireConfigs: [],
        conditionConfigs: [],
        commonConfig: [],
      };
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getQuestionnaire('testName', NotificationType.NominalNotification6_1).subscribe(result => {
        expect(result).toBeDefined();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToDiseaseQuestionnaire6_1}/testName/formly`, { headers: environment.futsHeaders });
    });

    it('setFieldDefaults applies correct transformation when FEATURE_FLAG_DISEASE_DATEPICKER is false', () => {
      // Import test data

      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_DATEPICKER = false;

      const mockResponse = EXAMPLE_MSVD;
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getQuestionnaire('testName', NotificationType.NominalNotification6_1).subscribe(result => {
        const valueDateFields = [
          ...findValueDateFields(result.questionnaireConfigs),
          ...findValueDateFields(result.conditionConfigs),
          ...findValueDateFields(result.commonConfig),
        ];

        valueDateFields.forEach(field => {
          expect(field.validators).toEqual({ validation: ['date123'] });
          expect(field.modelOptions).toEqual({ updateOn: 'blur' });
          // wrappers can be undefined or ['form-field'] - they are not changed by setFieldDefaults
          // when FEATURE_FLAG_DISEASE_DATEPICKER is false
          if (field.wrappers !== undefined) {
            expect(field.wrappers).toEqual(['form-field']);
          }
          expect(field.props?.appearance).toBeUndefined();
          expect(field.props?.allowedPrecisions).toBeUndefined();
        });
      });

      expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('setFieldDefaults applies correct transformation when FEATURE_FLAG_DISEASE_DATEPICKER is true', () => {
      // Import test data

      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_DATEPICKER = true;

      const mockResponse = EXAMPLE_MSVD_FEATURE_FLAG_DISEASE_DATEPICKER;
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getQuestionnaire('testName', NotificationType.NominalNotification6_1).subscribe(result => {
        const valueDateFields = [
          ...findValueDateFields(result.questionnaireConfigs),
          ...findValueDateFields(result.conditionConfigs),
          ...findValueDateFields(result.commonConfig),
        ];

        valueDateFields.forEach(field => {
          expect(field.wrappers).toEqual([]);
          expect(field.props?.appearance).toBe('fill');
          expect(field.props?.allowedPrecisions).toEqual(field.props?.allowedPrecisions || ['day', 'month', 'year']);
          expect(field.validators).toBeUndefined();
        });
      });

      expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('postMessage calls pathToGatewayDiseaseNonNominal when NotificationType === NonNominalNotification7_3', () => {
      const mockNotification = {
        notifiedPerson: {
          info: {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
          },
        },
      } as unknown as DiseaseNotification;
      httpClientSpy.post = jasmine.createSpy('post').and.returnValue(of({}));

      service.postMessage(mockNotification, NotificationType.NonNominalNotification7_3).subscribe();

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.pathToGatewayDiseaseNonNominal,
        JSON.stringify(mockNotification),
        jasmine.objectContaining({
          headers: environment.headers,
          reportProgress: true,
        })
      );
    });

    it('postMessage calls pathToGatewayDisease when NotificationType === NominalNotification6_1', () => {
      const mockNotification = {
        notifiedPerson: {
          info: {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
          },
        },
      } as unknown as DiseaseNotification;
      httpClientSpy.post = jasmine.createSpy('post').and.returnValue(of({}));

      service.postMessage(mockNotification, NotificationType.NominalNotification6_1).subscribe();

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.pathToGatewayDisease,
        JSON.stringify(mockNotification),
        jasmine.objectContaining({
          headers: environment.headers,
          reportProgress: true,
        })
      );
    });

    it('sendNotification handles successful response', () => {
      const mockNotification = {
        notifiedPerson: {
          info: {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
          },
        },
      } as unknown as DiseaseNotification;
      const mockResponse = new HttpResponse({
        body: { status: 'All OK', content: 'base64content' },
      });
      const mockDialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of({})),
      };

      progressServiceSpy.showProgress = jasmine.createSpy('showProgress').and.returnValue(Promise.resolve(mockResponse));
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);
      helperSpy.exitApplication = jasmine.createSpy('exitApplication');
      fileServiceSpy.getFileNameByNotificationType = jasmine.createSpy('getFileNameByNotificationType').and.returnValue('test-file.pdf');

      service.sendNotification(mockNotification, NotificationType.NominalNotification6_1);

      expect(progressServiceSpy.showProgress).toHaveBeenCalled();
    });

    it('sendNotification handles error response', () => {
      const mockNotification = {
        notifiedPerson: {
          info: {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
          },
        },
      } as unknown as DiseaseNotification;
      const mockResponse = new HttpResponse({
        body: { status: 'Error', message: 'Something went wrong' },
      });

      progressServiceSpy.showProgress = jasmine.createSpy('showProgress').and.returnValue(Promise.resolve(mockResponse));
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue({});

      service.sendNotification(mockNotification, NotificationType.NominalNotification6_1);

      expect(progressServiceSpy.showProgress).toHaveBeenCalled();
    });

    it('sendNotification handles rejection', () => {
      const mockNotification = {
        notifiedPerson: {
          info: {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
          },
        },
      } as unknown as DiseaseNotification;
      const mockError = {
        error: {
          message: 'Validation failed',
          validationErrors: [{ field: 'testField', message: 'Test error' }],
        },
      };

      progressServiceSpy.showProgress = jasmine.createSpy('showProgress').and.returnValue(Promise.reject(mockError));
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue({});
      loggerSpy.error = jasmine.createSpy('error');

      service.sendNotification(mockNotification, NotificationType.NominalNotification6_1);

      expect(progressServiceSpy.showProgress).toHaveBeenCalled();
    });

    it('submitNotification posts to non-nominal url and shows submit dialog on success', () => {
      const mockNotification = {
        notifiedPerson: { info: { firstName: 'John', lastName: 'Doe', birthDate: '1990-01-01' } },
      } as unknown as DiseaseNotification;

      fileServiceSpy.getFileNameByNotificationType = jasmine.createSpy('getFileNameByNotificationType').and.returnValue('test-file.pdf');

      const response = new HttpResponse({
        body: {
          authorEmail: 'author@test.de',
          content: 'base64content',
          notificationId: 'notif-123',
          timestamp: 1712345678901,
        },
      });
      httpClientSpy.post = jasmine.createSpy('post').and.returnValue(of(response));

      service.submitNotification(mockNotification, NotificationType.NonNominalNotification7_3);

      expect(messageDialogServiceSpy.showSpinnerDialog).toHaveBeenCalledWith({ message: 'Erkrankungsmeldung wird gesendet' });
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.pathToGatewayDiseaseNonNominal,
        JSON.stringify(mockNotification),
        jasmine.objectContaining({ headers: environment.headers, observe: 'response' })
      );
      expect(fileServiceSpy.getFileNameByNotificationType).toHaveBeenCalledWith(
        mockNotification.notifiedPerson!.info,
        NotificationType.NonNominalNotification7_3,
        'notif-123'
      );

      const submitArgs = (messageDialogServiceSpy.showSubmitDialog as jasmine.Spy).calls.mostRecent().args[0];
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

      fileServiceSpy.getFileNameByNotificationType = jasmine.createSpy('getFileNameByNotificationType').and.returnValue('nominal-file.pdf');

      const response = new HttpResponse({
        body: {
          authorEmail: 'nominal@test.de',
          content: 'othercontent',
          notificationId: 'notif-456',
          timestamp: 1712345678000,
        },
      });
      httpClientSpy.post = jasmine.createSpy('post').and.returnValue(of(response));

      service.submitNotification(mockNotification, NotificationType.NominalNotification6_1);

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.pathToGatewayDisease,
        JSON.stringify(mockNotification),
        jasmine.objectContaining({ headers: environment.headers, observe: 'response' })
      );

      const submitArgs = (messageDialogServiceSpy.showSubmitDialog as jasmine.Spy).calls.mostRecent().args[0];
      expect(submitArgs.fileName).toBe('nominal-file.pdf');
      expect(submitArgs.href).toBe('data:application/actet-stream;base64,othercontent');
      expect(messageDialogServiceSpy.closeSpinnerDialog).toHaveBeenCalled();
    });

    it('submitNotification shows error dialog on error and closes spinner', () => {
      const mockNotification = { notifiedPerson: { info: {} } } as unknown as DiseaseNotification;
      const httpError = {
        error: {
          message: 'Validation failed',
          validationErrors: [{ field: 'fieldA', message: 'Field A invalid' }],
        },
      };

      httpClientSpy.post = jasmine.createSpy('post').and.returnValue(throwError(() => httpError));
      loggerSpy.error = jasmine.createSpy('error');

      service.submitNotification(mockNotification, NotificationType.NominalNotification6_1);

      expect(messageDialogServiceSpy.showSpinnerDialog).toHaveBeenCalled();
      expect(loggerSpy.error).toHaveBeenCalled();
      expect(messageDialogServiceSpy.showErrorDialog).toHaveBeenCalledWith(
        jasmine.objectContaining({
          errorTitle: 'Meldung konnte nicht zugestellt werden!',
          errors: [{ text: 'Field A invalid', queryString: 'Field A invalid' }],
        })
      );
      expect(messageDialogServiceSpy.closeSpinnerDialog).toHaveBeenCalled();
    });

    it('extractErrorDetails returns mapped validation errors when present', () => {
      const err = {
        error: {
          message: 'Validation failed',
          validationErrors: [
            { field: 'fieldA', message: 'Field A invalid' },
            { field: 'fieldB', message: 'Field B invalid' },
          ],
        },
      };

      const result = (service as any).extractErrorDetails(err);

      expect(messageDialogServiceSpy.extractMessageFromError).toHaveBeenCalledWith(err.error);
      expect(result).toEqual([
        { text: 'Field A invalid', queryString: 'Field A invalid' },
        { text: 'Field B invalid', queryString: 'Field B invalid' },
      ]);
    });

    it('extractErrorDetails returns parsed message when no validationErrors are present', () => {
      const err = { error: { message: 'Generic failure' } };
      (messageDialogServiceSpy.extractMessageFromError as jasmine.Spy).and.returnValue('Parsed Error');

      const result = (service as any).extractErrorDetails(err);

      expect(messageDialogServiceSpy.extractMessageFromError).toHaveBeenCalledWith(err.error);
      expect(result).toEqual([{ text: 'Parsed Error', queryString: 'Parsed Error' }]);
    });

    // ...existing code...
  });

  describe('FEATURE_FLAG_NON_NOMINAL_NOTIFICATION == false', () => {
    beforeEach(() => {
      environment.diseaseConfig = { ...mainConfig };
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = false;
      return MockBuilder(Ifsg61Service).mock(HttpClient).mock(ProgressService).mock(NGXLogger).mock(FileService).mock(MatDialog).mock(HelpersService);
    });

    beforeEach(() => {
      const fixture = MockRender();
      service = fixture.point.injector.get(Ifsg61Service);
      httpClientSpy = fixture.point.injector.get(HttpClient) as jasmine.SpyObj<HttpClient>;
    });

    it('should be created with correct ff', () => {
      expect(service).toBeTruthy();
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION).toBeFalse();
    });

    it('getDiseaseOptions calls pathToDisease when NotificationType === NonNominalNotification7_3', () => {
      const mockResponse = [{ code: 'test', display: 'Test', system: 'test-system' }];
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getDiseaseOptions(NotificationType.NonNominalNotification7_3).subscribe(result => {
        expect(result).toBeDefined();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(environment.pathToDisease, { headers: environment.futsHeaders });
    });

    it('getQuestionnaire calls pathToDiseaseQuestionnaire when NotificationType === NonNominalNotification7_3', () => {
      const mockResponse = {
        questionnaireConfigs: [],
        conditionConfigs: [],
        commonConfig: [],
      };
      httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockResponse));

      service.getQuestionnaire('testName', NotificationType.NonNominalNotification7_3).subscribe(result => {
        expect(result).toBeDefined();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.pathToDiseaseQuestionnaire}/testName/formly`, { headers: environment.futsHeaders });
    });

    it('postMessage calls pathToGatewayDisease when NotificationType === NonNominalNotification7_3', () => {
      const mockNotification = {} as unknown as DiseaseNotification;
      httpClientSpy.post = jasmine.createSpy('post').and.returnValue(of({}));

      service.postMessage(mockNotification, NotificationType.NonNominalNotification7_3).subscribe();

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        environment.pathToGatewayDisease,
        JSON.stringify(mockNotification),
        jasmine.objectContaining({
          headers: environment.headers,
          reportProgress: true,
        })
      );
    });
  });
});
