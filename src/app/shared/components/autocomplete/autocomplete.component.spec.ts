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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { DemisCoding } from '../../../demis-types';
import { AddBreadcrumbDirective } from '../../formly/components/autocomplete-coding/add-breadcrumb.directive';
import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: MockedComponentFixture<AutocompleteComponent, any>;

  const mockOptions: DemisCoding[] = [
    { code: 'test1', display: 'Test Option 1', system: 'test-system' },
    { code: 'test2', display: 'Test Option 2', system: 'test-system' },
    { code: 'test3', display: 'Another Test', system: 'test-system' },
  ];

  beforeEach(() => {
    return MockBuilder(AutocompleteComponent)
      .keep(ReactiveFormsModule)
      .keep(NoopAnimationsModule)
      .mock(MatAutocompleteModule)
      .mock(MatFormFieldModule)
      .mock(MatInputModule)
      .mock(MatIconModule)
      .mock(MatButtonModule)
      .mock(MatChipsModule)
      .mock(MatCheckboxModule)
      .mock(AddBreadcrumbDirective);
  });

  beforeEach(() => {
    fixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.selectControl).toBeDefined();
    expect(component.selectData).toEqual([]);
    expect(component.initialPlaceholder).toBe('');
  });

  it('should handle displayFn without code', () => {
    const testOption = mockOptions[0];
    const result = component.displayFn(testOption);
    expect(result).toBe('Test Option 1');
  });

  it('should handle displayFn without code', () => {
    const testOption = mockOptions[0];
    const result = component.displayFn(testOption);
    expect(result).toBe('Test Option 1');
  });

  it('should handle displayFn with code when showCode is true', () => {
    // Create a new component instance with showCode = true
    const newFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: true,
      multi: false,
      key: 'test-key',
    });
    const newComponent = newFixture.point.componentInstance;

    const testOption = mockOptions[0];
    const result = newComponent.displayFn(testOption);
    expect(result).toBe('Test Option 1 | test1');
  });

  it('should handle writeValue for single selection', () => {
    const testOption = mockOptions[0];
    component.writeValue(testOption);
    expect(component.selectControl.value).toEqual(testOption);
  });

  it('should handle writeValue with null/undefined', () => {
    component.writeValue(null);
    expect(component.selectControl.value).toBeNull();

    component.writeValue(undefined);
    expect(component.selectControl.value).toBeNull();
  });

  it('should handle registerOnChange', () => {
    const mockOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(mockOnChange);
    expect(component.onChange).toBe(mockOnChange);
  });

  it('should handle registerOnTouched', () => {
    const mockOnTouched = jasmine.createSpy('onTouched');
    component.registerOnTouched(mockOnTouched);
    expect(component.onTouched).toBe(mockOnTouched);
  });

  it('should handle setDisabledState', () => {
    component.setDisabledState?.(true);
    expect(component.selectControl.disabled).toBeTruthy();
  });

  it('should handle toggleSelection for single-select (multi-mode logic)', () => {
    const testOption = { ...mockOptions[0] };
    component.toggleSelection(testOption);

    // In single-select mode, toggleSelection still uses multi-mode logic
    expect(component.selectData.length).toBe(1);
    expect(component.selectData[0]).toEqual(testOption);
    expect(testOption.selected).toBeTruthy();
  });

  it('should handle toggleSelection for multi-select', () => {
    // Create a new component instance with multi = true
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    const testOption = { ...mockOptions[0] };
    multiComponent.toggleSelection(testOption);

    expect(multiComponent.selectData.length).toBe(1);
    expect(multiComponent.selectData[0]).toEqual(testOption);
    expect(testOption.selected).toBeTruthy();
  });

  it('should handle removeChip', () => {
    // Create a new component instance with multi = true
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    const testOption = { ...mockOptions[0] };
    testOption.selected = true;
    multiComponent.selectData = [testOption];

    multiComponent.removeChip(testOption);

    expect(multiComponent.selectData.length).toBe(0);
    expect(testOption.selected).toBeFalsy();
  });

  it('should handle writeValue for multi selection', () => {
    // Create a new component instance with multi = true
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    const testOptions = [mockOptions[0], mockOptions[1]];
    multiComponent.writeValue(testOptions);
    expect(multiComponent.selectData).toEqual(testOptions);
  });

  it('should handle onClick', () => {
    component.selectControl.setValue('test');
    component.onClick();
    expect(component.selectControl.value).toBe('');
  });

  it('should handle onRemoveSelection', () => {
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as any;

    component.selectControl.setValue('test');
    component.onRemoveSelection(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.selectControl.value).toBe('');
    expect(component.latestValidSelection).toBeUndefined();
  });

  it('should handle createIdForAutocompleteInput', () => {
    const mockField = { id: 'test-field-id' } as any;
    const result = component.createIdForAutocompleteInput(mockField);
    expect(result).toBe('test-field-id-input');

    const mockFieldNoId = {} as any;
    const resultNoId = component.createIdForAutocompleteInput(mockFieldNoId);
    expect(resultNoId).toBe('autocomplete-input-field');
  });

  it('should handle activateOption', () => {
    const mockEvent = {
      option: { value: mockOptions[0] },
    } as any;

    component.activateOption(mockEvent);
    expect(component.activeOption).toBe(mockOptions[0]);
  });

  it('should handle onClosePanel', () => {
    component.activeOption = mockOptions[0];
    spyOn(component, 'markAsTouched');

    component.onClosePanel();

    expect(component.activeOption).toBeUndefined();
    expect(component.markAsTouched).toHaveBeenCalled();
  });

  it('should handle onBlur for multi-select', () => {
    // Create a new component instance with multi = true
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    multiComponent.selectControl.setValue('test');
    multiComponent.onBlur();
    expect(multiComponent.selectControl.value).toBe('');
  });

  it('should handle getCurrentBreadcrumb', () => {
    const mockFormControl = new FormControl({ breadcrumb: 'test-breadcrumb' });
    const breadcrumbFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: mockFormControl,
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const breadcrumbComponent = breadcrumbFixture.point.componentInstance;

    const result = breadcrumbComponent.getCurrentBreadcrumb();
    expect(result).toBe('test-breadcrumb');
  });
});
