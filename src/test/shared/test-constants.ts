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

//field ids
export const FIELD_BIRTH_DATE = 'birthDate';
export const FIELD_FIRST_NAME = 'firstname';
export const FIELD_LAST_NAME = 'lastname';
export const FIELD_INSTITUTIONAME = 'institutionName';
export const FIELD_BSNR = 'bsnr';
export const FIELD_NOTIFIER_FACILITY_ADDRESS_HOUSE_NUMBER = 'houseNumber';
export const FIELD_NOTIFIER_FACILITY_ADDRESS_STREET = 'street';
export const FIELD_NOTIFIER_FACILITY_ADDRESS_ZIP = 'zip';
export const FIELD_NOTIFIER_FACILITY_ADDRESS_CITY = 'city';
export const FIELD_RESIDENCE_ADDRESS_HOUSE_NUMBER = 'residence-address-houseNumber';
export const FIELD_RESIDENCE_ADDRESS_STREET = 'residence-address-street';
export const FIELD_RESIDENCE_ADDRESS_ZIP = 'residence-address-zip';
export const FIELD_RESIDENCE_ADDRESS_CITY = 'residence-address-city';
export const FIELD_CURRENT_ADDRESS_INSTITUTION_NAME = 'currentAddressInstitutionName';
export const FIELD_CURRENT_ADDRESS_HOUSE_NUMBER = 'current-address-houseNumber';
export const FIELD_CURRENT_ADDRESS_STREET = 'current-address-street';
export const FIELD_CURRENT_ADDRESS_CITY = 'current-address-city';
export const FIELD_CURRENT_ADDRESS_ZIP = 'current-address-zip';
export const FIELD_CURRENT_ADDRESS_COUNTRY = 'current-address-country';
export const FIELD_CURRENT_ADDRESS_TYPE = 'currentAddressType';

//clipboard keys
export const CLIPBOARD_KEY_RESIDENCE_HOUSENR = 'P.r.houseNumber';
export const CLIPBOARD_KEY_RESIDENCE_STREET = 'P.r.street';
export const CLIPBOARD_KEY_RESIDENCE_ZIP = 'P.r.zip';
export const CLIPBOARD_KEY_RESIDENCE_CITY = 'P.r.city';
export const CLIPBOARD_KEY_RESIDENCE_TYPE = 'P.r.type';
export const CLIPBOARD_KEY_CURRENT_HOUSENR = 'P.c.houseNumber';
export const CLIPBOARD_KEY_CURRENT_STREET = 'P.c.street';
export const CLIPBOARD_KEY_CURRENT_ZIP = 'P.c.zip';
export const CLIPBOARD_KEY_CURRENT_CITY = 'P.c.city';
export const CLIPBOARD_KEY_CURRENT_COUNTRY = 'P.c.country';
export const CLIPBOARD_KEY_CURRENT_TYPE = 'P.c.type';
export const CLIPBOARD_KEY_CURRENT_NAME = 'P.c.name';
export const CLIPBOARD_KEY_FACILITY_NAME = 'F.name';
export const CLIPBOARD_KEY_FACILITY_STREET = 'F.street';
export const CLIPBOARD_KEY_FACILITY_HOUSENR = 'F.houseNumber';
export const CLIPBOARD_KEY_FACILITY_ZIP = 'F.zip';
export const CLIPBOARD_KEY_FACILITY_CITY = 'F.city';
export const CLIPBOARD_KEY_NOTIFIER_GIVEN = 'N.given';
export const CLIPBOARD_KEY_NOTIFIER_FAMILY = 'N.family';
export const CLIPBOARD_KEY_HOSP_STREET = 'C.hospitalized.street';
export const CLIPBOARD_KEY_HOSP_HOUSENR = 'C.hospitalized.houseNumber';
export const CLIPBOARD_KEY_HOSP_ZIP = 'C.hospitalized.zip';
export const CLIPBOARD_KEY_HOSP_CITY = 'C.hospitalized.city';
export const CLIPBOARD_KEY_HOSP_COUNTRY = 'C.hospitalized.country';
export const CLIPBOARD_KEY_HOSP_INSTITUTION_NAME = 'C.hospitalized.name';
export const CLIPBOARD_KEY_HOSP_GIVEN = 'C.hospitalized.given';
export const CLIPBOARD_KEY_HOSP_FAMILY = 'C.hospitalized.family';
export const CLIPBOARD_KEY_HOSPITALIZED = 'C.hospitalized';
export const CLIPBOARD_KEY_DISEASE_CODE = 'D.code';

