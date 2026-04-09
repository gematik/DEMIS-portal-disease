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

import { Component, forwardRef, Input, input, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteActivatedEvent, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { map, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';
import { DemisCoding } from '../../../demis-types';

@Component({
  selector: 'app-autocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrl: 'autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class AutocompleteComponent implements OnInit, OnDestroy, ControlValueAccessor {
  readonly formControl = input<FormControl>(new FormControl());
  readonly clearable = input<boolean>(true);
  readonly errorStateMatcher = input<ErrorStateMatcher>(new ErrorStateMatcher());
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() formlyField?: FieldTypeConfig;
  readonly key = input<string | number | (string | number)[]>('');
  readonly multi = input<boolean>(false);
  readonly showCode = input<boolean>(false);
  readonly options = input<DemisCoding[]>([]);
  autocomplete = viewChild<MatAutocompleteTrigger>(MatAutocompleteTrigger);
  latestValidSelection?: DemisCoding;
  selectData: Array<DemisCoding> = [];
  selectControl: FormControl = new FormControl('');
  filteredCodings!: Observable<DemisCoding[]>;
  activeOption?: DemisCoding;
  initialPlaceholder: string = '';
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() placeholder: string = '';
  private statusSubscription?: Subscription;
  autocompleteDisabled = false;
  private suppressPropagation = false;

  ngOnInit() {
    this.initialPlaceholder = this.placeholder;
    const parentControl = this.formControl();

    if (parentControl.disabled) {
      this.selectControl.disable({ emitEvent: false });
      this.autocompleteDisabled = true;
    }

    this.statusSubscription = parentControl.statusChanges?.pipe(startWith(parentControl.status), distinctUntilChanged()).subscribe(() => {
      if (parentControl.disabled && this.selectControl.enabled) {
        this.selectControl.disable({ emitEvent: false });
        this.autocompleteDisabled = true;
        this.autocomplete()?.closePanel();
      } else if (parentControl.enabled && this.selectControl.disabled) {
        this.selectControl.enable({ emitEvent: false });
        this.autocompleteDisabled = false;
      }
    });

    this.filteredCodings = this.selectControl.valueChanges.pipe(
      startWith((this.selectControl.value as string) || ''),
      map((value: string | DemisCoding) => {
        const display = typeof value === 'string' ? value : value?.display;
        const matchingOptions = this.findMatchingOptions(display);
        if (matchingOptions.length === 1 && matchingOptions[0].display === value) {
          const autoSelectedCoding = matchingOptions[0];
          this.selectControl.setValue(autoSelectedCoding, { emitEvent: false });
          this.propagateValueToParent(autoSelectedCoding);
        }
        return matchingOptions;
      })
    );

    this.selectControl.valueChanges.subscribe((value: DemisCoding | string) => {
      this.propagateValueToParent(value);
    });
  }

  private propagateValueToParent(value: DemisCoding | string): void {
    if (this.suppressPropagation) {
      return;
    }
    const formControl = this.formControl();
    if (!this.multi() && formControl.value !== value) {
      formControl.setValue(value);
      this.onChange(value);
    }

    if (!formControl.errors && formControl.value !== '') {
      this.latestValidSelection = formControl.value;
    }
  }

  private findMatchingOptions(value: string): DemisCoding[] {
    const filterValue = value ? value.toLowerCase() : '';
    const options = this.options();
    return options?.length
      ? options.filter(coding => coding.display.toLowerCase().includes(filterValue) || (this.showCode() && coding.code.includes(filterValue)))
      : [];
  }

  private canToggleSelection(): boolean {
    return !this.formControl().disabled && !this.selectControl.disabled;
  }

  toggleSelection = (data: DemisCoding): void => {
    if (!this.canToggleSelection()) return;
    data.selected = !data.selected;

    if (data.selected) {
      this.selectData.push(data);
    } else {
      const i = this.selectData.findIndex(value => value.code === data.code);
      this.selectData.splice(i, 1);
    }
    this.placeholder = this.selectData.length > 0 ? 'weitere auswählen' : this.initialPlaceholder;
    this.formControl().setValue(this.selectData);
    this.onChange(this.selectData);
    this.markAsTouched();
    setTimeout(() => {
      if (this.autocomplete()) {
        this.autocomplete()?.updatePosition();
      }
    }, 0);
  };

  removeChip = (data: DemisCoding): void => {
    if (!this.canToggleSelection()) return;
    this.toggleSelection(data);
  };

  handleSpace(evt: Event): boolean {
    if (!this.canToggleSelection()) return true;
    evt.preventDefault();
    if (!this.multi() || !this.activeOption) {
      return true;
    }
    if (this.activeOption) {
      this.toggleSelection(this.activeOption);
    }
    return false;
  }

  activateOption(evt: MatAutocompleteActivatedEvent) {
    if (!this.canToggleSelection()) return;
    this.activeOption = evt.option?.value;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    if (this.multi()) {
      const coding = event.option.value as DemisCoding;
      this.toggleSelection(coding);
      this.selectControl.setValue('');
      setTimeout(() => {
        this.autocomplete()?.openPanel();
        setTimeout(() => this.autocomplete()?.updatePosition());
      });
    }
  }

  displayFn = (coding: DemisCoding | undefined): string => {
    if (this.showCode()) {
      return coding ? `${coding.display} | ${coding.code}` : '';
    } else {
      return coding ? coding.display : '';
    }
  };

  // This method is called when the form control value in the parent changes
  // to ensure that the custom control’s UI reflects the updated value.
  writeValue(obj: any): void {
    if (obj === undefined || obj === null) {
      this.selectControl.reset();
      return;
    }

    const multi = this.multi();
    if (multi && Array.isArray(obj)) {
      this.options().forEach(opt => {
        opt.selected = obj.some(item => item.code === opt.code);
      });

      this.selectData = obj;
      return;
    }

    if (!multi && obj.code) {
      this.selectControl.setValue(obj);
    }
  }

  onTouched() {}

  markAsTouched() {
    this.formControl().markAsTouched();
    this.onTouched();
  }

  onChange(value: any) {}

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.disableSelectControl();
      return;
    }
    this.enableSelectControl();
  }

  private disableSelectControl(): void {
    this.selectControl.disable({ emitEvent: false });
    this.autocompleteDisabled = true;
    this.autocomplete()?.closePanel();
  }

  private enableSelectControl(): void {
    this.selectControl.enable({ emitEvent: false });
    this.autocompleteDisabled = false;
  }

  onClick() {
    this.clearOnEntry();
    if (!this.autocompleteDisabled) {
      this.autocomplete()?.openPanel();
    }
  }

  onInputFocus() {
    this.clearOnEntry();
  }

  private clearOnEntry(): void {
    if (!this.canToggleSelection()) {
      return;
    }
    if (this.multi() && this.autocomplete()?.panelOpen) {
      return;
    }
    this.suppressPropagation = true;
    this.selectControl.setValue('');
    this.suppressPropagation = false;
  }

  onClosePanel() {
    this.activeOption = undefined;
    if (this.multi()) {
      this.selectControl.setValue('');
    } else {
      this.populateLatestValidSelectionIfNothingHasBeenSelected();
    }
    this.markAsTouched();
  }

  onBlur() {
    if (this.multi() && !this.autocomplete()?.panelOpen) {
      this.selectControl.setValue('');
    }
  }

  private populateLatestValidSelectionIfNothingHasBeenSelected() {
    const selectValue = this.selectControl.value;
    const isUnselected = selectValue === '' || selectValue === null || typeof selectValue === 'string';
    if (isUnselected && this.latestValidSelection) {
      this.suppressPropagation = true;
      this.selectControl.setValue(this.latestValidSelection);
      this.suppressPropagation = false;
    }
  }

  getCurrentBreadcrumb(): string {
    return this.formControl().value?.breadcrumb ?? '';
  }

  onRemoveSelection(event: MouseEvent) {
    if (!this.canToggleSelection()) {
      return;
    }
    event.stopPropagation(); //required otherwise the field is still focused
    this.selectControl.setValue('');
    this.latestValidSelection = undefined;
  }

  createIdForAutocompleteInput(formlyField: FieldTypeConfig) {
    return formlyField.id ? `${formlyField.id}-input` : 'autocomplete-input-field';
  }

  ngOnDestroy() {
    this.statusSubscription?.unsubscribe();
  }
}
