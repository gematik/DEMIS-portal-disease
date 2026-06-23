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

import { getNestedValue, setNestedValue } from './object-path.util';

describe('object-path.util', () => {
  describe('getNestedValue', () => {
    it('should return a top-level value', () => {
      expect(getNestedValue({ name: 'test' }, 'name')).toBe('test');
    });

    it('should return a deeply nested value', () => {
      const obj = { a: { b: { c: 'deep' } } };
      expect(getNestedValue(obj, 'a.b.c')).toBe('deep');
    });

    it('should return undefined for missing intermediate path', () => {
      expect(getNestedValue({ a: {} }, 'a.b.c')).toBeUndefined();
    });

    it('should return undefined when intermediate is not an object', () => {
      expect(getNestedValue({ a: 'string' }, 'a.b')).toBeUndefined();
    });

    it('should return undefined when obj is null or undefined', () => {
      expect(getNestedValue(null, 'a')).toBeUndefined();
      expect(getNestedValue(undefined, 'a')).toBeUndefined();
    });

    it('should return undefined when obj is not an object', () => {
      expect(getNestedValue(42, 'a')).toBeUndefined();
    });
  });

  describe('setNestedValue', () => {
    it('should set a top-level value', () => {
      const obj: Record<string, unknown> = {};
      setNestedValue(obj, 'name', 'test');
      expect(obj['name']).toBe('test');
    });

    it('should create nested objects and set deep value', () => {
      const obj: Record<string, unknown> = {};
      setNestedValue(obj, 'a.b.c', 'deep');
      expect((obj as any).a.b.c).toBe('deep');
    });

    it('should overwrite existing intermediate non-object values', () => {
      const obj: Record<string, unknown> = { a: 'string' };
      setNestedValue(obj, 'a.b', 'value');
      expect((obj as any).a.b).toBe('value');
    });

    it('should not throw when obj is null or undefined', () => {
      expect(() => setNestedValue(null, 'a.b', 'v')).not.toThrow();
      expect(() => setNestedValue(undefined, 'a.b', 'v')).not.toThrow();
    });

    it('should not throw when obj is not an object', () => {
      expect(() => setNestedValue(42, 'a', 'v')).not.toThrow();
    });
  });
});