export const CLIPBOARD_VALUE_STREET = 'Teststreet';
export const CLIPBOARD_VALUE_ZIP = '98765';
export const CLIPBOARD_VALUE_CITY = 'Clipboard City';
export const CLIPBOARD_VALUE_HOUSENR = '33';
export const CLIPBOARD_VALUE_COUNTRY_DE = 'DE';
export const CLIPBOARD_VALUE_INSTITUTION_NAME = 'Clipboard Institution';
export const CLIPBOARD_VALUE_OTHER_STREET = 'Otherstreet';
export const CLIPBOARD_VALUE_OTHER_ZIP = '54321';
export const CLIPBOARD_VALUE_OTHER_CITY = 'Othercity';
export const CLIPBOARD_VALUE_OTHER_INSTITUTION_NAME = 'Other Institution';
export const CLIPBOARD_VALUE_OTHER_HOUSENR = '99';
export const CLIPBOARD_VALUE_NOTIFIER_GIVEN = 'Notifier given name';
export const CLIPBOARD_VALUE_NOTIFIER_FAMILY = 'Notifier family name';
export const CLIPBOARD_VALUE_OTHER_NOTIFIER_GIVEN = 'Other given name';
export const CLIPBOARD_VALUE_OTHER_NOTIFIER_FAMILY = 'Other family name';
export const CLIPBOARD_VALUE_DISEASE_CODE = 'cvdd';
export const CLIPBOARD_VALUE_HOSP_YES = 'yes';

//address types
export const ADDRESS_TYPE_PRIMARY = 'primary';
export const ADDRESS_TYPE_ORDINARY = 'ordinary';

//validation input values
export const VALUE_INVALID_DATE = '12.13.2012';
export const VALUE_INVALID_NAME_SPECIAL_CHAR = 'Eins$';
export const VALUE_INVALID_NAME_NUMBER = 'Eins1';
export const VALUE_EMPTY = '';
export const VALUE_SPACE = ' ';
export const VALUE_INVALID_SPECIAL_CHAR = 'Testxxx?';
export const VALUE_LONG_NUMBER = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
export const VALUE_SHORT_ZIP = '11';
export const VALUE_INVALID_HOUSE_NUMBER = '1a,';
export const VALUE_INVALID_EMAIL_1 = 'auch-ungueltig.de';
export const VALUE_INVALID_EMAIL_2 = '_@test_Me.too';
export const VALUE_INVALID_EMAIL_3 = 'keinesonderzeichen´êa@ü?.djkd';
export const VALUE_INVALID_EMAIL_4 =
  'genau321Zeichen_nach_dem@Lorem-ipsum-dolor-sit-amet--consetetur-sadipscing-elitr--sed-diam-nonumy-eirmod-tempor-invidunt-ut-labore-et-dolore-magna-aliquyam-erat--sed-diam-voluptua.-At-vero-eos-et-accusam-et-justo-duo-dolores-et-ea-rebum.-Stet-clita-kasd-gubergren--no-sea-takimata-sanctus-est-Lorem-ipsum-dolor-sit-amet.-Lorem-ipsum-dolor-sit.com';
export const VALUE_INVALID_EMAIL_5 = '@abc.de';
export const VALUE_INVALID_EMAIL_6 = 'ab@de';
export const VALUE_INVALID_EMAIL_7 = 'ab.de';
export const VALUE_INVALID_EMAIL_8 = 'ab@cde.de[';

export const VALUE_INVALID_PHONE_1 = '1741236589';
export const VALUE_INVALID_PHONE_2 = '01234';
export const VALUE_INVALID_PHONE_3 = '0123456789abc';
export const VALUE_INVALID_PHONE_4 = '(0049)1741236589';
export const VALUE_INVALID_PHONE_5 = 'a';
export const VALUE_INVALD_BSNR = '12345678';

//validation error messages
export const ERROR_INVALID_DATE = 'Kein gültiges Datum (Beispiele: 05.11.1998)';
export const ERROR_INVALID_SPECIAL_CHAR = 'Ihre Eingabe enthält unzulässige Sonderzeichen';
export const ERROR_REQUIRED = 'Diese Angabe wird benötigt';
export const ERROR_MIN_LENGTH = 'Minimallänge nicht erreicht';
export const ERROR_MIN_ONE_CHAR = 'Es muss mindestens ein Zeichen eingegeben werden';
export const ERROR_INVALID_HOUSE_NUMBER = 'Keine gültige Hausnummer';
export const ERROR_INVALID_EMAIL = 'Keine gültige E-Mail (Beispiel: meine.Email@email.de)';
export const ERROR_INVALID_PHONE = 'Die Telefonnummer muss mit 0 oder + beginnen, gefolgt von mindestens 6 Ziffern.';
export const ERROR_INVALID_BSNR = 'Bitte geben Sie Ihre 9-stellige Betriebsstättennummer (BSNR) ein';
