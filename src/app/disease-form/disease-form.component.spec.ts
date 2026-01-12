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

import { DiseaseFormComponent } from './disease-form.component';
import { Ifsg61Service } from '../ifsg61.service';
import { of, throwError } from 'rxjs';
import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { AppModule } from '../app.module';
import { ImportFieldValuesService } from './services/import-field-values.service';
import { HelpersService } from '../shared/helpers.service';
import { TabsNavigationService } from '../shared/formly/components/tabs-navigation/tabs-navigation.service';
import { ChangeDetectorRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValueSetService } from '../legacy/value-set.service';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { registerValueSetExtension } from '../legacy/value-set.extension';
import { environment } from '../../environments/environment';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { EXAMPLE_COUNTRY_CODES, EXAMPLE_DISEASE_OPTIONS, EXAMPLE_MSVD, EXAMPLE_VALUE_SET } from '../../test/shared/data/test-values';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { NavigationStart, Router } from '@angular/router';
import { allowedRoutes, NotificationType } from '../demis-types';

const overrides = {
  get Ifsg61Service() {
    return {
      getCodeValueSet: jasmine.createSpy('getCodeValueSet').and.returnValue(of(EXAMPLE_VALUE_SET)),
      getDiseaseOptions: jasmine.createSpy('getDiseaseOptions').and.returnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getQuestionnaire: jasmine.createSpy('getQuestionnaire').and.returnValue(of(EXAMPLE_MSVD)),
    } as Partial<Ifsg61Service>;
  },
  get ValueSetService() {
    return {
      get: jasmine.createSpy('get').and.returnValue(of(EXAMPLE_COUNTRY_CODES)),
    };
  },
};

