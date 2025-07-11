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

import { buildMock, setupIntegrationTests } from './base.spec';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { Router } from '@angular/router';
import { getTabList } from '../../shared/material-harness-utils';

describe('DiseaseFormComponent nonnominal integration tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  // we need to have two beforeEach() steps, since a MockingComponent needs to be returned before working with it
  beforeEach(() =>
    buildMock().provide({
      provide: Router,
      useValue: { url: '/disease-notification/7.3/non-nominal' },
    })
  );

  beforeEach(() => {
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should show new stepper heading with nonnominal routing', async () => {
    let textContent = fixture.nativeElement.textContent;
    expect(textContent.includes('Krankheit')).toBeTruthy();
    expect(textContent.includes('Krankheitsmeldung')).toBeFalsy();
  });

  it('should not show epidemiologische Angaben', async () => {
    const tabList = await getTabList(loader);
    expect(tabList.length).toBe(5);
    await expectAsync(tabList[4].getLabel()).toBeResolvedTo('Spezifische Angaben');
  });
});
