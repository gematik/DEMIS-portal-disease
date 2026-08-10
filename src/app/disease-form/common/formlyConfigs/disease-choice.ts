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
import { infoOutline } from './formly-base';
import { NotificationType } from '../../../demis-types';
import { CodeDisplay, DiseaseStatus, NotificationLaboratoryCategory } from '../../../../api/notification';
import { environment } from '../../../../environments/environment';
import StatusEnum = DiseaseStatus.StatusEnum;
import { NOTIFICATION_ID_REFERENCE_LIST } from 'src/app/legacy/formly-options-lists';
import NotificationIdReferenceEnum = NotificationLaboratoryCategory.NotificationIdReferenceEnum;

const statusField = (field: FormlyFieldConfig) => field.parent?.parent?.fieldGroup?.find(field => field.id === 'clinical-status');
const referenceField = (field: FormlyFieldConfig) =>
  field.parent?.parent?.fieldGroup?.find(f => f.key === 'statusNoteGroup')!.fieldGroup?.find(f => f.id === 'notificationIdReference')!;

const referenceFieldValue = (field: FormlyFieldConfig): string | null | undefined => referenceField(field)?.model?.notificationIdReference?.answer?.valueString;

const INITIAL_NOTIFICATION_ID_TEXT_NO_REREFERENCE =
  '<span>Für diese Meldung wird eine neue Meldungs-ID erzeugt, die Sie für einen zukünftigen Meldungsverweis nutzen können. Sie finden diese auf der PDF-Meldungsquittung in der Zeile “Meldungs-ID” oder auf der letzten Seite beim QR-Code.</span><br><br>';

const INITIAL_NOTIFICATION_ID_TEXT_OWN_FACILITY_REFERENCE =
  '<span>Bitte geben Sie die Meldungs-ID der Initialmeldung an, um sie für diese Meldung als Meldungs-ID nachzunutzen. Sie finden diese auf der PDF-Meldungsquittung der vorherigen Meldung in der Zeile “Meldungs-ID” oder auf der letzten Seite beim QR-Code.</span><br><br>';

const INITIAL_NOTIFICATION_ID_TEXT_OTHER_FACILITY_REFERENCE =
  '<span>Bitte geben Sie die Meldungs-ID der Initialmeldung an, um den Meldungsverweis zu setzen. Sie finden diese auf der PDF-Meldungsquittung der vorherigen Meldung in der Zeile “Meldungs-ID” oder auf der letzten Seite beim QR-Code.</span><br><br>';

