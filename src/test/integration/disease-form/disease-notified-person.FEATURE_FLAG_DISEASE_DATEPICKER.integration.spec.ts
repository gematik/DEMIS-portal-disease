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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MockedComponentFixture, MockRender } from 'ng-mocks';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { environment } from '../../../environments/environment';
import { selectTab } from '../utils/disease-common-utils';
import { buildMock, mainConfig } from './base.spec';

describe('NotifiedPerson with FEATURE_FLAG_DISEASE_DATEPICKER', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  // Helper function to find birthDate field in the formly configuration
  const findBirthDateField = (fields: any[]): any => {
    for (const field of fields) {
      if (field.key === 'birthDate') {
        return field;
      }
      if (field.fieldGroup) {
        const found = findBirthDateField(field.fieldGroup);
        if (found) return found;
      }
    }
    return null;
  };

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

  describe('when FEATURE_FLAG_DISEASE_DATEPICKER is enabled', () => {
    beforeEach(() => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_DATEPICKER = true;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
    });

    it('should have FEATURE_FLAG_DISEASE_DATEPICKER enabled', () => {
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_DATEPICKER).toBeTrue();
    });

    it('should use datepicker type for birthDate field when feature flag is enabled', async () => {
      // Navigate to NotifiedPerson tab
      await selectTab(fixture, loader, 2);

      // Check that the birthDate field has type 'datepicker'
      const notifiedPersonFields = component.formlyConfigFields;

      const birthDateField = findBirthDateField(notifiedPersonFields);

      expect(birthDateField).toBeTruthy();
      expect(birthDateField.type).toBe('datepicker');
      expect(birthDateField.props?.multiYear).toBeTrue();
      expect(birthDateField.props?.maxDate).toBeInstanceOf(Date);
    });

    it('should have correct datepicker properties when feature flag is enabled', async () => {
      await selectTab(fixture, loader, 2);

      const notifiedPersonFields = component.formlyConfigFields;

      const birthDateField = findBirthDateField(notifiedPersonFields);

      expect(birthDateField).toBeTruthy();
      expect(birthDateField.props?.label).toBe('Geburtsdatum');
      expect(birthDateField.props?.appearance).toBe('fill');
      expect(birthDateField.props?.placeholder).toBe('TT.MM.JJJJ');
      expect(birthDateField.props?.maxLength).toBe(10);
      expect(birthDateField.props?.required).toBeFalse();
    });
  });

  describe('when FEATURE_FLAG_DISEASE_DATEPICKER is disabled', () => {
    beforeEach(() => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_DATEPICKER = false;
      fixture.detectChanges();
    });

    it('should have FEATURE_FLAG_DISEASE_DATEPICKER disabled', () => {
      expect(environment.diseaseConfig.featureFlags.FEATURE_FLAG_DISEASE_DATEPICKER).toBeFalse();
    });

    it('should use input type for birthDate field when feature flag is disabled', async () => {
      await selectTab(fixture, loader, 2);

      const notifiedPersonFields = component.formlyConfigFields;

      const birthDateField = findBirthDateField(notifiedPersonFields);

      expect(birthDateField).toBeTruthy();
      expect(birthDateField.type).toBe('input');
      expect(birthDateField.validators?.validation).toContain('dateInputValidator');
    });

    it('should have correct input properties when feature flag is disabled', async () => {
      await selectTab(fixture, loader, 2);

      const notifiedPersonFields = component.formlyConfigFields;

      const birthDateField = findBirthDateField(notifiedPersonFields);

      expect(birthDateField).toBeTruthy();
      expect(birthDateField.props?.label).toBe('Geburtsdatum');
      expect(birthDateField.props?.placeholder).toBe('TT.MM.JJJJ');
      expect(birthDateField.props?.maxLength).toBe(10);
      expect(birthDateField.props?.required).toBeFalse();
      // Should not have datepicker specific properties
      expect(birthDateField.props?.multiYear).toBeUndefined();
      expect(birthDateField.props?.maxDate).toBeUndefined();
      // Note: appearance may have a default value from Material theme, but should not be 'fill'
      expect(birthDateField.props?.appearance).not.toBe('fill');
    });
  });
});
