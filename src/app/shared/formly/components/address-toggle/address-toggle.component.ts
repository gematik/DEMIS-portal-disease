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

import { Component, DoCheck, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { getNestedValue } from './object-path.util';

/**
 * A formly type that renders a toggle button to show/hide address fields.
 *
 * Uses Formly's hide property with resetOnHide=false to properly exclude hidden fields
 * from validation while preserving their values.
 * Automatically shows fields when data is imported externally (HexHex, Pastebox).
 */
@Component({
  selector: 'app-address-toggle',
  templateUrl: './address-toggle.component.html',
  styleUrls: ['./address-toggle.component.scss'],
  imports: [FormlyModule, MatButton, MatIcon],
})
export class AddressToggleComponent extends FieldType<FieldTypeConfig> implements OnInit, DoCheck {
  /** Signal controlling visibility of address fields */
  readonly addressVisible = signal(false);

  /**
   * Set to true when the user explicitly hides the fields via the toggle button.
   * Prevents ngDoCheck from auto-showing fields that the user intentionally hid.
   * Reset to false when fields become empty or user shows them again.
   */
  private _manuallyHidden = false;

  ngOnInit(): void {
    this.field.fieldGroup?.forEach(child => {
      child.resetOnHide = false;
      child.hide = true;
      if (child.props) {
        child.props['required'] = true;
      }
    });
  }

  /**
   * Detects external model changes (HexHex, Pastebox import) on every change
   * detection cycle. A fieldChanges-based subscription does not fire for hidden
   * fields whose FormControls are removed from the FormGroup.
   */
  ngDoCheck(): void {
    if (this._manuallyHidden) {
      // If model is cleared while manually hidden, allow auto-show on next import
      if (!this.hasModelValues()) {
        this._manuallyHidden = false;
      }
      return;
    }
    if (!this.addressVisible() && this.hasModelValues()) {
      this.showFieldsWithValues(this.captureCurrentValues());
    }
  }

  /**
   * Captures current model values for all child fields.
   */
  private captureCurrentValues(): Map<string, unknown> {
    const values = new Map<string, unknown>();
    this.field.fieldGroup?.forEach(child => {
      if (child.key) {
        const value = this.getFieldValue(child);
        if (value !== undefined && value !== null && value !== '') {
          values.set(String(child.key), value);
        }
      }
    });
    return values;
  }

  /**
   * Checks if any child field has a non-empty value in the model.
   */
  private hasModelValues(): boolean {
    return (
      this.field.fieldGroup?.some(child => {
        if (!child.key) return false;
        const value = this.getFieldValue(child);
        return value !== null && value !== undefined && value !== '';
      }) || false
    );
  }

  /**
   * Gets the value for a field, handling nested keys like 'street.answer.valueString'.
   */
  private getFieldValue(field: { key?: string | number | (string | number)[] }): unknown {
    return getNestedValue(this.model, String(field.key));
  }

  /**
   * Shows the address fields and patches values via FormControls.
   * Using patchValue ensures Formly's reactive pipeline stays consistent.
   */
  private showFieldsWithValues(values: Map<string, unknown>): void {
    // FIRST: Set addressVisible to block any further calls from the subscription
    this.addressVisible.set(true);

    // Second: Show fields so Formly creates FormControls
    this.field.fieldGroup?.forEach(child => (child.hide = false));
    this.options.detectChanges?.(this.field);

    // Third: Patch values via FormControls - Formly syncs Control → Model
    this.field.fieldGroup?.forEach(child => {
      if (child.key && child.formControl) {
        const value = values.get(String(child.key));
        if (value !== undefined) {
          child.formControl.patchValue(value, { emitEvent: false });
        }
      }
    });
  }

  /**
   * Shows the address fields (used by toggle button).
   */
  private showFields(): void {
    this._manuallyHidden = false;
    this.addressVisible.set(true);
    this.field.fieldGroup?.forEach(child => (child.hide = false));
    this.options.detectChanges?.(this.field);
  }

  /**
   * Hides the address fields. Formly handles the values via resetOnHide=false.
   */
  private hideFields(): void {
    this._manuallyHidden = true;
    this.addressVisible.set(false);
    this.field.fieldGroup?.forEach(child => (child.hide = true));
    this.options.detectChanges?.(this.field);
  }

  toggle(): void {
    if (this.addressVisible()) {
      this.hideFields();
    } else {
      this.showFields();
    }
  }
}
