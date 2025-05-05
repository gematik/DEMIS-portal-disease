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

import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { checkDescribingError } from '../../shared/assertion-utils';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { getButton, getInput } from '../../shared/material-harness-utils';
import { buildMock, setupIntegrationTests } from './base.spec';

import { TEST_PARAMETER_VALIDATION } from '../../shared/test-data';
import { getHtmlButtonElement } from '../../shared/html-element-utils';

describe('DiseaseFormComponent institution regex integration tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  // we need to have two beforeEach() steps, since a MockingComponent needs to be returned before working with it
  beforeEach(() => buildMock());

  beforeEach(() => {
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
  });

  describe('Überprüfung der korrekten Validierung der Eingaben zum Melder', () => {
    TEST_PARAMETER_VALIDATION.facilityInfo.forEach(parameter => {
      it(`for the '${parameter.field}', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        const facilityInfoInput = await getInput(loader, `#${parameter.field}`);
        await facilityInfoInput.setValue(parameter.value);
        await facilityInfoInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: facilityInfoInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.notifierFacilityAddress.forEach(parameter => {
      it(`for the '${parameter.field}', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        const notifierFacilityAddressInput = await getInput(loader, `#${parameter.field}`);
        await notifierFacilityAddressInput.setValue(parameter.value);
        await notifierFacilityAddressInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: notifierFacilityAddressInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.contactPerson.forEach(parameter => {
      it(`for the '${parameter.field}', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        const firstnameInput = await getInput(loader, `#${parameter.field}`);
        await firstnameInput.setValue(parameter.value);
        await firstnameInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: firstnameInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.phone.forEach(parameter => {
      it(`for phone number, the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await (await getButton(loader, '#btn-telefonnummer-hinzufügen')).click();
        const phoneNoInput = await getInput(loader, '[data-cy=phoneNo]');
        await phoneNoInput.setValue(parameter.value);
        await phoneNoInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: phoneNoInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.email.forEach(parameter => {
      it(`for email, the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await (await getButton(loader, '#btn-email-adresse-hinzufügen')).click();
        const emailInput = await getInput(loader, '[data-cy=email]');
        await emailInput.setValue(parameter.value);
        await emailInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: emailInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });
  });
});
