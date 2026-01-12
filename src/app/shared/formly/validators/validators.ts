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

// only the year must be given
/**
 * @deprecated Use the new generic datepicker from Portal-Core instead
 */
export function Date1Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^\d{4}$/.test(control.value) ? {} : { date1: true };
}

// exactly the two date parts (M,J) must be given.
/**
 * @deprecated Use the new generic datepicker from Portal-Core instead
 */
export function Date2Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^\d{1,2}\.\d{4}$/.test(control.value) ? {} : { date2: true };
}

// exactly all three date parts (T,M,J) must be given.
/**
 * @deprecated Use the new generic datepicker from Portal-Core instead
 */
export function Date3Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(control.value) ? {} : { date3: true };
}

// either of the three formats above can be given
/**
 * @deprecated Use the new generic datepicker from Portal-Core instead
 */
export function Date123Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^((\d{1,2}\.)?\d{1,2}\.)?\d{4}$/.test(control.value) ? {} : { date123: true };
}