export function getDiseaseChoiceFields(diseaseOptions: CodeDisplay[], notificationType: NotificationType): FormlyFieldConfig[] {
  const isNonNominal = notificationType === NotificationType.NonNominalNotification7_3 || notificationType === NotificationType.FollowUpNotification7_3;
  const isFollowUp = notificationType === NotificationType.FollowUpNotification6_1 || notificationType === NotificationType.FollowUpNotification7_3;

  return [
    infoOutline,
    {
      template:
        '<div class="info-link" id="knowledge-db-info-link">Weiterführende Informationen zur Meldung gemäß § 6 IfSG finden Sie in der <a href="https://go.gematik.de/demis-info-disease" target="_blank">DEMIS-Wissensdatenbank</a></div>',
      props: { safeHtml: true },
      expressions: {
        hide: () => isNonNominal,
      },
    },
    {
      id: 'disease-choice-input',
      className: 'LinkId_diseaseChoice',
      key: 'diseaseChoice.answer.valueCoding',
      type: 'filterable-select',
      props: {
        label: 'Erkrankung',
        placeholder: 'Bitte auswählen',
        optionValueKey: 'code',
        optionLabelKey: 'display',
        optionDescriptionKey: 'breadcrumb',
        options: diseaseOptions,
        required: true,
        clearable: !isFollowUp,
        disabled: isFollowUp,
        importSpec: {
          importKey: 'D.code',
        },
      },
      validators: {
        validation: ['isCodeChoosen'],
      },
    },
    {
      id: 'clinical-status',
      className: 'clinical-status',
      type: 'radio',
      key: 'clinicalStatus.answer.valueString',
      props: {
        label: 'Status',
        ...(environment.featureFlags?.FEATURE_FLAG_DISEASE_STATUS_ORDER_NODEFAULT ? { required: true } : {}),
        options: [
          ...(environment.featureFlags?.FEATURE_FLAG_DISEASE_STATUS_ORDER_NODEFAULT
            ? [
                { value: StatusEnum.Preliminary, label: 'Vorläufig/Verdacht', disabled: isFollowUp },
                { value: StatusEnum.Final, label: 'Endgültig' },
              ]
            : [
                { value: StatusEnum.Final, label: 'Endgültig' },
                { value: StatusEnum.Preliminary, label: 'Vorläufig/Verdacht', disabled: isFollowUp },
              ]),
          { value: StatusEnum.Amended, label: 'Ergänzung oder Korrektur' },
          { value: StatusEnum.Refuted, label: 'Verdacht nicht bestätigt' },
          { value: StatusEnum.Error, label: 'Irrtümliche Meldung revidieren' },
        ],
        importSpec: {
          importKey: 'D.status',
          multi: false,
        },
      },
    },
    ...(environment.featureFlags?.FEATURE_FLAG_REFERENCE_FIELD
      ? [
          {
            fieldGroup: [
              {
                type: 'input',
                key: 'statusNote.answer.valueString',
                className: 'col-md-12 LinkId_statusNote',
                props: {
                  label: 'Hinweise',
                  importSpec: {
                    importKey: 'D.note.status',
                    multi: false,
                  },
                },
              },
              {
                type: 'radio',
                id: 'notificationIdReference',
                key: 'notificationIdReference.answer.valueString',
                className: 'col-md-12 LinkId_notificationIdReference',
                ...(isFollowUp ? { defaultValue: NotificationIdReferenceEnum.RelatesToOtherFacility } : {}),
                props: {
                  label: 'Verweis auf vorherige Meldung (Initiale Meldungs-ID)',
                  disabled: isFollowUp,
                  required: true,
                  importSpec: {
                    importKey: 'D.reference',
                    multi: false,
                    valueMap: {
                      NONE: NotificationIdReferenceEnum.NoReference,
                      OWN: NotificationIdReferenceEnum.RelatesToOwnFacility,
                      OTHER: NotificationIdReferenceEnum.RelatesToOtherFacility,
                    },
                  },
                },
                expressions: {
                  'props.options': (field: FormlyFieldConfig) => {
                    const statusFieldValue = statusField(field)?.model?.clinicalStatus?.answer?.valueString;
                    const requiresReference = !!statusFieldValue && [StatusEnum.Amended, StatusEnum.Refuted, StatusEnum.Error].includes(statusFieldValue);
                    return NOTIFICATION_ID_REFERENCE_LIST.map(option => ({
                      ...option,
                      disabled: option.value === NotificationIdReferenceEnum.NoReference && requiresReference,
                    }));
                  },
                  'model.notificationIdReference.answer.valueString': (field: FormlyFieldConfig) => {
                    // If the status requires a reference and the current value is "NoReference", the reference field should be undefined to force the user to select a valid reference option.
                    const statusFieldValue = statusField(field)?.model?.clinicalStatus?.answer?.valueString;
                    const requiresReference = !!statusFieldValue && [StatusEnum.Amended, StatusEnum.Refuted, StatusEnum.Error].includes(statusFieldValue);
                    const currentValue = field.model?.notificationIdReference?.answer?.valueString;
                    if (requiresReference && currentValue === NotificationIdReferenceEnum.NoReference) {
                      return undefined;
                    }
                    return currentValue;
                  },
                },
              },
              {
                className: 'col-md-1=',
                template: '',
                expressions: {
                  template: (field: FormlyFieldConfig) => {
                    const referenceValue = referenceFieldValue(field);
                    switch (referenceValue) {
                      case NotificationIdReferenceEnum.RelatesToOwnFacility:
                        return INITIAL_NOTIFICATION_ID_TEXT_OWN_FACILITY_REFERENCE;
                      case NotificationIdReferenceEnum.RelatesToOtherFacility:
                        return INITIAL_NOTIFICATION_ID_TEXT_OTHER_FACILITY_REFERENCE;
                      default:
                        return INITIAL_NOTIFICATION_ID_TEXT_NO_REREFERENCE;
                    }
                  },
                },
              },
              {
                type: 'input',
                id: 'initialNotificationId',
                key: 'initialNotificationId.answer.valueString',
                className: 'col-md-12 LinkId_initialNotificationId',
                props: {
                  label: 'Initiale Meldungs-ID',
                  disabled: isFollowUp,
                  importSpec: {
                    importKey: 'D.notificationId',
                    multi: false,
                  },
                },
                validators: {
                  validation: ['uuidValidator'],
                },
                expressions: {
                  'props.required': (field: FormlyFieldConfig) => {
                    return !!referenceFieldValue(field) && referenceFieldValue(field) !== NotificationIdReferenceEnum.NoReference;
                  },
                  'props.disabled': (field: FormlyFieldConfig) => {
                    return isFollowUp || !referenceFieldValue(field) || referenceFieldValue(field) === NotificationIdReferenceEnum.NoReference;
                  },
                  'model.initialNotificationId.answer.valueString': (field: FormlyFieldConfig) => {
                    if (referenceFieldValue(field) === NotificationIdReferenceEnum.NoReference) {
                      return undefined;
                    }
                    return field.model?.initialNotificationId?.answer?.valueString;
                  },
                },
              },
            ],
            key: 'statusNoteGroup',
            fieldGroupClassName: 'row',
          },
        ]
      : [
          {
            fieldGroup: [
              {
                type: 'input',
                key: 'statusNote.answer.valueString',
                className: 'col-md-6 LinkId_statusNote',
                props: {
                  label: 'Hinweise',
                  importSpec: {
                    importKey: 'D.note.status',
                    multi: false,
                  },
                },
              },
              {
                type: 'input',
                key: 'initialNotificationId.answer.valueString',
                className: 'col-md-6 LinkId_initialNotificationId',
                props: {
                  label: 'Initiale Meldungs-ID bei Folgemeldungen',
                  disabled: isFollowUp,
                  importSpec: {
                    importKey: 'D.notificationId',
                    multi: false,
                  },
                },
                expressions: {
                  'props.required': (field: FormlyFieldConfig) => {
                    const statusField = field.parent?.parent?.fieldGroup?.find((f: FormlyFieldConfig) => f.id === 'clinical-status');
                    return statusField?.model && [StatusEnum.Amended, StatusEnum.Refuted, StatusEnum.Error].includes(statusField.model.clinicalStatus);
                  },
                },
              },
            ],
            key: 'statusNoteGroup',
            fieldGroupClassName: 'row',
          },
        ]),
  ];
}
