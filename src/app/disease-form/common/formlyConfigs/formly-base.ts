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

import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { FormlyConstants } from '../../../legacy/formly-constants';
import { ZIP_GERMANY_MAX_LENGTH, ZIP_GERMANY_MIN_LENGTH, ZIP_INTERNATIONAL_MAX_LENGTH, ZIP_INTERNATIONAL_MIN_LENGTH } from '../../../legacy/common-utils';

export type FormlyExpressionType = {
  [property: string]: string | ((field: FormlyFieldConfig) => any) | Observable<any>;
};

export const formlyInputField = (config: {
  key: string;
  className: string;
  props: FormlyFieldProps;
  validators?: string[];
  id?: string;
}): FormlyFieldConfig => {
  return {
    id: config.id ? config.id : config.key,
    key: config.key,
    className: config.className,
    type: 'input',
    props: { ...config.props, attributes: { appCheckLabelLength: '' } },
    validators: {
      validation: config.validators || (config.props.required ? ['textValidator', 'nonBlankValidator'] : ['textValidator']),
    },
  };
};

export const formlyRow = (fieldConfig: FormlyFieldConfig[], key?: string, className: string = 'row') => {
  return {
    key: key ? key : undefined,
    fieldGroupClassName: className,
    fieldGroup: fieldConfig,
  } as FormlyFieldConfig;
};

export const oneTimeCodeConfigField = formlyRow([
  {
    id: 'oneTimeCode',
    key: 'oneTimeCode',
    type: 'input',
    className: 'oneTimeCode',
    props: {
      attributes: {
        tabindex: 500,
        autocomplete: 'off',
      },
    },
  },
]);

export const infoOutline: FormlyFieldConfig = {
  className: 'col-sm-12',
  template: `<div class="info-notification-text">
               <span class="material-icons md-48">info_outline</span>
               <span class="message">Grundsätzlich müssen Sie gemäß Infektionsschutzgesetz alle Ihnen vorliegenden Informationen im Meldeformular angeben, um die Meldepflicht zu erfüllen. Die Nachmeldung oder Korrektur von Angaben hat unverzüglich zu erfolgen.</span>
             </div>`,
  props: {
    addonLeft: {
      icon: 'info_outline',
    },
  },
};

export const personalDataWillBeStoredInLocalStorageOutline: FormlyFieldConfig = {
  className: 'col-sm-12',
  template: `<div class="info-notification-text">
               <span class="material-icons md-48">info_outline</span>
               <span class="message">Die Informationen aus den Eingabefeldern zur meldenden Person werden <i>lokal im aktuellen Browser</i> gespeichert. Bei Folgemeldungen werden diese Eingabefelder automatisch mit den gespeicherten Daten vorbefüllt, damit der Meldevorgang beschleunigt wird.</span>
             </div>`,
  props: {
    addonLeft: {
      icon: 'info_outline',
    },
  },
};

export const addressFormConfigFields = (
  required: boolean,
  idPrefix: string = '',
  disabled: boolean = false,
  zipExpressions: FormlyExpressionType | undefined = undefined,
  countryDisabled: boolean = false
) => [
  formlyInputField({
    id: `${idPrefix}street`,
    key: `street`,
    className: 'col-md-9',
    props: {
      label: 'Straße',
      required: required,
      disabled: disabled,
    },
    validators: required ? ['streetValidator', 'nonBlankValidator'] : ['streetValidator'],
  }),
  formlyInputField({
    id: `${idPrefix}houseNumber`,
    key: 'houseNumber',
    className: 'col-md-3',
    props: {
      maxLength: 10,
      label: 'Hausnummer',
      required: required,
      disabled: disabled,
    },
    validators: ['houseNumberValidator'],
  }),
  {
    ...formlyInputField({
      id: `${idPrefix}zip`,
      key: 'zip',
      className: FormlyConstants.COLMD3,
      props: {
        maxLength: required ? ZIP_GERMANY_MAX_LENGTH : ZIP_INTERNATIONAL_MAX_LENGTH,
        minLength: required ? ZIP_GERMANY_MIN_LENGTH : ZIP_INTERNATIONAL_MIN_LENGTH,
        label: 'Postleitzahl',
        disabled: disabled,
        required: true,
      },
      validators: [required ? 'germanZipValidator' : 'internationalZipValidator'],
    }),
    expressions: zipExpressions,
  },
  formlyInputField({
    id: `${idPrefix}city`,
    key: 'city',
    className: 'col-md-9',
    props: {
      label: 'Stadt',
      required: required,
      disabled: disabled,
    },
  }),
  {
    id: `${idPrefix}country`,
    key: 'country',
    className: 'col-12',
    type: 'select',
    defaultValue: 'DE',
    props: {
      label: 'Land',
      required: true,
      valueSetIdentifier: FormlyConstants.COUNTRY_CODES,
      disabled: disabled || countryDisabled,
    },
  },
];

