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

import { AutocompleteMultiCodingComponent } from './autocomplete-multi-coding.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { By } from '@angular/platform-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutocompleteComponent } from '../../../components/autocomplete/autocomplete.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AddBreadcrumbDirective } from '../autocomplete-coding/add-breadcrumb.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('AutocompleteMultiCodingComponent', () => {
  let fixture: ComponentFixture<MockComponent>;
  let underTest: AutocompleteMultiCodingComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'autocomplete-multi-coding', // Register the custom field type
              component: AutocompleteMultiCodingComponent, // Your custom component here
            },
          ],
        }),
      ],
      declarations: [
        MockComponent,
        AutocompleteComponent,
        AutocompleteMultiCodingComponent, // Declare your custom component
        AddBreadcrumbDirective,
      ],
    });

    fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();
    // Get the instance of AutocompleteMultiCodingComponent
    const debugElement = fixture.debugElement.query(By.directive(AutocompleteMultiCodingComponent));
    underTest = debugElement.componentInstance;
  });

  it('should create the component', () => {
    expect(underTest).toBeTruthy();
  });

  describe('Handling of default value', () => {
    describe('when formly field configured with NASK as default value', () => {
      it('field value should be NASK', () => {
        const selectedCodings = underTest.formControl.value;
        expect(selectedCodings.length).toBe(1);
        expect(selectedCodings[0].code === 'NASK').toBe(true);
      });

      it('when user selects another value, the default NASK value is removed', () => {
        // Simulate user selecting another additional value
        underTest.formControl.setValue([
          {
            code: 'NASK',
            display: 'not asked',
            system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
          },
          {
            code: '423590009',
            display: 'Endoscopic evidence of pseudomembranous colitis',
            system: 'http://snomed.info/sct',
          },
        ]);

        // Detect changes to reflect the update in the form control value
        fixture.detectChanges();

        // Verify that 'NASK' has been removed the first time the user selects another value
        let selectedCodings = underTest.formControl.value;
        expect(selectedCodings.length).toBe(1);
        expect(selectedCodings[0].code).toBe('423590009');

        // If after selecting another value, the user selects the default value 'NASK', it will not be removed anymore
        underTest.formControl.setValue([
          {
            code: 'NASK',
            display: 'not asked',
            system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
          },
          {
            code: '423590009',
            display: 'Endoscopic evidence of pseudomembranous colitis',
            system: 'http://snomed.info/sct',
          },
        ]);

        // Verify that 'NASK' has been removed the first time the user selects another value
        selectedCodings = underTest.formControl.value;
        expect(selectedCodings.length).toBe(2);
        expect(selectedCodings.map((coding: any) => coding.code)).toEqual(['NASK', '423590009']);
      });
    });

    describe("with default value other than NASK'", () => {
      beforeEach(() => {
        // Modify the MockComponent to set the defaultCode to 'ASKU'
        fixture.componentInstance.fields = [
          {
            key: 'valueCoding',
            type: 'autocomplete-multi-coding',
            props: {
              options: fixture.componentInstance.codings,
              required: true,
              clearable: true,
              defaultCode: 'ASKU',
              label: 'Mit welcher Methode wurde die Erkrankung nachgewiesen?',
            },
          },
        ];
        fixture.detectChanges();
      });

      it('Only default value NASK is removed', () => {
        // Default value is now ASKU
        let selectedCodings = underTest.formControl.value;
        expect(selectedCodings.length).toBe(1);
        expect(selectedCodings[0].code === 'ASKU').toBe(true);

        // Simulate user selecting another additional value
        underTest.formControl.setValue([
          {
            code: 'ASKU',
            display: 'asked but unknown',
            system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
          },
          {
            code: '423590009',
            display: 'Endoscopic evidence of pseudomembranous colitis',
            system: 'http://snomed.info/sct',
          },
        ]);

        fixture.detectChanges();

        // Verify that 'ASKU' has NOT been removed
        selectedCodings = underTest.formControl.value;
        expect(selectedCodings.length).toBe(2);
        expect(selectedCodings.map((coding: any) => coding.code)).toEqual(['ASKU', '423590009']);
      });
    });
  });
});

//We use a mock component to test the AutocompleteMultiCodingComponent Formly custom component
@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  standalone: false,
})
class MockComponent {
  form = new FormGroup({});
  model = {};
  codings = [
    { code: 'NASK', display: 'not asked', system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor' },
    { code: 'ASKU', display: 'asked but unknown', system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor' },
    { code: '423590009', display: 'Endoscopic evidence of pseudomembranous colitis', system: 'http://snomed.info/sct' },
  ];

  fields: FormlyFieldConfig[] = [
    {
      key: 'valueCoding',
      type: 'autocomplete-multi-coding',
      props: {
        options: this.codings,
        required: true,
        clearable: true,
        defaultCode: 'NASK',
        label: 'Mit welcher Methode wurde die Erkrankung nachgewiesen?',
      },
    },
  ];
}
