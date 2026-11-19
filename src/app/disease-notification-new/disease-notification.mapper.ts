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

import { trimStrings } from '@gematik/demis-portal-core-library';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  AddressType,
  CodeDisplay,
  Condition,
  ContactPointInfo,
  DiseaseNotification,
  DiseaseStatus,
  NotifiedPerson,
  NotifiedPersonAddressInfo,
  NotifiedPersonAnonymous,
  NotifierFacility,
  PractitionerInfo,
  QuestionnaireResponse,
} from '../../api/notification';
import { NotificationType } from '../demis-types';
import { ExtendedSalutationType } from '../legacy/common-utils';
import {
  ConditionStepModel,
  ContactLists,
  DiseaseFormModel,
  NotificationCategoryStepModel,
  NotifiedPersonStepModel,
  NotifierStepModel,
} from './disease-form.model';
import { toQuestionnaireResponseItems } from './questionnaire-response.mapper';

/** Formly fields of the two questionnaire steps; their order defines the item order. */
export interface QuestionnaireFields {
  /** Fields of the common questionnaire step. */
  common: FormlyFieldConfig[];
  /** Fields of the disease-specific questionnaire step. */
  specific: FormlyFieldConfig[];
}

/**
 * Checks whether a notification type includes the common questionnaire.
 *
 * @param notificationType The notification type.
 * @returns `true` for notifications according to § 6 IfSG (nominal and follow-up).
 */
export function usesCommonQuestionnaire(notificationType: NotificationType): boolean {
  return notificationType === NotificationType.NominalNotification6_1 || notificationType === NotificationType.FollowUpNotification6_1;
}

/**
 * Builds the notification request sent to the notification gateway.
 *
 * The disease-specific questionnaire is identified by the chosen disease code (`status.category`).
 *
 * @param model Form model of all steps after successful validation; it is not modified.
 * @param notificationType Determines how the notified person is sent and whether the common questionnaire is included.
 * @param questionnaireFields Fields of the questionnaire steps.
 * @returns The request with all strings trimmed.
 */
export function toDiseaseNotification(
  model: DiseaseFormModel,
  notificationType: NotificationType,
  questionnaireFields: QuestionnaireFields
): DiseaseNotification {
  const status = toStatus(model.notificationCategory);
  const notification: DiseaseNotification = {
    status,
    notifierFacility: toNotifierFacility(model.notifier),
    ...toNotifiedPerson(model.notifiedPerson, notificationType),
    condition: toCondition(model.condition),
    disease: toQuestionnaireResponse(status.category, model.specificQuestionnaire, questionnaireFields.specific),
  };
  if (usesCommonQuestionnaire(notificationType)) {
    notification.common = toQuestionnaireResponse('common', model.commonQuestionnaire, questionnaireFields.common);
  }
  return trimStrings(notification);
}

/**
 * Builds the answers to one questionnaire.
 *
 * @param questionnaire Identifier of the questionnaire: `common` or the disease code.
 * @param model Model of the questionnaire step.
 * @param fields Formly fields of the questionnaire step.
 * @returns The questionnaire response with its items in questionnaire order.
 */
function toQuestionnaireResponse(questionnaire: string, model: Record<string, unknown>, fields: FormlyFieldConfig[]): QuestionnaireResponse {
  const item = toQuestionnaireResponseItems(model, fields);
  return { questionnaire, item };
}

/**
 * Builds the status from the notification category step.
 *
 * @param step Model of the notification category step.
 * @returns Chosen disease code, clinical status and the optional status notes.
 */
function toStatus({ diseaseChoice, clinicalStatus, statusNoteGroup }: NotificationCategoryStepModel): DiseaseStatus {
  return {
    category: diseaseChoice.answer.valueCoding.code,
    status: clinicalStatus.answer.valueString,
    note: statusNoteGroup.statusNote?.answer?.valueString,
    notificationIdReference: statusNoteGroup.notificationIdReference.answer.valueString,
    initialNotificationId: statusNoteGroup.initialNotificationId?.answer?.valueString,
  };
}

/**
 * Builds the notifier facility from the notifier step.
 *
 * The salutation "None" is a form-only option and is sent as no salutation. The organization type is
 * reduced to its code.
 *
 * @param step Model of the notifier step.
 * @returns The notifier facility, including the honeypot value.
 */
function toNotifierFacility({ address, contact, contacts, facilityInfo, oneTimeCode }: NotifierStepModel): NotifierFacility {
  const salutation = toSalutation(contact.salutation);
  const organizationType = facilityInfo.organizationType.answer.valueCoding.code;
  return {
    address,
    contact: { ...contact, salutation },
    contacts: toContactPoints(contacts),
    facilityInfo: { ...facilityInfo, organizationType },
    oneTimeCode,
  };
}

