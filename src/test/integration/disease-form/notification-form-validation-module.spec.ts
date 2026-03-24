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

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  bsNrValidation,
  setValidationMessage,
  validateEmail,
  validatePhoneNo,
  phoneValidation,
  emailValidation,
} from '../../../app/legacy/notification-form-validation-module';
import { BSNR_ERROR_MSG, EMAIL_ERROR_MSG, PHONE_ERROR_MSG } from '../../../app/legacy/common-utils';
import { FormlyFieldConfig } from '@ngx-formly/core';

describe('phoneValidation (Formly-Wrapper)', () => {
  it('gibt null zurück bei leerem Wert, wenn props.required=false', () => {
    const control = new FormControl('');
    const field: FormlyFieldConfig = { props: { required: false } };
    const options = { required: true };
    expect(phoneValidation(control, field, options)).toBeNull();
  });

  it('props.required=false hat Vorrang vor options.required=true', () => {
    const control = new FormControl('');
    const field: FormlyFieldConfig = { props: { required: false } };
    const options = { required: true };
    expect(phoneValidation(control, field, options)).toBeNull();
  });

  it('verwendet options.required=true als Fallback, wenn props.required nicht gesetzt', () => {
    const control = new FormControl('');
    const field: FormlyFieldConfig = { props: {} };
    const options = { required: true };
    expect(phoneValidation(control, field, options)).toEqual(setValidationMessage(PHONE_ERROR_MSG));
  });
});

describe('bsNrValidation', () => {
  describe('case1 (with radio button)', () => {
    it('returns validation error for invalid BSNR when radio button is true', () => {
      const form = new FormGroup({
        existsBsnr: new FormControl(true),
        bsnr: new FormControl('invalidBSNR'),
      });
      const control = form.get('bsnr');
      const result = bsNrValidation(control as AbstractControl);
      expect(result).toEqual(setValidationMessage(BSNR_ERROR_MSG));
    });

    it('returns null for valid BSNR when radio button is true', () => {
      const form = new FormGroup({
        existsBsnr: new FormControl(true),
        bsnr: new FormControl('123456789'),
      });
      const control = form.get('bsnr');
      const result = bsNrValidation(control as AbstractControl);
      expect(result).toBeNull();
    });

    it('returns null for invalid BSNR when radio button is false', () => {
      const form = new FormGroup({
        existsBsnr: new FormControl(false),
        bsnr: new FormControl('invalidBSNR'),
      });
      const control = form.get('bsnr');
      const result = bsNrValidation(control as AbstractControl);
      expect(result).toBeNull();
    });

    it('returns null for empty value when radio button is true', () => {
      const form = new FormGroup({
        existsBsnr: new FormControl(true),
        bsnr: new FormControl(''),
      });
      const control = form.get('bsnr');
      const result = bsNrValidation(control as AbstractControl);
      expect(result).toBeNull();
    });
  });

  describe('case2 (no radio button)', () => {
    it('returns validation error for invalid BSNR', () => {
      const form = new FormGroup({
        bsnr: new FormControl('invalidBSNR'),
      });
      const control = form.get('bsnr');
      const result = bsNrValidation(control as AbstractControl);
      expect(result).toEqual(setValidationMessage(BSNR_ERROR_MSG));
    });

    it('returns null for valid BSNR', () => {
      const form = new FormGroup({
        bsnr: new FormControl('123456789'),
      });
      const control = form.get('bsnr');
      const result = bsNrValidation(control as AbstractControl);
      expect(result).toBeNull();
    });

    it('returns null for empty value', () => {
      const form = new FormGroup({
        bsnr: new FormControl(''),
      });
      const control = form.get('bsnr');
      const result = bsNrValidation(control as AbstractControl);
      expect(result).toBeNull();
    });
  });
});

