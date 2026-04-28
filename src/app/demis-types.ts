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
import { environment } from '../environments/environment';

// TOOD: Why is this hardocded hier and not served from  CodeDisplay type
// Answer: This is hardcoded, because we do not communicate with the gateway but with FUTS
export type DemisCoding = {
  code: string;
  display: string;
  system: string;
  systemVersion?: string;
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
  FollowUpNotification6_1,
  FollowUpNotification7_3,
}

interface AllowedRoutes {
  [key: string]: string;
}

export const allowedRoutes: AllowedRoutes = {
  nominal: 'disease-notification/6.1',
  nonNominal: 'disease-notification/7.3/non-nominal',
  followUp: 'disease-notification/6.1/follow-up',
  followUpNonNominal: 'disease-notification/7.3/follow-up',
  main: 'disease-notification',
};

export const getNotificationTypeByRouterUrl = (url: string): NotificationType => {
  if (url.includes(allowedRoutes['nonNominal']) && environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION === true) {
    return NotificationType.NonNominalNotification7_3;
  } else if (url.includes(allowedRoutes['followUp'])) {
    return NotificationType.FollowUpNotification6_1;
  } else if (
    url.includes(allowedRoutes['followUpNonNominal']) &&
    environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION === true &&
    environment.diseaseConfig.featureFlags?.FEATURE_FLAG_FOLLOW_UP_7_3 === true
  ) {
    return NotificationType.FollowUpNotification7_3;
  } else {
    return NotificationType.NominalNotification6_1;
  }
};
