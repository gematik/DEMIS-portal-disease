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

import { getCheckBox, getInput, getRadioButton, getRadioGroup, selectRadioOption, getAutocomplete, getTabGroup } from '../../shared/material-harness-utils';
import { HarnessLoader } from '@angular/cdk/testing';
import { FIELD_CURRENT_ADDRESS_TYPE } from '../../shared/test-constants';
import { AddressType } from '../../../api/notification';
import { NOTIFIED_PERSON_CONTACT_INPUT } from '../../shared/test-data';
import { setInputFieldValues, verifyInputFieldValues } from '../../shared/test-utils';
import { MockedComponentFixture } from 'ng-mocks';
import { ComponentFixture } from '@angular/core/testing';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { TestDataAddress } from '../../shared/data/test-objects';
import { MatInputHarness } from '@angular/material/input/testing';

export async function selectIsHospitalizedYes(loader: HarnessLoader) {
  const selectButton = await getRadioButton(loader, '#radio-button-LinkId_hospitalized-Ja');
  await selectButton.check();
  await selectButton.blur();
}

export async function verifyCheckBoxCopyAddressIsChecked(loader: HarnessLoader) {
  const checkBox = await checkCopyAddressCheckbox(loader);
  expect(await checkBox.isChecked()).toBe(true);
  await checkBox.blur();
}

export async function verifyCheckBoxCopyAddressIsUnchecked(loader: HarnessLoader) {
  const checkBox = await checkCopyAddressCheckbox(loader, false);
  expect(await checkBox.isChecked()).toBe(false);
  await checkBox.blur();
}

export async function verifyCheckBoxCopyContactIsChecked(loader: HarnessLoader) {
  const checkBox = await checkCopyContactCheckbox(loader);
  expect(await checkBox.isChecked()).toBe(true);
  await checkBox.blur();
}

export async function checkCopyAddressCheckbox(loader: HarnessLoader, checked = true) {
  const checkBox = await getCheckBox(loader, '#copyNotifiedPersonCurrentAddress');
  if (checked) {
    await checkBox.check();
  } else {
    await checkBox.uncheck();
  }
  return checkBox;
}

export async function checkCopyContactCheckbox(loader: HarnessLoader) {
  const checkBox = await getCheckBox(loader, '#copyNotifierContact');
  await checkBox.check();
  return checkBox;
}

export async function verifyCopyAddressCheckBoxIsUnchecked(loader: HarnessLoader) {
  const checkBox = await getCheckBox(loader, '#copyNotifiedPersonCurrentAddress');
  await checkBox.uncheck();
  expect(await checkBox.isChecked()).toBe(false);
  await checkBox.blur();
}

export async function verifyHospitalizationAddressInputFields(
  loader: HarnessLoader,
  expectedAddress: {
    name: string;
    street: string;
    houseNr: string;
    city: string;
    zip: string;
    country: string;
  } = { name: '', street: '', houseNr: '', city: '', zip: '', country: '' }
) {
  await verifyInputFieldValues(loader, [
    {
      selector: 'input[id*="input_street.answer"]',
      expectedValue: expectedAddress.street,
    },
  ]);
  await verifyInputFieldValues(loader, [
    {
      selector: 'input[id*="coding_country.answer"]',
      expectedValue: expectedAddress.country,
    },
  ]);
  await verifyInputFieldValues(loader, [
    {
      selector: 'input[id*="input_name.answer"]',
      expectedValue: expectedAddress.name,
    },
  ]);
  await verifyInputFieldValues(loader, [
    {
      selector: 'input[id*="input_houseNumber.answer"]',
      expectedValue: expectedAddress.houseNr,
    },
  ]);
  await verifyInputFieldValues(loader, [
    {
      selector: 'input[id*="input_city.answer"]',
      expectedValue: expectedAddress.city,
    },
  ]);
  await verifyInputFieldValues(loader, [
    {
      selector: 'input[id*="input_postalCode.answer"]',
      expectedValue: expectedAddress.zip,
    },
  ]);
}

export async function verifyHospitalizationContactInputFields(
  loader: HarnessLoader,
  expectedValues: {
    prefix?: string;
    given?: string;
    family?: string;
    phone?: string;
    email?: string;
  } = {}
) {
  const { prefix, given, family, phone, email } = expectedValues;

  await verifyInputFieldValues(loader, [
    {
      selector: 'input[id*="input_name.prefix.answer"]',
      expectedValue: prefix,
    },
    {
      selector: 'input[id*="input_name.family.answer"]',
      expectedValue: family,
    },
    {
      selector: 'input[id*="input_name.given.answer"]',
      expectedValue: given,
    },
    {
      selector: 'input[id*="input_phone.answer"]',
      expectedValue: phone,
    },
    {
      selector: 'input[id*="input_email.answer"]',
      expectedValue: email,
    },
  ]);
}

export async function fillNotifiedPersonCurrentAddressOtherFacility(loader: HarnessLoader, fixture: MockedComponentFixture, otherAddress: TestDataAddress) {
  const radioGroup = await getRadioGroup(loader, `#${FIELD_CURRENT_ADDRESS_TYPE}`);
  await selectRadioOption(radioGroup, 'andere Einrichtung / Unterkunft');
  expect(await radioGroup.getCheckedValue()).toBe(AddressType.OtherFacility);
  fixture.detectChanges();
  await setInputFieldValues(loader, [
    {
      selector: otherAddress.zip.htmlSelector,
      value: otherAddress.zip.manualValue,
    },
  ]);
  await setInputFieldValues(loader, [
    {
      selector: otherAddress.street.htmlSelector,
      value: otherAddress.street.manualValue,
    },
  ]);
  await setInputFieldValues(loader, [
    {
      selector: otherAddress.city.htmlSelector,
      value: otherAddress.city.manualValue,
    },
  ]);
  await setInputFieldValues(loader, [
    {
      selector: otherAddress.houseNumber.htmlSelector,
      value: otherAddress.houseNumber.manualValue,
    },
  ]);
  await setInputFieldValues(loader, [
    {
      selector: otherAddress.institutionName.htmlSelector,
      value: otherAddress.institutionName.manualValue,
    },
  ]);
  fixture.detectChanges();
}

