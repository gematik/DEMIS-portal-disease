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
    const openPanelSpy = jasmine.createSpy('openPanel');
    spyOn(component, 'autocomplete' as any).and.returnValue({ openPanel: openPanelSpy });
    component.onClick();
    expect(component.selectControl.value).toBe('');
    expect(openPanelSpy).toHaveBeenCalled();
  });

  it('should not open panel on onClick when autocomplete is disabled', () => {
    component.selectControl.setValue('test');
    component.autocompleteDisabled = true;
    const openPanelSpy = jasmine.createSpy('openPanel');
    spyOn(component, 'autocomplete' as any).and.returnValue({ openPanel: openPanelSpy });
    component.onClick();
    expect(openPanelSpy).not.toHaveBeenCalled();
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

  it('should clear selectControl on close panel in multi mode', () => {
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    multiComponent.selectControl.setValue('filter text');
    multiComponent.onClosePanel();
    expect(multiComponent.selectControl.value).toBe('');
  });

  describe('onOptionSelected', () => {
    it('should toggle selection, clear input and reopen panel in multi mode', () => {
      const multiFixture = MockRender(AutocompleteComponent, {
        options: mockOptions,
        formControl: new FormControl(),
        clearable: true,
        showCode: false,
        multi: true,
        key: 'test-key',
      });
      const multiComponent = multiFixture.point.componentInstance;

      const openPanelSpy = jasmine.createSpy('openPanel');
      spyOn(multiComponent, 'autocomplete' as any).and.returnValue({ openPanel: openPanelSpy, updatePosition: jasmine.createSpy() });

      const coding: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system' };
      const mockEvent = { option: { value: coding } } as any;

      multiComponent.onOptionSelected(mockEvent);

      expect(multiComponent.selectData.length).toBe(1);
      expect(multiComponent.selectData[0]).toEqual(coding);
      expect(multiComponent.selectControl.value).toBe('');
    });

    it('should not toggle selection in single mode', () => {
      const coding: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system' };
      const mockEvent = { option: { value: coding } } as any;

      component.onOptionSelected(mockEvent);

      expect(component.selectData.length).toBe(0);
    });

    it('should deselect already selected option in multi mode', () => {
      const multiFixture = MockRender(AutocompleteComponent, {
        options: mockOptions,
        formControl: new FormControl(),
        clearable: true,
        showCode: false,
        multi: true,
        key: 'test-key',
      });
      const multiComponent = multiFixture.point.componentInstance;

      const coding: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system', selected: true };
      multiComponent.selectData = [coding];

      const mockEvent = { option: { value: coding } } as any;
      multiComponent.onOptionSelected(mockEvent);

      expect(multiComponent.selectData.length).toBe(0);
      expect(coding.selected).toBeFalsy();
      expect(multiComponent.selectControl.value).toBe('');
    });
  });

  it('should handle onBlur for multi-select when panel is closed', () => {
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

  it('should not clear selectControl on blur when panel is open in multi mode', () => {
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    multiComponent.selectControl.setValue('filter text');
    spyOn(multiComponent, 'autocomplete' as any).and.returnValue({ panelOpen: true });
    multiComponent.onBlur();
    expect(multiComponent.selectControl.value).toBe('filter text');
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

  it('should return empty string from getCurrentBreadcrumb when no breadcrumb exists', () => {
    const mockFormControl = new FormControl({ display: 'test' });
    const noBreadcrumbFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: mockFormControl,
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const noBreadcrumbComponent = noBreadcrumbFixture.point.componentInstance;

    expect(noBreadcrumbComponent.getCurrentBreadcrumb()).toBe('');
  });

  it('should return empty string from displayFn when coding is undefined', () => {
    expect(component.displayFn(undefined)).toBe('');
  });

  it('should return empty string from displayFn with showCode when coding is undefined', () => {
    const showCodeFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: true,
      multi: false,
      key: 'test-key',
    });
    const showCodeComponent = showCodeFixture.point.componentInstance;

    expect(showCodeComponent.displayFn(undefined)).toBe('');
  });

  it('should handle setDisabledState with false (enable)', () => {
    component.setDisabledState?.(true);
    expect(component.selectControl.disabled).toBeTruthy();
    expect(component.autocompleteDisabled).toBeTruthy();

    component.setDisabledState?.(false);
    expect(component.selectControl.disabled).toBeFalsy();
    expect(component.autocompleteDisabled).toBeFalsy();
  });

  it('should handle onInputFocus by clearing selectControl in single mode', () => {
    component.selectControl.setValue('test');
    component.onInputFocus();
    expect(component.selectControl.value).toBe('');
  });

  it('should not clear selectControl on focus in multi mode when panel is open', () => {
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    multiComponent.selectControl.setValue('filter text');
    spyOn(multiComponent, 'autocomplete' as any).and.returnValue({ panelOpen: true });
    multiComponent.onInputFocus();
    expect(multiComponent.selectControl.value).toBe('filter text');
  });

  it('should clear selectControl on focus in multi mode when panel is closed', () => {
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    multiComponent.selectControl.setValue('filter text');
    multiComponent.onInputFocus();
    expect(multiComponent.selectControl.value).toBe('');
  });

  it('should not clear on onInputFocus when disabled', () => {
    component.selectControl.setValue('test-value');
    component.setDisabledState?.(true);
    component.onInputFocus();
    expect(component.selectControl.value).toBe('test-value');
  });

  it('should not clear on onClick when disabled', () => {
    component.selectControl.setValue('test-value');
    component.setDisabledState?.(true);
    component.onClick();
    expect(component.selectControl.value).toBe('test-value');
  });

  describe('handleSpace', () => {
    it('should return true and prevent default when not in multi mode', () => {
      const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
      const result = component.handleSpace(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return true when in multi mode but no activeOption', () => {
      const multiFixture = MockRender(AutocompleteComponent, {
        options: mockOptions,
        formControl: new FormControl(),
        clearable: true,
        showCode: false,
        multi: true,
        key: 'test-key',
      });
      const multiComponent = multiFixture.point.componentInstance;

      const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
      multiComponent.activeOption = undefined;
      const result = multiComponent.handleSpace(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should toggle selection and return false when in multi mode with activeOption', () => {
      const multiFixture = MockRender(AutocompleteComponent, {
        options: mockOptions,
        formControl: new FormControl(),
        clearable: true,
        showCode: false,
        multi: true,
        key: 'test-key',
      });
      const multiComponent = multiFixture.point.componentInstance;

      const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
      multiComponent.activeOption = { code: 'fresh1', display: 'Fresh Option', system: 'test' };
      const result = multiComponent.handleSpace(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
      expect(multiComponent.selectData.length).toBe(1);
    });

    it('should return true when disabled', () => {
      const multiFixture = MockRender(AutocompleteComponent, {
        options: mockOptions,
        formControl: new FormControl(),
        clearable: true,
        showCode: false,
        multi: true,
        key: 'test-key',
      });
      const multiComponent = multiFixture.point.componentInstance;
      multiComponent.setDisabledState?.(true);

      const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
      multiComponent.activeOption = { ...mockOptions[0] };
      const result = multiComponent.handleSpace(mockEvent);
      expect(result).toBe(true);
    });
  });

  it('should not toggle selection when disabled', () => {
    component.setDisabledState?.(true);
    const testOption: DemisCoding = { code: 'fresh1', display: 'Fresh', system: 'test' };
    component.toggleSelection(testOption);
    expect(component.selectData.length).toBe(0);
    expect(testOption.selected).toBeUndefined();
  });

  it('should not remove chip when disabled', () => {
    const testOption = { ...mockOptions[0], selected: true };
    component.selectData = [testOption];
    component.setDisabledState?.(true);
    component.removeChip(testOption);
    expect(component.selectData.length).toBe(1);
  });

  it('should not activate option when disabled', () => {
    component.setDisabledState?.(true);
    const mockEvent = { option: { value: mockOptions[0] } } as any;
    component.activateOption(mockEvent);
    expect(component.activeOption).toBeUndefined();
  });

  it('should not remove selection when disabled', () => {
    component.selectControl.setValue('test');
    component.setDisabledState?.(true);
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
    component.onRemoveSelection(mockEvent);
    expect(component.selectControl.value).toBe('test');
    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('should deselect and remove from selectData on toggleSelection when already selected', () => {
    const testOption = { ...mockOptions[0], selected: true };
    component.selectData = [testOption];
    component.toggleSelection(testOption);
    expect(component.selectData.length).toBe(0);
    expect(testOption.selected).toBeFalsy();
  });

  it('should update placeholder when selectData becomes non-empty', () => {
    component.initialPlaceholder = 'Bitte auswählen';
    const testOption = { ...mockOptions[0] };
    component.toggleSelection(testOption);
    expect(component.placeholder).toBe('weitere auswählen');
  });

  it('should restore placeholder when selectData becomes empty', () => {
    component.initialPlaceholder = 'Bitte auswählen';
    const testOption = { ...mockOptions[0], selected: true };
    component.selectData = [testOption];
    component.toggleSelection(testOption);
    expect(component.placeholder).toBe('Bitte auswählen');
  });

  it('should handle onBlur for single-select (no-op)', () => {
    component.selectControl.setValue('test-value');
    component.onBlur();
    expect(component.selectControl.value).toBe('test-value');
  });

  it('should repopulate latestValidSelection on onClosePanel when nothing selected', () => {
    const validSelection: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system' };
    component.latestValidSelection = validSelection;
    component.selectControl.setValue('');
    component.onClosePanel();
    expect(component.selectControl.value).toEqual(validSelection);
  });

  it('should repopulate latestValidSelection on onClosePanel when value is null', () => {
    const validSelection: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system' };
    component.selectControl.setValue(null);
    // Set latestValidSelection AFTER setValue to avoid propagation overwriting it
    component.latestValidSelection = validSelection;
    component.onClosePanel();
    expect(component.selectControl.value).toEqual(validSelection);
  });

  it('should repopulate latestValidSelection on onClosePanel when value is a string', () => {
    const validSelection: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system' };
    component.selectControl.setValue('partial text');
    // Set latestValidSelection AFTER setValue to avoid propagation overwriting it
    component.latestValidSelection = validSelection;
    component.onClosePanel();
    expect(component.selectControl.value).toEqual(validSelection);
  });

  it('should not repopulate on onClosePanel when no latestValidSelection', () => {
    component.latestValidSelection = undefined;
    component.selectControl.setValue('');
    component.onClosePanel();
    expect(component.selectControl.value).toBe('');
  });

  it('should not overwrite on onClosePanel when a DemisCoding object is selected', () => {
    const currentSelection: DemisCoding = { code: 'test2', display: 'Test Option 2', system: 'test-system' };
    const latestSelection: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system' };
    component.latestValidSelection = latestSelection;
    component.selectControl.setValue(currentSelection);
    component.onClosePanel();
    expect(component.selectControl.value).toEqual(currentSelection);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    component.ngOnDestroy();
    // Verify component can be destroyed without error
    expect(component).toBeTruthy();
  });

  it('should handle ngOnInit with disabled parent form control', () => {
    const disabledFormControl = new FormControl({ value: '', disabled: true });
    const disabledFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: disabledFormControl,
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const disabledComponent = disabledFixture.point.componentInstance;

    expect(disabledComponent.selectControl.disabled).toBeTruthy();
    expect(disabledComponent.autocompleteDisabled).toBeTruthy();
  });

  it('should enable selectControl when parent control changes from disabled to enabled', () => {
    const parentControl = new FormControl({ value: '', disabled: true });
    const toggleFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: parentControl,
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const toggleComponent = toggleFixture.point.componentInstance;

    expect(toggleComponent.selectControl.disabled).toBeTruthy();
    expect(toggleComponent.autocompleteDisabled).toBeTruthy();

    parentControl.enable();
    expect(toggleComponent.selectControl.enabled).toBeTruthy();
    expect(toggleComponent.autocompleteDisabled).toBeFalsy();
  });

  it('should disable selectControl when parent control changes from enabled to disabled', () => {
    const parentControl = new FormControl('');
    const toggleFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: parentControl,
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const toggleComponent = toggleFixture.point.componentInstance;

    expect(toggleComponent.selectControl.enabled).toBeTruthy();

    parentControl.disable();
    expect(toggleComponent.selectControl.disabled).toBeTruthy();
    expect(toggleComponent.autocompleteDisabled).toBeTruthy();
  });

  it('should filter options by code when showCode is true', (done: DoneFn) => {
    const showCodeFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: new FormControl(),
      clearable: true,
      showCode: true,
      multi: false,
      key: 'test-key',
    });
    const showCodeComponent = showCodeFixture.point.componentInstance;

    let emissions = 0;
    showCodeComponent.filteredCodings.subscribe(result => {
      emissions++;
      if (emissions === 2) {
        expect(result.length).toBe(1);
        expect(result[0].code).toBe('test1');
        done();
      }
    });
    showCodeComponent.selectControl.setValue('test1');
  });

  it('should return all options when filter value is empty', (done: DoneFn) => {
    let emissions = 0;
    component.filteredCodings.subscribe(result => {
      emissions++;
      if (emissions === 1) {
        expect(result.length).toBe(3);
        done();
      }
    });
  });

  it('should handle writeValue for single selection without code property', () => {
    const initialValue = component.selectControl.value;
    const objWithoutCode = { display: 'test' } as any;
    component.writeValue(objWithoutCode);
    // Should not set value since obj.code is falsy
    expect(component.selectControl.value).toBe(initialValue);
  });

  it('should handle markAsTouched with default onTouched (no-op)', () => {
    // Directly call the default empty onTouched implementation
    expect(() => component.onTouched()).not.toThrow();
    // Then verify markAsTouched works with the default handler
    component.markAsTouched();
    expect(component.formControl().touched).toBeTruthy();
  });

  it('should have default onChange as no-op', () => {
    // Directly call the default empty onChange implementation
    expect(() => component.onChange('test')).not.toThrow();
  });

  it('should handle markAsTouched', () => {
    const mockOnTouched = jasmine.createSpy('onTouched');
    component.registerOnTouched(mockOnTouched);
    component.markAsTouched();
    expect(component.formControl().touched).toBeTruthy();
    expect(mockOnTouched).toHaveBeenCalled();
  });

  it('should not propagate value to parent when multi is true', () => {
    const parentControl = new FormControl();
    const multiFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: parentControl,
      clearable: true,
      showCode: false,
      multi: true,
      key: 'test-key',
    });
    const multiComponent = multiFixture.point.componentInstance;

    const onChangeSpy = jasmine.createSpy('onChange');
    multiComponent.registerOnChange(onChangeSpy);

    // In multi mode, selectControl.valueChanges should not propagate via propagateValueToParent
    multiComponent.selectControl.setValue('test');
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('should set latestValidSelection when parent control has no errors and value is not empty', () => {
    const parentControl = new FormControl();
    const testFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: parentControl,
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const testComponent = testFixture.point.componentInstance;

    const coding: DemisCoding = { code: 'test1', display: 'Test Option 1', system: 'test-system' };
    testComponent.selectControl.setValue(coding);

    expect(testComponent.latestValidSelection).toEqual(coding);
  });

  it('should handle filteredCodings with empty options', () => {
    const emptyFixture = MockRender(AutocompleteComponent, {
      options: [],
      formControl: new FormControl(),
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const emptyComponent = emptyFixture.point.componentInstance;

    emptyComponent.selectControl.setValue('test');
    emptyComponent.filteredCodings.subscribe(result => {
      expect(result.length).toBe(0);
    });
  });

  it('should auto-select when filteredCodings finds exactly one match with same display', (done: DoneFn) => {
    const parentControl = new FormControl();
    const autoFixture = MockRender(AutocompleteComponent, {
      options: mockOptions,
      formControl: parentControl,
      clearable: true,
      showCode: false,
      multi: false,
      key: 'test-key',
    });
    const autoComponent = autoFixture.point.componentInstance;

    let emissions = 0;
    autoComponent.filteredCodings.subscribe(result => {
      emissions++;
      if (emissions === 2) {
        expect(result.length).toBe(1);
        expect(parentControl.value).toEqual(mockOptions[2]);
        done();
      }
    });
    // Type exact display value that matches only one option
    autoComponent.selectControl.setValue('Another Test');
  });
});
