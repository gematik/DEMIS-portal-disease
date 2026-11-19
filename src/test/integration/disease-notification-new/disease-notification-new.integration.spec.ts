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

import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowUpMixedCodesService, FollowUpNotificationIdService, MessageDialogService, withDemisFormlyCore } from '@gematik/demis-portal-core-library';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { allowedRoutes } from '../../../app/demis-types';
import { DiseaseNotificationNewComponent } from '../../../app/disease-notification-new/disease-notification-new.component';
import { DiseaseNotificationService } from '../../../app/disease-notification-new/disease-notification.service';
import { getStepKeys } from '../../../app/disease-notification-new/step-data';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { NotificationFormValidationModule } from '../../../app/legacy/notification-form-validation-module';
import { registerValueSetExtension } from '../../../app/legacy/value-set.extension';
import { ValueSetService } from '../../../app/legacy/value-set.service';
import { APP_FORMLY_CONFIG } from '../../../app/shared/formly/formly-app-config';
import { environment } from '../../../environments/environment';
import { EXAMPLE_DISEASE_OPTIONS, EXAMPLE_VALUE_SET } from '../../shared/data/test-values';
import { EXAMPLE_MSVD_SHORT } from '../../shared/data/test-values-short';
import { mainConfig } from '../disease-form/base';

