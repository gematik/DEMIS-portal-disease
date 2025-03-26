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

import { FormlyFieldConfig } from '@ngx-formly/core';
import { addressFormConfigFields, contactsFormConfigFields, formlyInputField, formlyRow, infoOutline } from './formly-base';
import { FormlyConstants } from '../../../legacy/formly-constants';
import { CURRENT_ADDRESS_TYPE_OPTION_LIST, GENDER_OPTION_LIST, RESIDENCE_ADDRESS_TYPE_OPTION_LIST } from '../../../legacy/formly-options-lists';
import { TEXT_MAX_LENGTH, UI_DATE_FORMAT_GER } from '../../../legacy/common-utils';
import { AddressType } from '../../../../api/notification';

const INFO_KEY = 'info';

export const RESIDENCE_ADDRESS_ID = 'residence-address-'; //WOHNSITZ
export const CURRENT_ADDRESS_ID = 'current-address-'; //DERZEITIGER AUFENTHALTSORT

export const notifiedPersonInfo: FormlyFieldConfig[] = [
  infoOutline,
  formlyRow(
    [
      {
        id: 'gender',
        key: 'gender',
        type: 'select',
        className: FormlyConstants.COLMD6,
        props: {
          label: 'Geschlecht',
          options: GENDER_OPTION_LIST,
          required: true,
        },
      },
    ],
    INFO_KEY
  ),
  formlyRow(
    [
      formlyInputField({
        key: 'firstname',
        className: FormlyConstants.COLMD6,
        props: {
          label: 'Vorname',
          maxLength: TEXT_MAX_LENGTH,
          required: true,
        },
        validators: ['nameValidator'],
      }),
      formlyInputField({
        key: 'lastname',
        className: FormlyConstants.COLMD6,
        props: {
          label: 'Nachname',
          maxLength: TEXT_MAX_LENGTH,
          required: true,
        },
        validators: ['nameValidator'],
      }),
    ],
    INFO_KEY
  ),
  formlyRow(
    [
      formlyInputField({
        key: 'birthDate',
        className: FormlyConstants.COLMD6,
        props: {
          placeholder: UI_DATE_FORMAT_GER,
          maxLength: 10,
          label: 'Geburtsdatum',
          required: false,
        },
        validators: ['dateInputValidator'],
      }),
    ],
    INFO_KEY
  ),
];

export const dnNotifiedPersonFormConfigFields: FormlyFieldConfig[] = [
  {
    className: '',
    template: '<h2>Wohnsitz</h2>',
  },
  {
    className: '',
    template:
      '<p>Die Hauptwohnung bezeichnet den Ort, an dem die betroffene Person gemeldet ist. Der gewöhnliche Aufenthaltsort bezeichnet den Ort, ' +
      'an dem die betroffene Person sich dauerhaft aufhält und ist anzugeben, wenn es sich nicht um die Hauptwohnung handelt.</p>',
  },
  {
    id: 'residenceAddressType',
    key: 'residenceAddressType',
    className: FormlyConstants.ROW,
    type: 'radio',
    defaultValue: AddressType.Primary,
    props: {
      required: true,
      options: RESIDENCE_ADDRESS_TYPE_OPTION_LIST,
    },
  },
  {
    key: 'residenceAddress',
    id: 'residenceAddress',
    fieldGroupClassName: FormlyConstants.ROW,
    fieldGroup: addressFormConfigFields(false, RESIDENCE_ADDRESS_ID),
  },
  {
    className: '',
    template: '<h2>Derzeitiger Aufenthaltsort *</h2>',
  },
  {
    className: '',
    template:
      '<p>Der derzeitige Aufenthaltsort bezeichnet den Ort, an dem sich die betroffene Person zum Zeitpunkt der Meldung aktuell aufhält. ' +
      'Angaben zum derzeitigen Aufenthaltsort sind immer notwendig, wenn sich diese von Angaben zum gewöhnlichen Aufenthaltsort bzw. zur Hauptwohnung der betroffenen Person unterscheiden, ' +
      'z.B. bei einem stationären Aufenthalt im Krankenhaus (ambulante Krankenhausaufenthalte und Arztpraxen fallen nicht darunter). ' +
      'Handelt es sich beim derzeitigen Aufenthaltsort um die meldende Einrichtung, kann diese hier übernommen werden.</p>',
  },
  {
    id: 'currentAddressType',
    key: 'currentAddressType',
    className: FormlyConstants.ROW,
    type: 'radio',
    props: {
      required: true,
      options: CURRENT_ADDRESS_TYPE_OPTION_LIST,
    },
  },
  {
    id: 'currentAddressInstitutionName',
    key: 'currentAddressInstitutionName',
    className: FormlyConstants.ROW,
    type: 'input',
    props: {
      required: true,
    },
    expressions: {
      hide: (ffc: FormlyFieldConfig) =>
        !ffc.form?.value?.currentAddressType ||
        ffc.form?.value?.currentAddressType === AddressType.PrimaryAsCurrent ||
        ffc.form?.value?.currentAddressType === AddressType.Current,
      'props.label': (ffc: FormlyFieldConfig) =>
        ffc.form?.value?.currentAddressType === AddressType.SubmittingFacility ? 'Name der Einrichtung' : 'Name der Einrichtung / Unterkunft',
      'props.disabled': (ffc: FormlyFieldConfig) => ffc.form?.value?.currentAddressType === AddressType.SubmittingFacility,
    },
    validators: {
      validation: ['nonBlankValidator', 'textValidator'],
    },
  },
  {
    key: 'currentAddress',
    fieldGroupClassName: FormlyConstants.ROW,
    fieldGroup: addressFormConfigFields(false, CURRENT_ADDRESS_ID, false),
    expressions: {
      hide: (ffc: FormlyFieldConfig) => !ffc.form?.value?.currentAddressType || ffc.form?.value?.currentAddressType === AddressType.PrimaryAsCurrent,
      'props.disabled': (ffc: FormlyFieldConfig) => ffc.form?.value?.currentAddressType === AddressType.SubmittingFacility,
    },
  },
  {
    className: '',
    template: '<h2>Kontaktmöglichkeiten der betroffenen Person</h2>',
  },
];

export const notifiedPersonFormConfigFields = (advanced: boolean) => {
  return notifiedPersonInfo.concat(dnNotifiedPersonFormConfigFields).concat(contactsFormConfigFields(false, true));
};
