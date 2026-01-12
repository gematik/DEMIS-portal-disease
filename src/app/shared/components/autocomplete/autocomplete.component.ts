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

import { Component, forwardRef, Input, OnInit, ViewChild, input, OnDestroy } from '@angular/core';
import { DemisCoding } from '../../../demis-types';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
import { map, Observable, Subscription } from 'rxjs';
import { MatAutocompleteActivatedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

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
  @ViewChild(MatAutocompleteTrigger) autocomplete?: MatAutocompleteTrigger;
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
        this.autocomplete?.closePanel();
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
        // this might be good behaviour, or it might not
        if (matchingOptions.length === 1 && matchingOptions[0].display === value) {
          this.selectControl.setValue(matchingOptions[0]);
        }
        return matchingOptions;
      })
    );

    this.selectControl.valueChanges.subscribe((value: DemisCoding | string) => {
      const formControl = this.formControl();
      if (!this.multi() && formControl.value !== value) {
        formControl.setValue(value);
        this.onChange(value);
      }

      if (!formControl.errors && formControl.value !== '') {
        this.latestValidSelection = formControl.value;
      }
    });
  }

  private findMatchingOptions(value: string): DemisCoding[] {
    const filterValue = value ? value.toLowerCase() : '';
    const options = this.options();
    return options && options.length
      ? options.filter(coding => coding.display.toLowerCase().includes(filterValue) || (this.showCode() && coding.code.includes(filterValue)))
      : [];
  }

  private isDisabled(): boolean {
    return this.formControl().disabled || this.selectControl.disabled;
  }

  toggleSelection = (data: DemisCoding): void => {
    if (this.isDisabled()) return;
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
      if (this.autocomplete) {
        this.autocomplete.updatePosition();
      }
    }, 0);
  };

  removeChip = (data: DemisCoding): void => {
    if (this.isDisabled()) return;
    this.toggleSelection(data);
  };

  handleSpace(evt: Event): boolean {
    if (this.isDisabled()) return true;
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
    if (this.isDisabled()) return;
    this.activeOption = evt.option?.value;
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
        opt.selected = !!obj.find(item => item.code === opt.code);
      });

      this.selectData = obj;
      return;
    }

    if (!multi && obj.code) {
      this.selectControl.setValue(obj);
      return;
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
      this.selectControl.disable({ emitEvent: false });
      this.autocompleteDisabled = true;
      this.autocomplete?.closePanel();
    } else {
      this.selectControl.enable({ emitEvent: false });
      this.autocompleteDisabled = false;
    }
  }

  onClick() {
    if (this.isDisabled()) return;
    this.selectControl.setValue('');
  }

  onClosePanel() {
    this.activeOption = undefined;
    this.populateLatestValidSelectionIfNothingHasBeenSelected();
    this.markAsTouched();
  }

  onBlur() {
    if (this.multi()) {
      this.selectControl.setValue('');
    }
  }

  private populateLatestValidSelectionIfNothingHasBeenSelected() {
    const currentValueDisplayed = this.formControl().value;
    if (currentValueDisplayed === '' && this.latestValidSelection) {
      this.selectControl.setValue(this.latestValidSelection);
    }
  }

  getCurrentBreadcrumb(): string {
    return this.formControl().value?.breadcrumb ?? '';
  }

  onRemoveSelection(event: MouseEvent) {
    if (this.isDisabled()) return;
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
