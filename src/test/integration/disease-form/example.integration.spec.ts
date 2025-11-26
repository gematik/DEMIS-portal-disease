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
import { clickNextButton } from '../../shared/test-utils';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { MockedComponentFixture } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { getTabList, navigateTo } from '../../shared/material-harness-utils';
import { getHtmlSpanElement } from '../../shared/html-element-utils';

describe('DiseaseFormComponent example integration tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  // we need to have two beforeEach() steps, since a MockingComponent needs to be returned before working with it
  beforeEach(() => buildMock());
  beforeEach(() => {
    const result = setupIntegrationTests();
    fixture = result.fixture;
    component = result.component;
    loader = result.loader;
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  it('should reset disease dependent input', async () => {
    // given
    component.model.tabDiseaseCondition = { test: true };
    component.model.tabDiseaseCommon = { test: true };
    component.model.tabQuestionnaire = { test: true };
    // when
    await component.loadQuestionnaire('msvd'); // Masern
    // then
    expect(component.model.tabDiseaseCondition.test).withContext("tabDiseaseCondition should have been reset but isn't").toBeUndefined();
    expect(component.model.tabDiseaseCommon.test).withContext("tabDiseaseCommon should have been reset but isn't").toBeUndefined();
    expect(component.model.tabQuestionnaire.test).withContext("tabQuestionnaire should have been reset but isn't").toBeUndefined();
  });

  it('should switch to next form page when clicking nextButton', async () => {
    let textContent = fixture.nativeElement.textContent;
    expect(textContent.includes('Kontaktmöglichkeiten der betroffenen Person')).toBeFalse();
    expect(textContent).toContain('Ansprechperson (Melder)');

    await clickNextButton(fixture);

    textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Kontaktmöglichkeiten der betroffenen Person');
  });

  it('should switch to betroffene person when navigating to it', async () => {
    await navigateTo(loader, 1);
    const span = getHtmlSpanElement(fixture.nativeElement, '.section-title');

    expect(span).toBeTruthy();
    expect(span.textContent).toBe('Betroffene Person');
  });

  it('should switch between sections when navigating', async () => {
    await navigateTo(loader, 5);
    expect(getHtmlSpanElement(fixture.nativeElement, '.section-title').textContent).toBe('Spezifische Angaben');

    await navigateTo(loader, 0);
    expect(getHtmlSpanElement(fixture.nativeElement, '.section-title').textContent).toBe('Meldende Person');

    await navigateTo(loader, 2);
    expect(getHtmlSpanElement(fixture.nativeElement, '.section-title').textContent).toBe('Meldetatbestand');

    await navigateTo(loader, 2);
    expect(getHtmlSpanElement(fixture.nativeElement, '.section-title').textContent).toBe('Meldetatbestand');

    await navigateTo(loader, 1);
    expect(getHtmlSpanElement(fixture.nativeElement, '.section-title').textContent).toBe('Betroffene Person');
  });

  it("navigation should throw an error when tab doesn't exist", async () => {
    await expectAsync(navigateTo(loader, 100)).toBeRejectedWithError(
      `Could not navigate to tab 100: TypeError: Cannot read properties of undefined (reading 'select')`
    );
  });

  it('should show new stepper heading with default routing', async () => {
    let textContent = fixture.nativeElement.textContent;
    expect(textContent.includes('Krankheitsmeldung')).toBeTruthy();
  });

  it('should show epidemiologische Angaben', async () => {
    const tabList = await getTabList(loader);
    expect(tabList.length).toBe(6);
    await expectAsync(tabList[4].getLabel()).toBeResolvedTo('Klinische und epidemiologische Angaben');
  });
});
