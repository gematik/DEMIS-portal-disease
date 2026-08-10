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

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ADDITIONAL_INFO_REG_EXP,
  BLANK_ERROR_MSG,
  BSNR_ERROR_MSG,
  BSNR_REG_EXP,
  CODING_ERROR_MGS,
  EMAIL_ERROR_MSG,
  EMAIL_REG_EXP,
  HOUSE_NBR_ERROR_MSG,
  HOUSE_NBR_REG_EXP,
  MINIMUM_LENGTH_NOT_REACHED,
  NAME_REG_EXP,
  NUMBER_ERROR_MSG,
  OPTION_INCOMPLETE,
  OPTION_MISMATCH,
  PHONE_ERROR_MSG,
  PHONE_REG_EXP,
  POSITIVE_NUMBER,
  REQUIRED_FIELD,
  STREET_REG_EXP,
  TEXT_ERROR_MSG,
  TEXT_REG_EXP,
  UUID_MSG,
  UUID_REG_EXP,
  ZIP_GERMANY_ERROR_MSG,
  ZIP_GERMANY_REG_EXP,
  ZIP_GERMANY_SHORT_ERROR_MSG,
  ZIP_GERMANY_SHORT_REG_EXP,
  ZIP_INTERNATIONAL_ERROR_MSG,
  ZIP_INTERNATIONAL_REG_EXP,
} from './common-utils';
import { ValidationWrapperComponent } from './validation-wrapper/validation-wrapper.component';

export const NotificationFormValidationModule = FormlyModule.forRoot({
  validators: [
    { name: 'bsNrValidator', validation: bsNrValidation },
    { name: 'codingValidator', validation: codingValidation },
    { name: 'germanZipValidator', validation: germanZipValidation },
    { name: 'germanShortZipValidator', validation: germanShortZipValidation },
    { name: 'houseNumberValidator', validation: houseNumberValidation },
    { name: 'internationalZipValidator', validation: internationalZipValidation },
    { name: 'textValidator', validation: textValidation },
    { name: 'streetValidator', validation: streetValidation },
    { name: 'phoneValidator', validation: phoneValidation, options: { required: true } },
    { name: 'emailValidator', validation: emailValidation, options: { required: true } },
    { name: 'nameValidator', validation: nameValidation },
    { name: 'additionalInfoTextValidator', validation: additionalInfoTextValidation },
    { name: 'numberValidator', validation: numberValidator },
    { name: 'nonBlankValidator', validation: nonBlankValidator },
    { name: 'optionMatches', validation: optionMatchesValidation },
    { name: 'isCodeChoosen', validation: validOptionHasBeenSelectedFromDropdownMenu },
    { name: 'uuidValidator', validation: uuidValidator },
  ],
  validationMessages: [
    { name: 'minLength', message: MINIMUM_LENGTH_NOT_REACHED },
    { name: 'required', message: requiredValidationMessage },
    { name: 'optionMismatch', message: OPTION_MISMATCH },
    { name: 'optionIncomplete', message: OPTION_INCOMPLETE },
    { name: 'codeChoosen', message: CODING_ERROR_MGS },
    { name: 'min', message: quantityValidationMessage },
    { name: 'max', message: quantityValidationMessage },
  ],
  wrappers: [{ name: 'validation', component: ValidationWrapperComponent }],
});

//********** FUNKTIONEN **************

// Exportable:...

export function validateBSNR(bsNummer: string): any {
  if (!bsNummer) {
    return null;
  }
  return matchesRegExp(BSNR_REG_EXP, bsNummer) ? null : setValidationMessage(BSNR_ERROR_MSG);
}

export function validateGermanZip(zip: string): any {
  if (!zip) {
    return null;
  }
  return matchesRegExp(ZIP_GERMANY_REG_EXP, zip) ? null : setValidationMessage(ZIP_GERMANY_ERROR_MSG);
}

