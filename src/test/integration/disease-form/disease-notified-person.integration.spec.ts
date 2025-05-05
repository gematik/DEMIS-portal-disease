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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture, MockRender } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { buildMock, mainConfig } from './base.spec';
import { environment } from '../../../environments/environment';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { selectTab } from '../utils/disease-common-utils';
import { getRadioGroup } from '../../shared/material-harness-utils';
import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { TestBed } from '@angular/core/testing';
import { CopyAndKeepInSyncService } from '../../../app/disease-form/services/copy-and-keep-in-sync-service';
import { HelpersService } from '../../../app/shared/helpers.service';

describe('DiseaseFormComponent integration tests for Notified Person Tab', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  beforeAll(() => {
    localStorage.clear();
  });

  beforeEach(() => buildMock());

  beforeEach(() => {
    environment.diseaseConfig = mainConfig;
    fixture = MockRender(DiseaseFormComponent);
    component = fixture.point.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should have correct feature flags', async () => {
    expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_HOSP_COPY_CHECKBOXES).toBeTrue();
    expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_PORTAL_ERROR_DIALOG).toBeTrue();
  });

  it('error if current address set to notifier-address but this is not available', async () => {
    // steps to take
    await selectTab(fixture, loader, 2);
    const showErrorDialogSpy = spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
    const legacyDisplayErrorSpy = spyOn(TestBed.inject(HelpersService), 'displayError');

    const radioGroup = await getRadioGroup(loader, '#currentAddressType');
    await radioGroup.checkRadioButton({ label: 'anderer Wohnsitz' });
    await radioGroup.checkRadioButton({ label: 'Adresse der meldenden Einrichtung' });
    fixture.detectChanges();

    // assertion
    expect(showErrorDialogSpy).toHaveBeenCalledOnceWith({
      errorTitle: CopyAndKeepInSyncService.MESSAGE_COPY_IMPOSSIBLE,
      errors: [
        {
          text: CopyAndKeepInSyncService.MESSAGE_ERROR_COPY_NOTIFIER,
        },
      ],
    });

    // can be deleted when FEATURE_FLAG_PORTAL_ERROR_DIALOG is active everywhere:
    environment.diseaseConfig.featureFlags.FEATURE_FLAG_PORTAL_ERROR_DIALOG = false;
    await radioGroup.checkRadioButton({ label: 'anderer Wohnsitz' });
    await radioGroup.checkRadioButton({ label: 'Adresse der meldenden Einrichtung' });
    fixture.detectChanges();
    expect(legacyDisplayErrorSpy).toHaveBeenCalledOnceWith(
      CopyAndKeepInSyncService.MESSAGE_COPY_IMPOSSIBLE,
      CopyAndKeepInSyncService.MESSAGE_ERROR_COPY_NOTIFIER,
      ''
    );
    environment.diseaseConfig.featureFlags.FEATURE_FLAG_PORTAL_ERROR_DIALOG = true;
    //////////////////////////////////////////////////////////////////////////////
  });
});
