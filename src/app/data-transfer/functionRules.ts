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

/*
 * Rules in "_Functional" style
 */

import { ContactPointInfo } from '../../api/notification';
import { ClipboardRules } from '../disease-form/services/import-field-values.service';
import { parseGender, parseSalutation } from '../legacy/common-utils';

function addContact(contactType: ContactPointInfo.ContactTypeEnum, value: string, contacts: ContactPointInfo[]): ContactPointInfo[] {
  if (contacts.some(c => c.contactType === contactType && c.value === value)) return contacts;
  return [...contacts, { contactType, value }].filter(c => c.contactType !== contactType || c.value);
}

const getNotifiedPersonAnonymousBirthDate = (value: string) => {
  // Convert dd.mm.yyyy format to mm.yyyy
  const parts = value.split('.');
  const formattedDate = parts.length === 3 ? `${parts[1]}.${parts[2]}` : value;

  return {
    tabPatient: { info: { birthDate: formattedDate } },
  };
};

const getNotifiedPersonAnonymousZip = (value: string) => {
  // If zip is over 3 digits, shorten it to the first three digits
  const shortenedZip = value.length > 3 ? value.substring(0, 3) : value;

  return { tabPatient: { residenceAddress: { zip: shortenedZip } } };
};

export const NOMINAL_PERSON_RULES: ClipboardRules = {
  'P.gender': async value => {
    const fromClipboard = parseGender(value);
    return { tabPatient: { info: { gender: fromClipboard } } };
  },
  'P.given': value => ({ tabPatient: { info: { firstname: value } } }),
  'P.family': value => ({ tabPatient: { info: { lastname: value } } }),
  'P.birthDate': value => ({ tabPatient: { info: { birthDate: value } } }),
  'P.phone': (value, model) => ({
    tabPatient: { contacts: { phoneNumbers: addContact('phone', value, model.tabPatient.contacts.phoneNumbers) } },
  }),
  'P.email': (value, model) => ({
    tabPatient: { contacts: { emailAddresses: addContact('email', value, model.tabPatient.contacts.emailAddresses) } },
  }),
  'P.phone2': (value, model) => ({
    tabPatient: { contacts: { phoneNumbers: addContact('phone', value, model.tabPatient.contacts.phoneNumbers) } },
  }),
  'P.email2': (value, model) => ({
    tabPatient: { contacts: { emailAddresses: addContact('email', value, model.tabPatient.contacts.emailAddresses) } },
  }),
};

export const NOMINAL_PERSON_ADDRESS_RULES: ClipboardRules = {
  'P.r.type': value => ({ tabPatient: { residenceAddressType: value } }),
  'P.r.street': value => ({ tabPatient: { residenceAddress: { street: value } } }),
  'P.r.houseNumber': value => ({ tabPatient: { residenceAddress: { houseNumber: value } } }),
  'P.r.zip': value => ({ tabPatient: { residenceAddress: { zip: value } } }),
  'P.r.city': value => ({ tabPatient: { residenceAddress: { city: value } } }),
  'P.r.country': value => ({ tabPatient: { residenceAddress: { country: value } } }),
  'P.c.type': value => ({ tabPatient: { currentAddressType: value } }),
  'P.c.name': value => ({ tabPatient: { currentAddressInstitutionName: value } }),
  'P.c.street': value => ({ tabPatient: { currentAddress: { street: value } } }),
  'P.c.houseNumber': value => ({ tabPatient: { currentAddress: { houseNumber: value } } }),
  'P.c.zip': value => ({ tabPatient: { currentAddress: { zip: value } } }),
  'P.c.city': value => ({ tabPatient: { currentAddress: { city: value } } }),
  'P.c.country': value => ({ tabPatient: { currentAddress: { country: value } } }),
};

export const ANONYMOUS_PERSON_RULES: ClipboardRules = {
  'P.gender': async value => {
    const fromClipboard = parseGender(value);
    return { tabPatient: { info: { gender: fromClipboard } } };
  },
  'P.birthDate': value => getNotifiedPersonAnonymousBirthDate(value),
  'P.r.zip': value => getNotifiedPersonAnonymousZip(value),
  'P.r.country': value => ({ tabPatient: { residenceAddress: { country: value } } }),
};

export const FACILITY_RULES: ClipboardRules = {
  'F.name': value => ({ tabNotifier: { facilityInfo: { institutionName: value } } }),
  'F.bsnr': value => ({ tabNotifier: { facilityInfo: { existsBsnr: true, bsnr: value } } }),
  'F.street': value => ({ tabNotifier: { address: { street: value } } }),
  'F.houseNumber': value => ({ tabNotifier: { address: { houseNumber: value } } }),
  'F.type': value => ({ tabNotifier: { facilityInfo: { organizationType: { answer: { valueCoding: { code: value } } } } } }),
  'F.zip': value => ({ tabNotifier: { address: { zip: value } } }),
  'F.city': value => ({ tabNotifier: { address: { city: value } } }),
  'N.salutation': async value => {
    const fromClipboard = parseSalutation(value);
    return { tabNotifier: { contact: { salutation: fromClipboard } } };
  },
  'N.prefix': value => ({ tabNotifier: { contact: { prefix: value } } }),
  'N.given': value => ({ tabNotifier: { contact: { firstname: value } } }),
  'N.family': value => ({ tabNotifier: { contact: { lastname: value } } }),
  'N.phone': (value, model) => ({
    tabNotifier: {
      contacts: {
        phoneNumbers: addContact(
          'phone',
          value,
          model.tabNotifier.contacts.phoneNumbers.length === 1 && model.tabNotifier.contacts.phoneNumbers[0] === ''
            ? []
            : model.tabNotifier.contacts.phoneNumbers
        ),
      },
    },
  }),
  'N.email': (value, model) => ({
    tabNotifier: { contacts: { emailAddresses: addContact('email', value, model.tabNotifier.contacts.emailAddresses) } },
  }),
  'N.phone2': (value, model) => ({
    tabNotifier: { contacts: { phoneNumbers: addContact('phone', value, model.tabNotifier.contacts.phoneNumbers) } },
  }),
  'N.email2': (value, model) => ({
    tabNotifier: { contacts: { emailAddresses: addContact('email', value, model.tabNotifier.contacts.emailAddresses) } },
  }),
};
