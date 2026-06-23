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

import { AddressToggleComponent } from './address-toggle.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('AddressToggleComponent', () => {
  let fixture: ComponentFixture<MockComponent>;
  let mockComponent: MockComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        FormlyModule.forRoot({
          types: [{ name: 'address-toggle', component: AddressToggleComponent }],
        }),
        AddressToggleComponent,
        MockComponent,
        MockComponentWithChildWithoutProps,
        MockComponentWithNestedKeys,
        MockComponentWithChildWithoutKey,
        MockComponentWithoutFieldGroup,
      ],
      providers: [{ provide: 'TOKEN_LOGGER_CONFIG', useValue: {} }],
    });
    fixture = TestBed.createComponent(MockComponent);
    mockComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(mockComponent).toBeTruthy();
  });

  it('should show addButtonLabel initially', () => {
    const label = fixture.debugElement.query(By.css('.toggle-label'));
    expect(label.nativeElement.textContent).toContain('Adresse hinzufügen');
  });

  it('should set child fields to hidden initially', () => {
    const addressField = mockComponent.fields[0];
    expect(addressField.fieldGroup?.[0].hide).toBe(true);
    expect(addressField.fieldGroup?.[1].hide).toBe(true);
  });

  it('should set resetOnHide to false to preserve imported values (HexHex, Pastebox)', () => {
    const addressField = mockComponent.fields[0];
    expect(addressField.fieldGroup?.[0].resetOnHide).toBe(false);
    expect(addressField.fieldGroup?.[1].resetOnHide).toBe(false);
  });

  it('should show child fields after toggle', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    const addressField = mockComponent.fields[0];
    expect(addressField.fieldGroup?.[0].hide).toBe(false);
    expect(addressField.fieldGroup?.[1].hide).toBe(false);
  });

  it('should show removeButtonLabel after toggle', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.toggle-label'));
    expect(label.nativeElement.textContent).toContain('Adresse entfernen');
  });

  it('should hide child fields after double toggle', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();
    button.nativeElement.click();
    fixture.detectChanges();

    const addressField = mockComponent.fields[0];
    expect(addressField.fieldGroup?.[0].hide).toBe(true);
  });

  it('should handle children without props', () => {
    const fixtureNoProps = TestBed.createComponent(MockComponentWithChildWithoutProps);
    fixtureNoProps.detectChanges();

    const button = fixtureNoProps.debugElement.query(By.css('button'));
    expect(() => {
      button.nativeElement.click();
      fixtureNoProps.detectChanges();
    }).not.toThrow();
  });

  it('should restore cached values after hiding and showing again', () => {
    const button = fixture.debugElement.query(By.css('button'));
    const addressField = mockComponent.fields[0];

    // Show address fields
    button.nativeElement.click();
    fixture.detectChanges();

    // Enter values
    const streetControl = addressField.fieldGroup?.[0].formControl;
    const cityControl = addressField.fieldGroup?.[1].formControl;
    streetControl?.setValue('Teststraße 123');
    cityControl?.setValue('Berlin');
    fixture.detectChanges();

    // Hide address fields
    button.nativeElement.click();
    fixture.detectChanges();

    // Show address fields again
    button.nativeElement.click();
    fixture.detectChanges();

    // Verify values are restored
    expect(streetControl?.value).toBe('Teststraße 123');
    expect(cityControl?.value).toBe('Berlin');
  });

  it('should automatically show fields when external data is imported (HexHex/Pastebox)', fakeAsync(() => {
    const addressField = mockComponent.fields[0];

    // Initially hidden
    expect(addressField.fieldGroup?.[0].hide).toBe(true);

    tick();
    fixture.detectChanges();

    // Simulate external data import by setting model values directly
    mockComponent.model = { address: { street: 'Importierte Straße', city: 'Berlin' } };
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Fields should now be visible
    expect(addressField.fieldGroup?.[0].hide).toBe(false);
    expect(addressField.fieldGroup?.[1].hide).toBe(false);

    // Button label should reflect visible state
    const label = fixture.debugElement.query(By.css('.toggle-label'));
    expect(label.nativeElement.textContent).toContain('Adresse entfernen');
  }));

  it('should not auto-show fields when model has only empty values', fakeAsync(() => {
    const addressField = mockComponent.fields[0];

    tick();
    fixture.detectChanges();

    // Set model with empty strings - should NOT trigger auto-show
    mockComponent.model = { address: { street: '', city: '' } };
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Fields should remain hidden
    expect(addressField.fieldGroup?.[0].hide).toBe(true);
  }));

  it('should not auto-show fields when model has only null values', fakeAsync(() => {
    const addressField = mockComponent.fields[0];

    tick();
    fixture.detectChanges();

    mockComponent.model = { address: { street: null, city: null } } as any;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(addressField.fieldGroup?.[0].hide).toBe(true);
  }));

  it('should auto-show fields and ignore null values while keeping valid ones', fakeAsync(() => {
    const addressField = mockComponent.fields[0];

    tick();
    fixture.detectChanges();

    // Only city has a value, street is null
    mockComponent.model = { address: { street: null, city: 'Berlin' } } as any;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Fields should be shown because at least one value is present
    expect(addressField.fieldGroup?.[0].hide).toBe(false);
    expect(addressField.fieldGroup?.[1].hide).toBe(false);

    // The city field should have the imported value
    const cityControl = addressField.fieldGroup?.[1].formControl;
    expect(cityControl?.value).toBe('Berlin');
  }));

  it('should not auto-show fields that are already visible', fakeAsync(() => {
    const button = fixture.debugElement.query(By.css('button'));

    // Manually show fields
    button.nativeElement.click();
    fixture.detectChanges();
    tick();

    const addressField = mockComponent.fields[0];
    expect(addressField.fieldGroup?.[0].hide).toBe(false);

    // Set model - should not cause issues since fields are already visible
    mockComponent.model = { address: { street: 'New Street' } };
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // Fields should still be visible
    expect(addressField.fieldGroup?.[0].hide).toBe(false);
  }));

  it('should detect nested key values like street.answer.valueString (FUTS structure)', fakeAsync(() => {
    const nestedFixture = TestBed.createComponent(MockComponentWithNestedKeys);
    const nestedComponent = nestedFixture.componentInstance;
    nestedFixture.detectChanges();

    const addressField = nestedComponent.fields[0];

    // Initially hidden
    expect(addressField.fieldGroup?.[0].hide).toBe(true);

    tick();
    nestedFixture.detectChanges();

    // Simulate HexHex import with FUTS-style nested structure
    nestedComponent.model = {
      address: {
        street: { answer: { valueString: 'Laborstraße 42' } },
        city: { answer: { valueString: 'Laborstadt' } },
      },
    };
    nestedFixture.detectChanges();
    tick();
    nestedFixture.detectChanges();

    // Fields should now be visible
    expect(addressField.fieldGroup?.[0].hide).toBe(false);
    expect(addressField.fieldGroup?.[1].hide).toBe(false);

    // Button should show remove label
    const label = nestedFixture.debugElement.query(By.css('.toggle-label'));
    expect(label.nativeElement.textContent).toContain('Adresse entfernen');
  }));

  it('should handle fieldGroup children without key during external import', fakeAsync(() => {
    const fixtureNoKey = TestBed.createComponent(MockComponentWithChildWithoutKey);
    fixtureNoKey.detectChanges();

    const addressField = fixtureNoKey.componentInstance.fields[0];

    tick();
    fixtureNoKey.detectChanges();

    // Import data - the keyless child should not cause errors
    fixtureNoKey.componentInstance.model = { address: { street: 'Imported' } };
    fixtureNoKey.detectChanges();
    tick();
    fixtureNoKey.detectChanges();

    // Field with key should be shown since it has a value
    expect(addressField.fieldGroup?.[1].hide).toBe(false);
  }));

  it('should handle address-toggle without fieldGroup gracefully', () => {
    const fixtureNoGroup = TestBed.createComponent(MockComponentWithoutFieldGroup);
    fixtureNoGroup.detectChanges();

    // Should not throw during initialization
    const button = fixtureNoGroup.debugElement.query(By.css('button'));
    expect(() => {
      button.nativeElement.click();
      fixtureNoGroup.detectChanges();
    }).not.toThrow();
  });
});

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'address',
      type: 'address-toggle',
      props: {},
      fieldGroup: [
        { key: 'street', props: { label: 'Straße' } },
        { key: 'city', props: { label: 'Stadt' } },
      ],
    },
  ];
}

@Component({
  selector: 'app-test-form-no-props',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponentWithChildWithoutProps {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'address',
      type: 'address-toggle',
      props: {},
      fieldGroup: [{ key: 'street' }],
    },
  ];
}

@Component({
  selector: 'app-test-form-nested-keys',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponentWithNestedKeys {
  form = new FormGroup({});
  model: Record<string, unknown> = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'address',
      type: 'address-toggle',
      props: {},
      fieldGroup: [
        { key: 'street.answer.valueString', props: { label: 'Straße' } },
        { key: 'city.answer.valueString', props: { label: 'Stadt' } },
      ],
    },
  ];
}

@Component({
  selector: 'app-test-form-no-key',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponentWithChildWithoutKey {
  form = new FormGroup({});
  model: Record<string, unknown> = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'address',
      type: 'address-toggle',
      props: {},
      fieldGroup: [{ props: { label: 'No Key Field' } }, { key: 'street', props: { label: 'Straße' } }],
    },
  ];
}

@Component({
  selector: 'app-test-form-no-group',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponentWithoutFieldGroup {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'address',
      type: 'address-toggle',
      props: {},
    },
  ];
}
