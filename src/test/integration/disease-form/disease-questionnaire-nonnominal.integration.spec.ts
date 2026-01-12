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

import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture, MockRender } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { environment } from '../../../environments/environment';
import { selectDisease, selectTab } from '../utils/disease-common-utils';
import { buildMock, mainConfig } from './base';
import { getInput } from '../../shared/material-harness-utils';
import { checkDescribingError } from '../../shared/assertion-utils';
import { VALUE_INVALID_QUANTITY } from '../../shared/test-constants';
import { NotificationType } from '../../../app/demis-types';

describe('DiseaseFormComponent integration tests for Questionnaire Tab with §7.3 nonnominal notifications', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  beforeEach(() => buildMock(NotificationType.NonNominalNotification7_3));

  beforeEach(() => {
    environment.diseaseConfig = mainConfig;
    environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = true;

    fixture = MockRender(DiseaseFormComponent);
    component = fixture.point.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should have correct feature flags', async () => {
    expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION).toBeTrue();
  });

  describe('Spezifische Angaben - test validation for quantity field pregancyWeek', () => {
    const selector = 'input[id*="input_pregnancyWeek"]';
    let inputField: Awaited<ReturnType<typeof getInput>>;

    const expectNoValidationError = async () => {
      const describedby = await (await inputField.host()).getAttribute('aria-describedby');
      expect(describedby).toBeNull();
    };

    const typeAndExpectValue = async (value: string, expected: string) => {
      await inputField.setValue(value);
      expect(await inputField.getValue()).toBe(expected);
    };

    const blurAndExpectQuantityError = async () => {
      await inputField.blur();
      await checkDescribingError({
        fixture,
        element: inputField,
        expectedResult: VALUE_INVALID_QUANTITY,
      });
    };

    beforeEach(async () => {
      // Prep: select Toxoplasmose and switch to "Spezifische Angaben"
      await selectTab(fixture, loader, 3, true);
      await selectDisease(loader, fixture, /Toxoplasma/i);
      await fixture.whenStable();
      await selectTab(fixture, loader, 5, true);
      // test validation for input field pregancyWeek with input type number
      inputField = await getInput(loader, selector);
    });

    it('should not accept strings text', async () => {
      await typeAndExpectValue('Text', '');
    });

    it('should accept valid integer', async () => {
      await typeAndExpectValue('2', '2');
      await expectNoValidationError();
    });

    it('should accept valid decimal with dot', async () => {
      await typeAndExpectValue('2.5', '2.5');
      await expectNoValidationError();
    });

    /**
     * the user can only enter decimal numbers which are supported by the browsers they are using
     */
    it('should reject decimal with comma (Chrome behaviour)', async () => {
      await typeAndExpectValue('2,5', '');
    });

    /**
     * Min value for pregnancyWeek is 1
     * Max value for pregnancyWeek is 42
     */
    describe('Validation errors', () => {
      const invalidCases: Array<{ input: string; expectedEcho: string }> = [
        { input: '0', expectedEcho: '0' }, // too small
        { input: '42.1', expectedEcho: '42.1' }, // too big
        { input: '50', expectedEcho: '50' }, // too big
      ];

      for (const { input, expectedEcho } of invalidCases) {
        it(`should show error for invalid value: ${input}`, async () => {
          await typeAndExpectValue(input, expectedEcho);
          await blurAndExpectQuantityError();
        });
      }

      it('should show error when empty (no number entered)', async () => {
        await inputField.blur();
        await blurAndExpectQuantityError();
      });
    });
  });
});