export async function fillNotifierContact(loader: HarnessLoader, contact = NOTIFIED_PERSON_CONTACT_INPUT) {
  await setInputFieldValues(loader, contact);
}

function getPageByStepNumber(pageNumber: number) {
  switch (pageNumber) {
    case 1:
      return 'Meldende Person';
    case 2:
      return 'Betroffene Person';
    case 3:
      return 'Meldetatbestand';
    case 4:
      return 'Angaben zu Symptomen';
    case 5:
      return 'Klinische und epidemiologische Angaben';
    case 6:
      return 'Spezifische Angaben';
    default:
      return 'Meldetatbestand';
  }
}

export async function selectTab(fixture: MockedComponentFixture, loader: HarnessLoader, pageNumber: number) {
  const tabGroup = await loader.getHarness(MatTabGroupHarness);
  await tabGroup.selectTab({ label: getPageByStepNumber(pageNumber) });
  expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe(getPageByStepNumber(pageNumber));
  fixture.detectChanges();
  await fixture.whenStable();
}

export async function selectNotifiedPersonCurrentAddressSubmittingFacility(loader: HarnessLoader, fixture: MockedComponentFixture) {
  const radioGroup = await getRadioGroup(loader, '#currentAddressType');
  await selectRadioOption(radioGroup, 'Adresse der meldenden Einrichtung');
  fixture.detectChanges();
  await fixture.whenStable();
  expect(await radioGroup.getCheckedValue()).toBe(AddressType.SubmittingFacility);
  fixture.detectChanges();
}

export async function moveFromNotifiedPersonToKlinischeAngaben(fixture: MockedComponentFixture, loader: HarnessLoader) {
  await selectTab(fixture, loader, 3);
  expect(fixture.nativeElement.querySelector('.section-title').textContent).toBe('Meldetatbestand');
  const inputField = await getInput(loader, '#disease-choice-input');
  await inputField.setValue('Cholera');
  await inputField.blur();
  await selectTab(fixture, loader, 5);
  expect(fixture.nativeElement.querySelector('.section-title').textContent).toBe('Klinische und epidemiologische Angaben');
  fixture.detectChanges();
}

export async function verifySelectedMeldetatbestand(fixture: MockedComponentFixture, loader: HarnessLoader) {
  expect(getStepHeader(fixture)).toBe('Meldetatbestand');
  const inputField = await getInput(loader, '#disease-choice-input');
  expect(await inputField.getValue()).toContain('Coronavirus');
}

export function getStepHeader(fixture: ComponentFixture<any>): string {
  return fixture.nativeElement.querySelector('.section-title').textContent;
}

export async function selectDisease(loader: HarnessLoader, fixture: MockedComponentFixture<any>, display: RegExp) {
  const inputSelector = '#disease-choice-input';
  try {
    const inputHarness = await getInput(loader, inputSelector);
    await inputHarness.focus();
    await fixture.whenStable();
    const autocompleteHarness = await getAutocomplete(loader, inputSelector);
    await autocompleteHarness.selectOption({ text: display });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  } catch (e) {
    throw e;
  }
}

export async function navigateToTabIndex(loader: HarnessLoader, fixture: MockedComponentFixture<any>, index: number, label: string) {
  const selector = '#NAVIGATION';
  try {
    const tabGroup = await getTabGroup(loader, selector);
    const tabs = await tabGroup.getTabs();
    if (index < 0 || index >= tabs.length) {
      const labels = await Promise.all(tabs.map(t => t.getLabel()));
      throw new Error(`Invalid tab index ${index} for "${label}". Max index: ${tabs.length - 1}. Labels: ${labels.join(',')}`);
    }
    await tabs[index].select();
    fixture.detectChanges();
    await fixture.whenStable();
  } catch (e) {
    throw e;
  }
}

export async function dispatchChangeEvents(fixture: MockedComponentFixture<any>, input: MatInputHarness): Promise<void> {
  const inputElement = await input.host();
  await inputElement.focus();
  fixture.detectChanges();
  await fixture.whenStable();
  await inputElement.blur();
  await inputElement.dispatchEvent('input');
  await inputElement.dispatchEvent('change');
  fixture.detectChanges();
  await fixture.whenStable();
}

export async function simulateTypingWithDOM(
  fixture: MockedComponentFixture<any>,
  component: { previousDate3InputLength?: number },
  nativeInput: HTMLInputElement,
  text: string
): Promise<void> {
  nativeInput.value = '';
  nativeInput.dispatchEvent(new Event('input', { bubbles: true }));

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (component.previousDate3InputLength !== undefined) {
      component.previousDate3InputLength = nativeInput.value.length;
    }

    nativeInput.value += char;

    nativeInput.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    nativeInput.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 5));

    fixture.detectChanges();
    await fixture.whenStable();
  }

  nativeInput.dispatchEvent(new Event('change', { bubbles: true }));
  nativeInput.blur();
  nativeInput.dispatchEvent(new Event('blur', { bubbles: true }));

  fixture.detectChanges();
  await fixture.whenStable();
}
