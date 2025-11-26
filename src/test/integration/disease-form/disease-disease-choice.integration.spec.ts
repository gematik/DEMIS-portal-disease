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
import { buildMock, mainConfig } from './base.spec';
import { environment } from '../../../environments/environment';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { selectTab } from '../utils/disease-common-utils';
import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { throwError } from 'rxjs';

describe('DiseaseFormComponent integration tests for Disease Choice Tab', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let getQuestionnaireSpy: jasmine.Spy;
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
    getQuestionnaireSpy = TestBed.inject(Ifsg61Service).getQuestionnaire as jasmine.Spy;
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should have correct feature flags', async () => {
    expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_PORTAL_ERROR_DIALOG).toBeTrue();
  });

  describe('handle errors correctly', () => {
    it('getQuestionnaire throws an error', async () => {
      let showErrorDialogSpy = spyOn(TestBed.inject(MessageDialogService), 'showErrorDialog');
      getQuestionnaireSpy.and.returnValue(throwError(() => new Error('Foo')));

      await selectTab(fixture, loader, 3);

      const formControl = component.form.get('tabDiseaseChoice.diseaseChoice.answer.valueCoding') as unknown as FormControl;
      formControl?.setValue({
        code: 'cvdd',
        display: 'Coronavirus-Krankheit-2019 (COVID-19)',
        designations: [],
      });
      fixture.detectChanges();
      await fixture.whenStable();

      // assertion
      expect(showErrorDialogSpy).toHaveBeenCalledOnceWith({
        errorTitle: 'Systemfehler',
        errors: [
          {
            text: 'Systemfehler beim Laden des Fragebogens (Error: Foo). Bitte kontaktieren Sie den Support.',
          },
        ],
      });
    });
  });
});
