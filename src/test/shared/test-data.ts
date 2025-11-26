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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import {
  ADDRESS_TYPE_PRIMARY,
  CLIPBOARD_KEY_CURRENT_CITY,
  CLIPBOARD_KEY_CURRENT_HOUSENR,
  CLIPBOARD_KEY_CURRENT_STREET,
  CLIPBOARD_KEY_CURRENT_TYPE,
  CLIPBOARD_KEY_CURRENT_ZIP,
  CLIPBOARD_KEY_DISEASE_CODE,
  CLIPBOARD_KEY_FACILITY_CITY,
  CLIPBOARD_KEY_FACILITY_HOUSENR,
  CLIPBOARD_KEY_FACILITY_NAME,
  CLIPBOARD_KEY_FACILITY_STREET,
  CLIPBOARD_KEY_FACILITY_ZIP,
  CLIPBOARD_KEY_HOSP_CITY,
  CLIPBOARD_KEY_HOSP_COUNTRY,
  CLIPBOARD_KEY_HOSP_FAMILY,
  CLIPBOARD_KEY_HOSP_GIVEN,
  CLIPBOARD_KEY_HOSP_HOUSENR,
  CLIPBOARD_KEY_HOSP_INSTITUTION_NAME,
  CLIPBOARD_KEY_HOSP_STREET,
  CLIPBOARD_KEY_HOSP_ZIP,
  CLIPBOARD_KEY_HOSPITALIZED,
  CLIPBOARD_KEY_NOTIFIER_FAMILY,
  CLIPBOARD_KEY_NOTIFIER_GIVEN,
  CLIPBOARD_KEY_RESIDENCE_CITY,
  CLIPBOARD_KEY_RESIDENCE_HOUSENR,
  CLIPBOARD_KEY_RESIDENCE_STREET,
  CLIPBOARD_KEY_RESIDENCE_TYPE,
  CLIPBOARD_KEY_RESIDENCE_ZIP,
  CLIPBOARD_VALUE_CITY,
  CLIPBOARD_VALUE_COUNTRY_DE,
  CLIPBOARD_VALUE_DISEASE_CODE,
  CLIPBOARD_VALUE_HOSP_YES,
  CLIPBOARD_VALUE_HOUSENR,
  CLIPBOARD_VALUE_INSTITUTION_NAME,
  CLIPBOARD_VALUE_NOTIFIER_FAMILY,
  CLIPBOARD_VALUE_NOTIFIER_GIVEN,
  CLIPBOARD_VALUE_OTHER_CITY,
  CLIPBOARD_VALUE_OTHER_HOUSENR,
  CLIPBOARD_VALUE_OTHER_INSTITUTION_NAME,
  CLIPBOARD_VALUE_OTHER_NOTIFIER_FAMILY,
  CLIPBOARD_VALUE_OTHER_NOTIFIER_GIVEN,
  CLIPBOARD_VALUE_OTHER_STREET,
  CLIPBOARD_VALUE_OTHER_ZIP,
  CLIPBOARD_VALUE_STREET,
  CLIPBOARD_VALUE_ZIP,
  ERROR_INVALID_BSNR,
  ERROR_INVALID_DATE,
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_HOUSE_NUMBER,
  ERROR_INVALID_PHONE,
  ERROR_INVALID_SPECIAL_CHAR,
  ERROR_MIN_LENGTH,
  ERROR_MIN_ONE_CHAR,
  ERROR_REQUIRED,
  ERROR_SHORT_ZIP,
  FIELD_BIRTH_DATE,
  FIELD_BSNR,
  FIELD_CURRENT_ADDRESS_CITY,
  FIELD_CURRENT_ADDRESS_HOUSE_NUMBER,
  FIELD_CURRENT_ADDRESS_INSTITUTION_NAME,
  FIELD_CURRENT_ADDRESS_STREET,
  FIELD_CURRENT_ADDRESS_ZIP,
  FIELD_FIRST_NAME,
  FIELD_INSTITUTIONAME,
  FIELD_LAST_NAME,
  FIELD_NOTIFIER_FACILITY_ADDRESS_CITY,
  FIELD_NOTIFIER_FACILITY_ADDRESS_HOUSE_NUMBER,
  FIELD_NOTIFIER_FACILITY_ADDRESS_STREET,
  FIELD_NOTIFIER_FACILITY_ADDRESS_ZIP,
  FIELD_RESIDENCE_ADDRESS_CITY,
  FIELD_RESIDENCE_ADDRESS_HOUSE_NUMBER,
  FIELD_RESIDENCE_ADDRESS_STREET,
  FIELD_RESIDENCE_ADDRESS_ZIP,
  VALUE_EMPTY,
  VALUE_INVALD_BSNR,
  VALUE_INVALID_DATE,
  VALUE_INVALID_EMAIL_1,
  VALUE_INVALID_EMAIL_2,
  VALUE_INVALID_EMAIL_3,
  VALUE_INVALID_EMAIL_4,
  VALUE_INVALID_EMAIL_5,
  VALUE_INVALID_EMAIL_6,
  VALUE_INVALID_EMAIL_7,
  VALUE_INVALID_EMAIL_8,
  VALUE_INVALID_HOUSE_NUMBER,
  VALUE_INVALID_NAME_NUMBER,
  VALUE_INVALID_NAME_SPECIAL_CHAR,
  VALUE_INVALID_PHONE_1,
  VALUE_INVALID_PHONE_2,
  VALUE_INVALID_PHONE_3,
  VALUE_INVALID_PHONE_4,
  VALUE_INVALID_PHONE_5,
  VALUE_INVALID_SPECIAL_CHAR,
  VALUE_LONG_NUMBER,
  VALUE_SHORT_ZIP,
  VALUE_SPACE,
} from './test-constants';
import { AddressType } from '../../api/notification';

