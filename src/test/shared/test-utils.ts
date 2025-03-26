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

import { HarnessLoader } from '@angular/cdk/testing';
import { getInput } from './material-harness-utils';
import { ComponentFixture } from '@angular/core/testing';
import { getHtmlButtonElement } from './html-element-utils';

export async function clickNextButton(fixture: ComponentFixture<any>) {
  const nextButton = getHtmlButtonElement(fixture.nativeElement, '#forward-button');
  await clickButton(nextButton, fixture);
}

export async function clickBackButton(fixture: ComponentFixture<any>) {
  const nextButton = getHtmlButtonElement(fixture.nativeElement, '#back-button');
  await clickButton(nextButton, fixture);
}

export async function clickButtonWithSelector(fixture: ComponentFixture<any>, selector: string) {
  const nextButton = getHtmlButtonElement(fixture.nativeElement, selector);
  await clickButton(nextButton, fixture);
}

async function clickButton(button: HTMLButtonElement, fixture: ComponentFixture<any>) {
  expect(button).toBeTruthy();
  button.click();
  fixture.detectChanges();

  await fixture.whenStable(); // Wait for all async operations to complete
}

export async function verifyInputFieldValues(
  loader: HarnessLoader,
  fields: {
    selector: string;
    expectedValue: string | undefined;
  }[]
) {
  for (const f of fields.filter(
    (
      field
    ): field is {
      selector: string;
      expectedValue: string;
    } => field.expectedValue !== undefined
  )) {
    const input = await getInput(loader, f.selector);
    expect(await input.getValue()).toBe(f.expectedValue);
  }
}

export async function setInputFieldValues(
  loader: HarnessLoader,
  fields: {
    selector: string;
    value: string;
  }[]
) {
  for (const { selector, value } of fields) {
    const inputField = await getInput(loader, selector);
    await inputField.setValue(value);
    await inputField.blur();
  }
}

export const buildClipboardString = (params: string[][]) => {
  let startString = 'URL ';
  for (const [key, value] of params) {
    startString = startString.concat(key + '=' + value + '&');
  }
  startString = startString.slice(0, -1);
  return startString;
};
