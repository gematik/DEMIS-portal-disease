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
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

export async function checkDescribingError(options: { loader: HarnessLoader; element: MatFormFieldControlHarness; expectedResult: string }): Promise<void> {
  const inputId = await (await options.element.host()).getAttribute('id');
  expect(inputId).withContext('input should have an id').toBeTruthy();

  const formFields = await options.loader.getAllHarnesses(MatFormFieldHarness);
  let matchingField: MatFormFieldHarness | null = null;
  for (const field of formFields) {
    const control = await field.getControl();
    if (!control) continue;
    const controlId = await (await control.host()).getAttribute('id');
    if (controlId === inputId) {
      matchingField = field;
      break;
    }
  }
  expect(matchingField).withContext(`mat-form-field for input '${inputId}' should be present`).toBeTruthy();

  const errors = await matchingField!.getTextErrors();
  expect(errors.length).withContext('mat-form-field should have at least one error').toBeGreaterThan(0);
  expect(errors.some(err => err.includes(options.expectedResult)))
    .withContext(`expected an error containing "${options.expectedResult}", got: ${JSON.stringify(errors)}`)
    .toBeTrue();
}
