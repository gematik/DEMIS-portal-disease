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

import { Component, OnInit } from '@angular/core';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { Subscription } from 'rxjs';
import { DemisCoding } from '../../../../demis-types';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-button-coding',
  templateUrl: './radio-button-coding.component.html',
  styleUrls: ['./radio-button-coding.component.scss'],
  imports: [MatRadioGroup, ReactiveFormsModule, FormlyModule, MatRadioButton],
})
export class RadioButtonCodingComponent extends FieldType<FieldTypeConfig> implements OnInit {
  codings: DemisCoding[] = [];
  private changesSubscription?: Subscription;

  ngOnInit() {
    this.codings = this.props['options'] as DemisCoding[];

    // Normalize both the initial value and later changes.
    // The initial value may already be present before ngOnInit runs, especially for
    // preloaded data in lazily created repeat-section fields. valueChanges only
    // covers later updates.
    this.resolveAndApplyInternalCoding(this.formControl.value);
    this.changesSubscription = this.formControl.valueChanges.subscribe((value: any) => {
      this.resolveAndApplyInternalCoding(value);
    });

    const defaultCode: string | undefined = this.props['defaultCode'];
    if (defaultCode && this.isFormControlEmpty()) {
      // Only apply the default code if the form control hasn't already been
      // populated (e.g. by clipboard import / model preload). Otherwise the
      // default would overwrite a valid imported value when this field is
      // created lazily inside a repeat-section (ngOnInit runs AFTER the
      // importer has written to the model).
      const defaultCoding = this.codings.find(coding => coding.code === defaultCode);
      if (defaultCoding) {
        this.formControl.setValue(defaultCoding);
      }
    }
  }

  /**
   * Replaces an externally provided Coding object with the matching option instance
   * from this radio button's available codings.
   *
   * This is needed because the radio group compares selected values by object reference.
   * Preloaded values, for example from dummy data or imports, may have the same code/system
   * but not be the same object instance as the option used by the radio button.
   *
   * @param value the current form control value to normalize
   */
  private resolveAndApplyInternalCoding(value: any): void {
    if (!value) return;

    const isAlreadyInternalValue = this.codings.some(coding => coding === value);
    if (isAlreadyInternalValue) return;

    const internalValue = this.codings.find(coding => coding.code === value.code && coding.system === value.system);

    if (internalValue) {
      this.formControl.setValue(internalValue, { emitEvent: false });
    }
  }

  private isFormControlEmpty(): boolean {
    const v = this.formControl.value;
    return v === null || v === undefined || v === '';
  }

  override ngOnDestroy() {
    this.changesSubscription?.unsubscribe();
  }
}
