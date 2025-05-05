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

import { FormlyFieldConfig } from '@ngx-formly/core';
import { DemisCoding } from '../../../demis-types';
import {
  addressFormConfigFields,
  contactsFormConfigFields,
  formlyInputField,
  formlyRow,
  infoOutline,
  oneTimeCodeConfigField,
  personalDataWillBeStoredInLocalStorageOutline,
} from './formly-base';
import { ExtendedSalutationEnum } from '../../../legacy/common-utils';

export const existsBsnrFormlyFieldConfig: FormlyFieldConfig = {
  id: 'existsBsnr',
  type: 'radio',
  key: 'existsBsnr',
  className: 'col-3  align-self-start',
  defaultValue: true,
  props: {
    label: 'Betriebsstättennummer',
    required: true,
    options: [
      { value: true, label: 'Vorhanden' },
      { value: false, label: 'Nicht vorhanden' },
    ],
  },
};

export const bsnrFormlyFieldConfig: FormlyFieldConfig = {
  id: 'bsnr',
  key: 'bsnr',
  type: 'input',
  className: 'col-9  align-self-start',
  expressions: {
    hide: (ffc: FormlyFieldConfig) => ffc.model.existsBsnr === false,
    'props.required': (ffc: FormlyFieldConfig) => ffc.model.existsBsnr,
  },
  defaultValue: '',
  props: {
    required: true,
    maxLength: 9,
    label: 'Betriebsstättennummer',
  },
  validators: {
    validation: ['bsNrValidator'],
  },
};

export const practitionerInfoFormConfigFields = formlyRow(
  [
    {
      id: 'salutation',
      type: 'select',
      key: 'salutation',
      className: 'id_salutation col-md-6',
      props: {
        label: 'Anrede',
        options: [
          { value: ExtendedSalutationEnum.Mrs, label: 'Frau' },
          { value: ExtendedSalutationEnum.Mr, label: 'Herr' },
          { value: ExtendedSalutationEnum.None, label: 'Keine Anrede' },
        ],
      },
    },
    formlyInputField({
      key: 'prefix',
      className: 'col-md-6',
      props: {
        label: 'Titel',
      },
    }),
    formlyInputField({
      key: 'firstname',
      className: 'col-md-6',
      props: {
        label: 'Vorname',
        required: true,
      },
      validators: ['nonBlankValidator', 'textValidator'],
    }),
    formlyInputField({
      key: 'lastname',
      className: 'col-md-6',
      props: {
        label: 'Nachname',
        required: true,
      },
      validators: ['nonBlankValidator', 'textValidator'],
    }),
  ],
  'contact'
);

export interface PractitionerInfoAsModel {
  salutation?: { value: string; label: string };
  prefix?: string;
  firstname: string;
  lastname: string;
}

function notifierFacilityOrgaTypeFormlyFieldConfig(orgaTypeOptions: DemisCoding[]): FormlyFieldConfig {
  return {
    id: 'organizationType',
    // note: key suffix answer.valueCoding is required for the clipboard functionality to work
    key: 'organizationType.answer.valueCoding',
    type: 'autocomplete-coding',
    className: 'id_organizationType col-md-12',
    defaultValue: '',
    props: {
      options: orgaTypeOptions,
      required: true,
      clearable: true,
      importSpec: {
        importKey: 'F.type',
      },
      label: 'Typ',
      _formlyPathKeys_: 'tabNotifier.facilityInfo.organizationType.answer.valueCoding',
    },
    validators: {
      validation: ['isCodeChoosen'],
    },
  };
}

export function notifierFacilityOrganizationFormConfigFields(orgaTypeOptions: DemisCoding[]): FormlyFieldConfig[] {
  return [
    {
      className: '',
      template: '<h2>Einrichtung</h2>',
    },
    {
      fieldGroupClassName: 'row',
      key: 'facilityInfo',
      fieldGroup: [
        formlyInputField({
          key: 'institutionName',
          className: 'col-md-12',
          props: {
            label: 'Name der Einrichtung',
            required: true,
          },
          validators: ['nonBlankValidator', 'textValidator'],
        }),
        existsBsnrFormlyFieldConfig,
        bsnrFormlyFieldConfig,
        notifierFacilityOrgaTypeFormlyFieldConfig(orgaTypeOptions),
      ],
    },
    {
      className: '',
      template: '<h2>Adresse</h2>',
    },
    {
      key: 'address',
      fieldGroupClassName: 'row',
      fieldGroup: addressFormConfigFields(true, '', false, { 'props.required': () => true }, true),
    },
    {
      template: '<h2>Ansprechperson (Melder)</h2>',
    },
    practitionerInfoFormConfigFields,
    oneTimeCodeConfigField,
    { template: '<h2>Kontaktmöglichkeiten</h2>' },
  ];
}

const notifierFacilityHtmlConfigFields: FormlyFieldConfig[] = [infoOutline, personalDataWillBeStoredInLocalStorageOutline];

export function notifierFacilityFormConfigFields(orgaTypeOptions: DemisCoding[]): FormlyFieldConfig[] {
  return notifierFacilityHtmlConfigFields.concat(notifierFacilityOrganizationFormConfigFields(orgaTypeOptions)).concat(contactsFormConfigFields(true));
}
