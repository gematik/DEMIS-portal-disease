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

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { RadioButtonCodingComponent } from './radio-button-coding.component';

describe('RadioButtonCodingComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [{ name: 'radio-button-coding', component: RadioButtonCodingComponent }],
        }),
        RadioButtonCodingTestHostComponent,
      ],
    });
  });

  it('updates the form control when a coding is selected', async () => {
    const fixture = TestBed.createComponent(RadioButtonCodingTestHostComponent);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const radioGroup = await loader.getHarness(MatRadioGroupHarness.with({ selector: '#radio-group-test-radio' }));
    await radioGroup.checkRadioButton({ label: 'Ja' });

    expect(fixture.componentInstance.form.get('choice')?.value).toEqual(codings[0]);
  });
});

const codings = [
  { code: 'yes', display: 'Ja', system: 'test-system' },
  { code: 'no', display: 'Nein', system: 'test-system' },
];

@Component({
  selector: 'app-radio-button-coding-test-host',
  template: '<form [formGroup]="form"><formly-form [form]="form" [fields]="fields" [model]="model"></formly-form></form>',
  imports: [ReactiveFormsModule, FormlyModule],
})
class RadioButtonCodingTestHostComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      id: 'test-radio',
      key: 'choice',
      type: 'radio-button-coding',
      className: 'test-radio',
      props: { options: codings },
    },
  ];
}
