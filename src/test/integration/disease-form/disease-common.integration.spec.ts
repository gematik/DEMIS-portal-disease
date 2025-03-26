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
import { MockedComponentFixture, MockRender } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { getMultipleInputFieldsWithSameSelector, getRadioGroup } from '../../shared/material-harness-utils';
import { environment } from '../../../environments/environment';
import { clickButtonWithSelector, setInputFieldValues } from '../../shared/test-utils';
import { exampleAddressOfType, NOTIFIER_FACILITY, TestDataAddress } from '../../shared/data/test-objects';
import {
  checkCopyAddressCheckbox,
  checkCopyContactCheckbox,
  fillNotifiedPersonCurrentAddressOtherFacility,
  fillNotifierContact,
  moveFromNotifiedPersonToKlinischeAngaben,
  selectIsHospitalizedYes,
  selectNotifiedPersonCurrentAddressSubmittingFacility,
  selectTab,
  verifyCheckBoxCopyAddressIsChecked,
  verifyCheckBoxCopyContactIsChecked,
  verifyCopyAddressCheckBoxIsUnchecked,
  verifyHospitalizationAddressInputFields,
  verifyHospitalizationContactInputFields,
} from '../utils/disease-common-utils';
import { NOTIFIER_PERSON_CONTACT_INPUT } from '../../shared/test-data';
import { CLIPBOARD_VALUE_HOUSENR, CLIPBOARD_VALUE_STREET, FIELD_CURRENT_ADDRESS_HOUSE_NUMBER, FIELD_CURRENT_ADDRESS_ZIP } from '../../shared/test-constants';
import { AddressType } from '../../../api/notification';
import { buildMock, mainConfig } from './base.spec';

