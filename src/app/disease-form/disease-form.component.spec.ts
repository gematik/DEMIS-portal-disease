/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */

import { DiseaseFormComponent } from './disease-form.component';
import { Ifsg61Service } from '../ifsg61.service';
import { of } from 'rxjs';
import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { AppModule } from '../app.module';
import { ProgressService } from '../shared/progress.service';
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
import { EXAMPLE_DISEASE_OPTIONS, EXAMPLE_MSVD, EXAMPLE_VALUE_SET } from '../../test/shared/data/test-values';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const overrides = {
  get Ifsg61Service() {
    return {
      getCodeValueSet: jasmine.createSpy('getCodeValueSet').and.returnValue(of(EXAMPLE_VALUE_SET)),
      getDiseaseOptions: jasmine.createSpy('getDiseaseOptions').and.returnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getQuestionnaire: jasmine.createSpy('getQuestionnaire').and.returnValue(of(EXAMPLE_MSVD)),
    } as Partial<Ifsg61Service>;
  },
};

describe('DiseaseFormComponent unit tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;

  beforeEach(() =>
    MockBuilder([DiseaseFormComponent, AppModule, NoopAnimationsModule])
      .provide(MockProvider(Ifsg61Service, overrides.Ifsg61Service))
      .provide(MockProvider(ChangeDetectorRef))
      .provide(TabsNavigationService) //Real service needs to be provided. Signals from service are used in disease-form template.
      .provide(MockProvider(HelpersService))
      .provide(MockProvider(ImportFieldValuesService))
      .provide(MockProvider(ProgressService))
      .provide(MockProvider(MatIconModule))
      .mock(MatIcon)
      .provide({
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerValueSetExtension,
        deps: [ValueSetService],
      })
  );

  beforeEach(() => {
    environment.diseaseConfig = {
      production: false,
      pathToGatewayDisease: '/gateway/notification/api/ng/notification/disease',
      pathToDisease: '/fhir-ui-data-model-translation/disease',
      pathToDiseaseQuestionnaire: '/fhir-ui-data-model-translation/disease/questionnaire',
      pathToFuts: '/fhir-ui-data-model-translation',
      featureFlags: {},
      ngxLoggerConfig: {
        level: 1,
        disableConsoleLogging: false,
      },
    };
    fixture = MockRender(DiseaseFormComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
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
});
