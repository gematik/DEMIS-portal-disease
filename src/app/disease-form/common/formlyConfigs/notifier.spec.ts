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

import { FormlyFieldConfig } from '@ngx-formly/core';
import { notifierFacilityOrganizationFormConfigFields } from './notifier';
import { DemisCoding } from '../../../demis-types';
import { environment } from '../../../../environments/environment';

describe('notifierFacilityOrgaTypeFormlyFieldConfig (via notifierFacilityOrganizationFormConfigFields)', () => {
  const orgaTypeOptions: DemisCoding[] = [{ code: 'hospital', display: 'Krankenhaus', system: 'foo' } as DemisCoding];

  function findOrganizationTypeField(fields: FormlyFieldConfig[]): FormlyFieldConfig | undefined {
    for (const field of fields) {
      if (field.id === 'organizationType') {
        return field;
      }
      const nested = field.fieldGroup ? findOrganizationTypeField(field.fieldGroup) : undefined;
      if (nested) {
        return nested;
      }
    }
    return undefined;
  }

  beforeEach(() => {
    environment.diseaseConfig = { featureFlags: {} };
  });

  it('should configure the organizationType field as filterable-select with the expected option keys', () => {
    const orgField = findOrganizationTypeField(notifierFacilityOrganizationFormConfigFields(orgaTypeOptions));

    expect(orgField).toBeTruthy();
    expect(orgField!.type).toBe('filterable-select');
    expect(orgField!.props?.['options']).toEqual(orgaTypeOptions);
    expect(orgField!.props?.['optionValueKey']).toBe('code');
    expect(orgField!.props?.['optionLabelKey']).toBe('display');
    expect(orgField!.props?.['optionDescriptionKey']).toBe('breadcrumb');
  });
});
