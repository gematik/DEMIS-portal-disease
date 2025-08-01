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

import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatRadioButtonHarness, MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';

export async function getInput(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatInputHarness.with({ selector }));
}

export async function getMultipleInputFieldsWithSameSelector(loader: HarnessLoader, selector: string) {
  return loader.getAllHarnesses(MatInputHarness.with({ selector }));
}

export async function getTabGroup(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatTabGroupHarness.with({ selector }));
}

export async function getButton(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatButtonHarness.with({ selector }));
}

export async function getAllButtonsWithSameSelector(loader: HarnessLoader, selector: string) {
  return loader.getAllHarnesses(MatButtonHarness.with({ selector }));
}

export async function getSelect(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatSelectHarness.with({ selector }));
}

export async function getAutocomplete(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatAutocompleteHarness.with({ selector }));
}

export async function selectOption(harness: MatSelectHarness, optionText: string) {
  if (!(await harness.isOpen())) {
    await harness.open();
  }
  await harness.clickOptions({ text: optionText });
}

export async function getRadioGroup(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatRadioGroupHarness.with({ selector }));
}

export async function getRadioButton(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatRadioButtonHarness.with({ selector }));
}

export async function selectRadioOption(harness: MatRadioGroupHarness, optionText: string) {
  await harness.checkRadioButton({ label: optionText });
}

export async function getDialog(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatDialogHarness.with({ selector }));
}

export async function getTabList(loader: HarnessLoader) {
  const tabGroup = await getTabGroup(loader, '#NAVIGATION');
  return await tabGroup.getTabs();
}

export async function navigateTo(loader: HarnessLoader, tab: number) {
  const tabList = await getTabList(loader);
  try {
    await tabList[tab].select();
  } catch (e) {
    throw new Error(`Could not navigate to tab ${tab}: ${e}`);
  }
}

export async function getCheckBox(loader: HarnessLoader, selector: string) {
  return loader.getHarness(MatCheckboxHarness.with({ selector }));
}
