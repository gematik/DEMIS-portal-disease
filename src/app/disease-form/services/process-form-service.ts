/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */

import { Injectable } from '@angular/core';
import { AddressType, DiseaseNotification, NotifiedPersonAddressInfo } from '../../../api/notification';
import { formatItems } from '../../format-items';
import { trimStrings } from '@gematik/demis-portal-core-library';
import { dateStringToIso } from '../../shared/utils';
import { ExtendedSalutationEnum } from '../../legacy/common-utils';

@Injectable({
  providedIn: 'root', // Makes it available app-wide
})
export class ProcessFormService {
  createNotification(model: any): DiseaseNotification {
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
      notifiedPerson: {
        info: model.tabPatient.info,
        currentAddress: this.addAddressType(
          model.tabPatient.currentAddressType === 'primaryAsCurrent' ? model.tabPatient.residenceAddress : model.tabPatient.currentAddress,
          model.tabPatient.currentAddressType,
          model.tabPatient.currentAddressInstitutionName
        ),
        residenceAddress: this.addAddressType(model.tabPatient.residenceAddress, model.tabPatient.residenceAddressType),
        contacts: [...model.tabPatient.contacts.emailAddresses, ...model.tabPatient.contacts.phoneNumbers],
      },
      condition: this.makeCondition(model.tabDiseaseCondition),
      common: {
        questionnaire: 'common',
        item: formatItems(model.tabDiseaseCommon),
      },
      disease: {
        questionnaire: model.tabDiseaseChoice.diseaseChoice.answer.valueCoding.code,
        item: formatItems(model.tabQuestionnaire),
      },
    };

    const trimmedMessage: DiseaseNotification = trimStrings(message);
    trimmedMessage.notifiedPerson.info.birthDate = dateStringToIso(trimmedMessage.notifiedPerson.info.birthDate);
    return trimmedMessage;
  }

  private addAddressType(address: NotifiedPersonAddressInfo, type: AddressType, institutionName?: string): NotifiedPersonAddressInfo {
    return { ...address, addressType: type, ...(institutionName ? { additionalInfo: institutionName } : {}) };
  }

  private makeCondition(condition: Record<string, any> | undefined) {
    return {
      recordedDate: dateStringToIso(this.answer(condition, 'recordedDate', 'valueDate')),
      onset: dateStringToIso(this.answer(condition, 'onset', 'valueDate')),
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
