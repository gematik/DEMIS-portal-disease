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
import { checkDescribingError } from '../../shared/assertion-utils';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { getButton, getInput, getRadioGroup, navigateTo, selectRadioOption } from '../../shared/material-harness-utils';
import { buildMock, setupIntegrationTests } from './base';

import { TEST_PARAMETER_VALIDATION } from '../../shared/test-data';
import { getHtmlButtonElement } from '../../shared/html-element-utils';

describe('DiseaseFormComponent notified person regex integration tests', () => {
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

  describe('Überprüfung der korrekten Validierung der Eingaben zur betroffenen Person', () => {
    TEST_PARAMETER_VALIDATION.notifiedPerson.forEach(parameter => {
      it(`for the '${parameter.field}', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await navigateTo(loader, 1);
        const notifiedPersonInput = await getInput(loader, `#${parameter.field}`);
        await notifiedPersonInput.setValue(parameter.value);
        await notifiedPersonInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: notifiedPersonInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.residenceAddress.forEach(parameter => {
      it(`for the '${parameter.field}' in 'Hauptwohnung', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await navigateTo(loader, 1);
        const residenceAddressInput = await getInput(loader, `#${parameter.field}`);
        await residenceAddressInput.setValue(parameter.value);
        await residenceAddressInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: residenceAddressInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.residenceAddress.forEach(parameter => {
      it(`for the '${parameter.field}' in 'Gewöhnlicher Aufenthaltsort', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await navigateTo(loader, 1);
        const residenceAddressType = await getRadioGroup(loader, '#residenceAddressType');
        await selectRadioOption(residenceAddressType, 'Gewöhnlicher Aufenthaltsort');
        const residenceAddressInput = await getInput(loader, `#${parameter.field}`);
        await residenceAddressInput.setValue(parameter.value);
        await residenceAddressInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: residenceAddressInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.currentAddress.forEach(parameter => {
      it(`for the '${parameter.field}' in 'anderer Wohnsitz', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await navigateTo(loader, 1);
        const currentAddressType = await getRadioGroup(loader, '#currentAddressType');
        await selectRadioOption(currentAddressType, 'anderer Wohnsitz');
        const currentAddressInput = await getInput(loader, `#${parameter.field}`);
        await currentAddressInput.setValue(parameter.value);
        await currentAddressInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: currentAddressInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.currentAddress.concat(TEST_PARAMETER_VALIDATION.currentAddressInstitutionName).forEach(parameter => {
      it(`for the '${parameter.field}' in 'andere Einrichtung / Unterkunft', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await navigateTo(loader, 1);
        const currentAddressType = await getRadioGroup(loader, '#currentAddressType');
        await selectRadioOption(currentAddressType, 'andere Einrichtung / Unterkunft');
        const currentAddressInput = await getInput(loader, `#${parameter.field}`);
        await currentAddressInput.setValue(parameter.value);
        await currentAddressInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: currentAddressInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });

    TEST_PARAMETER_VALIDATION.phone.forEach(parameter => {
      it(`for the '${parameter.value}', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await navigateTo(loader, 1);
        await (await getButton(loader, '#phoneNumbers-add-button')).click();
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
        await navigateTo(loader, 1);
        await (await getButton(loader, '#emailAddresses-add-button')).click();
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