describe('DiseaseNotificationNewComponent integration tests', () => {
  let fixture: ComponentFixture<DiseaseNotificationNewComponent>;
  let ifsg61Service: Record<string, ReturnType<typeof vi.fn>>;

  async function render(route: string) {
    environment.diseaseConfig = { ...mainConfig, featureFlags: { ...mainConfig.featureFlags, FEATURE_FLAG_CORE_SIDENAV: true } };
    ifsg61Service = {
      getDiseaseOptions: vi.fn().mockReturnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getCodeValueSet: vi.fn().mockReturnValue(of(EXAMPLE_VALUE_SET)),
      getQuestionnaire: vi.fn().mockReturnValue(of(structuredClone(EXAMPLE_MSVD_SHORT))),
      fetchFollowUpCode: vi.fn().mockReturnValue(of([])),
      submitNotification: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [DiseaseNotificationNewComponent, MatIconTestingModule],
      providers: [
        importProvidersFrom(NotificationFormValidationModule, FormlyMatDatepickerModule),
        provideFormlyCore([APP_FORMLY_CONFIG, ...withFormlyMaterial(), ...withDemisFormlyCore()]),
        { provide: FORMLY_CONFIG, multi: true, useFactory: registerValueSetExtension, deps: [ValueSetService] },
        { provide: ValueSetService, useValue: { get: vi.fn().mockReturnValue(of([{ value: 'DE', label: 'Deutschland' }])) } },
        { provide: Ifsg61Service, useValue: ifsg61Service },
        { provide: MessageDialogService, useValue: { showErrorDialog: vi.fn() } },
        {
          provide: FollowUpNotificationIdService,
          useValue: {
            hasValidNotificationId$: new BehaviorSubject(false),
            openDialog: vi.fn(),
            closeDialog: vi.fn(),
            resetState: vi.fn(),
            followUpNotificationCategory: vi.fn(),
            validatedNotificationId: vi.fn(),
          },
        },
        { provide: FollowUpMixedCodesService, useValue: { openDialog: vi.fn() } },
        { provide: NGXLogger, useValue: { error: vi.fn(), warn: vi.fn(), log: vi.fn() } },
        { provide: Router, useValue: { url: route, navigate: vi.fn(), currentNavigation: vi.fn(), events: new Subject(), routerState: { root: {} } } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, queryParams: of({}) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DiseaseNotificationNewComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const service = () => fixture.debugElement.injector.get(DiseaseNotificationService);
  const stepLabels = () => Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.step-label')).map(label => label.textContent?.trim());
  const stepHeaders = () => Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('mat-step-header'));
  const headline = () => fixture.nativeElement.querySelector('[id$="-section-header"] gem-demis-section-header')?.textContent?.trim();

  async function goToStep(stepNumber: number) {
    stepHeaders()[stepNumber - 1].click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('renders the six steps of a nominal notification with the first step content', async () => {
    await render(allowedRoutes['nominal']);

    expect(fixture.nativeElement.textContent).toContain('Krankheitsmeldung (§ 6.1)');
    expect(stepLabels()).toEqual([
      'Meldende Person',
      'Betroffene Person',
      'Meldetatbestand',
      'Angaben zu Symptomen',
      'Klinische und epidemiologische Angaben',
      'Spezifische Angaben',
    ]);
    expect(headline()).toBe('Meldende Person');
  });

  it('omits the common step for non-nominal notifications', async () => {
    await render(allowedRoutes['nonNominal']);

    expect(fixture.nativeElement.textContent).toContain('ohne Angaben von Personendaten');
    expect(stepLabels()).not.toContain('Klinische und epidemiologische Angaben');
    expect(stepLabels()).toHaveLength(5);
  });

  it.each([
    ['followUp', false],
    ['followUp', true],
    ['followUpNonNominal', false],
    ['followUpNonNominal', true],
  ])('shows step validity for %s after resolving the ID (delayed questionnaire: %s)', async (route, delayed) => {
    await render(allowedRoutes[route]);
    expect(
      stepHeaders()
        .slice(0, 3)
        .every(header => header.querySelector('.step-number'))
    ).toBe(true);
    const questionnaire = new Subject<typeof EXAMPLE_MSVD_SHORT>();
    ifsg61Service['fetchFollowUpCode'].mockReturnValue(of([{ code: 'msvd' }]));
    ifsg61Service['getQuestionnaire'].mockReturnValue(delayed ? questionnaire : of(structuredClone(EXAMPLE_MSVD_SHORT)));
    const followUpIdService = TestBed.inject(FollowUpNotificationIdService);
    vi.mocked(followUpIdService.validatedNotificationId).mockReturnValue('a5e2a5a4-30b4-4d13-b3e1-11e1d5c1a7b2');

    (followUpIdService.hasValidNotificationId$ as BehaviorSubject<boolean>).next(true);
    fixture.detectChanges();
    await fixture.whenStable();
    if (delayed) {
      expect(stepHeaders()[3].getAttribute('aria-disabled')).toBe('true');

      questionnaire.next(structuredClone(EXAMPLE_MSVD_SHORT));
      questionnaire.complete();
      fixture.detectChanges();
      await fixture.whenStable();
    }

    expect(stepHeaders()[3].getAttribute('aria-disabled')).not.toBe('true');
    expect(stepHeaders().every(header => !header.querySelector('.step-number'))).toBe(true);
    const stepKeys = getStepKeys(service());
    stepHeaders().forEach((header, index) => {
      expect(!!header.querySelector('.step-valid')).toBe(service().stepGroup(stepKeys[index]).valid);
      expect(!!header.querySelector('.step-invalid')).toBe(service().stepGroup(stepKeys[index]).invalid);
    });
    for (const stepKey of stepKeys.filter(key => key === 'commonQuestionnaire' || key === 'specificQuestionnaire')) {
      expect(service().stepGroup(stepKey).valid).toBe(true);
      const valueBeforeRendering = structuredClone(service().stepGroup(stepKey).value);
      await goToStep(stepKeys.indexOf(stepKey) + 1);
      expect(service().stepGroup(stepKey).valid).toBe(true);
      expect(service().stepGroup(stepKey).value).toEqual(valueBeforeRendering);
    }
  });

  it('renders the honeypot outside of the keyboard and accessibility tree', async () => {
    await render(allowedRoutes['nominal']);

    const honeypot: HTMLInputElement = fixture.nativeElement.querySelector('input#oneTimeCode');
    expect(honeypot).toBeTruthy();
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.getAttribute('aria-hidden')).toBe('true');
  });

  it('unlocks the questionnaire steps after a disease has been chosen on the rendered step', async () => {
    await render(allowedRoutes['nominal']);
    expect(stepHeaders()[3].getAttribute('aria-disabled')).toBe('true');

    await goToStep(3);
    expect(headline()).toBe('Meldetatbestand');
    service()
      .stepGroup('notificationCategory')
      .get('diseaseChoice.answer.valueCoding')!
      .setValue(EXAMPLE_DISEASE_OPTIONS.find(o => o.code === 'msvd'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(ifsg61Service['getQuestionnaire']).toHaveBeenCalledWith('msvd', expect.anything());
    expect(service().model.notificationCategory.diseaseChoice.answer.valueCoding.code).toBe('msvd');
    expect(stepHeaders()[3].getAttribute('aria-disabled')).not.toBe('true');

    await goToStep(6);
    expect(headline()).toBe('Spezifische Angaben');
    expect(fixture.nativeElement.querySelector('#specificQuestionnaire-form formly-form')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#btn-nav-action-next')).toBeNull();
    expect(fixture.nativeElement.querySelector('#btn-send-notification')).toBeTruthy();
  });

  it('navigates with the step actions and offers submit only through accessible blocking', async () => {
    await render(allowedRoutes['nominal']);

    const initialBack: HTMLButtonElement = fixture.nativeElement.querySelector('#btn-nav-action-back');
    expect(initialBack.disabled).toBe(true);

    const next: HTMLButtonElement = fixture.nativeElement.querySelector('#btn-nav-action-next');
    next.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(headline()).toBe('Betroffene Person');

    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('#btn-send-notification');
    expect(submit.getAttribute('aria-disabled')).toBe('true');
    submit.click();
    expect(ifsg61Service['submitNotification']).not.toHaveBeenCalled();

    const back: HTMLButtonElement = fixture.nativeElement.querySelector('#btn-nav-action-back');
    expect(back.disabled).toBe(false);
    back.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(headline()).toBe('Meldende Person');
  });
});