describe('DiseaseFormComponent integration tests for Common Tab', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;
  const exampleAddress: TestDataAddress = exampleAddressOfType(AddressType.OtherFacility);

  beforeEach(() => buildMock());

  beforeEach(() => {
    environment.diseaseConfig = mainConfig;

    // preparation: set notifier facility set in local storage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(NOTIFIER_FACILITY));

    fixture = MockRender(DiseaseFormComponent);
    component = fixture.point.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should have correct feature flags', async () => {
    expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_HOSP_COPY_CHECKBOXES).toBeTrue();
  });

  describe('Klinische und epidemiologische Angaben', () => {
    beforeEach(async () => {
      await selectTab(fixture, loader, 2);
    });

    describe('Hospitalized question, testing copy address checkbox', () => {
      describe('Testing errors in case that data is empty', () => {
        beforeEach(async () => {
          await moveFromNotifiedPersonToKlinischeAngaben(fixture, loader);
        });

        it('should verify that copy address is not working for empty data', async () => {
          await selectIsHospitalizedYes(loader);
          const checkBox = await checkCopyAddressCheckbox(loader);
          fixture.detectChanges();
          expect(await checkBox.isChecked()).toBe(false);
          await verifyHospitalizationAddressInputFields(loader);
        });

        it('should verify that copy contact is not working when required field is missing', async () => {
          // steps to take
          await selectTab(fixture, loader, 1);
          await setInputFieldValues(loader, [{ selector: '#firstname', value: 'Test' }]);
          await selectTab(fixture, loader, 5);
          await selectIsHospitalizedYes(loader);
          const checkBox = await checkCopyContactCheckbox(loader);
          fixture.detectChanges();

          // assertion
          expect(await checkBox.isChecked()).toBe(false);
          await verifyHospitalizationContactInputFields(loader);
        });

        it('should verify that copy address is not working when required field is missing', async () => {
          // steps to take
          await selectTab(fixture, loader, 2);
          await fillNotifiedPersonCurrentAddressOtherFacility(loader, fixture, exampleAddress);
          await setInputFieldValues(loader, [{ selector: `#${FIELD_CURRENT_ADDRESS_ZIP}`, value: '' }]);
          await selectTab(fixture, loader, 5);
          await selectIsHospitalizedYes(loader);
          const checkBox = await checkCopyAddressCheckbox(loader);
          fixture.detectChanges();

          // assertion
          expect(await checkBox.isChecked()).toBe(false);
          await verifyHospitalizationAddressInputFields(loader);
        });
      });

      describe('Address data available in notifier facility, selected submittingFacility in notified person currentAddressType', () => {
        beforeEach(async () => {
          await selectNotifiedPersonCurrentAddressSubmittingFacility(loader, fixture);
          await moveFromNotifiedPersonToKlinischeAngaben(fixture, loader);
        });

        it('should verify default state of radio buttons in hospitalized question', async () => {
          // preparation
          const radioGroup = await getRadioGroup(loader, '#radio-group-LinkId_hospitalized');
          const hospitalizedRadioGroup = await radioGroup.getRadioButtons();
          fixture.detectChanges();

          // assertion
          expect(hospitalizedRadioGroup.length).toBe(4);
          expect(await hospitalizedRadioGroup[0].isChecked()).toBe(true);
          expect(await hospitalizedRadioGroup[3].isChecked()).toBe(false);
        });

        it('should verify that yes was selected in hospitalized question', async () => {
          // steps to take
          const radioGroup = await getRadioGroup(loader, '#radio-group-LinkId_hospitalized');
          const hospitalizedRadioGroup = await radioGroup.getRadioButtons();
          await selectIsHospitalizedYes(loader);

          // assertion
          expect(await hospitalizedRadioGroup[0].isChecked()).toBe(false);
          expect(await hospitalizedRadioGroup[3].isChecked()).toBe(true);
          fixture.detectChanges();
          await verifyHospitalizationAddressInputFields(loader);
        });

        it('should verify checkbox selection address copy function', async () => {
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyAddressIsChecked(loader);
          await verifyHospitalizationAddressInputFields(loader, {
            name: NOTIFIER_FACILITY.facilityInfo.institutionName,
            street: NOTIFIER_FACILITY.address.street,
            houseNr: NOTIFIER_FACILITY.address.houseNumber,
            city: NOTIFIER_FACILITY.address.city,
            zip: NOTIFIER_FACILITY.address.zip,
            country: 'Germany',
          });
        });

        it('should verify unselect checkbox removes data from input fields', async () => {
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyAddressIsChecked(loader);
          await verifyCopyAddressCheckBoxIsUnchecked(loader);
          await verifyHospitalizationAddressInputFields(loader);
        });

        it('should verify select checkbox works for multiple panels', async () => {
          // Step 1: preparation - copy address in first panel
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyAddressIsChecked(loader);
          // Step 2: add second panel
          await clickButtonWithSelector(fixture, '#add-button-REPEATER-LinkId_hospitalizedGroup');
          // Step 3: verify that second panel address is empty but first panel address is filled with data
          const multipleFields = await getMultipleInputFieldsWithSameSelector(loader, 'input[id*="input_street.answer"]');
          expect(await multipleFields[0].getValue()).toBe(NOTIFIER_FACILITY.address.street);
          expect(await multipleFields[1].getValue()).toBe('');
        });

        it('should verify checking the checkbox and changing content in NotifierFacility currentaddress also changes content in hospitalized address', async () => {
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyAddressIsChecked(loader);
          await selectTab(fixture, loader, 1);
          await setInputFieldValues(loader, [{ selector: '#street', value: CLIPBOARD_VALUE_STREET }]);
          await selectTab(fixture, loader, 5);
          await verifyHospitalizationAddressInputFields(loader, {
            name: NOTIFIER_FACILITY.facilityInfo.institutionName,
            street: CLIPBOARD_VALUE_STREET,
            houseNr: NOTIFIER_FACILITY.address.houseNumber,
            city: NOTIFIER_FACILITY.address.city,
            zip: NOTIFIER_FACILITY.address.zip,
            country: 'Germany',
          });
        });
      });

      describe('Address data available in notified person, selected otherFacility in notified person currentAddressType', () => {
        beforeEach(async () => {
          await fillNotifiedPersonCurrentAddressOtherFacility(loader, fixture, exampleAddress);
          await moveFromNotifiedPersonToKlinischeAngaben(fixture, loader);
        });

        it('should verify changing currentaddress to submitting facility clears data', async () => {
          // Step 1: copy address via checkbox
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyAddressIsChecked(loader);
          await verifyHospitalizationAddressInputFields(loader, {
            name: exampleAddress.institutionName.manualValue,
            street: exampleAddress.street.manualValue,
            houseNr: exampleAddress.houseNumber.manualValue,
            zip: exampleAddress.zip.manualValue,
            city: exampleAddress.city.manualValue,
            country: 'Germany',
          });
          fixture.detectChanges();

          // Step 2: change currentAddress
          await selectTab(fixture, loader, 2);
          fixture.detectChanges();
          await selectNotifiedPersonCurrentAddressSubmittingFacility(loader, fixture);
          fixture.detectChanges();

          // Step 3: verify that hospitalized address is empty
          await selectTab(fixture, loader, 5);
          fixture.detectChanges();
          await verifyCopyAddressCheckBoxIsUnchecked(loader);
          await verifyHospitalizationAddressInputFields(loader);
        });

        it('should verify changing currentaddress fields also changes data in hospitalization', async () => {
          // Step 1: copy address via checkbox
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyAddressIsChecked(loader);
          await verifyHospitalizationAddressInputFields(loader, {
            name: exampleAddress.institutionName.manualValue,
            street: exampleAddress.street.manualValue,
            houseNr: exampleAddress.houseNumber.manualValue,
            zip: exampleAddress.zip.manualValue,
            city: exampleAddress.city.manualValue,
            country: 'Germany',
          });

          // Step 2: change currentAddress
          await selectTab(fixture, loader, 2);
          await setInputFieldValues(loader, [
            {
              selector: `#${FIELD_CURRENT_ADDRESS_HOUSE_NUMBER}`,
              value: CLIPBOARD_VALUE_HOUSENR,
            },
          ]);

          // Step 3: verify that hospitalized address is changed
          await selectTab(fixture, loader, 5);
          fixture.detectChanges();

          await verifyHospitalizationAddressInputFields(loader, {
            name: exampleAddress.institutionName.manualValue,
            street: exampleAddress.street.manualValue,
            houseNr: CLIPBOARD_VALUE_HOUSENR,
            zip: exampleAddress.zip.manualValue,
            city: exampleAddress.city.manualValue,
            country: 'Germany',
          });
        });

        it('should verify having 2 panels but only checking 1st checkbox and changing currentAddress should only affect 1st panel input fields', async () => {
          // Step 1: copy address in first panel
          await selectIsHospitalizedYes(loader);
          fixture.detectChanges();
          await verifyCheckBoxCopyAddressIsChecked(loader);
          fixture.detectChanges();
          // Step 2: add second panel
          await clickButtonWithSelector(fixture, '#add-button-REPEATER-LinkId_hospitalizedGroup');
          fixture.detectChanges();
          // Step 3: verify that second panel address is empty but first panel address is filled with data
          const multipleFields = await getMultipleInputFieldsWithSameSelector(loader, 'input[id*="input_street.answer"]');
          expect(await multipleFields[0].getValue()).toBe(exampleAddress.street.manualValue);
          expect(await multipleFields[1].getValue()).toBe('');

          //Step 3a: enter street in second panel
          await multipleFields[1].setValue(CLIPBOARD_VALUE_STREET);
          await multipleFields[1].blur();
          fixture.detectChanges();

          // Step 4: change currentAddress
          await selectTab(fixture, loader, 2);
          fixture.detectChanges();

          await selectNotifiedPersonCurrentAddressSubmittingFacility(loader, fixture);
          fixture.detectChanges();

          // Step 5: verify that hospitalized address is reset only in first panel
          await selectTab(fixture, loader, 5);
          fixture.detectChanges();

          expect(await multipleFields[0].getValue()).toBe('');
          fixture.detectChanges();
          expect(await multipleFields[1].getValue()).toBe(CLIPBOARD_VALUE_STREET);
        });
      });
    });

    describe('Hospitalized question, testing copy contact checkbox', () => {
      describe('Testing errors in case that data is empty', () => {
        beforeEach(async () => {
          await moveFromNotifiedPersonToKlinischeAngaben(fixture, loader);
        });

        it('should verify that copy contact is not working for empty data', async () => {
          await selectIsHospitalizedYes(loader);
          const checkBox = await checkCopyContactCheckbox(loader);
          fixture.detectChanges();

          await verifyHospitalizationContactInputFields(loader);
          expect(await checkBox.isChecked()).toBe(false);
        });
      });

      describe('Contact data set in notified person', () => {
        beforeEach(async () => {
          await selectNotifiedPersonCurrentAddressSubmittingFacility(loader, fixture);
          await moveFromNotifiedPersonToKlinischeAngaben(fixture, loader);
        });

        it('should verify copy contact to hospitalized question works', async () => {
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyContactIsChecked(loader);
          await verifyHospitalizationContactInputFields(loader, {
            prefix: NOTIFIER_FACILITY.contact.prefix,
            given: NOTIFIER_FACILITY.contact.firstname,
            family: NOTIFIER_FACILITY.contact.lastname,
            phone: NOTIFIER_FACILITY.contacts.phoneNumbers[0].value,
            email: NOTIFIER_FACILITY.contacts.emailAddresses[0].value,
          });
        });

        it('should verify changing contact also changes content in hospitalized contact', async () => {
          // Step 1: copy contact via checkbox
          await selectIsHospitalizedYes(loader);
          await verifyCheckBoxCopyContactIsChecked(loader);
          await verifyHospitalizationContactInputFields(loader, {
            prefix: NOTIFIER_FACILITY.contact.prefix,
            given: NOTIFIER_FACILITY.contact.firstname,
            family: NOTIFIER_FACILITY.contact.lastname,
            phone: NOTIFIER_FACILITY.contacts.phoneNumbers[0].value,
            email: NOTIFIER_FACILITY.contacts.emailAddresses[0].value,
          });

          // Step 2: change contact
          await selectTab(fixture, loader, 1);
          await fillNotifierContact(loader, NOTIFIER_PERSON_CONTACT_INPUT);

          // Step 3: verify that hospitalized contact is changed
          await selectTab(fixture, loader, 5);
          fixture.detectChanges();
          await fixture.whenStable();
          await verifyHospitalizationContactInputFields(loader, {
            given: NOTIFIER_PERSON_CONTACT_INPUT[0].value,
            family: NOTIFIER_PERSON_CONTACT_INPUT[1].value,
            prefix: NOTIFIER_PERSON_CONTACT_INPUT[2].value,
            phone: NOTIFIER_PERSON_CONTACT_INPUT[3].value,
            email: NOTIFIER_PERSON_CONTACT_INPUT[4].value,
          });
        });
      });
    });
  });
});
