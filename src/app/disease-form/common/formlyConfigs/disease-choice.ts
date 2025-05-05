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
import { infoOutline } from './formly-base';
import { DemisCoding } from '../../../demis-types';
import { DiseaseStatus } from '../../../../api/notification';
import StatusEnum = DiseaseStatus.StatusEnum;

export function getDiseaseChoiceFields(diseaseOptions: DemisCoding[]): FormlyFieldConfig[] {
  return [
    infoOutline,
    {
      template:
        '<div class="info-link" id="knowledge-db-info-link">Weiterführende Informationen zur Meldung gemäß § 6 IfSG finden Sie in der <a href="https://go.gematik.de/demis-info-disease" target="_blank">DEMIS-Wissensdatenbank</a></div>',
    },
    {
      template: '<div class="question-title">Erkrankung *</div>',
      className: 'question-title',
    },
    {
      id: 'disease-choice',
      className: 'LinkId_diseaseChoice',
      key: 'diseaseChoice.answer.valueCoding',
      type: 'autocomplete-coding',
      props: {
        options: diseaseOptions,
        required: true,
        clearable: true,
        importSpec: {
          importKey: 'D.code',
        },
      },
      validators: {
        validation: ['isCodeChoosen'],
      },
    },
    {
      template: '<div class="question-title">Status</div>',
      className: 'diseaseStatus',
    },
    {
      id: 'clinical-status',
      className: 'clinical-status',
      type: 'radio',
      key: 'clinicalStatus.answer.valueString',
      props: {
        options: [
          { value: StatusEnum.Final, label: 'Endgültig' },
          { value: StatusEnum.Preliminary, label: 'Vorläufig/Verdacht' },
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
            importSpec: {
              importKey: 'D.notificationId',
              multi: false,
            },
          },
          expressions: {
            'props.required': field => {
              const statusField = field.parent?.parent?.fieldGroup?.find(field => field.id === 'clinical-status');
              return statusField && statusField.model && [StatusEnum.Amended, StatusEnum.Refuted, StatusEnum.Error].includes(statusField.model.clinicalStatus);
            },
          },
        },
      ],
      key: 'statusNoteGroup',
      fieldGroupClassName: 'row',
    },
  ];
}
