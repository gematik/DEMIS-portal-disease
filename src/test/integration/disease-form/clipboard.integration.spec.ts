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

import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { getButton, getInput, getRadioGroup, getSelect } from '../../shared/material-harness-utils';

import {
  CLIPBOARD_DISEASE,
  CLIPBOARD_FACILITY,
  CLIPBOARD_HOSPITALIZED,
  CLIPBOARD_NOTIFIER,
  CURRENT_ADDRESS_TYPE_ANDERER_WOHNSITZ,
  CURRENT_ADDRESS_TYPE_SUBMITTING_FACILITY,
  RESIDENCE_ADDRESS_TYPE_HAUPTWOHNUNG,
} from '../../shared/test-data';
import { clickNextButton } from '../../shared/test-utils';
import { AddressType } from '../../../api/notification';
import { MatSelectHarness } from '@angular/material/select/testing';
import { buildMock, setupIntegrationTests } from './base.spec';
import {
  getStepHeader,
  selectTab,
  verifyCheckBoxCopyAddressIsChecked,
  verifyCheckBoxCopyAddressIsUnchecked,
  verifyCheckBoxCopyContactIsChecked,
  verifyHospitalizationAddressInputFields,
  verifyHospitalizationContactInputFields,
  verifySelectedMeldetatbestand,
} from '../utils/disease-common-utils';
import {
  CLIPBOARD_VALUE_NOTIFIER_FAMILY,
  CLIPBOARD_VALUE_NOTIFIER_GIVEN,
  CLIPBOARD_VALUE_OTHER_NOTIFIER_FAMILY,
  CLIPBOARD_VALUE_OTHER_NOTIFIER_GIVEN,
} from '../../shared/test-constants';
import { exampleAddressOfType, TestDataAddress } from '../../shared/data/test-objects';

