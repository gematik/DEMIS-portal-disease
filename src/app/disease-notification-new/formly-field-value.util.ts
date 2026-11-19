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

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Derives a model path from a field's position in the Formly configuration tree.
 *
 * The traversal follows every parent link from the field to the top-level Formly node. This is
 * necessary to reach keyed ancestors above any unkeyed groups. Only keyed nodes contribute model
 * path segments: an unkeyed group organizes fields in the Formly tree but does not represent a
 * property in the model. Each key is prepended to keep the final path in root-to-leaf order; array
 * keys contribute their individual values, while dotted string keys are split into segments.
 *
 * @param field Field whose location in the Formly configuration tree determines the model path.
 * @returns The highest Formly node in the parent chain and the path from its model to the target value.
 */
function resolveModelPathFromFieldTree(field: FormlyFieldConfig): { root: FormlyFieldConfig; path: string[] } {
  const path: string[] = [];
  let root = field;
  for (let current: FormlyFieldConfig | undefined = field; current; current = current.parent) {
    if (current.key !== undefined && current.key !== null) {
      path.unshift(...(Array.isArray(current.key) ? current.key.map(String) : String(current.key).split('.')));
    }
    root = current;
  }
  return { root, path };
}

/**
 * Writes a value to both the Formly model and the field's current control.
 *
 * Formly synchronizes control changes into the model only while a field is rendered, and restores
 * model values when a field is rendered. Updating both therefore preserves values for hidden or
 * not-yet-rendered fields. Group controls are patched so partial values are accepted; scalar
 * controls receive the value directly. If the control has not been built yet, the model is still
 * updated for its next render.
 *
 * @param field Target Formly field; its parent chain determines the model path.
 * @param value Value to store in the model and, when available, in the control.
 */
export function writeFieldValue(field: FormlyFieldConfig, value: unknown): void {
  const { root, path } = resolveModelPathFromFieldTree(field);
  if (path.length > 0 && root.model) {
    const parent = path.slice(0, -1).reduce((node, segment) => (node[segment] ??= {}), root.model);
    const lastPathSegment = path.at(-1);
    if (lastPathSegment !== undefined) {
      parent[lastPathSegment] = value;
    }
  }
  if (field.formControl instanceof FormGroup) {
    field.formControl.patchValue(value ?? {});
  } else {
    field.formControl?.setValue(value);
  }
}

/**
 * Clears a field tree by setting every keyed leaf to `null` in both model and control.
 *
 * Group fields are traversed recursively rather than patched as a whole, so only fields in the
 * supplied subtree are cleared. Unkeyed leaf fields have no model value and are left unchanged.
 *
 * @param field Root field or field group whose keyed descendants should be cleared.
 */
export function clearFieldValue(field: FormlyFieldConfig): void {
  if (field.fieldGroup?.length) {
    field.fieldGroup.forEach(child => clearFieldValue(child));
  } else if (field.key !== undefined && field.key !== null) {
    writeFieldValue(field, null);
  }
}

/**
 * Disables a Formly field immediately and preserves the disabled state across future renders.
 *
 * @param field Field to disable without changing its value.
 */
export function disableField(field: FormlyFieldConfig): void {
  field.props ??= {};
  field.props.disabled = true;
  field.formControl?.disable();
}

/**
 * Enables a Formly field immediately and preserves the enabled state across future renders.
 *
 * @param field Field to enable without changing its value.
 */
export function enableField(field: FormlyFieldConfig): void {
  field.props ??= {};
  field.props.disabled = false;
  field.formControl?.enable();
}
