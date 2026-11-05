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
import { describe, expect, it } from 'vitest';
import { CodeDisplay, DiseaseStatus, NotificationLaboratoryCategory } from '../../../../api/notification';
import { NotificationType } from '../../../demis-types';
import { getDiseaseChoiceFields } from './disease-choice';
import NotificationIdReferenceEnum = NotificationLaboratoryCategory.NotificationIdReferenceEnum;

function findFieldById(fields: FormlyFieldConfig[], id: string): FormlyFieldConfig | undefined {
  return fields.find(field => field.id === id);
}

function findFieldByKey(fields: FormlyFieldConfig[], key: string): FormlyFieldConfig | undefined {
  return fields.find(field => field.key === key);
}

function findNestedFieldById(fields: FormlyFieldConfig[], groupKey: string, id: string): FormlyFieldConfig | undefined {
  const group = findFieldByKey(fields, groupKey);
  return group?.fieldGroup?.find(f => f.id === id);
}

function findNestedFieldByKey(fields: FormlyFieldConfig[], groupKey: string, nestedKey: string): FormlyFieldConfig | undefined {
  const group = findFieldByKey(fields, groupKey);
  return group?.fieldGroup?.find(f => f.key === nestedKey);
}

describe('getDiseaseChoiceFields', () => {
  const diseaseOptions: CodeDisplay[] = [{ code: 'cvdd', display: 'COVID-19' }];

  it('should contain the knowledge database info link with the correct href', () => {
    const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);

    const infoField = fields.find(field => typeof field.template === 'string' && field.template.includes('id="knowledge-db-info-link"'));
    expect(infoField, 'info link field should be present').toBeTruthy();

    const template = infoField && ((infoField as any).template as string | undefined);
    if (!template) {
      throw new Error('info link template not found');
      return;
    }

    // match href value of anchor inside the template
    const hrefMatch = template.match(/href\s*=\s*"([^"]+)"/);
    expect(hrefMatch, 'href must be present in the template anchor').toBeTruthy();
    expect(hrefMatch && hrefMatch[1]).toBe('https://go.gematik.de/demis-info-disease');
  });

  describe('disease autocomplete field', () => {
    it('should produce a filterable-select disease-choice-input field with label, placeholder and option keys', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);

      const diseaseChoice = findFieldById(fields, 'disease-choice-input');
      expect(diseaseChoice, 'new field id "disease-choice-input" should be present').toBeTruthy();
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
      expect(statusTitleField, 'legacy status title must not be rendered').toBeUndefined();

      const clinicalStatus = findFieldById(fields, 'clinical-status');
      expect(clinicalStatus?.props?.['label']).toBe('Status');
    });

    it('should disable and lock the disease-choice-input field for follow-up notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.FollowUpNotification7_3);
      const diseaseChoice = findFieldById(fields, 'disease-choice-input');

      expect(diseaseChoice?.props?.['disabled']).toBe(true);
      expect(diseaseChoice?.props?.['clearable']).toBe(false);
    });
  });

  describe('clinical-status field', () => {
    it('should mark the clinical-status field as required', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const clinicalStatus = findFieldById(fields, 'clinical-status');

      expect(clinicalStatus?.props?.['required']).toBe(true);
    });

    it('should list Preliminary before Final in the clinical-status options', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const clinicalStatus = findFieldById(fields, 'clinical-status');
      const options = clinicalStatus?.props?.['options'] as {
        value: string;
        label: string;
      }[];

      expect(options[0].value).toBe(DiseaseStatus.StatusEnum.Preliminary);
      expect(options[1].value).toBe(DiseaseStatus.StatusEnum.Final);
    });
  });

  it('should contain the statusNoteGroup fieldGroup with row className', () => {
    const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
    const statusNoteGroup = findFieldByKey(fields, 'statusNoteGroup');

    expect(statusNoteGroup, 'statusNoteGroup should be present').toBeTruthy();
    expect(statusNoteGroup?.fieldGroupClassName).toBe('row');
  });

  it('should include a statusNote input field with col-md-12 className', () => {
    const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
    const statusNote = findNestedFieldByKey(fields, 'statusNoteGroup', 'statusNote.answer.valueString');

    expect(statusNote, 'statusNote field should be present').toBeTruthy();
    expect(statusNote?.type).toBe('input');
    expect(statusNote?.props?.['label']).toBe('Hinweise');
    expect(statusNote?.className).toContain('col-md-12');
  });

  describe('template help text expression', () => {
    let templateField: FormlyFieldConfig;

    function buildMockForTemplateExpression(referenceValue: string | null | undefined): void {
      const notificationIdReferenceField: FormlyFieldConfig = {
        id: 'notificationIdReference',
        key: 'notificationIdReference.answer.valueString',
        model: { notificationIdReference: { answer: { valueString: referenceValue } } },
      };

      const statusNoteGroupField: FormlyFieldConfig = {
        key: 'statusNoteGroup',
        fieldGroup: [notificationIdReferenceField, templateField],
      };

      const rootParent: FormlyFieldConfig = { fieldGroup: [statusNoteGroupField] };
      (templateField as any)['parent'] = statusNoteGroupField;
      (statusNoteGroupField as any)['parent'] = rootParent;
    }

    beforeEach(() => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const statusNoteGroup = findFieldByKey(fields, 'statusNoteGroup');
      templateField = statusNoteGroup?.fieldGroup?.find(f => f.className === 'col-md-1=' && f.expressions?.['template'])!;
    });

    it('should be present', () => {
      expect(templateField, 'template field with dynamic text should be present').toBeTruthy();
    });

    it('should return own facility text when reference is RelatesToOwnFacility', () => {
      buildMockForTemplateExpression(NotificationIdReferenceEnum.RelatesToOwnFacility);
      const templateExpr = templateField.expressions!['template'] as (field: FormlyFieldConfig) => string;

      expect(templateExpr(templateField)).toContain(
        'Bitte geben Sie die Meldungs-ID der Initialmeldung an, um sie für diese Meldung als Meldungs-ID nachzunutzen'
      );
    });

    it('should return other facility text when reference is RelatesToOtherFacility', () => {
      buildMockForTemplateExpression(NotificationIdReferenceEnum.RelatesToOtherFacility);
      const templateExpr = templateField.expressions!['template'] as (field: FormlyFieldConfig) => string;

      expect(templateExpr(templateField)).toContain('Bitte geben Sie die Meldungs-ID der Initialmeldung an, um den Meldungsverweis zu setzen');
    });

    it('should return no-reference text when reference is NoReference', () => {
      buildMockForTemplateExpression(NotificationIdReferenceEnum.NoReference);
      const templateExpr = templateField.expressions!['template'] as (field: FormlyFieldConfig) => string;

      expect(templateExpr(templateField)).toContain('Für diese Meldung wird eine neue Meldungs-ID erzeugt');
    });

    it('should return no-reference text when reference value is null', () => {
      buildMockForTemplateExpression(null);
      const templateExpr = templateField.expressions!['template'] as (field: FormlyFieldConfig) => string;

      expect(templateExpr(templateField)).toContain('Für diese Meldung wird eine neue Meldungs-ID erzeugt');
    });

    it('should return no-reference text when reference value is undefined', () => {
      buildMockForTemplateExpression(undefined);
      const templateExpr = templateField.expressions!['template'] as (field: FormlyFieldConfig) => string;

      expect(templateExpr(templateField)).toContain('Für diese Meldung wird eine neue Meldungs-ID erzeugt');
    });
  });

  describe('notificationIdReference field', () => {
    it('should be a required radio field with correct label', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const referenceField = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference');

      expect(referenceField, 'notificationIdReference field should be present').toBeTruthy();
      expect(referenceField?.type).toBe('radio');
      expect(referenceField?.props?.['label']).toBe('Verweis auf vorherige Meldung (Initiale Meldungs-ID)');
      expect(referenceField?.props?.['required']).toBe(true);
    });

    it('should not be disabled for nominal notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const referenceField = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference');

      expect(referenceField?.props?.['disabled']).toBeFalsy();
    });

    it('should be disabled for follow-up notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.FollowUpNotification6_1);
      const referenceField = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference');

      expect(referenceField?.props?.['disabled']).toBe(true);
    });

    it('should set defaultValue to RelatesToOtherFacility for follow-up notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.FollowUpNotification7_3);
      const referenceField = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference');

      expect(referenceField?.defaultValue).toBe(NotificationIdReferenceEnum.RelatesToOtherFacility);
    });

    it('should not set defaultValue for nominal notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const referenceField = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference');

      expect(referenceField?.defaultValue).toBeUndefined();
    });

    it('should have an importSpec with valueMap', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const referenceField = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference');
      const importSpec = referenceField?.props?.['importSpec'];

      expect(importSpec).toBeTruthy();
      expect(importSpec.importKey).toBe('D.reference');
      expect(importSpec.valueMap).toEqual({
        NONE: NotificationIdReferenceEnum.NoReference,
        OWN: NotificationIdReferenceEnum.RelatesToOwnFacility,
        OTHER: NotificationIdReferenceEnum.RelatesToOtherFacility,
      });
    });

    it('should have an expression that computes options based on clinical status', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const referenceField = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference');

      expect(referenceField?.expressions?.['props.options']).toBeDefined();
    });

    describe('props.options expression', () => {
      let referenceFieldConfig: FormlyFieldConfig;

      function buildMockForOptionsExpression(clinicalStatusValue: string | undefined): void {
        const clinicalStatusField: FormlyFieldConfig = {
          id: 'clinical-status',
          model: { clinicalStatus: { answer: { valueString: clinicalStatusValue } } },
        };

        const statusNoteGroupField: FormlyFieldConfig = {
          key: 'statusNoteGroup',
          fieldGroup: [referenceFieldConfig],
        };

        const rootParent: FormlyFieldConfig = {
          fieldGroup: [clinicalStatusField, statusNoteGroupField],
        };

        (referenceFieldConfig as any)['parent'] = statusNoteGroupField;
        (statusNoteGroupField as any)['parent'] = rootParent;
      }

      beforeEach(() => {
        const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
        referenceFieldConfig = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference')!;
      });

      it('should disable NoReference option when status is Amended', () => {
        buildMockForOptionsExpression(DiseaseStatus.StatusEnum.Amended);
        const optionsExpr = referenceFieldConfig.expressions!['props.options'] as (field: FormlyFieldConfig) => any[];
        const options = optionsExpr(referenceFieldConfig);

        const noRefOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.NoReference);
        expect(noRefOption.disabled).toBe(true);
      });

      it('should disable NoReference option when status is Refuted', () => {
        buildMockForOptionsExpression(DiseaseStatus.StatusEnum.Refuted);
        const optionsExpr = referenceFieldConfig.expressions!['props.options'] as (field: FormlyFieldConfig) => any[];
        const options = optionsExpr(referenceFieldConfig);

        const noRefOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.NoReference);
        expect(noRefOption.disabled).toBe(true);
      });

      it('should disable NoReference option when status is Error', () => {
        buildMockForOptionsExpression(DiseaseStatus.StatusEnum.Error);
        const optionsExpr = referenceFieldConfig.expressions!['props.options'] as (field: FormlyFieldConfig) => any[];
        const options = optionsExpr(referenceFieldConfig);

        const noRefOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.NoReference);
        expect(noRefOption.disabled).toBe(true);
      });

      it('should not disable NoReference option when status is Final', () => {
        buildMockForOptionsExpression(DiseaseStatus.StatusEnum.Final);
        const optionsExpr = referenceFieldConfig.expressions!['props.options'] as (field: FormlyFieldConfig) => any[];
        const options = optionsExpr(referenceFieldConfig);

        const noRefOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.NoReference);
        expect(noRefOption.disabled).toBe(false);
      });

      it('should not disable NoReference option when status is Preliminary', () => {
        buildMockForOptionsExpression(DiseaseStatus.StatusEnum.Preliminary);
        const optionsExpr = referenceFieldConfig.expressions!['props.options'] as (field: FormlyFieldConfig) => any[];
        const options = optionsExpr(referenceFieldConfig);

        const noRefOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.NoReference);
        expect(noRefOption.disabled).toBe(false);
      });

      it('should not disable NoReference option when status is undefined', () => {
        buildMockForOptionsExpression(undefined);
        const optionsExpr = referenceFieldConfig.expressions!['props.options'] as (field: FormlyFieldConfig) => any[];
        const options = optionsExpr(referenceFieldConfig);

        const noRefOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.NoReference);
        expect(noRefOption.disabled).toBe(false);
      });

      it('should never disable RelatesToOwnFacility or RelatesToOtherFacility options', () => {
        buildMockForOptionsExpression(DiseaseStatus.StatusEnum.Amended);
        const optionsExpr = referenceFieldConfig.expressions!['props.options'] as (field: FormlyFieldConfig) => any[];
        const options = optionsExpr(referenceFieldConfig);

        const ownOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.RelatesToOwnFacility);
        const otherOption = options.find((o: any) => o.value === NotificationIdReferenceEnum.RelatesToOtherFacility);
        expect(ownOption.disabled).toBe(false);
        expect(otherOption.disabled).toBe(false);
      });
    });

    describe('model.notificationIdReference.answer.valueString expression (reset on status change)', () => {
      let referenceFieldConfig: FormlyFieldConfig;

      function buildMockForModelExpression(clinicalStatusValue: string | undefined, referenceValue: string | undefined): void {
        const clinicalStatusField: FormlyFieldConfig = {
          id: 'clinical-status',
          model: { clinicalStatus: { answer: { valueString: clinicalStatusValue } } },
        };

        Object.defineProperty(referenceFieldConfig, 'model', {
          value: { notificationIdReference: { answer: { valueString: referenceValue } } },
          writable: true,
          configurable: true,
        });

        const statusNoteGroupField: FormlyFieldConfig = {
          key: 'statusNoteGroup',
          fieldGroup: [referenceFieldConfig],
        };

        const rootParent: FormlyFieldConfig = {
          fieldGroup: [clinicalStatusField, statusNoteGroupField],
        };

        (referenceFieldConfig as any)['parent'] = statusNoteGroupField;
        (statusNoteGroupField as any)['parent'] = rootParent;
      }

      beforeEach(() => {
        const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
        referenceFieldConfig = findNestedFieldById(fields, 'statusNoteGroup', 'notificationIdReference')!;
      });

      it('should reset NoReference value to undefined when status requires a reference', () => {
        buildMockForModelExpression(DiseaseStatus.StatusEnum.Amended, NotificationIdReferenceEnum.NoReference);
        const modelExpr = referenceFieldConfig.expressions!['model.notificationIdReference.answer.valueString'] as (field: FormlyFieldConfig) => any;

        expect(modelExpr(referenceFieldConfig)).toBeUndefined();
      });

      it('should keep the current value when status requires a reference but value is not NoReference', () => {
        buildMockForModelExpression(DiseaseStatus.StatusEnum.Amended, NotificationIdReferenceEnum.RelatesToOwnFacility);
        const modelExpr = referenceFieldConfig.expressions!['model.notificationIdReference.answer.valueString'] as (field: FormlyFieldConfig) => any;

        expect(modelExpr(referenceFieldConfig)).toBe(NotificationIdReferenceEnum.RelatesToOwnFacility);
      });
    });
  });

  describe('initialNotificationId field', () => {
    it('should be an input field with correct label and uuidValidator', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
      const initialNotificationId = findNestedFieldById(fields, 'statusNoteGroup', 'initialNotificationId');

      expect(initialNotificationId, 'initialNotificationId field should be present').toBeTruthy();
      expect(initialNotificationId?.type).toBe('input');
      expect(initialNotificationId?.props?.['label']).toBe('Initiale Meldungs-ID');
      expect(initialNotificationId?.validators?.['validation']).toContain('uuidValidator');
    });

    it('should be disabled for follow-up notifications', () => {
      const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.FollowUpNotification6_1);
      const initialNotificationId = findNestedFieldById(fields, 'statusNoteGroup', 'initialNotificationId');

      expect(initialNotificationId?.props?.['disabled']).toBe(true);
    });

    describe('props.required expression', () => {
      let initialNotificationIdField: FormlyFieldConfig;

      function buildMockFieldTree(referenceValue: string | null | undefined): void {
        const notificationIdReferenceField: FormlyFieldConfig = {
          id: 'notificationIdReference',
          key: 'notificationIdReference.answer.valueString',
          model: { notificationIdReference: { answer: { valueString: referenceValue } } },
        };

        const statusNoteGroupField: FormlyFieldConfig = {
          key: 'statusNoteGroup',
          fieldGroup: [notificationIdReferenceField, initialNotificationIdField],
        };

        const rootParent: FormlyFieldConfig = { fieldGroup: [statusNoteGroupField] };
        (initialNotificationIdField as any)['parent'] = statusNoteGroupField;
        (statusNoteGroupField as any)['parent'] = rootParent;
      }

      beforeEach(() => {
        const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
        initialNotificationIdField = findNestedFieldById(fields, 'statusNoteGroup', 'initialNotificationId')!;
      });

      it('should be true when reference value is RelatesToOwnFacility', () => {
        buildMockFieldTree(NotificationIdReferenceEnum.RelatesToOwnFacility);
        const requiredExpr = initialNotificationIdField.expressions!['props.required'] as (field: FormlyFieldConfig) => boolean;

        expect(requiredExpr(initialNotificationIdField)).toBe(true);
      });

      it('should be true when reference value is RelatesToOtherFacility', () => {
        buildMockFieldTree(NotificationIdReferenceEnum.RelatesToOtherFacility);
        const requiredExpr = initialNotificationIdField.expressions!['props.required'] as (field: FormlyFieldConfig) => boolean;

        expect(requiredExpr(initialNotificationIdField)).toBe(true);
      });

      it('should be false when reference value is NoReference', () => {
        buildMockFieldTree(NotificationIdReferenceEnum.NoReference);
        const requiredExpr = initialNotificationIdField.expressions!['props.required'] as (field: FormlyFieldConfig) => boolean;

        expect(requiredExpr(initialNotificationIdField)).toBe(false);
      });

      it('should be false when reference value is null', () => {
        buildMockFieldTree(null);
        const requiredExpr = initialNotificationIdField.expressions!['props.required'] as (field: FormlyFieldConfig) => boolean;

        expect(requiredExpr(initialNotificationIdField)).toBe(false);
      });

      it('should be false when reference value is undefined', () => {
        buildMockFieldTree(undefined);
        const requiredExpr = initialNotificationIdField.expressions!['props.required'] as (field: FormlyFieldConfig) => boolean;

        expect(requiredExpr(initialNotificationIdField)).toBe(false);
      });
    });

    describe('props.disabled expression', () => {
      let initialNotificationIdField: FormlyFieldConfig;

      function buildMockFieldTree(referenceValue: string | null | undefined): void {
        const notificationIdReferenceField: FormlyFieldConfig = {
          id: 'notificationIdReference',
          key: 'notificationIdReference.answer.valueString',
          model: { notificationIdReference: { answer: { valueString: referenceValue } } },
        };

        const statusNoteGroupField: FormlyFieldConfig = {
          key: 'statusNoteGroup',
          fieldGroup: [notificationIdReferenceField, initialNotificationIdField],
        };

        const rootParent: FormlyFieldConfig = { fieldGroup: [statusNoteGroupField] };
        (initialNotificationIdField as any)['parent'] = statusNoteGroupField;
        (statusNoteGroupField as any)['parent'] = rootParent;
      }

      beforeEach(() => {
        const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
        initialNotificationIdField = findNestedFieldById(fields, 'statusNoteGroup', 'initialNotificationId')!;
      });

      it('should be true when reference value is NoReference', () => {
        buildMockFieldTree(NotificationIdReferenceEnum.NoReference);
        const disabledExpr = initialNotificationIdField.expressions!['props.disabled'] as (field: FormlyFieldConfig) => boolean;

        expect(disabledExpr(initialNotificationIdField)).toBe(true);
      });

      it('should be true when reference value is null', () => {
        buildMockFieldTree(null);
        const disabledExpr = initialNotificationIdField.expressions!['props.disabled'] as (field: FormlyFieldConfig) => boolean;

        expect(disabledExpr(initialNotificationIdField)).toBe(true);
      });

      it('should be true when reference value is undefined', () => {
        buildMockFieldTree(undefined);
        const disabledExpr = initialNotificationIdField.expressions!['props.disabled'] as (field: FormlyFieldConfig) => boolean;

        expect(disabledExpr(initialNotificationIdField)).toBe(true);
      });

      it('should be false when reference value is RelatesToOwnFacility', () => {
        buildMockFieldTree(NotificationIdReferenceEnum.RelatesToOwnFacility);
        const disabledExpr = initialNotificationIdField.expressions!['props.disabled'] as (field: FormlyFieldConfig) => boolean;

        expect(disabledExpr(initialNotificationIdField)).toBe(false);
      });

      it('should be false when reference value is RelatesToOtherFacility', () => {
        buildMockFieldTree(NotificationIdReferenceEnum.RelatesToOtherFacility);
        const disabledExpr = initialNotificationIdField.expressions!['props.disabled'] as (field: FormlyFieldConfig) => boolean;

        expect(disabledExpr(initialNotificationIdField)).toBe(false);
      });

      it('should be true for follow-up notifications regardless of reference value', () => {
        const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.FollowUpNotification6_1);
        const followUpField = findNestedFieldById(fields, 'statusNoteGroup', 'initialNotificationId')!;

        const notificationIdReferenceField: FormlyFieldConfig = {
          id: 'notificationIdReference',
          key: 'notificationIdReference.answer.valueString',
          model: { notificationIdReference: { answer: { valueString: NotificationIdReferenceEnum.RelatesToOtherFacility } } },
        };

        const groupField: FormlyFieldConfig = {
          key: 'statusNoteGroup',
          fieldGroup: [notificationIdReferenceField, followUpField],
        };

        const rootParent: FormlyFieldConfig = { fieldGroup: [groupField] };
        (followUpField as any)['parent'] = groupField;
        (groupField as any)['parent'] = rootParent;

        const disabledExpr = followUpField.expressions!['props.disabled'] as (field: FormlyFieldConfig) => boolean;
        expect(disabledExpr(followUpField)).toBe(true);
      });
    });

    describe('model.initialNotificationId.answer.valueString expression', () => {
      let initialNotificationIdField: FormlyFieldConfig;

      function buildMockFieldTree(referenceValue: string | null | undefined, modelValue?: string): void {
        const notificationIdReferenceField: FormlyFieldConfig = {
          id: 'notificationIdReference',
          key: 'notificationIdReference.answer.valueString',
          model: { notificationIdReference: { answer: { valueString: referenceValue } } },
        };

        const statusNoteGroupField: FormlyFieldConfig = {
          key: 'statusNoteGroup',
          fieldGroup: [notificationIdReferenceField, initialNotificationIdField],
        };

        const rootParent: FormlyFieldConfig = { fieldGroup: [statusNoteGroupField] };
        (initialNotificationIdField as any)['parent'] = statusNoteGroupField;
        (statusNoteGroupField as any)['parent'] = rootParent;
        (initialNotificationIdField as any)['model'] = { initialNotificationId: { answer: { valueString: modelValue } } };
      }

      beforeEach(() => {
        const fields = getDiseaseChoiceFields(diseaseOptions, NotificationType.NominalNotification6_1);
        initialNotificationIdField = findNestedFieldById(fields, 'statusNoteGroup', 'initialNotificationId')!;
      });

      it('should return undefined when reference value is NoReference', () => {
        buildMockFieldTree(NotificationIdReferenceEnum.NoReference, '12345678-1234-1234-1234-123456789012');
        const modelExpr = initialNotificationIdField.expressions!['model.initialNotificationId.answer.valueString'] as (
          field: FormlyFieldConfig
        ) => string | undefined;

        expect(modelExpr(initialNotificationIdField)).toBeUndefined();
      });

      it('should return the current model value when reference value is RelatesToOwnFacility', () => {
        const uuid = '12345678-1234-1234-1234-123456789012';
        buildMockFieldTree(NotificationIdReferenceEnum.RelatesToOwnFacility, uuid);
        const modelExpr = initialNotificationIdField.expressions!['model.initialNotificationId.answer.valueString'] as (
          field: FormlyFieldConfig
        ) => string | undefined;

        expect(modelExpr(initialNotificationIdField)).toBe(uuid);
      });

      it('should return the current model value when reference value is RelatesToOtherFacility', () => {
        const uuid = 'abcdefab-abcd-abcd-abcd-abcdefabcdef';
        buildMockFieldTree(NotificationIdReferenceEnum.RelatesToOtherFacility, uuid);
        const modelExpr = initialNotificationIdField.expressions!['model.initialNotificationId.answer.valueString'] as (
          field: FormlyFieldConfig
        ) => string | undefined;

        expect(modelExpr(initialNotificationIdField)).toBe(uuid);
      });

      it('should return the current model value when reference value is null', () => {
        buildMockFieldTree(null, 'some-value');
        const modelExpr = initialNotificationIdField.expressions!['model.initialNotificationId.answer.valueString'] as (
          field: FormlyFieldConfig
        ) => string | undefined;

        expect(modelExpr(initialNotificationIdField)).toBe('some-value');
      });
    });
  });
});
