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

import { AddressType } from '../../../api/notification';
import {
  CLIPBOARD_KEY_CURRENT_CITY,
  CLIPBOARD_KEY_CURRENT_HOUSENR,
  CLIPBOARD_KEY_CURRENT_NAME,
  CLIPBOARD_KEY_CURRENT_STREET,
  CLIPBOARD_KEY_CURRENT_TYPE,
  CLIPBOARD_KEY_CURRENT_ZIP,
  CLIPBOARD_VALUE_CITY,
  CLIPBOARD_VALUE_HOUSENR,
  CLIPBOARD_VALUE_INSTITUTION_NAME,
  CLIPBOARD_VALUE_OTHER_CITY,
  CLIPBOARD_VALUE_OTHER_HOUSENR,
  CLIPBOARD_VALUE_OTHER_INSTITUTION_NAME,
  CLIPBOARD_VALUE_OTHER_STREET,
  CLIPBOARD_VALUE_OTHER_ZIP,
  CLIPBOARD_VALUE_STREET,
  CLIPBOARD_VALUE_ZIP,
  FIELD_CURRENT_ADDRESS_CITY,
  FIELD_CURRENT_ADDRESS_HOUSE_NUMBER,
  FIELD_CURRENT_ADDRESS_INSTITUTION_NAME,
  FIELD_CURRENT_ADDRESS_STREET,
  FIELD_CURRENT_ADDRESS_TYPE,
  FIELD_CURRENT_ADDRESS_ZIP,
} from '../test-constants';

export const NOTIFIER_FACILITY = {
  facilityInfo: {
    existsBsnr: true,
    bsnr: '123456789',
    institutionName: 'Kreiskrankenhaus Riedlingen',
    organizationType: {
      answer: {
        valueCoding: {
          code: 'hospital',
          display: 'Krankenhaus',
          designations: [
            { language: 'en-US', value: 'Hospital' },
            {
              language: 'de-DE',
              value: 'Krankenhaus',
            },
          ],
          system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
        },
      },
    },
  },
  address: { zip: '21481', country: 'DE', street: 'Im Himmelreich', city: 'Frühling', houseNumber: '1' },
  contact: { firstname: 'Test', lastname: 'Person', prefix: 'Dr.' },
  contacts: {
    emailAddresses: [
      { contactType: 'email', value: 't.person@gmail.com' },
      { contactType: 'email', value: 'test.person@kh-rie.de' },
    ],
    phoneNumbers: [{ contactType: 'phone', usage: 'work', value: '01234567' }],
  },
};

interface MatchingContent {
  clipboardKey: string;
  manualValue: AddressType | string;
  clipboardValue: AddressType | string;
  otherClipboardValue: AddressType | string;
  htmlSelector: string;
}

export interface TestDataAddress {
  type: MatchingContent;
  institutionName: MatchingContent;
  street: MatchingContent;
  houseNumber: MatchingContent;
  zip: MatchingContent;
  city: MatchingContent;
}

export const exampleAddressOfType = (addressType?: AddressType): TestDataAddress => {
  return {
    type: {
      clipboardKey: CLIPBOARD_KEY_CURRENT_TYPE,
      manualValue: addressType || AddressType.Current,
      clipboardValue: addressType || AddressType.Current,
      otherClipboardValue: addressType || AddressType.Current,
      htmlSelector: `#${FIELD_CURRENT_ADDRESS_TYPE}`,
    },
    institutionName: {
      clipboardKey: CLIPBOARD_KEY_CURRENT_NAME,
      manualValue: 'Example Institution',
      clipboardValue: CLIPBOARD_VALUE_INSTITUTION_NAME,
      otherClipboardValue: CLIPBOARD_VALUE_OTHER_INSTITUTION_NAME,
      htmlSelector: `#${FIELD_CURRENT_ADDRESS_INSTITUTION_NAME}`,
    },
    street: {
      clipboardKey: CLIPBOARD_KEY_CURRENT_STREET,
      manualValue: 'Example Street',
      clipboardValue: CLIPBOARD_VALUE_STREET,
      otherClipboardValue: CLIPBOARD_VALUE_OTHER_STREET,
      htmlSelector: `#${FIELD_CURRENT_ADDRESS_STREET}`,
    },
    houseNumber: {
      clipboardKey: CLIPBOARD_KEY_CURRENT_HOUSENR,
      manualValue: '123',
      clipboardValue: CLIPBOARD_VALUE_HOUSENR,
      otherClipboardValue: CLIPBOARD_VALUE_OTHER_HOUSENR,
      htmlSelector: `#${FIELD_CURRENT_ADDRESS_HOUSE_NUMBER}`,
    },
    zip: {
      clipboardKey: CLIPBOARD_KEY_CURRENT_ZIP,
      manualValue: '12345',
      clipboardValue: CLIPBOARD_VALUE_ZIP,
      otherClipboardValue: CLIPBOARD_VALUE_OTHER_ZIP,
      htmlSelector: `#${FIELD_CURRENT_ADDRESS_ZIP}`,
    },
    city: {
      clipboardKey: CLIPBOARD_KEY_CURRENT_CITY,
      manualValue: 'Example City',
      clipboardValue: CLIPBOARD_VALUE_CITY,
      otherClipboardValue: CLIPBOARD_VALUE_OTHER_CITY,
      htmlSelector: `#${FIELD_CURRENT_ADDRESS_CITY}`,
    },
  };
};