describe('validatePhoneNo', () => {
  describe('required=true (Standard-Verhalten)', () => {
    it('gibt einen Fehler zurück bei leerem Wert', () => {
      expect(validatePhoneNo('', true)).toEqual(setValidationMessage(PHONE_ERROR_MSG));
    });

    it('gibt einen Fehler zurück bei null', () => {
      expect(validatePhoneNo(null as any, true)).toEqual(setValidationMessage(PHONE_ERROR_MSG));
    });

    it('gibt einen Fehler zurück bei ungültiger Telefonnummer', () => {
      expect(validatePhoneNo('abc123', true)).toEqual(setValidationMessage(PHONE_ERROR_MSG));
    });

    it('gibt null zurück bei gültiger Telefonnummer (beginnt mit 0)', () => {
      expect(validatePhoneNo('0123456789', true)).toBeNull();
    });

    it('gibt null zurück bei gültiger Telefonnummer (beginnt mit +)', () => {
      expect(validatePhoneNo('+49 123 456789', true)).toBeNull();
    });
  });

  describe('required=false (Feld ist optional)', () => {
    it('gibt null zurück bei leerem Wert', () => {
      expect(validatePhoneNo('', false)).toBeNull();
    });

    it('gibt null zurück bei null', () => {
      expect(validatePhoneNo(null as any, false)).toBeNull();
    });

    it('gibt einen Fehler zurück bei ungültiger Telefonnummer, wenn ein Wert eingegeben wurde', () => {
      expect(validatePhoneNo('abc123', false)).toEqual(setValidationMessage(PHONE_ERROR_MSG));
    });

    it('gibt null zurück bei gültiger Telefonnummer', () => {
      expect(validatePhoneNo('0123456789', false)).toBeNull();
    });
  });

  describe('required-Standardwert (default: true)', () => {
    it('gibt einen Fehler zurück bei leerem Wert, wenn kein required-Parameter übergeben wird', () => {
      expect(validatePhoneNo('')).toEqual(setValidationMessage(PHONE_ERROR_MSG));
    });

    it('gibt null zurück bei gültiger Telefonnummer, wenn kein required-Parameter übergeben wird', () => {
      expect(validatePhoneNo('+49123456789')).toBeNull();
    });
  });
});

describe('validateEmail', () => {
  describe('required=true (Standard-Verhalten)', () => {
    it('gibt einen Fehler zurück bei leerem Wert', () => {
      expect(validateEmail('', true)).toEqual(setValidationMessage(EMAIL_ERROR_MSG));
    });

    it('gibt einen Fehler zurück bei null', () => {
      expect(validateEmail(null as any, true)).toEqual(setValidationMessage(EMAIL_ERROR_MSG));
    });

    it('gibt einen Fehler zurück bei ungültiger E-Mail-Adresse', () => {
      expect(validateEmail('keine-email', true)).toEqual(setValidationMessage(EMAIL_ERROR_MSG));
    });

    it('gibt null zurück bei gültiger E-Mail-Adresse', () => {
      expect(validateEmail('meine.Email@email.de', true)).toBeNull();
    });
  });

  describe('required=false (Feld ist optional)', () => {
    it('gibt null zurück bei leerem Wert', () => {
      expect(validateEmail('', false)).toBeNull();
    });

    it('gibt null zurück bei null', () => {
      expect(validateEmail(null as any, false)).toBeNull();
    });

    it('gibt einen Fehler zurück bei ungültiger E-Mail-Adresse, wenn ein Wert eingegeben wurde', () => {
      expect(validateEmail('keine-email', false)).toEqual(setValidationMessage(EMAIL_ERROR_MSG));
    });

    it('gibt null zurück bei gültiger E-Mail-Adresse', () => {
      expect(validateEmail('meine.Email@email.de', false)).toBeNull();
    });
  });

  describe('required-Standardwert (default: true)', () => {
    it('gibt einen Fehler zurück bei leerem Wert, wenn kein required-Parameter übergeben wird', () => {
      expect(validateEmail('')).toEqual(setValidationMessage(EMAIL_ERROR_MSG));
    });

    it('gibt null zurück bei gültiger E-Mail-Adresse, wenn kein required-Parameter übergeben wird', () => {
      expect(validateEmail('meine.Email@email.de')).toBeNull();
    });
  });
});
