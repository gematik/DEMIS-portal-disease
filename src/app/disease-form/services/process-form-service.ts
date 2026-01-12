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

import { Injectable } from '@angular/core';
import { AddressType, DiseaseNotification, NotifiedPersonAddressInfo, Quantity } from '../../../api/notification';
import { formatItems } from '../../format-items';
import { trimStrings } from '@gematik/demis-portal-core-library';
import { ExtendedSalutationEnum } from '../../legacy/common-utils';
import { NotificationType } from '../../demis-types';

@Injectable({
  providedIn: 'root', // Makes it available app-wide
})
export class ProcessFormService {
  createNotification(model: any, notificationType: NotificationType, quantityFields?: Map<string, Quantity>): DiseaseNotification {
    const message: DiseaseNotification = {
      status: {
        category: model.tabDiseaseChoice.diseaseChoice.answer.valueCoding.code,
        status: model.tabDiseaseChoice.clinicalStatus.answer.valueString,
        note: model.tabDiseaseChoice.statusNoteGroup.statusNote.answer?.valueString,
        initialNotificationId: model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer?.valueString,
      },
      notifierFacility: {
        address: model.tabNotifier.address,
        contact: {
          ...model.tabNotifier.contact,
          salutation:
            !!model.tabNotifier.contact?.salutation && model.tabNotifier.contact.salutation !== ExtendedSalutationEnum.None
              ? model.tabNotifier.contact.salutation
              : undefined,
        },
        contacts: [...model.tabNotifier.contacts.emailAddresses, ...model.tabNotifier.contacts.phoneNumbers],
        facilityInfo: {
          ...model.tabNotifier.facilityInfo,
          organizationType: model.tabNotifier.facilityInfo.organizationType.answer.valueCoding.code,
        },
        oneTimeCode: model.tabNotifier.oneTimeCode,
      },
      ...this.transformNotifiedPerson(model, notificationType),
      condition: this.makeCondition(model.tabDiseaseCondition),
      ...(model.tabDiseaseCommon
        ? {
            common: {
              questionnaire: 'common',
              item: formatItems(model.tabDiseaseCommon),
            },
          }
        : {}),
      ...(model.tabQuestionnaire
        ? {
            disease: {
              questionnaire: model.tabDiseaseChoice.diseaseChoice.answer.valueCoding.code,
              item: formatItems(model.tabQuestionnaire, quantityFields),
            },
          }
        : {}),
    };

    return trimStrings(message);
  }

  private transformNotifiedPerson(model: any, notificationType: NotificationType): Partial<DiseaseNotification> {
    switch (notificationType) {
      case NotificationType.FollowUpNotification6_1:
        return this.transformAnonymousPerson(model);
      case NotificationType.NonNominalNotification7_3:
        return this.transformNotifiedPersonNotByName(model);
      default:
        return this.transformNominalPerson(model);
    }
  }

  private transformNotifiedPersonNotByName(model: any) {
    return {
      notifiedPerson: {
        info: model.tabPatient.info,
        residenceAddress: this.addAddressType(model.tabPatient.residenceAddress, model.tabPatient.residenceAddressType),
      },
    };
  }

  private transformNominalPerson(model: any): Partial<DiseaseNotification> {
    const currentAddress = this.addAddressType(
      model.tabPatient.currentAddressType === 'primaryAsCurrent' ? model.tabPatient.residenceAddress : model.tabPatient.currentAddress,
      model.tabPatient.currentAddressType,
      model.tabPatient.currentAddressInstitutionName
    );

    return {
      notifiedPerson: {
        info: model.tabPatient.info,
        currentAddress,
        residenceAddress: this.addAddressType(model.tabPatient.residenceAddress, model.tabPatient.residenceAddressType),
        contacts: [...model.tabPatient.contacts.emailAddresses, ...model.tabPatient.contacts.phoneNumbers],
      },
    };
  }

  private transformAnonymousPerson(model: any): Partial<DiseaseNotification> {
    return {
      notifiedPersonAnonymous: {
        gender: model.tabPatient.info?.gender || undefined,
        birthDate: model.tabPatient.info?.birthDate || undefined,
        residenceAddress: {
          country: model.tabPatient.residenceAddress.country,
          zip: model.tabPatient.residenceAddress.zip || undefined,
          addressType: AddressType.Primary,
        },
      },
    };
  }

  private addAddressType(address: NotifiedPersonAddressInfo, type: AddressType, institutionName?: string): NotifiedPersonAddressInfo {
    return { ...address, addressType: type, ...(institutionName ? { additionalInfo: institutionName } : {}) };
  }

  private makeCondition(condition: Record<string, any> | undefined) {
    return {
      recordedDate: this.answer(condition, 'recordedDate', 'valueDate'),
      onset: this.answer(condition, 'onset', 'valueDate'),
      note: this.answer(condition, 'note', 'valueString'),
      evidence: this.answer(condition, 'evidence', 'valueCoding'),
      verificationStatus: this.answer(condition, 'verificationStatus', 'valueCoding')?.code,
    };
  }

  private answer(condition: Record<string, any | undefined> | undefined, key: string, typeTag: string): any {
    if (!condition) return undefined;
    const prop = condition[key];
    if (!prop) return undefined;
    if (Array.isArray(prop)) {
      return prop.filter(item => item).map(item => item.answer[typeTag]);
    } else {
      return prop?.answer[typeTag];
    }
  }
}
