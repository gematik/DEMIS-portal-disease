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

import { buildMock, mainConfig, setupIntegrationTests } from './base';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { NotificationType } from '../../../app/demis-types';
import { TestBed } from '@angular/core/testing';
import { FollowUpNotificationIdService, FollowUpMixedCodesService, MessageDialogService } from '@gematik/demis-portal-core-library';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { EXAMPLE_DISEASE_OPTIONS } from '../../shared/data/test-values';
import { TEST_PARAMETER_VALIDATION } from '../../shared/test-data';
import { getButton, getCheckBox, getInput, getSelect, navigateTo } from '../../shared/material-harness-utils';
import { checkDescribingError } from '../../shared/assertion-utils';
import { getHtmlButtonElement } from '../../shared/html-element-utils';
import { clickNextButton } from '../../shared/test-utils';
import { lastValueFrom, of } from 'rxjs';
import { selectIsHospitalizedYes, selectTab } from '../utils/disease-common-utils';

describe('DiseaseFormComponent followUp integration tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;
  let showFollowUpDialogSpy: jasmine.Spy;
  let followUpNotificationIdService: FollowUpNotificationIdService;
  let messageDialogService: MessageDialogService;
  let ifsg61Service: Ifsg61Service;
  let followUpMixedCodesService: FollowUpMixedCodesService;

  // we need to have two beforeEach() steps, since a MockingComponent needs to be returned before working with it
  beforeEach(() => buildMock(NotificationType.FollowUpNotification6_1));

  beforeEach(() => {
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
    followUpNotificationIdService = TestBed.inject(FollowUpNotificationIdService);
    messageDialogService = TestBed.inject(MessageDialogService);
    ifsg61Service = TestBed.inject(Ifsg61Service);
    followUpMixedCodesService = TestBed.inject(FollowUpMixedCodesService);
    showFollowUpDialogSpy = followUpNotificationIdService.openDialog as jasmine.Spy;
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should show follow up heading', async () => {
    let textContent = fixture.nativeElement.textContent;
    expect(textContent.includes('Folgemeldung')).toBeTruthy();
    expect(textContent.includes('Krankheit')).toBeFalsy();
    expect(textContent.includes('Krankheitsmeldung')).toBeFalsy();
  });
  it('should open follow up dialog', async () => {
    component.ngOnInit();
    expect(showFollowUpDialogSpy).toHaveBeenCalledWith({
      dialogData: {
        routerLink: '/disease-notification/6.1',
        linkTextContent: 'einer namentlichen Infektionskrankheit nach § 6 IfSG',
        pathToDestinationLookup: '/destination-lookup/v1',
        errorUnsupportedNotificationCategory:
          'Aktuell sind Nichtnamentliche Folgemeldungen einer Infektionskrankheit gemäß § 6 Abs. 1 IfSG nur für eine § 6 Abs. 1 IfSG Initialmeldung möglich.',
      },
      notificationCategoryCodes: EXAMPLE_DISEASE_OPTIONS.map(option => option.code),
    });
  });

  it('should populate disease choice when hasValidNotificationId$ emits true with valid disease code', async () => {
    const mockDiseaseCode = EXAMPLE_DISEASE_OPTIONS[0].code;
    const mockNotificationId = 'test-notification-id-123';
    const mockFollowUpCode = [{ code: mockDiseaseCode, display: EXAMPLE_DISEASE_OPTIONS[0].display, designations: [] }];

    (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
    (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);
    (ifsg61Service.fetchFollowUpCode as jasmine.Spy).and.returnValue(of(mockFollowUpCode));

    component.ngOnInit();

    await fixture.whenStable();

    (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding).toBeDefined();
    expect(component.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding?.code).toBe(mockDiseaseCode);
    expect(component.model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer.valueString).toBe(mockNotificationId);
  });

  it('should set disease-choice and initialNotificationId values and keep them disabled after valid follow-up id emitted', async () => {
    const mockDiseaseCode = EXAMPLE_DISEASE_OPTIONS[0].code;
    const mockNotificationId = 'test-notification-id-999';
    const mockFollowUpCode = [{ code: mockDiseaseCode, display: EXAMPLE_DISEASE_OPTIONS[0].display, designations: [] }];

    (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
    (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);
    (ifsg61Service.fetchFollowUpCode as jasmine.Spy).and.returnValue(of(mockFollowUpCode));

    component.ngOnInit();
    await fixture.whenStable();

    (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding?.code).toBe(mockDiseaseCode);
    expect(component.model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer.valueString).toBe(mockNotificationId);

    const diseaseChoiceField = component.diseaseChoiceFields.find(f => f.id === 'disease-choice');
    expect(diseaseChoiceField?.props?.disabled).toBeTrue();

    const initialNotificationIdField = component.diseaseChoiceFields
      .find(f => f.key === 'statusNoteGroup')
      ?.fieldGroup?.find(f => f.key === 'initialNotificationId.answer.valueString');
    expect(initialNotificationIdField?.props?.disabled).toBeTrue();
  });

  it('should show error dialog when hasValidNotificationId$ emits true but disease code is invalid', async () => {
    // Use custom config with FEATURE_FLAG_MIXED_FOLLOW_UP disabled to test non-mixed path
    const customConfig = {
      ...mainConfig,
      featureFlags: {
        ...mainConfig.featureFlags,
        FEATURE_FLAG_MIXED_FOLLOW_UP: false,
      },
    };
    const result = setupIntegrationTests(customConfig);
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;

    const mockInvalidDiseaseCode = '';
    const mockNotificationId = 'test-notification-id-456';

    (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockInvalidDiseaseCode);
    (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);

    const showErrorDialogSpy = spyOn(messageDialogService, 'showErrorDialog');

    component.ngOnInit();

    await fixture.whenStable();

    (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(showErrorDialogSpy).toHaveBeenCalledWith({
      errorTitle: 'Fehler',
      errors: jasmine.arrayContaining([
        jasmine.objectContaining({
          text: jasmine.stringContaining('wird für die §6.1er Meldungen nicht unterstützt'),
        }),
      ]),
      redirectToHome: true,
    });
  });
  describe('validate notified person anonymous input fields', () => {
    TEST_PARAMETER_VALIDATION.notifiedPersonAnonymous.forEach(parameter => {
      it(`for the '${parameter.field}', the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        component.ngOnInit();

        await navigateTo(loader, 1);

        const notifiedPersonInput = await getInput(loader, `#${parameter.field}`);
        await notifiedPersonInput.setValue(parameter.value);
        await notifiedPersonInput.blur();

        await checkDescribingError({
          fixture: fixture,
          element: notifiedPersonInput,
          expectedResult: parameter.expectedResult,
        });

        expect(getHtmlButtonElement(fixture.nativeElement, '#send-button').disabled).toBe(true);
      });
    });
  });
  describe('clipboard tests', () => {
    it('should insert correct values for notified person', async () => {
      await clickNextButton(fixture);

      const gender = await getSelect(loader, '#gender');
      expect(await gender.getValueText()).toBe('Bitte auswählen');

      const birthDate = await getInput(loader, '#birthDate-datepicker-input-field');
      expect(await birthDate.getValue()).toBe('');

      const zip = await getInput(loader, '#residence-address-zip');
      expect(await zip.getValue()).toBe('');

      const country = await getSelect(loader, '#residence-address-country');
      country.getOptions().then(options => {
        console.log(options);
      });
      expect(await country.getValueText()).toBe('Deutschland');

      const p = lastValueFrom(of('URL P.gender=MALE&P.birthDate=01.01.2023&P.r.zip=12345&P.r.country=DK'));
      spyOn(window.navigator.clipboard, 'readText').and.returnValue(p);
      spyOn(window.navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
      await (await getButton(loader, '#btn-fill-form')).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(await gender.getValueText()).toBe('Männlich');
      expect(await birthDate.getValue()).toBe('01.2023');
      expect(await zip.getValue()).toBe('123');
      expect(await country.getValueText()).toBe('Dänemark');
    });
  });

  it('should hide hospitalized checkboxes', async () => {
    const mockDiseaseCode = EXAMPLE_DISEASE_OPTIONS[0].code;
    const mockNotificationId = 'test-notification-id-999';
    const mockFollowUpCode = [{ code: mockDiseaseCode, display: EXAMPLE_DISEASE_OPTIONS[0].display, designations: [] }];

    (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
    (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);
    (ifsg61Service.fetchFollowUpCode as jasmine.Spy).and.returnValue(of(mockFollowUpCode));

    component.ngOnInit();
    await fixture.whenStable();

    (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);
    await fixture.whenStable();
    fixture.detectChanges();

    await selectTab(fixture, loader, 5);
    await selectIsHospitalizedYes(loader);
    await expectAsync(getCheckBox(loader, '#copyNotifiedPersonCurrentAddress')).toBeRejectedWithError(/Failed[\s\S]*copyNotifiedPersonCurrentAddress/);
    await expectAsync(getCheckBox(loader, '#copyNotifierContact')).toBeRejectedWithError(/Failed[\s\S]*copyNotifierContact/);
  });

  describe('mixed follow-up notification', () => {
    it('should open mixed codes dialog when fetchFollowUpCode returns multiple codes', async () => {
      const mockDiseaseCode = 'MYCP';
      const mockNotificationId = 'test-notification-id-mixed-123';
      const mockFollowUpCodes = [
        { code: EXAMPLE_DISEASE_OPTIONS[0].code, display: EXAMPLE_DISEASE_OPTIONS[0].display, designations: [] },
        { code: EXAMPLE_DISEASE_OPTIONS[1].code, display: EXAMPLE_DISEASE_OPTIONS[1].display, designations: [] },
      ];
      const selectedCode = EXAMPLE_DISEASE_OPTIONS[0].code;

      (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
      (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);
      (ifsg61Service.fetchFollowUpCode as jasmine.Spy).and.returnValue(of(mockFollowUpCodes));
      (followUpMixedCodesService.openDialog as jasmine.Spy).and.returnValue(of(selectedCode));

      component.ngOnInit();
      await fixture.whenStable();

      (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(ifsg61Service.fetchFollowUpCode).toHaveBeenCalledWith(mockDiseaseCode);
      expect(followUpNotificationIdService.closeDialog).toHaveBeenCalled();
      expect(followUpMixedCodesService.openDialog).toHaveBeenCalledWith(mockFollowUpCodes);
      expect(component.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding?.code).toBe(selectedCode);
      expect(component.model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer.valueString).toBe(mockNotificationId);
    });

    it('should use single code directly when fetchFollowUpCode returns one code', async () => {
      const mockDiseaseCode = 'MYCP';
      const mockNotificationId = 'test-notification-id-single-456';
      const mockFollowUpCode = [{ code: EXAMPLE_DISEASE_OPTIONS[0].code, display: EXAMPLE_DISEASE_OPTIONS[0].display, designations: [] }];

      (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
      (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);
      (ifsg61Service.fetchFollowUpCode as jasmine.Spy).and.returnValue(of(mockFollowUpCode));

      component.ngOnInit();
      await fixture.whenStable();

      (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(ifsg61Service.fetchFollowUpCode).toHaveBeenCalledWith(mockDiseaseCode);
      expect(followUpMixedCodesService.openDialog).not.toHaveBeenCalled();
      expect(component.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding?.code).toBe(mockFollowUpCode[0].code);
      expect(component.model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer.valueString).toBe(mockNotificationId);
    });

    it('should not update model when fetchFollowUpCode returns empty array', async () => {
      const mockDiseaseCode = 'MYCP';
      const mockNotificationId = 'test-notification-id-empty-789';

      (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
      (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);
      (ifsg61Service.fetchFollowUpCode as jasmine.Spy).and.returnValue(of([]));

      component.ngOnInit();
      await fixture.whenStable();

      (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(ifsg61Service.fetchFollowUpCode).toHaveBeenCalledWith(mockDiseaseCode);
      expect(followUpMixedCodesService.openDialog).not.toHaveBeenCalled();
      expect(component.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding).toBeNull();
    });

    it('should not update model when fetchFollowUpCode returns null', async () => {
      const mockDiseaseCode = 'MYCP';
      const mockNotificationId = 'test-notification-id-null-012';

      (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
      (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);
      (ifsg61Service.fetchFollowUpCode as jasmine.Spy).and.returnValue(of(null as any));

      component.ngOnInit();
      await fixture.whenStable();

      (followUpNotificationIdService.hasValidNotificationId$ as any).next(true);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(ifsg61Service.fetchFollowUpCode).toHaveBeenCalledWith(mockDiseaseCode);
      expect(followUpMixedCodesService.openDialog).not.toHaveBeenCalled();
      expect(component.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding).toBeNull();
    });
  });
});
