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

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { DateTime } from 'luxon';
import { NotifiedPersonBasicInfo, PractitionerInfo } from 'src/api/notification';

// CONST:..................................

/*** id: de-DE ***/
export const LOCALE_ID_DE: string = 'de-DE';
registerLocaleData(localeDe, LOCALE_ID_DE, localeDeExtra);

/*** format: TT.MM.JJJJ ***/
export const UI_DATE_FORMAT_GER: string = 'TT.MM.JJJJ';
/*** format: dd.LL.yyyy ***/
export const UI_LUXON_DATE_FORMAT: string = 'dd.LL.yyyy';
/*** code: DE ***/
export const GERMANY_COUNTRY_CODE: string = 'DE';
/*** code: 21481 ***/
export const ZIP_CODE_DEFAULT: string = '21481';

export const ZIP_GERMANY_MIN_LENGTH: number = 4;
export const ZIP_GERMANY_MAX_LENGTH: number = 5;
export const ZIP_INTERNATIONAL_MIN_LENGTH: number = 3;
export const ZIP_INTERNATIONAL_MAX_LENGTH: number = 50;
export const TEXT_MAX_LENGTH: number = 100;

// VALIDATIONS: More about this Reg-exp rules: https://wiki.gematik.de/pages/viewpage.action?pageId=459871766 ..........

export const BSNR_REG_EXP: RegExp = /^\d{9}$/; // 9-stellige Nummer
export const DATE_FORMAT_PARTIAL_EXP: RegExp = /^(((0?[1-9]|[1-2][0-9]|3[0-1])\.)?(0?[1-9]|1[0-2])\.)?([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)$/; //yyyy, mm.yyyy, dd.mm.yyyy, m.yyyy, d.m.yyyy
export const DATE_FORMAT_DD_MM_YYYY_REG_EXP: RegExp = /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.]([1-9])\d{3}$/; // for the format: dd.mm.yyyy
export const EMAIL_REG_EXP: RegExp = /^[A-Z0-9+_.-]+@[A-Z0-9.-]{5,320}$/i;
export const HOUSE_NBR_REG_EXP: RegExp = /^[0-9][\/ \-+0-9a-zA-Z]{0,50}$/; // No special characters allowed
export const PHONE_REG_EXP: RegExp = /^[0+][0-9 \-()]{6,50}$/; // Starts with 0 or +, followed by 7-15 digits
export const TEXT_REG_EXP: RegExp = /^[^@\\*?$|=´'"\[\]{}<>]{0,100}$/; // No dangerous signs allowed
export const STREET_REG_EXP: RegExp = /^[^@\\*?$|=´"\[\]{}<>]{0,100}$/;
export const ADDITIONAL_INFO_REG_EXP: RegExp = /^[^\\=´'<>]{0,5000}$/; // No dangerous signs allowed
export const ZIP_GERMANY_REG_EXP: RegExp = /^\d{5}$/; // 5 Ziffern allowed
export const ZIP_INTERNATIONAL_REG_EXP: RegExp = /(?=^[\w\- ]{3,50}$)(?=.*\d)/;
export const NAME_REG_EXP: RegExp = /^[^@\\*?$|=´'"\[\]{}<>0-9]{0,100}$/; // from https://wiki.gematik.de/x/JRlpGw
export const POSITIVE_NUMBER: RegExp = /^\d{0,10}$/;

export const REQUIRED_FIELD: string = 'Diese Angabe wird benötigt';
export const OPTION_MISMATCH: string = 'Keine Übereinstimmung gefunden';
export const OPTION_INCOMPLETE: string = 'Unvollständige Eingabe';
export const MINIMUM_LENGTH_NOT_REACHED = 'Minimallänge nicht erreicht';
export const BSNR_ERROR_MSG: string = 'Bitte geben Sie Ihre 9-stellige Betriebsstättennummer (BSNR) ein';
export const CODING_ERROR_MGS: string = 'Bitte wählen Sie eine der verfügbaren Optionen';
export const DATE_FORMAT_ERROR_MSG: string = 'Kein gültiges Datum (Beispiele: 05.11.1998)';
export const DATE_NOT_EXIST: string = 'Das Datum existiert nicht!';
export const PARTIAL_DATE_FORMAT_ERROR_MSG: string = 'Kein gültiges Datum (Beispiele: 2022, 08.1978, 05.11.1998)';
export const DATE_IN_FUTURE_ERROR_MSG: string = 'Das Datum darf nicht in der Zukunft liegen';
export const EMAIL_ERROR_MSG: string = 'Keine gültige E-Mail (Beispiel: meine.Email@email.de)';
export const BLANK_ERROR_MSG: string = 'Es muss mindestens ein Zeichen eingegeben werden';
export const HOUSE_NBR_ERROR_MSG: string = 'Keine gültige Hausnummer';
export const END_DATE_LATER_THAN_START_DATE_ERROR_MSG: string = 'Das Startdatum darf nicht nach dem Enddatum liegen';
export const PHONE_ERROR_MSG: string = 'Die Telefonnummer muss mit 0 oder + beginnen, gefolgt von mindestens 6 Ziffern.';
export const TEXT_ERROR_MSG: string = 'Ihre Eingabe enthält unzulässige Sonderzeichen';
export const ZIP_GERMANY_ERROR_MSG: string = 'Die Postleitzahl muss aus 5 Ziffern bestehen';
export const ZIP_INTERNATIONAL_ERROR_MSG: string = 'Die Postleitzahl muss aus mindestens 3 Zeichen und einer Ziffer bestehen';
export const NUMBER_ERROR_MSG: string = 'Bitte geben Sie eine positive Zahl ein.';
export const VALUE_DEFAULT_PLACEHOLDER: string = 'Bitte eingeben';
export const VALUE_DEFUALT_SELECT_PLACEHOLDER = 'Bitte auswählen';

/***
 * to convert string to Luxon date
 *
 * @param date
 * @param format
 */
export function stringToDateFromLuxon(date: string, format?: string): Date | null {
  format = format ?? UI_LUXON_DATE_FORMAT;
  return !!date && DateTime.fromFormat(date, format).isValid ? DateTime.fromFormat(date, format).toJSDate() : null;
}

/**
 * Create a new function that attempts to match an unknown value to an instance
 * of the given Enum. If the function fails, an error is thrown. Otherwise the
 * matched instance is returned.
 */
function createEnumParser<Enum>(enumDefinition: Record<string, Enum>) {
  return function (val: unknown): Enum {
    if (typeof val === 'string') {
      const titleCase = `${val[0].toLocaleUpperCase()}${val.substring(1).toLocaleLowerCase()}`;
      const result = enumDefinition[titleCase];
      if (result !== undefined) {
        return result;
      }
    }

    throw new Error(`Unknown value '${val}'`);
  };
}

// 'None' is hardcoded and not in the enum because it's only needed for the frontend
export const ExtendedSalutationEnum = {
  ...PractitionerInfo.SalutationEnum,
  None: 'None' as ExtendedSalutationType,
};

export type ExtendedSalutationType = PractitionerInfo.SalutationEnum | 'None';

export const parseGender = createEnumParser<NotifiedPersonBasicInfo.GenderEnum>(NotifiedPersonBasicInfo.GenderEnum);
export const parseSalutation = createEnumParser<ExtendedSalutationType>(ExtendedSalutationEnum);