export function validateGermanShortZip(zip: string): any {
  return zip ? (matchesRegExp(ZIP_GERMANY_SHORT_REG_EXP, zip) ? null : setValidationMessage(ZIP_GERMANY_SHORT_ERROR_MSG)) : null;
}

export function termValidation(term: string): any {
  // following signs not accepted: @ \ * ? $ | = ´ ' " [ ] { } < >
  if (!term) return null;
  return validateNotBlank(term) || (matchesRegExp(TEXT_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG));
}

export function validateStreet(term: string): any {
  // following signs not accepted: @ \ * ? $ | = " [ ] { } < >
  if (!term) return null;
  return validateNotBlank(term) || (matchesRegExp(STREET_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG));
}

export function validateName(term: string): any {
  // following signs not accepted: @ \ * ? $ | = ´ ' " [ ] { } < > 0-9
  if (!term) return null;
  return validateNotBlank(term) || (matchesRegExp(NAME_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG));
}

export function checkAdditionalInfoText(term: string): any {
  // Following signs not accepted: \ = ´ ' < >
  if (!term) {
    return null;
  }
  return matchesRegExp(ADDITIONAL_INFO_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG);
}

export function validateHouseNumber(hausNumber: string): any {
  if (!hausNumber) {
    return null;
  }
  return matchesRegExp(HOUSE_NBR_REG_EXP, hausNumber) ? null : setValidationMessage(HOUSE_NBR_ERROR_MSG);
}

export function validateInternationalZip(zip: string): any {
  if (!zip) {
    return null;
  }
  return matchesRegExp(ZIP_INTERNATIONAL_REG_EXP, zip) ? null : setValidationMessage(ZIP_INTERNATIONAL_ERROR_MSG);
}

function germanShortZipValidation(control: AbstractControl): any {
  return validateGermanShortZip(control.value);
}

export function validatePhoneNo(phoneNumber: string, required: boolean = true): boolean | null {
  if (required || phoneNumber) {
    return validatePhoneNoRegex(phoneNumber);
  } else {
    return null;
  }
}

function validatePhoneNoRegex(phoneNumber: string): boolean | null {
  const number = Array.isArray(phoneNumber) ? phoneNumber[0].phoneNo : phoneNumber;
  return matchesRegExp(PHONE_REG_EXP, number) ? null : setValidationMessage(PHONE_ERROR_MSG);
}

export function validateNotBlank(s: string): any {
  if (!s) return null;
  return matchesRegExp(/.*\S.*/, s) ? null : setValidationMessage(BLANK_ERROR_MSG);
}

export function validateUUID(s: string): any {
  if (!s) return null;
  return matchesRegExp(UUID_REG_EXP, s) ? null : setValidationMessage(UUID_MSG);
}

export function validateEmail(email: string, required: boolean = true): ValidationErrors | null {
  if (required || email) {
    return validateEmailRegex(email);
  } else {
    return null;
  }
}

function validateEmailRegex(email: string): ValidationErrors | null {
  const emailToValidate = Array.isArray(email) ? email[0].email : email;
  return matchesRegExp(EMAIL_REG_EXP, emailToValidate) ? null : setValidationMessage(EMAIL_ERROR_MSG);
}

export function checkIsNumber(value: string | undefined | null): { fieldMatch: { message: string } } | null {
  if (!value) {
    return null;
  }
  return matchesRegExp(POSITIVE_NUMBER, value) ? null : setValidationMessage(NUMBER_ERROR_MSG);
}

export function matchesRegExp(regExp: RegExp, value: string): boolean {
  return regExp.test(value);
}

export function setValidationMessage(valMessage: string): any {
  return { fieldMatch: { message: valMessage } };
}

// Private:...

