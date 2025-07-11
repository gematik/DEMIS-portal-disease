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

// TOOD: Why is this hardocded hier and not served from  CodeDisplay type
export type DemisCoding = {
  code: string;
  display: string;
  system: string;
  designations?: { language: string; value: string }[];
  breadcrumb?: string;
  selected?: boolean;
};

export type EnableWhen = {
  path: string;
  op: '=' | '!=';
  value: string;
}[];

export type QuestionnaireDescriptor = {
  questionnaireConfigs: FormlyFieldConfig[];
  conditionConfigs: FormlyFieldConfig[];
  commonConfig: FormlyFieldConfig[];
};

export enum NotificationType {
  NominalNotification6_1,
  NonNominalNotification7_3,
  AnonymousNotification7_3,
}

interface AllowedRoutes {
  [key: string]: string;
}

export const allowedRoutes: AllowedRoutes = {
  nominal: 'disease-notification/6.1',
  nonNominal: 'disease-notification/7.3/non-nominal',
  anonymous: 'disease-notification/7.3/anonymous',
  main: 'disease-notification',
};

export const getNotificationTypeByRouterUrl = (url: string): NotificationType => {
  if (url.includes(allowedRoutes['nonNominal'])) {
    return NotificationType.NonNominalNotification7_3;
  } else {
    return NotificationType.NominalNotification6_1;
  }
};
