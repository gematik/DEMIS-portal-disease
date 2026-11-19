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

import { createEnvironmentInjector, EnvironmentInjector, importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FollowUpMixedCodesService, FollowUpNotificationIdService, MessageDialogService, withDemisFormlyCore } from '@gematik/demis-portal-core-library';
import { FORMLY_CONFIG, FormlyFieldConfig, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { environment } from '../../environments/environment';
import { NotificationType, QuestionnaireDescriptor } from '../demis-types';
import { oneTimeCodeConfigField } from '../disease-form/common/formlyConfigs/formly-base';
import { Ifsg61Service } from '../ifsg61.service';
import { NotificationFormValidationModule } from '../legacy/notification-form-validation-module';
import { registerValueSetExtension } from '../legacy/value-set.extension';
import { ValueSetService } from '../legacy/value-set.service';
import { APP_FORMLY_CONFIG } from '../shared/formly/formly-app-config';
import { mainConfig } from '../../test/integration/disease-form/base';
import { EXAMPLE_DISEASE_OPTIONS, EXAMPLE_VALUE_SET } from '../../test/shared/data/test-values';
import { DiseaseQuestionnaireService } from './disease-questionnaire.service';
import { FieldMirroringService } from './field-mirroring.service';
import { DiseaseNotificationService, IFSG61_NOTIFIER } from './disease-notification.service';

const COUNTRIES = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'DK', label: 'Dänemark' },
];

function questionnaire(marker: string, specificFields = true): QuestionnaireDescriptor {
  const field = (key: string): FormlyFieldConfig => ({ key, type: 'input', props: { label: `${marker}-${key}`, required: true } });
  return {
    conditionConfigs: [field('condition')],
    commonConfig: [field('common')],
    questionnaireConfigs: specificFields ? [{ template: 'info' }, field('specific')] : [{ template: 'info' }],
  };
}

const allLabels = (fields: FormlyFieldConfig[]) => fields.map(f => f.props?.label).filter(Boolean);

