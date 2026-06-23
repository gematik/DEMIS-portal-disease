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
import { getDiseaseChoiceFields } from './disease-choice';
import { NotificationType } from '../../../demis-types';
import { CodeDisplay, DiseaseStatus } from '../../../../api/notification';
import { environment } from '../../../../environments/environment';

function findFieldById(fields: FormlyFieldConfig[], id: string): FormlyFieldConfig | undefined {
  return fields.find(field => field.id === id);
}

describe('getDiseaseChoiceFields', () => {
  const diseaseOptions: CodeDisplay[] = [{ code: 'cvdd', display: 'COVID-19' }];

  beforeEach(() => {
    environment.diseaseConfig = {
      featureFlags: {},
    };
  });

  it('should contain the knowledge database info link with the correct href', () => {
    const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);

    const infoField = fields.find(field => typeof field.template === 'string' && field.template.includes('id="knowledge-db-info-link"'));
    expect(infoField).withContext('info link field should be present').toBeTruthy();

    const template = infoField && ((infoField as any).template as string | undefined);
    if (!template) {
      fail('info link template not found');
      return;
    }

    // match href value of anchor inside the template
    const hrefMatch = template.match(/href\s*=\s*"([^"]+)"/);
    expect(hrefMatch).withContext('href must be present in the template anchor').toBeTruthy();
    expect(hrefMatch && hrefMatch[1]).toBe('https://go.gematik.de/demis-info-disease');
  });

  describe('when FEATURE_FLAG_DISEASE_AUTOCOMPLETE is disabled', () => {
    beforeEach(() => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_AUTOCOMPLETE = false;
    });

    it('should produce the legacy autocomplete-coding disease-choice field with a question-title for status', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);

      const diseaseChoice = findFieldById(fields, 'disease-choice');
      expect(diseaseChoice).withContext('legacy field id "disease-choice" should be present').toBeTruthy();
      expect(diseaseChoice?.type).toBe('autocomplete-coding');
      expect(diseaseChoice?.props?.['label']).toBeUndefined();
      expect(diseaseChoice?.props?.['optionValueKey']).toBeUndefined();

      const statusTitleField = fields.find(field => field.className === 'diseaseStatus');
      expect(statusTitleField).withContext('legacy "Status *" question-title template should be present').toBeTruthy();

      const clinicalStatus = findFieldById(fields, 'clinical-status');
      expect(clinicalStatus?.props?.['label']).toBeUndefined();
    });

    it('should mark the disease-choice field as disabled and not clearable for follow-up notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.FollowUpNotification6_1);
      const diseaseChoice = findFieldById(fields, 'disease-choice');

      expect(diseaseChoice?.props?.['disabled']).toBeTrue();
      expect(diseaseChoice?.props?.['clearable']).toBeFalse();
    });
  });

  describe('when FEATURE_FLAG_DISEASE_AUTOCOMPLETE is enabled', () => {
    beforeEach(() => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_AUTOCOMPLETE = true;
    });

    it('should produce a filterable-select disease-choice-input field with label, placeholder and option keys', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);

      const diseaseChoice = findFieldById(fields, 'disease-choice-input');
      expect(diseaseChoice).withContext('new field id "disease-choice-input" should be present').toBeTruthy();
      expect(diseaseChoice?.type).toBe('filterable-select');
      expect(diseaseChoice?.props?.['label']).toBe('Erkrankung');
      expect(diseaseChoice?.props?.['placeholder']).toBe('Bitte auswählen');
      expect(diseaseChoice?.props?.['optionValueKey']).toBe('code');
      expect(diseaseChoice?.props?.['optionLabelKey']).toBe('display');
      expect(diseaseChoice?.props?.['optionDescriptionKey']).toBe('breadcrumb');
    });

    it('should not include the legacy "Status *" question-title and should set the label on the clinical status field', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);

      const statusTitleField = fields.find(field => field.className === 'diseaseStatus');
      expect(statusTitleField).withContext('legacy status title must not be rendered').toBeUndefined();

      const clinicalStatus = findFieldById(fields, 'clinical-status');
      expect(clinicalStatus?.props?.['label']).toBe('Status');
    });

    it('should disable and lock the disease-choice-input field for follow-up notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.FollowUpNotification7_3);
      const diseaseChoice = findFieldById(fields, 'disease-choice-input');

      expect(diseaseChoice?.props?.['disabled']).toBeTrue();
      expect(diseaseChoice?.props?.['clearable']).toBeFalse();
    });
  });

  describe('when FEATURE_FLAG_DISEASE_STATUS_ORDER_NODEFAULT is enabled', () => {
    beforeEach(() => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_STATUS_ORDER_NODEFAULT = true;
    });

    it('should mark the clinical-status field as required', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const clinicalStatus = findFieldById(fields, 'clinical-status');

      expect(clinicalStatus?.props?.['required']).toBeTrue();
    });

    it('should list Preliminary before Final in the clinical-status options', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const clinicalStatus = findFieldById(fields, 'clinical-status');
      const options = clinicalStatus?.props?.['options'] as { value: string; label: string }[];

      expect(options[0].value).toBe(DiseaseStatus.StatusEnum.Preliminary);
      expect(options[1].value).toBe(DiseaseStatus.StatusEnum.Final);
    });
  });

  describe('when FEATURE_FLAG_DISEASE_STATUS_ORDER_NODEFAULT is disabled', () => {
    beforeEach(() => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_STATUS_ORDER_NODEFAULT = false;
    });

    it('should not mark the clinical-status field as required', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const clinicalStatus = findFieldById(fields, 'clinical-status');

      expect(clinicalStatus?.props?.['required']).toBeFalsy();
    });

    it('should list Final before Preliminary in the clinical-status options', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const clinicalStatus = findFieldById(fields, 'clinical-status');
      const options = clinicalStatus?.props?.['options'] as { value: string; label: string }[];

      expect(options[0].value).toBe(DiseaseStatus.StatusEnum.Final);
      expect(options[1].value).toBe(DiseaseStatus.StatusEnum.Preliminary);
    });
  });
});