export const contactsFormConfigFields: (needsContact: boolean, hospitalizationPerson?: boolean) => FormlyFieldConfig[] = needsContact => [
  {
    className: 'col-sm-12 mt-sm-3',
    template: `<p>Bitte geben Sie mindestens eine Kontaktmöglichkeit an.</p>`,
    expressions: { hide: () => !needsContact },
  },
  {
    key: 'contacts',
    fieldGroup: [
      {
        key: 'phoneNumbers',
        id: 'phoneNumbers',
        type: 'repeater',
        defaultValue: needsContact ? [{}] : [],
        wrappers: ['validation'],
        props: { addButtonLabel: 'Telefonnummer hinzufügen' },
        expressions: {
          'props.required': needsContact ? (field: FormlyFieldConfig) => field.form?.get('emailAddresses')?.value.length === 0 : () => false,
        },
        fieldArray: {
          fieldGroupClassName: 'd-flex flex-column',
          fieldGroup: [
            {
              key: 'contactType',
              defaultValue: 'phone',
            },
            {
              key: 'usage',
              defaultValue: needsContact ? 'work' : undefined,
            },
            {
              className: 'flex-grow-1',
              type: 'input',
              key: 'value',
              defaultValue: '',
              props: {
                label: 'Telefonnummer',
                maxLength: 50,
                required: true,
                attributes: { 'data-cy': 'phoneNo' },
              },
              validators: {
                validation: ['phoneValidator'],
              },
              validation: {
                show: true,
              },
              expressions: {
                'validation.show': (ffc: FormlyFieldConfig) => ffc.model?.value,
              },
            },
          ],
        },
      },
      {
        id: 'emailAddresses',
        key: 'emailAddresses',
        type: 'repeater',
        defaultValue: needsContact ? [{}] : [],
        wrappers: ['validation'],
        props: {
          addButtonLabel: 'Email-Adresse hinzufügen',
        },
        expressions: {
          'props.required': needsContact ? (field: FormlyFieldConfig) => field.form?.get('phoneNumbers')?.value.length === 0 : () => false,
        },
        fieldArray: {
          fieldGroupClassName: 'd-flex flex-column',
          fieldGroup: [
            {
              key: 'contactType',
              defaultValue: 'email',
            },
            {
              className: 'flex-grow-1',
              type: 'input',
              key: 'value',
              defaultValue: '',
              props: {
                label: 'Email-Adresse',
                required: true,
                maxLength: 5000,
                attributes: { 'data-cy': 'email' },
              },
              validators: {
                validation: ['emailValidator'],
              },
              validation: {
                show: true,
              },
              expressionProperties: {
                'validation.show': (ffc: FormlyFieldConfig) => ffc.model?.value,
              },
            },
          ],
        },
      },
    ],
  },
];

export interface ContactsAsModel {
  emailAddresses: {
    contactType: string;
    value: string;
  }[];
  phoneNumbers: {
    contactType: string;
    usage: string;
    value: string;
  }[];
}

export interface AddressAsModel {
  city: string;
  country: string;
  houseNumber: string;
  street: string;
  zip: string;
}
