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
import { NotificationType } from '../demis-types';
import { ProcessFormService } from '../disease-form/services/process-form-service';
import { ExtendedSalutationEnum } from '../legacy/common-utils';
import { DiseaseFormModel } from './disease-form.model';
import { toDiseaseNotification } from './disease-notification.mapper';

const coding = (code: string) => ({ code, display: code, system: 'https://example.org', designations: [{ language: 'de', value: code }] });

const QUESTIONNAIRE_FIELDS = {
  common: [{ key: 'isDead.answer', fieldGroup: [{ key: 'valueCoding', type: 'radio-button-coding' }] }] as FormlyFieldConfig[],
  specific: [{ key: 'infectionSource.answer', fieldGroup: [{ key: 'valueString', type: 'input' }] }] as FormlyFieldConfig[],
};

/** A completely filled form model; strings carry whitespace to verify the trimming. */
function completeModel(): DiseaseFormModel {
  return {
    notifier: {
      address: { street: ' Im Himmelreich ', houseNumber: '1', zip: '21481', city: 'Frühling', country: 'DE' },
      contact: { salutation: ExtendedSalutationEnum.Mrs, prefix: 'Dr.', firstname: 'Test', lastname: 'Person' },
      contacts: {
        emailAddresses: [{ contactType: 'email', value: 'test@example.org ' }],
        phoneNumbers: [{ contactType: 'phone', value: '01234567' }],
      },
      facilityInfo: { institutionName: 'Klinik', bsnr: '123456789', existsBsnr: true, organizationType: { answer: { valueCoding: coding('hospital') } } },
      oneTimeCode: '',
    },
    notifiedPerson: {
      info: { firstname: ' Max', lastname: 'Melderson', gender: 'MALE', birthDate: '1970-01-01' },
      residenceAddress: { street: 'Wohnsitzstraße', houseNumber: '1', zip: '10115', city: 'Berlin', country: 'DE' },
      residenceAddressType: 'primary',
      currentAddress: { street: 'Klinikweg', houseNumber: '2', zip: '10117', city: 'Berlin', country: 'DE' },
      currentAddressType: 'otherFacility',
      currentAddressInstitutionName: 'Pflegeheim ',
      contacts: { emailAddresses: [{ contactType: 'email', value: 'max@example.org' }], phoneNumbers: [] },
    },
    notificationCategory: {
      diseaseChoice: { answer: { valueCoding: coding('cvdd') } },
      clinicalStatus: { answer: { valueString: 'final' } },
      statusNoteGroup: {
        statusNote: { answer: { valueString: ' Hinweis ' } },
        notificationIdReference: { answer: { valueString: 'noReference' } },
        initialNotificationId: { answer: { valueString: '' } },
      },
    },
    condition: {
      recordedDate: { answer: { valueDate: '2024-01-13' } },
      onset: { answer: { valueDate: '2023-12-31' } },
      note: { answer: { valueString: 'Verlauf ' } },
      evidence: { answer: { valueCoding: [coding('49727002'), coding('386661006')] } },
    },
    commonQuestionnaire: { isDead: { answer: { valueCoding: coding('no') } } },
    specificQuestionnaire: { infectionSource: { answer: { valueString: ' Kontakt ' } } },
  };
}

const ALL_TYPES = [
  NotificationType.NominalNotification6_1,
  NotificationType.FollowUpNotification6_1,
  NotificationType.NonNominalNotification7_3,
  NotificationType.FollowUpNotification7_3,
];

describe('toDiseaseNotification', () => {
  // RETIRING(FEATURE_FLAG_CORE_SIDENAV): Remove this comparison together with the legacy ProcessFormService.
  describe.each(ALL_TYPES)('equivalence with the legacy ProcessFormService for %s', notificationType => {
    // The legacy model uses the former tab* step keys; its questionnaire items are compared in questionnaire-response.mapper.spec.ts.
    const legacy = (model: DiseaseFormModel) =>
      new ProcessFormService().createNotification(
        {
          tabNotifier: model.notifier,
          tabPatient: model.notifiedPerson,
          tabDiseaseChoice: model.notificationCategory,
          tabDiseaseCondition: model.condition,
        },
        notificationType
      );

    it('builds the same status, notifier, notified person and condition', () => {
      const { common, disease, ...notification } = toDiseaseNotification(completeModel(), notificationType, QUESTIONNAIRE_FIELDS);

      expect(notification).toEqual(legacy(completeModel()));
    });

    it('builds the same request when the current address equals the residence address', () => {
      const model = completeModel();
      model.notifiedPerson.currentAddressType = 'primaryAsCurrent';
      model.notifiedPerson.currentAddressInstitutionName = undefined;
      const { common, disease, ...notification } = toDiseaseNotification(model, notificationType, QUESTIONNAIRE_FIELDS);

      expect(notification).toEqual(legacy(model));
    });

    it('builds the same request when the salutation is "None"', () => {
      const model = completeModel();
      model.notifier.contact.salutation = ExtendedSalutationEnum.None;

      expect(toDiseaseNotification(model, notificationType, QUESTIONNAIRE_FIELDS).notifierFacility).toEqual(legacy(model).notifierFacility);
    });

    it('builds the same condition from evidence entered as a list of single answers', () => {
      const model = completeModel();
      model.condition.evidence = [{ answer: { valueCoding: coding('49727002') } }, { answer: { valueCoding: coding('386661006') } }];

      expect(toDiseaseNotification(model, notificationType, QUESTIONNAIRE_FIELDS).condition).toEqual(legacy(model).condition);
    });
  });

  describe('questionnaires', () => {
    it.each([NotificationType.NominalNotification6_1, NotificationType.FollowUpNotification6_1])('includes the common questionnaire for %s', type => {
      const notification = toDiseaseNotification(completeModel(), type, QUESTIONNAIRE_FIELDS);

      expect(notification.common).toEqual({
        questionnaire: 'common',
        item: [{ linkId: 'isDead', answer: [{ valueCoding: { code: 'no', display: 'no', system: 'https://example.org' } }] }],
      });
    });

    it.each([NotificationType.NonNominalNotification7_3, NotificationType.FollowUpNotification7_3])('omits the common questionnaire for %s', type => {
      expect(toDiseaseNotification(completeModel(), type, QUESTIONNAIRE_FIELDS)).not.toHaveProperty('common');
    });

    it('sends the specific questionnaire of the chosen disease with trimmed answers', () => {
      const notification = toDiseaseNotification(completeModel(), NotificationType.NominalNotification6_1, QUESTIONNAIRE_FIELDS);

      expect(notification.disease).toEqual({ questionnaire: 'cvdd', item: [{ linkId: 'infectionSource', answer: [{ valueString: 'Kontakt' }] }] });
    });
  });

  it('does not modify the model', () => {
    const model = completeModel();

    toDiseaseNotification(model, NotificationType.NominalNotification6_1, QUESTIONNAIRE_FIELDS);

    expect(model).toEqual(completeModel());
  });
});
