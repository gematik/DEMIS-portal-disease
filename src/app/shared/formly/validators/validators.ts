/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

// only the year must be given
export function Date1Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^\d{4}$/.test(control.value) ? {} : { date1: true };
}

// exactly the two date parts (M,J) must be given.
export function Date2Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^\d{1,2}\.\d{4}$/.test(control.value) ? {} : { date2: true };
}

// exactly all three date parts (T,M,J) must be given.
export function Date3Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(control.value) ? {} : { date3: true };
}

// either of the three formats above can be given
export function Date123Validator(control: AbstractControl): ValidationErrors {
  return !control.value || /^((\d{1,2}\.)?\d{1,2}\.)?\d{4}$/.test(control.value) ? {} : { date123: true };
}