/**
 * Converts the salutation chosen in the form into the salutation of the request.
 *
 * @param salutation Salutation from the model; "None" is a form-only option.
 * @returns The salutation, or `undefined` for "None" and no selection.
 */
function toSalutation(salutation: ExtendedSalutationType | undefined): PractitionerInfo.SalutationEnum | undefined {
  if (!salutation || salutation === 'None') {
    return undefined;
  }
  return salutation;
}

/**
 * Builds the notified person in the form required by the notification type.
 *
 * @param person Model of the notified person step.
 * @param notificationType The notification type.
 * @returns Either `notifiedPerson` or `notifiedPersonAnonymous`.
 */
function toNotifiedPerson(
  person: NotifiedPersonStepModel,
  notificationType: NotificationType
): Pick<DiseaseNotification, 'notifiedPerson' | 'notifiedPersonAnonymous'> {
  switch (notificationType) {
    case NotificationType.FollowUpNotification6_1:
    case NotificationType.FollowUpNotification7_3:
      return { notifiedPersonAnonymous: toAnonymousPerson(person) };
    case NotificationType.NonNominalNotification7_3:
      return { notifiedPerson: toNonNominalPerson(person) };
    default:
      return { notifiedPerson: toNominalPerson(person) };
  }
}

/**
 * Builds the anonymous person of follow-up notifications (§ 6.1 and § 7.3).
 *
 * @param person Model of the notified person step.
 * @returns Gender, birth date, country and zip code; empty values are omitted.
 */
function toAnonymousPerson({ info, residenceAddress }: NotifiedPersonStepModel): NotifiedPersonAnonymous {
  return {
    gender: info?.gender || undefined,
    birthDate: info?.birthDate || undefined,
    residenceAddress: {
      country: residenceAddress.country,
      zip: residenceAddress.zip || undefined,
      addressType: AddressType.Primary,
    },
  };
}

/**
 * Builds the notified person of non-nominal notifications (§ 7.3).
 *
 * @param person Model of the notified person step.
 * @returns Person info and residence address.
 */
function toNonNominalPerson({ info, residenceAddress, residenceAddressType }: NotifiedPersonStepModel): NotifiedPerson {
  return {
    info,
    residenceAddress: withAddressType(residenceAddress, residenceAddressType),
  };
}

/**
 * Builds the notified person of nominal notifications (§ 6.1).
 *
 * @param person Model of the notified person step.
 * @returns Person info, current and residence address and contacts. For `primaryAsCurrent` the
 *   residence address is sent as current address.
 */
function toNominalPerson(person: NotifiedPersonStepModel): NotifiedPerson {
  const { info, residenceAddress, residenceAddressType, currentAddressType, currentAddressInstitutionName } = person;
  const currentAddress = currentAddressType === AddressType.PrimaryAsCurrent ? residenceAddress : person.currentAddress;
  return {
    info,
    currentAddress: withAddressType(currentAddress, currentAddressType, currentAddressInstitutionName),
    residenceAddress: withAddressType(residenceAddress, residenceAddressType),
    contacts: toContactPoints(person.contacts),
  };
}

/**
 * Copies an address and sets its address type and, if given, the institution name.
 *
 * @param address The address from the model.
 * @param addressType Type chosen in the form.
 * @param institutionName Name of the institution; sent as `additionalInfo`.
 * @returns The address for the request.
 */
function withAddressType(address: NotifiedPersonAddressInfo | undefined, addressType?: AddressType, institutionName?: string): NotifiedPersonAddressInfo {
  const result: NotifiedPersonAddressInfo = { ...address, addressType };
  if (institutionName) {
    result.additionalInfo = institutionName;
  }
  return result;
}

/**
 * Merges the separately entered contact lists.
 *
 * @param contacts Email addresses and phone numbers from the model.
 * @returns All contact points, email addresses first.
 */
function toContactPoints({ emailAddresses, phoneNumbers }: ContactLists): ContactPointInfo[] {
  return [...emailAddresses, ...phoneNumbers];
}

/**
 * Builds the condition from the condition step.
 *
 * @param step Model of the condition step.
 * @returns Dates, note and evidence codings; missing answers stay `undefined`.
 */
function toCondition({ recordedDate, onset, note, evidence }: ConditionStepModel): Condition {
  return {
    recordedDate: recordedDate?.answer?.valueDate,
    onset: onset?.answer?.valueDate,
    note: note?.answer?.valueString,
    evidence: toEvidence(evidence),
  };
}

/**
 * Collects the evidence codings of the condition step.
 *
 * @param evidence A multi-select answer or, in older models, a list of single answers.
 * @returns The selected codings, or `undefined` if nothing was entered.
 */
function toEvidence(evidence: ConditionStepModel['evidence']): CodeDisplay[] | undefined {
  if (Array.isArray(evidence)) {
    return evidence.filter(Boolean).map(entry => entry.answer.valueCoding);
  }
  return evidence?.answer?.valueCoding;
}
