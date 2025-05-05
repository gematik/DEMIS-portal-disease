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

import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { DemisCoding } from '../../../demis-types';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { startWith } from 'rxjs/operators';
import { map, Observable } from 'rxjs';
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
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() formControl: FormControl = new FormControl();
  @Input() clearable: boolean = true;
  @Input() errorStateMatcher: ErrorStateMatcher = new ErrorStateMatcher();
  @Input() formlyField?: FieldTypeConfig;
  @Input() key: string | number | (string | number)[] = '';
  @Input() multi!: boolean;
  @Input() placeholder: string = '';
  @Input() showCode!: boolean;
  @Input() options: DemisCoding[] = [];
  @ViewChild(MatAutocompleteTrigger) autocomplete?: MatAutocompleteTrigger;
  latestValidSelection?: DemisCoding;
  selectData: Array<DemisCoding> = [];
  selectControl: FormControl = new FormControl('');
  filteredCodings!: Observable<DemisCoding[]>;
  activeOption?: DemisCoding;

  ngOnInit() {
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
      if (!this.multi && this.formControl.value !== value) {
        this.formControl.setValue(value);
        this.onChange(value);
        this.markAsTouched();
      }

      if (!this.formControl.errors && this.formControl.value !== '') {
        this.latestValidSelection = this.formControl.value;
      }
    });
  }

  private findMatchingOptions(value: string): DemisCoding[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.options && this.options.length
      ? this.options.filter(coding => coding.display.toLowerCase().includes(filterValue) || (this.showCode && coding.code.includes(filterValue)))
      : [];
  }

  toggleSelection = (data: DemisCoding): void => {
    data.selected = !data.selected;

    if (data.selected) {
      this.selectData.push(data);
    } else {
      const i = this.selectData.findIndex(value => value.code === data.code);
      this.selectData.splice(i, 1);
    }

    this.formControl.setValue(this.selectData);
    this.onChange(this.selectData);
    this.markAsTouched();
    setTimeout(() => {
      if (this.autocomplete) {
        this.autocomplete.updatePosition();
      }
    }, 0);
  };

  removeChip = (data: DemisCoding): void => {
    this.toggleSelection(data);
  };

  handleSpace(evt: Event): boolean {
    evt.preventDefault();
    if (!this.multi || !this.activeOption) {
      return true;
    }
    if (this.activeOption) {
      this.toggleSelection(this.activeOption);
    }
    return false;
  }

  activateOption(evt: MatAutocompleteActivatedEvent) {
    this.activeOption = evt.option?.value;
  }

  displayFn(coding: DemisCoding | undefined): string {
    if (this.showCode) {
      return coding ? `${coding.display} | ${coding.code}` : '';
    } else {
      return coding ? coding.display : '';
    }
  }

  // This method is called when the form control value in the parent changes
  // to ensure that the custom control’s UI reflects the updated value.
  writeValue(obj: any): void {
    if (obj === undefined || obj === null) {
      this.selectControl.reset();
      return;
    }

    if (this.multi && Array.isArray(obj)) {
      this.options.forEach(opt => {
        opt.selected = !!obj.find(item => item.code === opt.code);
      });

      this.selectData = obj;
      return;
    }

    if (!this.multi && obj.code) {
      this.selectControl.setValue(obj);
      return;
    }
  }

  onTouched() {}

  markAsTouched() {
    this.formControl.markAsTouched();
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
      this.selectControl.disable();
    }
  }

  onClick() {
    this.selectControl.setValue('');
  }

  onClosePanel() {
    this.activeOption = undefined;
    this.populateLatestValidSelectionIfNothingHasBeenSelected();
    this.markAsTouched();
  }

  onBlur() {
    if (this.multi) {
      this.selectControl.setValue('');
    }
  }

  private populateLatestValidSelectionIfNothingHasBeenSelected() {
    const currentValueDisplayed = this.formControl.value;
    if (currentValueDisplayed === '' && this.latestValidSelection) {
      this.selectControl.setValue(this.latestValidSelection);
    }
  }

  getCurrentBreadcrumb(): string {
    return this.formControl.value?.breadcrumb ?? '';
  }

  onRemoveSelection(event: MouseEvent) {
    event.stopPropagation(); //required otherwise the field is still focused
    this.selectControl.setValue('');
    this.latestValidSelection = undefined;
  }

  createIdForAutocompleteInput(formlyField: FieldTypeConfig) {
    return formlyField.id ? `${formlyField.id}-input` : 'autocomplete-input-field';
  }
}
