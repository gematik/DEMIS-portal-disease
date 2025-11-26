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

import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { AppModule } from '../../../app/app.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { ChangeDetectorRef } from '@angular/core';
import { TabsNavigationService } from '../../../app/shared/formly/components/tabs-navigation/tabs-navigation.service';
import { HelpersService } from '../../../app/shared/helpers.service';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { registerValueSetExtension } from '../../../app/legacy/value-set.extension';
import { ValueSetService } from '../../../app/legacy/value-set.service';
import { environment } from '../../../environments/environment';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BehaviorSubject, of } from 'rxjs';
import { EXAMPLE_COUNTRY_CODES, EXAMPLE_DISEASE_OPTIONS, EXAMPLE_DISEASE_OPTIONS_NONNOMINAL, EXAMPLE_VALUE_SET } from '../../shared/data/test-values';
import { HarnessLoader } from '@angular/cdk/testing';
import { EXAMPLE_MSVD_SHORT } from '../../shared/data/test-values-short';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { FollowUpNotificationIdService, PasteBoxComponent } from '@gematik/demis-portal-core-library';
import { EXAMPLE_TOXP_SHORT } from '../../shared/data/test-values-nonnominal';
import { Router } from '@angular/router';
import { allowedRoutes, NotificationType } from '../../../app/demis-types';
import { EXAMPLE_CODESYSTEM_VERSIONS } from '../../shared/data/test-codesystem-versions';

const overrides = {
  get Ifsg61Service() {
    return {
      getCodeValueSet: jasmine.createSpy('getCodeValueSet').and.returnValue(of(EXAMPLE_VALUE_SET)),
      getCodeSystemVersions: jasmine.createSpy('getCodeSystemVersions').and.returnValue(of(EXAMPLE_CODESYSTEM_VERSIONS)),
      getDiseaseOptions: jasmine.createSpy('getDiseaseOptions').and.returnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getQuestionnaire: jasmine.createSpy('getQuestionnaire').and.returnValue(of(EXAMPLE_MSVD_SHORT)),
    } as Partial<Ifsg61Service>;
  },

  get ValueSetService() {
    return {
      get: jasmine.createSpy('get').and.returnValue(of(EXAMPLE_COUNTRY_CODES)),
    };
  },
};

const overridesNonNominal = {
  get Ifsg61Service() {
    return {
      getCodeValueSet: jasmine.createSpy('getCodeValueSet').and.returnValue(of(EXAMPLE_VALUE_SET)),
      getCodeSystemVersions: jasmine.createSpy('getCodeSystemVersions').and.returnValue(of(EXAMPLE_CODESYSTEM_VERSIONS)),
      getDiseaseOptions: jasmine.createSpy('getDiseaseOptions').and.returnValue(of(EXAMPLE_DISEASE_OPTIONS_NONNOMINAL)),
      getQuestionnaire: jasmine.createSpy('getQuestionnaire').and.returnValue(of(EXAMPLE_TOXP_SHORT)),
    } as Partial<Ifsg61Service>;
  },
};

let component: DiseaseFormComponent;
let fixture: MockedComponentFixture<DiseaseFormComponent>;
let loader: HarnessLoader;

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
  pathToDestinationLookup: '/destination-lookup/v1',
  featureFlags: {
    FEATURE_FLAG_PORTAL_ERROR_DIALOG: true,
    FEATURE_FLAG_PORTAL_PASTEBOX: true,
    FEATURE_FLAG_OUTLINE_DESIGN: true,
    FEATURE_FLAG_NON_NOMINAL_NOTIFICATION: true,
    FEATURE_FLAG_DISEASE_DATEPICKER: false,
    FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE: true,
    FEATURE_FLAG_DISEASE_STRICT: true,
  },
  ngxLoggerConfig: {
    level: 1,
    disableConsoleLogging: false,
  },
};

export function buildMock(notificationType = NotificationType.NominalNotification6_1) {
  let ifsg61Service;
  let valueSetService;
  let allowedRoutesMock;
  valueSetService = overrides.ValueSetService;
  if (notificationType === NotificationType.NonNominalNotification7_3) {
    ifsg61Service = overridesNonNominal.Ifsg61Service;
    allowedRoutesMock = allowedRoutes['nonNominal'];
  } else if (notificationType === NotificationType.FollowUpNotification6_1) {
    ifsg61Service = overrides.Ifsg61Service;
    allowedRoutesMock = allowedRoutes['followUp'];
  } else {
    ifsg61Service = overrides.Ifsg61Service;
    allowedRoutesMock = allowedRoutes['nominal'];
  }

  const followUpNotificationIdServiceMock = {
    hasValidNotificationId$: new BehaviorSubject<boolean>(false),
    openDialog: jasmine.createSpy('openDialog'),
    resetState: jasmine.createSpy('resetState'),
    followUpNotificationCategory: jasmine.createSpy('followUpNotificationCategory').and.returnValue(''),
    validatedNotificationId: jasmine.createSpy('validatedNotificationId').and.returnValue(''),
  } as any;

  return MockBuilder(DiseaseFormComponent)
    .keep(AppModule)
    .keep(NoopAnimationsModule)
    .keep(MatIconTestingModule)
    .keep(PasteBoxComponent)
    .provide(MockProvider(Ifsg61Service, ifsg61Service))
    .provide(MockProvider(ValueSetService, valueSetService))
    .provide(MockProvider(ChangeDetectorRef))
    .provide(TabsNavigationService) //Real service needs to be provided. Signals from service are used in disease-form template.
    .provide(MockProvider(HelpersService))
    .provide({
      provide: FollowUpNotificationIdService,
      useValue: followUpNotificationIdServiceMock,
    })
    .provide({
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerValueSetExtension,
      deps: [ValueSetService],
    })
    .provide({
      provide: Router,
      useValue: jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation'], {
        url: allowedRoutesMock,
        routerState: { root: {} },
      }),
    });
}

export function setupIntegrationTests(customDiseaseConfig?: any) {
  environment.diseaseConfig = customDiseaseConfig ?? mainConfig;
  fixture = MockRender(DiseaseFormComponent);
  component = fixture.point.componentInstance;
  loader = TestbedHarnessEnvironment.loader(fixture);
  fixture.detectChanges();
  return {
    fixture: fixture,
    component: component,
    loader: loader,
  };
}
