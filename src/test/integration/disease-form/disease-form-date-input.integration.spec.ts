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

import { HarnessLoader } from '@angular/cdk/testing';
import { MockedComponentFixture, MockProvider } from 'ng-mocks';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { buildMock, setupIntegrationTests } from './base';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { of } from 'rxjs';
import { EXAMPLE_MSVD_SHORT } from '../../shared/data/test-values-short';
import { EXAMPLE_DISEASE_OPTIONS, EXAMPLE_VALUE_SET } from '../../shared/data/test-values';
import { cloneDeep } from 'lodash-es';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { By } from '@angular/platform-browser';
import { CLINICAL_TAB_INDEX, DATE_FORMAT_TEST_CASES, MELDESTATBESTAND_TAB_INDEX } from '../../shared/data/date-format-test-cases';
import { dispatchChangeEvents, navigateToTabIndex, selectDisease, simulateTypingWithDOM } from '../utils/disease-common-utils';
import { EXAMPLE_CODESYSTEM_VERSIONS } from '../../shared/data/test-codesystem-versions';

type FormlyFieldConfigWithPotentialValidators = FormlyFieldConfig & {
  validators?: {
    validation?: string[];
  };
  fieldArray?: FormlyFieldConfig & {
    fieldGroup?: FormlyFieldConfig[];
  };
};

describe('Date input without dots integration test', () => {
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let component: DiseaseFormComponent;
  let loader: HarnessLoader;

  function getModifiedMockQuestionnaire(): typeof EXAMPLE_MSVD_SHORT {
    const modifiedMock = cloneDeep(EXAMPLE_MSVD_SHORT);
    const autoDotValidator = 'date3';
    const targetDateKeys = ['answer.valueDate', 'valueDate'];

    const getValidatorForKey = (key: string | number | symbol | undefined | (string | number)[]): string | null => {
      if (typeof key === 'string' && targetDateKeys.includes(key)) {
        return autoDotValidator;
      } else if (Array.isArray(key)) {
        for (const k of key) {
          if (typeof k === 'string' && targetDateKeys.includes(k)) {
            return autoDotValidator;
          }
        }
      }
      return null;
    };

    const addValidatorsRecursively = (fields: FormlyFieldConfig[] | undefined, path: string = '') => {
      if (!fields) return;

      fields.forEach((field, index) => {
        if (typeof field !== 'object' || field === null) return;
        const fieldConfig = field as FormlyFieldConfigWithPotentialValidators;
        const currentPath = `${path}[${index}](${fieldConfig.key || 'no-key'}/${fieldConfig.className || 'no-class'})`;

        const validatorToAdd = getValidatorForKey(fieldConfig.key);
        if (fieldConfig.key && validatorToAdd) {
          if (!fieldConfig.validators) fieldConfig.validators = {};
          if (!fieldConfig.validators.validation) fieldConfig.validators.validation = [];

          if (!fieldConfig.validators.validation.includes(validatorToAdd)) {
            fieldConfig.validators.validation.push(validatorToAdd);
          }
        }

        if (fieldConfig.fieldGroup) {
          addValidatorsRecursively(fieldConfig.fieldGroup, `${currentPath}.fieldGroup`);
        }
        if (fieldConfig.fieldArray?.fieldGroup) {
          addValidatorsRecursively(fieldConfig.fieldArray.fieldGroup, `${currentPath}.fieldArray.fieldGroup`);
        }
      });
    };

    addValidatorsRecursively(modifiedMock.conditionConfigs, 'conditionConfigs');
    addValidatorsRecursively(modifiedMock.commonConfig, 'commonConfig');

    return modifiedMock;
  }

  beforeEach(() => {
    const specificIfsg61ServiceMock = {
      getQuestionnaire: jasmine.createSpy('getQuestionnaire').and.returnValue(of(getModifiedMockQuestionnaire())),
      getCodeValueSet: jasmine.createSpy('getCodeValueSet').and.returnValue(of(EXAMPLE_VALUE_SET)),
      getDiseaseOptions: jasmine.createSpy('getDiseaseOptions').and.returnValue(of(EXAMPLE_DISEASE_OPTIONS)),
    } as jasmine.SpyObj<Ifsg61Service>;

    return buildMock().provide(MockProvider(Ifsg61Service, specificIfsg61ServiceMock, 'useValue'));
  });

  beforeEach(() => {
    const setup = setupIntegrationTests();
    fixture = setup.fixture;
    component = setup.component;
    loader = setup.loader;
    component.previousDate3InputLength = 0;
  });

  DATE_FORMAT_TEST_CASES.forEach(tc => {
    it(`should format "${tc.inputText}" to "${tc.expectedDate}" for ${tc.description}`, async () => {
      await navigateToTabIndex(loader, fixture, MELDESTATBESTAND_TAB_INDEX, 'Meldetatbestand');
      await selectDisease(loader, fixture, tc.disease.display);
      await fixture.whenStable();
      await navigateToTabIndex(loader, fixture, tc.tabIndex, tc.tabLabelForErrorMsg);

      if (tc.tabIndex === CLINICAL_TAB_INDEX) {
        let radioGroupSelector: string | null = null;

        if (tc.description.includes('hospitalization')) {
          radioGroupSelector = '.LinkId_hospitalized';
        } else if (tc.description.includes('infectProtectFacility')) {
          radioGroupSelector = '.LinkId_infectProtectFacility';
        } else if (tc.description.includes('placeExposure')) {
          radioGroupSelector = '.LinkId_placeExposure';
        } else if (tc.description.includes('deathDate')) {
          radioGroupSelector = '.LinkId_isDead';
        }

        if (radioGroupSelector) {
          try {
            const yesButtonHarness = await loader.getHarness(
              MatRadioButtonHarness.with({
                ancestor: radioGroupSelector,
                label: 'Ja',
              })
            );
            await yesButtonHarness.check();
            fixture.detectChanges();
            await fixture.whenStable();
          } catch (e) {
            throw e;
          }
        }
      }

      try {
        const inputHarness = await loader.getHarness(
          MatInputHarness.with({
            ancestor: tc.fieldSelector,
          })
        );

        await inputHarness.setValue('');
        await inputHarness.focus();
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css(`${tc.fieldSelector} input`));
        if (input && input.nativeElement) {
          await simulateTypingWithDOM(fixture, component, input.nativeElement, tc.inputText);
        } else {
          await inputHarness.setValue(tc.inputText);
          await dispatchChangeEvents(fixture, inputHarness);
        }

        await new Promise(resolve => setTimeout(resolve, 50));
        fixture.detectChanges();
        await fixture.whenStable();

        const actualValue = await inputHarness.getValue();
        expect(actualValue).withContext(`Field with ancestor ${tc.fieldSelector} on tab ${tc.tabLabelForErrorMsg}`).toBe(tc.expectedDate);
      } catch (error) {
        throw error;
      }
    });
  });
});