export function bsNrValidation(control: AbstractControl): ValidationErrors | null {
  const parentValue = control.parent?.value;
  const hasBsnrRadioButton = parentValue != null && 'existsBsnr' in parentValue;
  if (hasBsnrRadioButton) {
    // Case1: BSNR validation is linked to a radio button (existsBsnr).
    return parentValue.existsBsnr ? validateBSNR(control.value) : null;
  }
  // Case2: BSNR validation is not linked to a radio button.
  return control.value ? validateBSNR(control.value) : null;
}

function codingValidation(control: AbstractControl): any {
  return !!control.value && !(control.value instanceof Object) ? setValidationMessage(CODING_ERROR_MGS) : null;
}

function partialDateNotInFuture(date: string): boolean {
  const splitDate: Array<string> = date.split('.');
  const now: Date = new Date();

  switch (splitDate.length) {
    case 1:
      return +splitDate[0] <= now.getFullYear(); // length = 1 when date = yyyy
    case 2:
      return new Date(+splitDate[1], +splitDate[0] - 1) <= now; // -1 as month is monthIndex
    case 3:
      return new Date(+splitDate[2], +splitDate[1] - 1, +splitDate[0]) <= now;
    default:
      return false;
  }
}

function germanZipValidation(control: AbstractControl): any {
  return validateGermanZip(control.value);
}

function textValidation(control: AbstractControl): any {
  return termValidation(control.value);
}

function streetValidation(control: AbstractControl): any {
  return validateStreet(control.value);
}

function nameValidation(control: AbstractControl): any {
  return validateName(control.value);
}

function houseNumberValidation(control: AbstractControl): any {
  return validateHouseNumber(control.value);
}

function internationalZipValidation(control: AbstractControl): any {
  return validateInternationalZip(control.value);
}

export function phoneValidation(control: AbstractControl, field: FormlyFieldConfig, options: any): any {
  const isRequired = field.props?.required ?? options.required;
  return validatePhoneNo(control.value, isRequired);
}

export function emailValidation(control: AbstractControl, field: FormlyFieldConfig, options: any): any {
  const isRequired = field.props?.required ?? options.required;
  return validateEmail(control.value, isRequired);
}

function additionalInfoTextValidation(control: AbstractControl): any {
  return checkAdditionalInfoText(control.value);
}

function numberValidator(control: AbstractControl): any {
  return checkIsNumber(control.value);
}

function nonBlankValidator(control: AbstractControl): any {
  return validateNotBlank(control.value);
}

function uuidValidator(control: AbstractControl): any {
  return validateUUID(control.value);
}

export async function optionMatchesValidation(control: AbstractControl, field: FormlyFieldConfig): Promise<ValidationErrors> {
  return lastValueFrom(
    field.props!['filter'](control.value).pipe(
      map((options: any[]) => {
        if (!control.value) {
          return null;
        }
        if (options.length === 0) {
          return { optionMismatch: true };
        }
        if (options.indexOf(control.value) >= 0) {
          return null;
        }
        return { optionIncomplete: true };
      })
    )
  );
}

/**
 * This check can be used in a formly field of type autocomplete-coding.
 * It is not appropriate for formly field of type autocomplete-multi-coding
 */
export function validOptionHasBeenSelectedFromDropdownMenu(control: AbstractControl, field: FormlyFieldConfig): ValidationErrors | null {
  if (field.props?.required) {
    return control.value?.code ? null : { codeChoosen: true };
  } else {
    return control.value?.code || control.value === '' ? null : { codeChoosen: true };
  }
}

export function quantityValidationMessage(error: any, field: FormlyFieldConfig) {
  return `Der eingegebene Wert muss zwischen ${field.props?.min} und ${field.props?.max} liegen.`;
}

export function requiredValidationMessage(error: any, field: FormlyFieldConfig) {
  if (environment.diseaseConfig?.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION && field.props?.min && field.props?.max) {
    return `Der eingegebene Wert muss zwischen ${field.props?.min} und ${field.props?.max} liegen.`;
  } else {
    return REQUIRED_FIELD;
  }
}
