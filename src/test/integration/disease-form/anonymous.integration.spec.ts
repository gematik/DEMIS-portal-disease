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

import { buildMock, setupIntegrationTests } from './base';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { NotificationType } from '../../../app/demis-types';
import { TestBed } from '@angular/core/testing';
import { FollowUpNotificationIdService, MessageDialogService } from '@gematik/demis-portal-core-library';
import { EXAMPLE_DISEASE_OPTIONS } from '../../shared/data/test-values';
import { TEST_PARAMETER_VALIDATION } from '../../shared/test-data';
import { getButton, getInput, getSelect, navigateTo } from '../../shared/material-harness-utils';
import { checkDescribingError } from '../../shared/assertion-utils';
import { getHtmlButtonElement } from '../../shared/html-element-utils';
import { clickNextButton } from '../../shared/test-utils';
import { lastValueFrom, of } from 'rxjs';

describe('DiseaseFormComponent anonymous integration tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  beforeEach(() => buildMock(NotificationType.AnonymousNotification7_3));

  beforeEach(() => {
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should show follow up heading', async () => {
    let textContent = fixture.nativeElement.textContent;
    console.log(textContent);
    expect(textContent.includes('Ärztliche Ergänzungsmeldung (anonym)')).toBeTruthy();
  });
});
