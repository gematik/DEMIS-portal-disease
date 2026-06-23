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

/**
 * Gets a nested value from an object using a dot-separated path.
 * e.g., getNestedValue(obj, 'a.b.c') returns obj.a.b.c
 */
export function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  return path.split('.').reduce((current: unknown, key: string) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
  }, obj);
}

/**
 * Sets a nested value in an object using a dot-separated path.
 * Creates intermediate objects as needed.
 * e.g., setNestedValue(obj, 'a.b.c', 'value') sets obj.a.b.c = 'value'
 */
export function setNestedValue(obj: unknown, path: string, value: unknown): void {
  if (!obj || typeof obj !== 'object') return;
  const keys = path.split('.');
  let current = obj as Record<string, unknown>;
  keys.slice(0, -1).forEach(key => {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  });
  const lastKey = keys.at(-1);
  if (lastKey) {
    current[lastKey] = value;
  }
}