export const TEST_PARAMETER_VALIDATION = {
  facilityInfo: [
    {
      field: FIELD_INSTITUTIONAME,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_INSTITUTIONAME,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_INSTITUTIONAME,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_INSTITUTIONAME,
      value: VALUE_LONG_NUMBER,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_BSNR,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_BSNR,
      value: VALUE_SPACE,
      expectedResult: ERROR_INVALID_BSNR,
    },
    {
      field: FIELD_BSNR,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_BSNR,
    },
    {
      field: FIELD_BSNR,
      value: VALUE_INVALD_BSNR,
      expectedResult: ERROR_INVALID_BSNR,
    },
  ],
  notifierFacilityAddress: [
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_STREET,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_STREET,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_ZIP,
      value: VALUE_SHORT_ZIP,
      expectedResult: ERROR_MIN_LENGTH,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_ZIP,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_LENGTH,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_ZIP,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_HOUSE_NUMBER,
      value: VALUE_INVALID_HOUSE_NUMBER,
      expectedResult: ERROR_INVALID_HOUSE_NUMBER,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_HOUSE_NUMBER,
      value: VALUE_SPACE,
      expectedResult: ERROR_INVALID_HOUSE_NUMBER,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_HOUSE_NUMBER,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_CITY,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_CITY,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_NOTIFIER_FACILITY_ADDRESS_CITY,
      value: VALUE_INVALID_NAME_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
  ],
  contactPerson: [
    // {
    //   field: FIELD_SALUTATION,
    //   value: VALUE_SPACE,
    //   expectedResult: ERROR_MIN_ONE_CHAR,
    // },
    // {
    //   field: FIELD_SALUTATION,
    //   value: VALUE_INVALID_NAME_SPECIAL_CHAR,
    //   expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    // },
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_INVALID_NAME_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_LONG_NUMBER,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    // {
    //   field: FIELD_FIRST_NAME,
    //   value: VALUE_INVALID_NAME_NUMBER,
    //   expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    // },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_LONG_NUMBER,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    // {
    //   field: FIELD_LAST_NAME,
    //   value: VALUE_INVALID_NAME_NUMBER,
    //   expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    // },
  ],
  notifiedPerson: [
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_INVALID_NAME_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_FIRST_NAME,
      value: VALUE_INVALID_NAME_NUMBER,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_BIRTH_DATE,
      value: VALUE_INVALID_DATE,
      expectedResult: ERROR_INVALID_DATE,
    },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_LAST_NAME,
      value: VALUE_INVALID_NAME_NUMBER,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
  ],
  residenceAddress: [
    {
      field: FIELD_RESIDENCE_ADDRESS_STREET,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_RESIDENCE_ADDRESS_STREET,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_RESIDENCE_ADDRESS_ZIP,
      value: VALUE_SHORT_ZIP,
      expectedResult: ERROR_MIN_LENGTH,
    },
    {
      field: FIELD_RESIDENCE_ADDRESS_ZIP,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_RESIDENCE_ADDRESS_HOUSE_NUMBER,
      value: VALUE_INVALID_HOUSE_NUMBER,
      expectedResult: ERROR_INVALID_HOUSE_NUMBER,
    },
    {
      field: FIELD_RESIDENCE_ADDRESS_CITY,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_RESIDENCE_ADDRESS_CITY,
      value: VALUE_INVALID_NAME_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
  ],
  currentAddress: [
    {
      field: FIELD_CURRENT_ADDRESS_STREET,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_CURRENT_ADDRESS_STREET,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_CURRENT_ADDRESS_ZIP,
      value: VALUE_SHORT_ZIP,
      expectedResult: ERROR_MIN_LENGTH,
    },
    {
      field: FIELD_CURRENT_ADDRESS_ZIP,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
    {
      field: FIELD_CURRENT_ADDRESS_HOUSE_NUMBER,
      value: VALUE_INVALID_HOUSE_NUMBER,
      expectedResult: ERROR_INVALID_HOUSE_NUMBER,
    },
    {
      field: FIELD_CURRENT_ADDRESS_CITY,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_CURRENT_ADDRESS_CITY,
      value: VALUE_INVALID_NAME_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
  ],
  currentAddressInstitutionName: [
    {
      field: FIELD_CURRENT_ADDRESS_INSTITUTION_NAME,
      value: VALUE_INVALID_SPECIAL_CHAR,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_CURRENT_ADDRESS_INSTITUTION_NAME,
      value: VALUE_SPACE,
      expectedResult: ERROR_MIN_ONE_CHAR,
    },
    {
      field: FIELD_CURRENT_ADDRESS_INSTITUTION_NAME,
      value: VALUE_LONG_NUMBER,
      expectedResult: ERROR_INVALID_SPECIAL_CHAR,
    },
    {
      field: FIELD_CURRENT_ADDRESS_INSTITUTION_NAME,
      value: VALUE_EMPTY,
      expectedResult: ERROR_REQUIRED,
    },
  ],
  phone: [
    { value: VALUE_EMPTY, expectedResult: ERROR_REQUIRED },
    { value: VALUE_SPACE, expectedResult: ERROR_INVALID_PHONE },
    { value: VALUE_INVALID_PHONE_1, expectedResult: ERROR_INVALID_PHONE },
    { value: VALUE_INVALID_PHONE_2, expectedResult: ERROR_INVALID_PHONE },
    { value: VALUE_INVALID_PHONE_3, expectedResult: ERROR_INVALID_PHONE },
    { value: VALUE_INVALID_PHONE_4, expectedResult: ERROR_INVALID_PHONE },
    { value: VALUE_INVALID_PHONE_5, expectedResult: ERROR_INVALID_PHONE },
  ],
  email: [
    { value: VALUE_EMPTY, expectedResult: ERROR_REQUIRED },
    { value: VALUE_SPACE, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_1, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_2, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_3, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_4, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_5, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_6, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_7, expectedResult: ERROR_INVALID_EMAIL },
    { value: VALUE_INVALID_EMAIL_8, expectedResult: ERROR_INVALID_EMAIL },
  ],
  notifiedPersonAnonymous: [
    {
      field: FIELD_RESIDENCE_ADDRESS_ZIP,
      value: VALUE_SHORT_ZIP,
      expectedResult: ERROR_SHORT_ZIP,
    },
    {
      field: FIELD_RESIDENCE_ADDRESS_ZIP,
      value: VALUE_SPACE,
      expectedResult: ERROR_SHORT_ZIP,
    },
  ],
};

export const CLIPBOARD_DISEASE = [
  {
    key: CLIPBOARD_KEY_DISEASE_CODE,
    value: CLIPBOARD_VALUE_DISEASE_CODE,
    matchingSelector: '',
  },
];

export const CLIPBOARD_HOSPITALIZED = [
  {
    key: CLIPBOARD_KEY_HOSPITALIZED,
    value: CLIPBOARD_VALUE_HOSP_YES,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_STREET,
    value: CLIPBOARD_VALUE_OTHER_STREET,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_ZIP,
    value: CLIPBOARD_VALUE_OTHER_ZIP,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_CITY,
    value: CLIPBOARD_VALUE_OTHER_CITY,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_HOUSENR,
    value: CLIPBOARD_VALUE_OTHER_HOUSENR,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_GIVEN,
    value: CLIPBOARD_VALUE_OTHER_NOTIFIER_GIVEN,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_FAMILY,
    value: CLIPBOARD_VALUE_OTHER_NOTIFIER_FAMILY,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_COUNTRY,
    value: CLIPBOARD_VALUE_COUNTRY_DE,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_HOSP_INSTITUTION_NAME,
    value: CLIPBOARD_VALUE_OTHER_INSTITUTION_NAME,
    matchingSelector: '',
  },
];

export const CLIPBOARD_FACILITY = [
  {
    key: CLIPBOARD_KEY_FACILITY_NAME,
    value: CLIPBOARD_VALUE_INSTITUTION_NAME,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_FACILITY_STREET,
    value: CLIPBOARD_VALUE_STREET,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_FACILITY_HOUSENR,
    value: CLIPBOARD_VALUE_HOUSENR,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_FACILITY_ZIP,
    value: CLIPBOARD_VALUE_ZIP,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_FACILITY_CITY,
    value: CLIPBOARD_VALUE_CITY,
    matchingSelector: '',
  },
];

export const CLIPBOARD_NOTIFIER = [
  {
    key: CLIPBOARD_KEY_NOTIFIER_GIVEN,
    value: CLIPBOARD_VALUE_NOTIFIER_GIVEN,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_NOTIFIER_FAMILY,
    value: CLIPBOARD_VALUE_NOTIFIER_FAMILY,
    matchingSelector: '',
  },
];

export const RESIDENCE_ADDRESS_TYPE_HAUPTWOHNUNG = [
  {
    key: CLIPBOARD_KEY_RESIDENCE_TYPE,
    value: AddressType.Primary,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_RESIDENCE_HOUSENR,
    value: CLIPBOARD_VALUE_HOUSENR,
    addressType: AddressType.Primary,
    matchingSelector: `#${FIELD_RESIDENCE_ADDRESS_HOUSE_NUMBER}`,
  },
  {
    key: CLIPBOARD_KEY_RESIDENCE_STREET,
    value: CLIPBOARD_VALUE_STREET,
    addressType: AddressType.Primary,
    matchingSelector: `#${FIELD_RESIDENCE_ADDRESS_STREET}`,
  },
  {
    key: CLIPBOARD_KEY_RESIDENCE_ZIP,
    value: CLIPBOARD_VALUE_ZIP,
    addressType: AddressType.Primary,
    matchingSelector: `#${FIELD_RESIDENCE_ADDRESS_ZIP}`,
  },
  {
    key: CLIPBOARD_KEY_RESIDENCE_CITY,
    value: CLIPBOARD_VALUE_CITY,
    addressType: AddressType.Primary,
    matchingSelector: `#${FIELD_RESIDENCE_ADDRESS_CITY}`,
  },
];

export const CURRENT_ADDRESS_TYPE_SUBMITTING_FACILITY = [
  {
    key: CLIPBOARD_KEY_CURRENT_TYPE,
    value: AddressType.SubmittingFacility,
    matchingSelector: '',
  },
];

export const CURRENT_ADDRESS_TYPE_ANDERER_WOHNSITZ = [
  {
    key: CLIPBOARD_KEY_CURRENT_TYPE,
    value: AddressType.Current,
    matchingSelector: '',
  },
  {
    key: CLIPBOARD_KEY_CURRENT_HOUSENR,
    value: CLIPBOARD_VALUE_HOUSENR,
    matchingSelector: `#${FIELD_CURRENT_ADDRESS_HOUSE_NUMBER}`,
  },
  {
    key: CLIPBOARD_KEY_CURRENT_STREET,
    value: CLIPBOARD_VALUE_STREET,
    matchingSelector: `#${FIELD_CURRENT_ADDRESS_STREET}`,
  },
  {
    key: CLIPBOARD_KEY_CURRENT_ZIP,
    value: CLIPBOARD_VALUE_ZIP,
    matchingSelector: `#${FIELD_CURRENT_ADDRESS_ZIP}`,
  },
  {
    key: CLIPBOARD_KEY_CURRENT_CITY,
    value: CLIPBOARD_VALUE_CITY,
    matchingSelector: `#${FIELD_CURRENT_ADDRESS_CITY}`,
  },
];

export const CURRENT_ADDRESS_INPUT = [
  {
    value: 'Bethel',
    selector: `#${FIELD_CURRENT_ADDRESS_INSTITUTION_NAME}`,
  },
  {
    value: 'Königsweg',
    selector: `#${FIELD_CURRENT_ADDRESS_STREET}`,
  },
  {
    value: '22',
    selector: `#${FIELD_CURRENT_ADDRESS_HOUSE_NUMBER}`,
  },
  {
    value: '33617',
    selector: `#${FIELD_CURRENT_ADDRESS_ZIP}`,
  },
  {
    value: 'Bielefeld',
    selector: `#${FIELD_CURRENT_ADDRESS_CITY}`,
  },
];

export const NOTIFIED_PERSON_CONTACT_INPUT = [
  {
    selector: '#firstname',
    value: 'Melderina',
  },
  {
    selector: '#lastname',
    value: 'Meldersson',
  },
];

export const NOTIFIER_PERSON_CONTACT_INPUT = [
  {
    selector: '#firstname',
    value: 'Testerino',
  },
  {
    selector: '#lastname',
    value: 'Testerssson',
  },
  {
    selector: '#prefix',
    value: 'Graf',
  },
  {
    selector: '[data-cy="phoneNo"]',
    value: '0521 123456',
  },
  {
    selector: '[data-cy="email"]',
    value: 'abc@xxx.de',
  },
];

export const TEST_PARAMETER_CLIPBOARD_RESIDENCE_ADDRESS_SINGLE_PRIMARY = [
  {
    key: CLIPBOARD_KEY_RESIDENCE_HOUSENR,
    value: CLIPBOARD_VALUE_HOUSENR,
    addressType: ADDRESS_TYPE_PRIMARY,
    selector: `#${FIELD_RESIDENCE_ADDRESS_HOUSE_NUMBER}`,
  },
  {
    key: CLIPBOARD_KEY_RESIDENCE_STREET,
    value: CLIPBOARD_VALUE_STREET,
    addressType: ADDRESS_TYPE_PRIMARY,
    selector: `#${FIELD_RESIDENCE_ADDRESS_STREET}`,
  },
  {
    key: CLIPBOARD_KEY_RESIDENCE_ZIP,
    value: CLIPBOARD_VALUE_ZIP,
    addressType: ADDRESS_TYPE_PRIMARY,
    selector: `#${FIELD_RESIDENCE_ADDRESS_ZIP}`,
  },
  {
    key: CLIPBOARD_KEY_RESIDENCE_CITY,
    value: CLIPBOARD_VALUE_CITY,
    addressType: ADDRESS_TYPE_PRIMARY,
    selector: `#${FIELD_RESIDENCE_ADDRESS_CITY}`,
  },
];
