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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { buildMock, setupIntegrationTests } from './base.spec';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { NotificationType } from '../../../app/demis-types';
import { TestBed } from '@angular/core/testing';
import { FollowUpNotificationIdService, MessageDialogService } from '@gematik/demis-portal-core-library';
import { EXAMPLE_DISEASE_OPTIONS } from '../../shared/data/test-values';
import { TEST_PARAMETER_VALIDATION } from '../../shared/test-data';
import { getInput, navigateTo } from '../../shared/material-harness-utils';
import { checkDescribingError } from '../../shared/assertion-utils';
import { getHtmlButtonElement } from '../../shared/html-element-utils';

describe('DiseaseFormComponent followUp integration tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;
  let showFollowUpDialogSpy: jasmine.Spy;
  let followUpNotificationIdService: FollowUpNotificationIdService;
  let messageDialogService: MessageDialogService;

  // we need to have two beforeEach() steps, since a MockingComponent needs to be returned before working with it
  beforeEach(() => buildMock(NotificationType.FollowUpNotification6_1));

  beforeEach(() => {
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
    followUpNotificationIdService = TestBed.inject(FollowUpNotificationIdService);
    messageDialogService = TestBed.inject(MessageDialogService);
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
        linkTextContent: 'eines Nachweises von Infektionskrankheiten gemäß § 6 IfSG',
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

    (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
    (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);

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

    (followUpNotificationIdService.followUpNotificationCategory as unknown as jasmine.Spy).and.returnValue(mockDiseaseCode);
    (followUpNotificationIdService.validatedNotificationId as unknown as jasmine.Spy).and.returnValue(mockNotificationId);

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
});