describe('User fills in form through clipboard', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  // we need to have two beforeEach() steps, since a MockingComponent needs to be returned before working with it
  beforeEach(() => buildMock());

  beforeEach(() => {
    localStorage.clear();
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
  });

  describe('NotifierFacility', () => {
    beforeEach(async () => {
      expect(fixture.nativeElement.textContent).toContain('Name der Einrichtung');
    });

    describe('Validation of salutation when using clipboard data button', () => {
      let salutationSelect: MatSelectHarness;

      beforeEach(async () => {
        salutationSelect = await getSelect(loader, '#salutation');
        expect(await salutationSelect.getValueText()).toBe('');
      });

      it('should not set invalid salutation', async () => {
        await userImportsDataThroughClipboard('URL N.salutation=W');
        expect(await salutationSelect.getValueText()).toBe('');
      });

      it('should set valid female value from clipboard', async () => {
        await userImportsDataThroughClipboard('URL N.salutation=Mrs');
        expect(await salutationSelect.getValueText()).toBe('Frau');
      });

      it('should set valid none value from clipboard', async () => {
        await userImportsDataThroughClipboard('URL N.salutation=None');
        expect(await salutationSelect.getValueText()).toBe('Keine Anrede');
      });
    });
  });
  describe('Focus on notified person', () => {
    beforeEach(async () => {
      await clickNextButton(fixture);
      expect(fixture.nativeElement.textContent).toContain('Wohnsitz');
    });

    describe('user imports residence address', () => {
      describe('residence address is of type primary ("Hauptwohnung")', () => {
        it('the address fields are set as expected', async () => {
          //preparation
          const residenceAddressProperties: {
            key: any;
            value: any;
            matchingSelector: any;
          }[] = RESIDENCE_ADDRESS_TYPE_HAUPTWOHNUNG;
          const clipboardString = createClipboardStringWithSpecifiedProperties(residenceAddressProperties);

          //execution
          await userImportsDataThroughClipboard(clipboardString);

          //assertion
          await checkSuccessOfImportThroughClipboard(residenceAddressProperties);
        });
        it('radio button "primary" should be checked', async () => {
          const radioGroup = await getRadioGroup(loader, '#residenceAddressType');
          expect(await radioGroup.getCheckedValue()).toBe(AddressType.Primary);
        });
      });
    });

    describe('user imports current address', () => {
      describe('current address is of type current ("anderer Wohnsitz")', async () => {
        const currentAddressProperties: {
          key: any;
          value: any;
          matchingSelector: any;
        }[] = CURRENT_ADDRESS_TYPE_ANDERER_WOHNSITZ;
        const clipboardString = createClipboardStringWithSpecifiedProperties(currentAddressProperties);

        describe('the fields are imported and reset when the user changes the address type in the GUI', () => {
          it('address type at the beginning of clipboard string', async () => {
            //Preparation: user clicks on radio 'anderer Wohnsitz'
            //without this initial step the test fails, I couldn't identify why and had to compromise to this workaround
            const radioGroup = await getRadioGroup(loader, '#currentAddressType');
            await radioGroup.checkRadioButton({ label: 'anderer Wohnsitz' });

            //Step 1: import
            await userImportsDataThroughClipboard(clipboardString);
            await checkSuccessOfImportThroughClipboard(currentAddressProperties);

            //Step 2: change the address type
            await radioGroup.checkRadioButton({ label: 'andere Einrichtung / Unterkunft' });
            await propertiesHaveBeenReset(currentAddressProperties, loader);
          });

          it('address type at the end of clipboard string', async () => {
            //Preparation
            const clipBoardRawDataWithAddressTypeAtTheEnd = [...currentAddressProperties.slice(1), currentAddressProperties[0]];
            const radioGroup = await getRadioGroup(loader, '#currentAddressType');
            await radioGroup.checkRadioButton({ label: 'anderer Wohnsitz' });
            const clipboardStringAddressTypeAtTheEnd = createClipboardStringWithSpecifiedProperties(currentAddressProperties);

            //Step 1: import
            await userImportsDataThroughClipboard(clipboardStringAddressTypeAtTheEnd);
            await checkSuccessOfImportThroughClipboard(clipBoardRawDataWithAddressTypeAtTheEnd);

            //Step 2: change the address type
            await radioGroup.checkRadioButton({ label: 'andere Einrichtung / Unterkunft' });
            await propertiesHaveBeenReset(clipBoardRawDataWithAddressTypeAtTheEnd, loader);
          });
        });
      });
    });
  });

  describe('Focus on Common Questions', () => {
    beforeEach(async () => {
      expect(getStepHeader(fixture)).toBe('Meldende Person');
    });

    describe('user imports data for hospitalization including data for notified person and notifier facility', () => {
      it('with submittingFacility, contact data is overwritten afterward clipboard import by checkbox', async () => {
        //preparation
        const residenceAddressProperties: {
          key: any;
          value: any;
          matchingSelector: any;
        }[] = CLIPBOARD_HOSPITALIZED.concat(CLIPBOARD_FACILITY)
          .concat(CLIPBOARD_NOTIFIER)
          .concat(CURRENT_ADDRESS_TYPE_SUBMITTING_FACILITY)
          .concat(CLIPBOARD_DISEASE)
          .concat(CLIPBOARD_HOSPITALIZED);
        const clipboardString = createClipboardStringWithSpecifiedProperties(residenceAddressProperties);

        //execution
        await userImportsDataThroughClipboard(clipboardString);

        // clipboard jumps to page 3
        await verifySelectedMeldetatbestand(fixture, loader);
        await selectTab(fixture, loader, 5);

        //assertion
        await verifyHospitalizationContactInputFields(loader, {
          given: CLIPBOARD_VALUE_OTHER_NOTIFIER_GIVEN,
          family: CLIPBOARD_VALUE_OTHER_NOTIFIER_FAMILY,
        });

        await verifyCheckBoxCopyContactIsChecked(loader);

        await verifyHospitalizationContactInputFields(loader, {
          given: CLIPBOARD_VALUE_NOTIFIER_GIVEN,
          family: CLIPBOARD_VALUE_NOTIFIER_FAMILY,
        });
      });

      it('with otherFacility, address data is overwritten afterward clipboard import by checkbox', async () => {
        //preparation
        //preparation
        const residenceAddressProperties: {
          key: any;
          value: any;
          matchingSelector: any;
        }[] = CLIPBOARD_HOSPITALIZED.concat(CLIPBOARD_FACILITY)
          .concat(CLIPBOARD_NOTIFIER)
          .concat(CURRENT_ADDRESS_TYPE_SUBMITTING_FACILITY)
          .concat(CLIPBOARD_DISEASE)
          .concat(CLIPBOARD_HOSPITALIZED);
        const clipboardString = createClipboardStringWithSpecifiedProperties(residenceAddressProperties);

        //execution
        await userImportsDataThroughClipboard(clipboardString);

        // clipboard jumps to page 3
        await verifySelectedMeldetatbestand(fixture, loader);
        await selectTab(fixture, loader, 5);

        //assertion
        await verifyHospitalizationContactInputFields(loader, {
          given: CLIPBOARD_VALUE_OTHER_NOTIFIER_GIVEN,
          family: CLIPBOARD_VALUE_OTHER_NOTIFIER_FAMILY,
        });

        await verifyCheckBoxCopyContactIsChecked(loader);

        await verifyHospitalizationContactInputFields(loader, {
          given: CLIPBOARD_VALUE_NOTIFIER_GIVEN,
          family: CLIPBOARD_VALUE_NOTIFIER_FAMILY,
        });
      });

      it('data imported through clipboard are overwritten by checkbox and then reset when checkbox unchecked', async () => {
        //preparation
        const exampleAddress: TestDataAddress = exampleAddressOfType(AddressType.OtherFacility);

        const residenceAddressProperties: {
          key: any;
          value: any;
          matchingSelector: any;
        }[] = CLIPBOARD_HOSPITALIZED.concat(CLIPBOARD_FACILITY).concat(CLIPBOARD_NOTIFIER).concat(CLIPBOARD_DISEASE).concat(CLIPBOARD_HOSPITALIZED);

        const partialClipboardStringFromAddress = createClipboardStringFromObject(exampleAddress, '&');
        const clipboardString = createClipboardStringWithSpecifiedProperties(residenceAddressProperties).concat(partialClipboardStringFromAddress);

        //execution
        await userImportsDataThroughClipboard(clipboardString);
        await selectTab(fixture, loader, 5);
        await verifyCheckBoxCopyAddressIsChecked(loader);
        await verifyCheckBoxCopyAddressIsUnchecked(loader);

        // check all fields are empty
        await verifyHospitalizationAddressInputFields(loader, {
          name: '',
          city: '',
          houseNr: '',
          street: '',
          zip: '',
          country: '',
        });
      });
    });
  });

  // Helper functions --------------------------------------------------------------------------------
  async function checkSuccessOfImportThroughClipboard(
    currentAddressProperties: {
      key: any;
      value: any;
      matchingSelector: any;
    }[]
  ) {
    fixture.detectChanges();
    for (const { key, value, matchingSelector } of currentAddressProperties.filter(it => it.matchingSelector !== '')) {
      const inputField = await getInput(loader, matchingSelector);
      const fieldValue = await inputField.getValue();
      // Custom error message for each property
      expect(fieldValue)
        .withContext(`For key: '${key}', the value for input field '${matchingSelector}' should be '${value}', but got '${fieldValue}'`)
        .toBe(value);
    }
  }

  async function propertiesHaveBeenReset(
    currentAddressProperties: {
      key: any;
      value: any;
      matchingSelector: any;
    }[],
    loader: HarnessLoader
  ) {
    for (const selector of currentAddressProperties.filter(it => it.matchingSelector !== '').map(it => it.matchingSelector)) {
      const inputField = await getInput(loader, selector);
      const fieldValue = await inputField.getValue();
      expect(fieldValue).withContext(`The value for input field '${selector}' should be empty, but got '${fieldValue}'`).toEqual('');
    }
  }

  function createClipboardStringFromObject(exampleAddress: TestDataAddress, start: string) {
    return (
      start +
      Object.values(exampleAddress)
        .map(property => `${property.clipboardKey}=${property.clipboardValue}`)
        .join('&')
    );
  }

  function createClipboardStringWithSpecifiedProperties(
    properties: {
      key: any;
      value: any;
      matchingSelector: any;
    }[]
  ): string {
    const queryParams = properties.map(prop => `${prop.key}=${prop.value}`).join('&');
    return `URL ${queryParams}`;
  }

  async function userImportsDataThroughClipboard(clipboardString: string) {
    spyOn(window.navigator.clipboard, 'readText').and.returnValue(Promise.resolve(clipboardString));
    spyOn(window.navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    await getButton(loader, '#btn-fill-form').then(btn => btn.click());
    fixture.detectChanges();
    await fixture.whenStable();
  }
});
