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
import { ZIP_INTERNATIONAL_MAX_LENGTH, ZIP_INTERNATIONAL_MIN_LENGTH } from './common-utils';
import { FormlyConstants } from './formly-constants';
import { FormlyExpressionType, formlyInputField, formlyRow } from '../disease-form/common/formlyConfigs/formly-base';

export const addressFormPanelConfigFields = (required: boolean, idPrefix: string, zipExpressions: FormlyExpressionType | undefined = undefined) =>
  [
    formlyRow([
      formlyInputField({
        id: `${idPrefix}street`,
        key: 'street',
        className: 'col-md-8',
        props: {
          label: 'Straße',
          required: required,
        },
        validators: required ? ['streetValidator', 'nonBlankValidator'] : ['streetValidator'],
      }),
      formlyInputField({
        id: `${idPrefix}houseNumber`,
        key: 'houseNumber',
        className: FormlyConstants.COLMD3,
        props: {
          maxLength: 10,
          label: 'Hausnummer',
          required: required,
        },
        validators: ['houseNumberValidator'],
      }),
    ]),
    formlyRow([
      {
        ...formlyInputField({
          id: `${idPrefix}zip`,
          key: 'zip',
          className: FormlyConstants.COLMD3,
          props: {
            minLength: ZIP_INTERNATIONAL_MIN_LENGTH,
            maxLength: ZIP_INTERNATIONAL_MAX_LENGTH,
            label: 'Postleitzahl',
            required: false,
          },
          validators: ['internationalZipValidator'],
        }),
        expressions: zipExpressions,
      },
      formlyInputField({
        id: `${idPrefix}city`,
        key: 'city',
        className: 'col-md-8',
        props: {
          label: 'Stadt',
          required: required,
        },
      }),
    ]),
    formlyRow(
      [
        {
          id: `${idPrefix}country`,
          key: 'country',
          className: 'col-md-11',
          type: 'select',
          props: {
            label: 'Land',
            required: required,
            valueSetIdentifier: FormlyConstants.COUNTRY_CODES,
            disabled: required,
          },
        },
      ],
      undefined,
      'row margin-right-exp-label-correction'
    ),
  ] as FormlyFieldConfig[];
