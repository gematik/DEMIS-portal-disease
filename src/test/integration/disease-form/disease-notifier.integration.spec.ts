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

import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture, MockRender } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { environment } from '../../../environments/environment';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { selectTab } from '../utils/disease-common-utils';
import { getAllButtonsWithSameSelector, getButton, getMultipleInputFieldsWithSameSelector } from '../../shared/material-harness-utils';
import { MatButtonHarness } from '@angular/material/button/testing';
import { buildMock, mainConfig, setupIntegrationTests } from './base.spec';

describe('DiseaseFormComponent integration tests for Notifier Tab', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  beforeEach(() => buildMock());

  beforeEach(() => {
    localStorage.clear();
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could be created').toBeTruthy();
  });

  describe('contacts works as expected', async () => {
    let getPhoneFieldsCount: () => Promise<number>;
    let getEmailFieldsCount: () => Promise<number>;
    let getDeletePhoneButtons: () => Promise<MatButtonHarness[]>;
    let getDeleteEmailButtons: () => Promise<MatButtonHarness[]>;
    let getAddPhoneButton: () => Promise<MatButtonHarness>;
    let getAddEmailButton: () => Promise<MatButtonHarness>;

    beforeEach(async () => {
      getPhoneFieldsCount = async () => (await getMultipleInputFieldsWithSameSelector(loader, '[data-cy="phoneNo"]')).length;
      getEmailFieldsCount = async () => (await getMultipleInputFieldsWithSameSelector(loader, '[data-cy="email"]')).length;
      getDeletePhoneButtons = async () => getAllButtonsWithSameSelector(loader, '[id^="phoneNumbers-delete-button"]');
      getDeleteEmailButtons = async () => getAllButtonsWithSameSelector(loader, '[id^="emailAddresses-delete-button"]');
      getAddPhoneButton = async () => getButton(loader, '#phoneNumbers-add-button');
      getAddEmailButton = async () => getButton(loader, '#emailAddresses-add-button');
    });

    it('it is possible to add phone and email', async () => {
      await selectTab(fixture, loader, 1);

      expect(await getPhoneFieldsCount()).toBe(1);
      await (await getAddPhoneButton()).click();
      fixture.detectChanges();
      expect(await getPhoneFieldsCount()).toBe(2);

      expect(await getEmailFieldsCount()).toBe(1);
      await (await getAddEmailButton()).click();
      fixture.detectChanges();
      expect(await getEmailFieldsCount()).toBe(2);
    });

    it('At start both email and phone fields should be visible and both are deletable', async () => {
      await selectTab(fixture, loader, 1);
      expect(await getPhoneFieldsCount()).toBe(1);
      expect(await getEmailFieldsCount()).toBe(1);

      expect((await getDeletePhoneButtons()).length).toBe(1);
      expect((await getDeleteEmailButtons()).length).toBe(1);
    });

    it('phone deletable except if it is the last contact field', async () => {
      await selectTab(fixture, loader, 1);
      expect(await getPhoneFieldsCount()).toBe(1);
      expect(await getEmailFieldsCount()).toBe(1);

      const deleteEmailButtons = await getDeleteEmailButtons();
      expect(deleteEmailButtons.length).toBe(1);
      await deleteEmailButtons[0].click();
      expect(await getEmailFieldsCount()).toBe(0);

      expect(await getPhoneFieldsCount()).toBe(1);
      expect((await getDeletePhoneButtons()).length).toBe(0);
    });

    it('email deletable except if it is the last contact field', async () => {
      await selectTab(fixture, loader, 1);
      expect(await getPhoneFieldsCount()).toBe(1);
      expect(await getEmailFieldsCount()).toBe(1);

      const deletePhoneButtons = await getDeletePhoneButtons();
      expect(deletePhoneButtons.length).toBe(1);
      await deletePhoneButtons[0].click();
      expect(await getPhoneFieldsCount()).toBe(0);

      expect(await getEmailFieldsCount()).toBe(1);
      expect((await getDeleteEmailButtons()).length).toBe(0);
    });
  });
});
