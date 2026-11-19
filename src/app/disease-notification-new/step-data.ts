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

import { ProcessStep } from '@gematik/demis-portal-core-library';
import { DiseaseStepKey } from './disease-form.model';
import { DiseaseNotificationService } from './disease-notification.service';

export const DISEASE_STEP_LABELS: Record<DiseaseStepKey, string> = {
  notifier: 'Meldende Person',
  notifiedPerson: 'Betroffene Person',
  notificationCategory: 'Meldetatbestand',
  condition: 'Angaben zu Symptomen',
  commonQuestionnaire: 'Klinische und epidemiologische Angaben',
  specificQuestionnaire: 'Spezifische Angaben',
};

export function getStepKeys(notificationService: DiseaseNotificationService): DiseaseStepKey[] {
  return [
    'notifier',
    'notifiedPerson',
    'notificationCategory',
    'condition',
    ...(notificationService.isFullQuestionnaire() ? (['commonQuestionnaire'] as const) : []),
    'specificQuestionnaire',
  ];
}

export function getStepData(notificationService: DiseaseNotificationService): ProcessStep[] {
  return getStepKeys(notificationService).map(stepKey => ({
    key: stepKey,
    label: DISEASE_STEP_LABELS[stepKey],
    control: notificationService.stepGroup(stepKey),
  }));
}
