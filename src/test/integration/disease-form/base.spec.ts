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

import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { AppModule } from '../../../app/app.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { ChangeDetectorRef } from '@angular/core';
import { TabsNavigationService } from '../../../app/shared/formly/components/tabs-navigation/tabs-navigation.service';
import { HelpersService } from '../../../app/shared/helpers.service';
import { ProgressService } from '../../../app/shared/progress.service';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { registerValueSetExtension } from '../../../app/legacy/value-set.extension';
import { ValueSetService } from '../../../app/legacy/value-set.service';
import { environment } from '../../../environments/environment';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { of } from 'rxjs';
import { EXAMPLE_DISEASE_OPTIONS, EXAMPLE_VALUE_SET } from '../../shared/data/test-values';
import { HarnessLoader } from '@angular/cdk/testing';
import { EXAMPLE_MSVD_SHORT } from '../../shared/data/test-values-short';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { PasteBoxComponent } from '@gematik/demis-portal-core-library';

const overrides = {
  get Ifsg61Service() {
    return {
      getCodeValueSet: jasmine.createSpy('getCodeValueSet').and.returnValue(of(EXAMPLE_VALUE_SET)),
      getDiseaseOptions: jasmine.createSpy('getDiseaseOptions').and.returnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getQuestionnaire: jasmine.createSpy('getQuestionnaire').and.returnValue(of(EXAMPLE_MSVD_SHORT)),
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
  featureFlags: {
    FEATURE_FLAG_HOSP_COPY_CHECKBOXES: true,
    FEATURE_FLAG_PORTAL_ERROR_DIALOG: true,
    FEATURE_FLAG_PORTAL_REPEAT: true,
    FEATURE_FLAG_PORTAL_PASTEBOX: true,
    FEATURE_FLAG_OUTLINE_DESIGN: true,
    FEATURE_FLAG_NON_NOMINAL_NOTIFICATION: true,
  },
  ngxLoggerConfig: {
    level: 1,
    disableConsoleLogging: false,
  },
};

export function buildMock() {
  return MockBuilder(DiseaseFormComponent)
    .keep(AppModule)
    .keep(NoopAnimationsModule)
    .keep(MatIconTestingModule)
    .keep(PasteBoxComponent)
    .provide(MockProvider(Ifsg61Service, overrides.Ifsg61Service))
    .provide(MockProvider(ChangeDetectorRef))
    .provide(TabsNavigationService) //Real service needs to be provided. Signals from service are used in disease-form template.
    .provide(MockProvider(HelpersService))
    .provide(MockProvider(ProgressService))
    .provide({
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerValueSetExtension,
      deps: [ValueSetService],
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