describe('DiseaseNotificationService', () => {
  let injector: ReturnType<typeof createEnvironmentInjector>;
  let service: DiseaseNotificationService;
  let ifsg61Service: Record<string, Mock>;
  let messageDialogService: Record<string, Mock>;
  let followUpNotificationIdService: any;
  let followUpMixedCodesService: Record<string, Mock>;

  beforeEach(() => {
    environment.diseaseConfig = { ...mainConfig, featureFlags: { ...mainConfig.featureFlags, FEATURE_FLAG_CORE_SIDENAV: true } };
    localStorage.removeItem(IFSG61_NOTIFIER);
    ifsg61Service = {
      getDiseaseOptions: vi.fn().mockReturnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getCodeValueSet: vi.fn().mockReturnValue(of(EXAMPLE_VALUE_SET)),
      getQuestionnaire: vi.fn().mockImplementation((code: string) => of(questionnaire(code))),
      fetchFollowUpCode: vi.fn().mockReturnValue(of([])),
      submitNotification: vi.fn(),
    };
    messageDialogService = { showErrorDialog: vi.fn() };
    followUpNotificationIdService = {
      hasValidNotificationId$: new BehaviorSubject(false),
      openDialog: vi.fn(),
      closeDialog: vi.fn(),
      resetState: vi.fn(),
      followUpNotificationCategory: vi.fn().mockReturnValue('cvdd'),
      validatedNotificationId: vi.fn().mockReturnValue('a5e2a5a4-30b4-4d13-b3e1-11e1d5c1a7b2'),
    };
    followUpMixedCodesService = { openDialog: vi.fn() };
    const valueSetService = { get: vi.fn().mockReturnValue(of(COUNTRIES)) };

    TestBed.configureTestingModule({
      providers: [
        importProvidersFrom(NotificationFormValidationModule, FormlyMatDatepickerModule),
        provideFormlyCore([APP_FORMLY_CONFIG, ...withFormlyMaterial(), ...withDemisFormlyCore()]),
        { provide: FORMLY_CONFIG, multi: true, useFactory: registerValueSetExtension, deps: [ValueSetService] },
        { provide: ValueSetService, useValue: valueSetService },
        { provide: Ifsg61Service, useValue: ifsg61Service },
        { provide: MessageDialogService, useValue: messageDialogService },
        { provide: FollowUpNotificationIdService, useValue: followUpNotificationIdService },
        { provide: FollowUpMixedCodesService, useValue: followUpMixedCodesService },
        { provide: NGXLogger, useValue: { error: vi.fn(), warn: vi.fn() } },
      ],
    });
    injector = createEnvironmentInjector([DiseaseNotificationService, DiseaseQuestionnaireService, FieldMirroringService], TestBed.inject(EnvironmentInjector));
    service = injector.get(DiseaseNotificationService);
  });

  afterEach(() => {
    if (!injector.destroyed) {
      injector.destroy();
    }
  });

  const diseaseControl = () => service.stepGroup('notificationCategory').get('diseaseChoice.answer.valueCoding')!;
  const selectDisease = (code: string | null) => diseaseControl().setValue(code ? EXAMPLE_DISEASE_OPTIONS.find(o => o.code === code)! : null);
  // Simulates a user entry in a rendered field, where Formly writes the control value into the model
  const enter = (key: 'notifier' | 'condition', path: string, value: string) => {
    const segments = path.split('.');
    const parent = segments.slice(0, -1).reduce((node: any, segment) => (node[segment] ??= {}), service.model[key]);
    parent[segments.at(-1)!] = value;
    service.stepGroup(key).get(path)!.setValue(value);
  };

  describe('initialization', () => {
    it('builds the controls of the first three steps before any step is rendered', () => {
      service.initialize(NotificationType.NominalNotification6_1, false);

      expect(service.isReady()).toBe(true);
      expect(Object.keys(service.stepGroup('notifier').controls).length).toBeGreaterThan(0);
      expect(Object.keys(service.stepGroup('notifiedPerson').controls).length).toBeGreaterThan(0);
      expect(diseaseControl()).toBeTruthy();
      expect(service.stepGroup('notificationCategory').invalid).toBe(true);
    });

    it('keeps the questionnaire steps disabled until a disease has been chosen', () => {
      service.initialize(NotificationType.NominalNotification6_1, false);

      expect(service.stepGroup('condition').disabled).toBe(true);
      expect(service.stepGroup('commonQuestionnaire').disabled).toBe(true);
      expect(service.stepGroup('specificQuestionnaire').disabled).toBe(true);
      expect(service.isFormValid()).toBe(false);
    });

    it('builds the anonymous person fields with the loaded country list', () => {
      service.initialize(NotificationType.FollowUpNotification6_1, true);

      const countryOptions: FormlyFieldConfig[] = [];
      const collect = (fields: FormlyFieldConfig[]) =>
        fields.forEach(f => {
          if (f.key === 'country' || (typeof f.key === 'string' && f.key.endsWith('country'))) countryOptions.push(f);
          collect(f.fieldGroup ?? []);
        });
      collect(service.fields.notifiedPerson());
      expect(countryOptions.length).toBeGreaterThan(0);
      expect(countryOptions.every(f => f.props?.options === COUNTRIES)).toBe(true);
    });

    it('shows a redirecting error dialog when mandatory options cannot be loaded', () => {
      ifsg61Service['getDiseaseOptions'].mockReturnValue(throwError(() => new Error('down')));

      service.initialize(NotificationType.NominalNotification6_1, false);

      expect(service.isReady()).toBe(false);
      expect(messageDialogService['showErrorDialog']).toHaveBeenCalledWith(
        expect.objectContaining({ redirectToHome: true, errors: [{ text: 'Meldetatbestände nicht verfügbar' }] })
      );
    });

    it.each([
      [NotificationType.NominalNotification6_1, 'Krankheitsmeldung (§ 6.1)', true],
      [NotificationType.NonNominalNotification7_3, 'Krankheit', false],
      [NotificationType.FollowUpNotification6_1, 'Folgemeldung', true],
      [NotificationType.FollowUpNotification7_3, 'Folgemeldung', false],
    ])('derives title and questionnaire scope for notification type %s', (type, title, fullQuestionnaire) => {
      service.initialize(type, true);

      expect(service.sideNavTitle()).toBe(title);
      expect(service.isFullQuestionnaire()).toBe(fullQuestionnaire);
    });
  });

  describe('notifier storage and honeypot', () => {
    it('restores the stored notifier without a persisted honeypot value', () => {
      localStorage.setItem(IFSG61_NOTIFIER, JSON.stringify({ oneTimeCode: 'bot', facilityInfo: { institutionName: 'Klinik' } }));

      service.initialize(NotificationType.NominalNotification6_1, false);

      expect(service.model.notifier.oneTimeCode).toBeFalsy();
      expect(service.model.notifier.facilityInfo.institutionName).toBe('Klinik');
      expect(service.model.notifier.address.country).toBe('DE');
    });

    it('ignores unreadable notifier data in the local storage', () => {
      localStorage.setItem(IFSG61_NOTIFIER, '{broken');

      service.initialize(NotificationType.NominalNotification6_1, false);

      expect(service.isReady()).toBe(true);
    });

    it('stores notifier changes without the honeypot value', () => {
      service.initialize(NotificationType.NominalNotification6_1, false);

      enter('notifier', 'oneTimeCode', 'bot');
      enter('notifier', 'facilityInfo.institutionName', 'Klinik');

      const stored = JSON.parse(localStorage.getItem(IFSG61_NOTIFIER)!);
      expect(stored.facilityInfo.institutionName).toBe('Klinik');
      expect(stored).not.toHaveProperty('oneTimeCode');
    });

    it('removes the honeypot from keyboard and assistive technology without changing the shared legacy config', () => {
      service.initialize(NotificationType.NominalNotification6_1, false);

      const honeypot = service.fields
        .notifier()
        .flatMap(row => row.fieldGroup ?? [])
        .find(field => field.key === 'oneTimeCode');
      expect(honeypot?.props?.attributes).toEqual(expect.objectContaining({ tabindex: -1, 'aria-hidden': 'true' }));
      expect(oneTimeCodeConfigField.fieldGroup![0].props!.attributes!['tabindex']).toBe(500);
    });
  });

  describe('disease selection', () => {
    beforeEach(() => service.initialize(NotificationType.NominalNotification6_1, false));

    it('builds and enables the questionnaire steps of the chosen disease', () => {
      selectDisease('cvdd');

      expect(ifsg61Service['getQuestionnaire']).toHaveBeenCalledWith('cvdd', NotificationType.NominalNotification6_1);
      expect(service.loadedDiseaseCode()).toBe('cvdd');
      expect(service.stepGroup('condition').enabled).toBe(true);
      expect(service.stepGroup('condition').get('condition')).toBeTruthy();
      expect(service.stepGroup('specificQuestionnaire').get('specific')).toBeTruthy();
    });

    it('applies only the questionnaire of the latest selection when responses arrive out of order', () => {
      const first = new Subject<QuestionnaireDescriptor>();
      const second = new Subject<QuestionnaireDescriptor>();
      ifsg61Service['getQuestionnaire'].mockReturnValueOnce(first).mockReturnValueOnce(second);

      selectDisease('clod');
      selectDisease('vchd');
      second.next(questionnaire('vchd'));
      first.next(questionnaire('clod'));

      expect(service.loadedDiseaseCode()).toBe('vchd');
      expect(allLabels(service.fields.condition())).toEqual(['vchd-condition']);
    });

    it('disables the dependent steps while the questionnaire of a newly chosen disease is loading', () => {
      selectDisease('cvdd');
      ifsg61Service['getQuestionnaire'].mockReturnValueOnce(new Subject());

      selectDisease('clod');

      expect(service.stepGroup('condition').disabled).toBe(true);
      expect(service.isFormValid()).toBe(false);
    });

    it('clears the dependent steps and informs the user when the questionnaire cannot be loaded', () => {
      selectDisease('cvdd');
      ifsg61Service['getQuestionnaire'].mockReturnValueOnce(throwError(() => new Error('down')));

      selectDisease('clod');

      expect(service.loadedDiseaseCode()).toBeUndefined();
      expect(service.fields.condition()).toEqual([]);
      expect(service.stepGroup('condition').disabled).toBe(true);
      expect(messageDialogService['showErrorDialog']).toHaveBeenCalledWith(expect.objectContaining({ errorTitle: 'Systemfehler' }));
    });

    it('keeps already entered questionnaire data when the same disease is chosen again after clearing it', () => {
      selectDisease('cvdd');
      enter('condition', 'condition', 'entered');

      selectDisease(null);
      expect(service.stepGroup('condition').disabled).toBe(true);
      selectDisease('cvdd');

      expect(ifsg61Service['getQuestionnaire']).toHaveBeenCalledOnce();
      expect(service.stepGroup('condition').enabled).toBe(true);
      expect(service.model.condition.condition).toBe('entered');
    });

    it('resets the dependent data when another disease is chosen', () => {
      selectDisease('cvdd');
      enter('condition', 'condition', 'entered');

      selectDisease('clod');

      expect(service.model.condition.condition).toBeUndefined();
    });

    it('shows a hint instead of an empty step when the disease has no specific questions', () => {
      ifsg61Service['getQuestionnaire'].mockReturnValueOnce(of(questionnaire('cvdd', false)));

      selectDisease('cvdd');

      expect(service.fields.specificQuestionnaire()[0].template).toContain('keine spezifischen Angaben');
      expect(service.stepGroup('specificQuestionnaire').valid).toBe(true);
    });
  });

  describe('follow-up notifications', () => {
    beforeEach(() => service.initialize(NotificationType.FollowUpNotification6_1, false));

    it('opens the follow-up dialog when not redirected', () => {
      expect(followUpNotificationIdService.openDialog).toHaveBeenCalledWith({
        dialogData: {
          routerLink: '/disease-notification/6.1',
          linkTextContent: 'einer namentlichen Infektionskrankheit nach § 6 IfSG',
          pathToDestinationLookup: '/destination-lookup/v1',
        },
      });
    });

    it('applies the single follow-up category and the validated notification id', () => {
      ifsg61Service['fetchFollowUpCode'].mockReturnValue(of([{ code: 'cvdd', display: 'COVID-19' }]));

      followUpNotificationIdService.hasValidNotificationId$.next(true);

      expect(diseaseControl().value.code).toBe('cvdd');
      expect(service.model.notificationCategory.statusNoteGroup.initialNotificationId.answer.valueString).toBe('a5e2a5a4-30b4-4d13-b3e1-11e1d5c1a7b2');
      expect(service.loadedDiseaseCode()).toBe('cvdd');
    });

    it('applies the category chosen in the mixed codes dialog', () => {
      ifsg61Service['fetchFollowUpCode'].mockReturnValue(of([{ code: 'cvdd' }, { code: 'clod' }]));
      followUpMixedCodesService['openDialog'].mockReturnValue(of('clod'));

      followUpNotificationIdService.hasValidNotificationId$.next(true);

      expect(followUpNotificationIdService.closeDialog).toHaveBeenCalled();
      expect(diseaseControl().value.code).toBe('clod');
    });

    it('changes nothing when the mixed codes dialog is left without a selection', () => {
      ifsg61Service['fetchFollowUpCode'].mockReturnValue(of([{ code: 'cvdd' }, { code: 'clod' }]));
      followUpMixedCodesService['openDialog'].mockReturnValue(of(undefined));

      expect(() => followUpNotificationIdService.hasValidNotificationId$.next(true)).not.toThrow();
      expect(diseaseControl().value).toBeFalsy();
      expect(ifsg61Service['getQuestionnaire']).not.toHaveBeenCalled();
    });

    it('keeps listening after the follow-up category could not be fetched', () => {
      ifsg61Service['fetchFollowUpCode'].mockReturnValueOnce(throwError(() => new Error('unsupported')));
      followUpNotificationIdService.hasValidNotificationId$.next(true);
      followUpNotificationIdService.hasValidNotificationId$.next(false);

      ifsg61Service['fetchFollowUpCode'].mockReturnValue(of([{ code: 'cvdd' }]));
      followUpNotificationIdService.hasValidNotificationId$.next(true);

      expect(diseaseControl().value.code).toBe('cvdd');
    });

    it('resets the follow-up state and stops reacting after destruction', () => {
      injector.destroy();
      ifsg61Service['fetchFollowUpCode'].mockReturnValue(of([{ code: 'cvdd' }]));

      followUpNotificationIdService.hasValidNotificationId$.next(true);

      expect(followUpNotificationIdService.resetState).toHaveBeenCalled();
      expect(ifsg61Service['fetchFollowUpCode']).not.toHaveBeenCalled();
    });
  });

  describe('sending', () => {
    describe.each([
      [NotificationType.NominalNotification6_1, true],
      [NotificationType.FollowUpNotification6_1, true],
      [NotificationType.NonNominalNotification7_3, false],
      [NotificationType.FollowUpNotification7_3, false],
    ] as const)('common questionnaire for notification type %s', (type, includesCommon) => {
      it.each([{}, { example: { answer: { valueString: 'entered' } } }])('applies the notification scope to common model %j', commonModel => {
        service.initialize(type, true);
        selectDisease('cvdd');
        service.model.notificationCategory.diseaseChoice.answer.valueCoding = diseaseControl().value;
        service.model.notificationCategory.statusNoteGroup.notificationIdReference = { answer: { valueString: 'noReference' } };
        service.model.notifier.facilityInfo.organizationType = { answer: { valueCoding: { code: 'hospital' } } };
        service.model.notifier.contact = { firstname: 'Erika', lastname: 'Muster' };
        service.model.notifier.contacts = { emailAddresses: [], phoneNumbers: [] };
        service.model.notifiedPerson.contacts = { emailAddresses: [], phoneNumbers: [] };
        service.model.notifiedPerson.residenceAddress = { country: 'DE' };
        service.model.commonQuestionnaire = commonModel;
        vi.spyOn(service.form, 'valid', 'get').mockReturnValue(true);

        service.sendData();

        expect(ifsg61Service['submitNotification']).toHaveBeenCalledOnce();
        const [notification, notificationType] = ifsg61Service['submitNotification'].mock.calls[0];
        expect(notificationType).toBe(type);
        expect(notification.status.category).toBe('cvdd');
        expect(notification.disease).toEqual({ questionnaire: 'cvdd', item: [] });
        if (includesCommon) {
          expect(notification.common).toEqual({
            questionnaire: 'common',
            item: Object.keys(commonModel).length ? [{ linkId: 'example', answer: [{ valueString: 'entered' }] }] : [],
          });
        } else {
          expect(notification).not.toHaveProperty('common');
        }
        expect(service.model.commonQuestionnaire).toBe(commonModel);
      });
    });

    it('does not send an invalid notification', () => {
      service.initialize(NotificationType.NominalNotification6_1, false);

      service.sendData();

      expect(ifsg61Service['submitNotification']).not.toHaveBeenCalled();
    });

    it('sends the legacy notification structure when all steps are valid', () => {
      service.initialize(NotificationType.FollowUpNotification7_3, true);
      ifsg61Service['fetchFollowUpCode'].mockReturnValue(of([{ code: 'cvdd' }]));
      followUpNotificationIdService.hasValidNotificationId$.next(true);
      service.model.notifier.contact = { firstname: 'Erika', lastname: 'Muster' };
      vi.spyOn(service.form, 'valid', 'get').mockReturnValue(true);

      service.sendData();

      expect(ifsg61Service['submitNotification']).toHaveBeenCalledWith(
        expect.objectContaining({ status: expect.objectContaining({ category: 'cvdd' }), disease: expect.objectContaining({ questionnaire: 'cvdd' }) }),
        NotificationType.FollowUpNotification7_3
      );
    });
  });
});
