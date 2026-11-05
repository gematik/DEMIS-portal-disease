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

import { FocusMonitor } from '@angular/cdk/a11y';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import {
  FollowUpMixedCodesService,
  FollowUpNotificationIdService,
  MessageDialogService,
  PasteBoxComponent,
  withDemisFormlyCore,
} from '@gematik/demis-portal-core-library';
import { FORMLY_CONFIG, FormlyModule, provideFormlyCore } from '@ngx-formly/core';
import { FormlyMaterialModule, withFormlyMaterial } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';
import { allowedRoutes, NotificationType } from '../../../app/demis-types';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { FormlyConstants } from '../../../app/legacy/formly-constants';
import { NotificationFormValidationModule } from '../../../app/legacy/notification-form-validation-module';
import { registerValueSetExtension } from '../../../app/legacy/value-set.extension';
import { ValueSetService } from '../../../app/legacy/value-set.service';
import { RepeatSectionComponent } from '../../../app/shared/formly/components/repeat-section/repeat-section.component';
import { TabsNavigationComponent } from '../../../app/shared/formly/components/tabs-navigation/tabs-navigation.component';
import { TabsNavigationService } from '../../../app/shared/formly/components/tabs-navigation/tabs-navigation.service';
import { APP_FORMLY_CONFIG } from '../../../app/shared/formly/formly-app-config';
import { ImportFieldValuesService } from '../../../app/disease-form/services/import-field-values.service';
import { CopyAndKeepInSyncService } from '../../../app/disease-form/services/copy-and-keep-in-sync-service';
import { environment } from '../../../environments/environment';
import { EXAMPLE_DISEASE_OPTIONS, EXAMPLE_DISEASE_OPTIONS_NONNOMINAL, EXAMPLE_VALUE_SET } from '../../shared/data/test-values';
import { EXAMPLE_TOXP_SHORT } from '../../shared/data/test-values-nonnominal';
import { EXAMPLE_MSVD_SHORT } from '../../shared/data/test-values-short';

const overrides = {
  get Ifsg61Service() {
    return {
      getCodeValueSet: vi.fn().mockReturnValue(of(EXAMPLE_VALUE_SET)),
      getDiseaseOptions: vi.fn().mockReturnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getQuestionnaire: vi.fn().mockReturnValue(of(EXAMPLE_MSVD_SHORT)),
      fetchFollowUpCode: vi.fn().mockReturnValue(of([])),
    } as Partial<Ifsg61Service>;
  },

  get ValueSetService() {
    return {
      get: vi.fn().mockImplementation((identifier: string) => {
        if (identifier === FormlyConstants.COUNTRY_CODES) {
          return of([
            { value: 'DE', label: 'Deutschland' },
            { value: 'DK', label: 'Dänemark' },
          ]);
        }
        return of([]);
      }),
    } as Partial<ValueSetService>;
  },
};

const overridesNonNominal = {
  get Ifsg61Service() {
    return {
      getCodeValueSet: vi.fn().mockReturnValue(of(EXAMPLE_VALUE_SET)),
      getDiseaseOptions: vi.fn().mockReturnValue(of(EXAMPLE_DISEASE_OPTIONS_NONNOMINAL)),
      getQuestionnaire: vi.fn().mockReturnValue(of(EXAMPLE_TOXP_SHORT)),
      fetchFollowUpCode: vi.fn().mockReturnValue(of([])),
    } as Partial<Ifsg61Service>;
  },
};

let component: DiseaseFormComponent;
let fixture: MockedComponentFixture<DiseaseFormComponent>;
let loader: HarnessLoader;

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
  pathToDestinationLookup: '/destination-lookup/v1',
  featureFlags: {
    FEATURE_FLAG_NON_NOMINAL_NOTIFICATION: true,
    FEATURE_FLAG_DISEASE_STRICT: true,
    FEATURE_FLAG_FOLLOW_UP_7_3: true,
  },
  ngxLoggerConfig: environment.defaultLoggerConfiguration,
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
  } else if (notificationType === NotificationType.FollowUpNotification7_3) {
    ifsg61Service = overridesNonNominal.Ifsg61Service;
    allowedRoutesMock = allowedRoutes['followUpNonNominal'];
  } else {
    ifsg61Service = overrides.Ifsg61Service;
    allowedRoutesMock = allowedRoutes['nominal'];
  }

  const followUpNotificationIdServiceMock = {
    hasValidNotificationId$: new BehaviorSubject<boolean>(false),
    openDialog: vi.fn(),
    closeDialog: vi.fn(),
    resetState: vi.fn(),
    followUpNotificationCategory: vi.fn().mockReturnValue(''),
    validatedNotificationId: vi.fn().mockReturnValue(''),
  } as any;

  const followUpMixedCodesServiceMock = {
    openDialog: vi.fn(),
  } as any;

  return MockBuilder(DiseaseFormComponent)
    .keep(MatIconTestingModule)
    .keep(PasteBoxComponent)
    .keep(TabsNavigationComponent)
    .keep(RepeatSectionComponent)
    .keep(FormlyMaterialModule)
    .keep(FormlyMatDatepickerModule)
    .keep(FormlyModule.forRoot(APP_FORMLY_CONFIG))
    .keep(NotificationFormValidationModule)
    .keep(ReactiveFormsModule)
    .keep(MatButtonModule)
    .keep(MatButton)
    .keep(FocusMonitor)
    .provide(provideRouter([]))
    .provide(provideFormlyCore([APP_FORMLY_CONFIG, ...withFormlyMaterial(), ...withDemisFormlyCore()]))
    .provide(MockProvider(Ifsg61Service, ifsg61Service))
    .provide(MockProvider(ValueSetService, valueSetService))
    .provide(MockProvider(ChangeDetectorRef))
    .provide(TabsNavigationService) //Real service needs to be provided. Signals from service are used in disease-form template.
    .provide(MessageDialogService)
    .provide(ImportFieldValuesService)
    .provide(CopyAndKeepInSyncService)
    .mock(NGXLogger)
    .provide({
      provide: FollowUpNotificationIdService,
      useValue: followUpNotificationIdServiceMock,
    })
    .provide({
      provide: FollowUpMixedCodesService,
      useValue: followUpMixedCodesServiceMock,
    })
    .provide({
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerValueSetExtension,
      deps: [ValueSetService],
    })
    .provide({
      provide: Router,
      useValue: {
        navigate: vi.fn(),
        currentNavigation: vi.fn(),
        url: allowedRoutesMock,
        routerState: { root: {} },
      },
    })
    .provide({
      provide: ActivatedRoute,
      useValue: { snapshot: { params: {} }, queryParams: of({}) },
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