describe('DiseaseFormComponent unit tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let getCodeValueSetSpy: jasmine.Spy;
  let getDiseaseOptionsSpy: jasmine.Spy;
  let showErrorDialogSpy: jasmine.Spy;
  let routerSpy: jasmine.SpyObj<Router>;

  const helpersServiceSpy = {
    exitApplication: jasmine.createSpy('exitApplication') as jasmine.Spy,
  };

  beforeEach(() =>
    MockBuilder([DiseaseFormComponent, AppModule, NoopAnimationsModule])
      .provide(MockProvider(Ifsg61Service, overrides.Ifsg61Service))
      .provide(MockProvider(ChangeDetectorRef))
      .provide(TabsNavigationService) //Real service needs to be provided. Signals from service are used in disease-form template.
      .provide(MockProvider(HelpersService, helpersServiceSpy))
      .provide(MockProvider(ValueSetService, overrides.ValueSetService))
      .provide(MockProvider(ImportFieldValuesService))
      .provide(MockProvider(MatIconModule))
      .mock(MatIcon)
      .provide({
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerValueSetExtension,
        deps: [ValueSetService],
      })
      .provide({
        provide: Router,
        useValue: jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation'], {
          url: allowedRoutes['nominal'],
          events: of(new NavigationStart(0, allowedRoutes['nominal'])),
          routerState: { root: {} },
        }),
      })
  );

  beforeEach(() => {
    environment.diseaseConfig = {
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
        FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE: true,
        FEATURE_FLAG_ANONYMOUS_NOTIFICATION: true,
      },
      ngxLoggerConfig: {
        level: 1,
        disableConsoleLogging: false,
      },
    };
    fixture = MockRender(DiseaseFormComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
    getCodeValueSetSpy = TestBed.inject(Ifsg61Service).getCodeValueSet as jasmine.Spy;
    getDiseaseOptionsSpy = TestBed.inject(Ifsg61Service).getDiseaseOptions as jasmine.Spy;
    showErrorDialogSpy = spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('test createNotification and submitNotification', () => {
    it('should call createNotification and submitNotification on submitForm', async () => {
      // Preparation
      const processFormService = (component as any)['processFormService'];
      const ifsg61Service = (component as any)['ifsg61Service'];
      const notificationMock = { common: { item: [] }, disease: { item: [] } };
      spyOn(processFormService, 'createNotification').and.returnValue(notificationMock);
      spyOn(ifsg61Service, 'submitNotification');

      (component as any).fieldSequence = { tabDiseaseCommon: [], tabQuestionnaire: [] };
      component.model = { foo: 'bar' };
      component.notificationType = (component as any).NotificationType.NominalNotification6_1;

      // Excecution
      await component.submitForm();

      // Assertion
      expect(processFormService.createNotification).toHaveBeenCalledWith(component.model, NotificationType.NominalNotification6_1, new Map());
      expect(ifsg61Service.submitNotification).toHaveBeenCalledWith(notificationMock, component.notificationType);
    });

    it('should call createNotification and submitNotification on submitForm with 7.3 notification type', async () => {
      // Preparation
      const processFormService = (component as any)['processFormService'];
      const ifsg61Service = (component as any)['ifsg61Service'];
      const notificationMock = { common: { item: [] }, disease: { item: [] } };
      spyOn(processFormService, 'createNotification').and.returnValue(notificationMock);
      spyOn(ifsg61Service, 'submitNotification');

      (component as any).fieldSequence = { tabDiseaseCommon: [], tabQuestionnaire: [] };
      component.model = { foo: 'bar' };
      component.notificationType = (component as any).NotificationType.NonNominalNotification7_3;

      // Excecution
      await component.submitForm();

      // Assertion
      expect(processFormService.createNotification).toHaveBeenCalledWith(component.model, NotificationType.NonNominalNotification7_3, jasmine.any(Map));
      expect(ifsg61Service.submitNotification).toHaveBeenCalledWith(notificationMock, component.notificationType);
    });
  });

  describe('should display error dialog if error on init', () => {
    beforeEach(() => {
      helpersServiceSpy.exitApplication?.calls.reset();
      showErrorDialogSpy.calls.reset();
    });

    it('error while getCodeValueSet()', fakeAsync(() => {
      const error = new Error('Etwas ist schief gelaufen');
      getCodeValueSetSpy.and.returnValue(throwError(() => error));

      component.ngOnInit();
      expect(showErrorDialogSpy).toHaveBeenCalledOnceWith({
        redirectToHome: true,
        errorTitle: 'Systemfehler',
        errors: [
          {
            text: 'Typen nicht abrufbar',
          },
        ],
      });
    }));

    it('error while getDiseaseOptions()', fakeAsync(() => {
      const error = new Error('Etwas ist schief gelaufen');
      getDiseaseOptionsSpy.and.returnValue(throwError(() => error));
      component.ngOnInit();
      expect(showErrorDialogSpy).toHaveBeenCalledOnceWith({
        redirectToHome: true,
        errorTitle: 'Systemfehler',
        errors: [
          {
            text: 'Meldetatbestände nicht verfügbar',
          },
        ],
      });
    }));
  });

  describe('test transformDate3Input', () => {
    it('should append period to date of length 2', () => {
      component.previousDate3InputLength = 1;
      const transformedDate = component.transformDate3Input('01');
      expect(transformedDate).toEqual('01.');
    });

    it('should append period to date of length 5', () => {
      component.previousDate3InputLength = 4;
      const transformedDate = component.transformDate3Input('01.01');
      expect(transformedDate).toEqual('01.01.');
    });
  });

  describe('test transformDate123Input', () => {
    it('should format date of length 6 correctly', () => {
      const transformedDate = component.transformDate123Input('012024');
      expect(transformedDate).toEqual('01.2024');
    });

    it('should format date of length 8 correctly', () => {
      const transformedDate = component.transformDate123Input('01012024');
      expect(transformedDate).toEqual('01.01.2024');
    });

    it('should return the same date if length is not 6 or 8', () => {
      const transformedDate = component.transformDate123Input('2024');
      expect(transformedDate).toEqual('2024');
    });
  });

  describe('resetDiseaseChoiceDependentInput', () => {
    it('should reset the model and remove form controls', () => {
      // Preparation
      let formBuilder = new FormBuilder();
      component.form = formBuilder.group({
        tabDiseaseCondition: formBuilder.group({
          symptom1: new FormControl('Husten'),
        }),
        tabDiseaseCommon: formBuilder.group({
          allergy1: new FormControl('Pollen'),
        }),
        tabQuestionnaire: formBuilder.group({
          question1: new FormControl('Ja'),
        }),
      }) as any;
      component.model = {
        tabDiseaseCondition: { symptom1: 'Husten' },
        tabDiseaseCommon: { allergy1: 'Pollen' },
        tabQuestionnaire: { question1: 'Ja' },
      };

      // Execution
      component.resetDiseaseChoiceDependentInput();

      // Assertions
      // --> Model should be empty
      expect(component.model.tabDiseaseCondition).toEqual({});
      expect(component.model.tabDiseaseCommon).toEqual({});
      expect(component.model.tabQuestionnaire).toEqual({});

      // --> Controls should be empty
      const tabDiseaseConditionGroup = component.form.get('tabDiseaseCondition') as unknown as FormGroup;
      const tabDiseaseCommonGroup = component.form.get('tabDiseaseCommon') as unknown as FormGroup;
      const tabQuestionnaireGroup = component.form.get('tabQuestionnaire') as unknown as FormGroup;
      expect(tabDiseaseConditionGroup?.controls).toEqual({});
      expect(tabDiseaseCommonGroup?.controls).toEqual({});
      expect(tabQuestionnaireGroup?.controls).toEqual({});
    });
  });

  describe('notification type initialization', () => {
    it('should set notificationType to FollowUpNotification6_1 when follow-up flag is enabled and url matches', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE = true;
      Object.defineProperty(routerSpy, 'url', { value: allowedRoutes['followUp'], configurable: true });

      component.ngOnInit();

      expect(component.notificationType).toBe(NotificationType.FollowUpNotification6_1);
    });

    it('should set notificationType to NonNominalNotification7_3 when non-nominal flag is enabled and url matches', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = true;
      Object.defineProperty(routerSpy, 'url', { value: allowedRoutes['nonNominal'], configurable: true });

      component.ngOnInit();

      expect(component.notificationType).toBe(NotificationType.NonNominalNotification7_3);
    });

    it('should set notificationType to NominalNotification6_1 when flags are enabled but url is nominal', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE = true;
      Object.defineProperty(routerSpy, 'url', { value: allowedRoutes['nominal'], configurable: true });

      component.ngOnInit();

      expect(component.notificationType).toBe(NotificationType.NominalNotification6_1);
    });

    it('should keep default NominalNotification6_1 when feature flags are disabled', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE = false;
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = false;
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_ANONYMOUS_NOTIFICATION = false;
      Object.defineProperty(routerSpy, 'url', { value: allowedRoutes['followUp'], configurable: true });

      component.ngOnInit();

      expect(component.notificationType).toBe(NotificationType.NominalNotification6_1);
    });

    it('should call getDiseaseOptions with correct notification type', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE = true;
      Object.defineProperty(routerSpy, 'url', { value: allowedRoutes['followUp'], configurable: true });

      component.ngOnInit();

      expect(getDiseaseOptionsSpy).toHaveBeenCalledWith(NotificationType.FollowUpNotification6_1);
    });
  });

  describe('form footer rendering via feature flag', () => {
    it('should render gem-demis-forms-footer when FEATURE_FLAG_PORTAL_HEADER_FOOTER is true', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_PORTAL_HEADER_FOOTER = true;

      const fixture = MockRender(DiseaseFormComponent);
      fixture.detectChanges();

      const footerEl: HTMLElement | null = fixture.nativeElement.querySelector('gem-demis-forms-footer');
      expect(footerEl).toBeTruthy();
    });

    it('should not render gem-demis-forms-footer when FEATURE_FLAG_PORTAL_HEADER_FOOTER is false', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_PORTAL_HEADER_FOOTER = false;

      const fixture = MockRender(DiseaseFormComponent);
      fixture.detectChanges();

      const footerEl: HTMLElement | null = fixture.nativeElement.querySelector('gem-demis-forms-footer');
      expect(footerEl).toBeFalsy();
    });
  });
});
