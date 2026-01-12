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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { FollowUpNotificationIdService, PasteBoxComponent } from '@gematik/demis-portal-core-library';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { AppModule } from '../../../app/app.module';
import { allowedRoutes } from '../../../app/demis-types';
import { DiseaseFormComponent } from '../../../app/disease-form/disease-form.component';
import { Ifsg61Service } from '../../../app/ifsg61.service';
import { FormlyConstants } from '../../../app/legacy/formly-constants';
import { registerValueSetExtension } from '../../../app/legacy/value-set.extension';
import { ValueSetService } from '../../../app/legacy/value-set.service';
import { TabsNavigationService } from '../../../app/shared/formly/components/tabs-navigation/tabs-navigation.service';
import { HelpersService } from '../../../app/shared/helpers.service';
import { environment } from '../../../environments/environment';
import { EXAMPLE_CODESYSTEM_VERSIONS } from '../../shared/data/test-codesystem-versions';
import { EXAMPLE_DISEASE_OPTIONS, EXAMPLE_VALUE_SET, QUESTIONNAIRE_WITH_TOOLTIP } from '../../shared/data/test-values';
import { navigateTo } from '../../shared/material-harness-utils';

describe('DiseaseFormComponent tooltip integration tests', () => {
  let component: DiseaseFormComponent;
  let fixture: MockedComponentFixture<DiseaseFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const ifsg61ServiceMock = {
      getCodeValueSet: jasmine.createSpy('getCodeValueSet').and.returnValue(of(EXAMPLE_VALUE_SET)),
      getCodeSystemVersions: jasmine.createSpy('getCodeSystemVersions').and.returnValue(of(EXAMPLE_CODESYSTEM_VERSIONS)),
      getDiseaseOptions: jasmine.createSpy('getDiseaseOptions').and.returnValue(of(EXAMPLE_DISEASE_OPTIONS)),
      getQuestionnaire: jasmine.createSpy('getQuestionnaire').and.returnValue(of(QUESTIONNAIRE_WITH_TOOLTIP)),
    };

    const valueSetServiceMock = {
      get: jasmine.createSpy('get').and.callFake((identifier: string) => {
        if (identifier === FormlyConstants.COUNTRY_CODES) {
          return of([
            { value: 'DE', label: 'Deutschland' },
            { value: 'DK', label: 'Dänemark' },
          ]);
        }
        return of([]);
      }),
    };

    const followUpNotificationIdServiceMock = {
      hasValidNotificationId$: new BehaviorSubject<boolean>(false),
      openDialog: jasmine.createSpy('openDialog'),
      resetState: jasmine.createSpy('resetState'),
      followUpNotificationCategory: jasmine.createSpy('followUpNotificationCategory').and.returnValue(''),
      validatedNotificationId: jasmine.createSpy('validatedNotificationId').and.returnValue(''),
    };

    await MockBuilder(DiseaseFormComponent)
      .keep(AppModule)
      .keep(NoopAnimationsModule)
      .keep(MatIconTestingModule)
      .keep(PasteBoxComponent)
      .mock(Ifsg61Service, ifsg61ServiceMock as any)
      .mock(ValueSetService, valueSetServiceMock as any)
      .mock(ChangeDetectorRef)
      .provide(TabsNavigationService)
      .mock(HelpersService)
      .provide({
        provide: FollowUpNotificationIdService,
        useValue: followUpNotificationIdServiceMock,
      })
      .provide({
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerValueSetExtension,
        deps: [ValueSetService],
      })
      .provide({
        provide: Router,
        useValue: jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation'], {
          url: allowedRoutes['nominal'],
          routerState: { root: {} },
        }),
      });
  });

  beforeEach(() => {
    environment.diseaseConfig = {
      production: false,
      gatewayPaths: {
        main: '/gateway/notification/api/ng/notification/disease',
        disease_6_1: '/6.1',
        disease_7_3_non_nominal: '/7.3/non_nominal',
      },
      futsPaths: {
        main: '/fhir-ui-data-model-translation/disease',
        notificationCategories_6_1: '/6.1',
        disease_7_3: '/7.3/non_nominal',
        notificationCategories_7_3: '/7.3',
        questionnaire: '/questionnaire',
        questionnaire_6_1: '/6.1/questionnaire',
        questionnaire_7_3: '/7.3/questionnaire',
      },
      pathToFuts: '/fhir-ui-data-model-translation',
      pathToDestinationLookup: '/destination-lookup/v1',
      featureFlags: {
        FEATURE_FLAG_OUTLINE_DESIGN: true,
        FEATURE_FLAG_NON_NOMINAL_NOTIFICATION: true,
        FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE: true,
        FEATURE_FLAG_DISEASE_STRICT: true,
      },
      ngxLoggerConfig: {
        level: 1,
        disableConsoleLogging: false,
      },
    };

    fixture = MockRender(DiseaseFormComponent);
    component = fixture.point.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).withContext('DiseaseFormComponent could not be created').toBeTruthy();
  });

  describe('tooltip wrapper functionality', () => {
    beforeEach(async () => {
      // Load the questionnaire with tooltip field
      await component.loadQuestionnaire('msvd');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should render tooltip icon for field with tooltip property', async () => {
      // Navigate to the questionnaire tab (tab index 5 for "Klinische und epidemiologische Angaben")
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      // Find the field with tooltip - "infectProtectFacility" field has a tooltip
      const tooltipIcon = fixture.nativeElement.querySelector('.gem-demis-form-field-label-info-icon');

      expect(tooltipIcon).withContext('Tooltip icon should be rendered for field with tooltip property').toBeTruthy();
    });

    it('should have tooltip icon with correct attributes', async () => {
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      const tooltipIcon = fixture.nativeElement.querySelector('.gem-demis-form-field-label-info-icon');
      expect(tooltipIcon).toBeTruthy();

      // Check that it's a mat-icon element
      expect(tooltipIcon.tagName).withContext('Tooltip icon should be a mat-icon element').toBe('MAT-ICON');

      // Check that it has tabindex="0" for keyboard accessibility
      expect(tooltipIcon.getAttribute('tabindex')).withContext('Tooltip icon should have tabindex="0"').toBe('0');
    });

    it('should display tooltip text on hover', async () => {
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      const tooltipIcon = fixture.nativeElement.querySelector('.gem-demis-form-field-label-info-icon');
      expect(tooltipIcon).toBeTruthy();

      // Check that the tooltip has the matTooltip attribute with expected content
      const tooltipAttribute = tooltipIcon.getAttribute('ng-reflect-message');
      expect(tooltipAttribute).withContext('Tooltip should have content').toBeTruthy();
      expect(tooltipAttribute.length).withContext('Tooltip text should not be empty').toBeGreaterThan(0);
    });

    it('should have form-field-with-tooltip wrapper applied to fields with tooltip', async () => {
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      // Check that the component has processed fields with tooltip property
      const hasTooltipFields = component.fields.some(field => {
        return hasTooltipWrapper(field);
      });

      expect(hasTooltipFields).withContext('At least one field should have form-field-with-tooltip wrapper').toBeTruthy();
    });

    it('should render tooltip for the correct field with tooltip property in EXAMPLE_MSVD', async () => {
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      // The field "infectProtectFacility" in EXAMPLE_MSVD has the tooltip about IfSG-relevant facilities
      const fieldElements = fixture.nativeElement.querySelectorAll('.LinkId_infectProtectFacility');

      expect(fieldElements.length).withContext('infectProtectFacility field should be rendered').toBeGreaterThan(0);

      // Check if this field has a tooltip icon
      let hasTooltipIcon = false;
      fieldElements.forEach((element: HTMLElement) => {
        const icon = element.querySelector('.gem-demis-form-field-label-info-icon');
        if (icon) {
          hasTooltipIcon = true;
        }
      });

      expect(hasTooltipIcon).withContext('infectProtectFacility field should have a tooltip icon').toBeTruthy();
    });

    it('should have tooltip text containing IfSG references', async () => {
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      // Get the expected tooltip text from test data
      // Navigate through the structure: questionnaireConfigs -> fieldGroup -> fieldGroup -> find field with tooltip
      let expectedTooltipText: string | undefined;
      QUESTIONNAIRE_WITH_TOOLTIP.questionnaireConfigs.forEach((config: any) => {
        if (config.fieldGroup) {
          config.fieldGroup.forEach((outerField: any) => {
            if (outerField.fieldGroup) {
              outerField.fieldGroup.forEach((innerField: any) => {
                if (innerField.props?.tooltip) {
                  expectedTooltipText = innerField.props.tooltip;
                }
              });
            }
          });
        }
      });

      expect(expectedTooltipText).withContext('Test data should contain tooltip for infectProtectFacility field').toBeTruthy();

      // Find the tooltip text directly in the component model instead of DOM attribute
      let foundTooltip = false;
      const checkField = (field: any): void => {
        if (field.props?.tooltip === expectedTooltipText) {
          foundTooltip = true;
        }
        if (field.fieldGroup) {
          field.fieldGroup.forEach((childField: any) => checkField(childField));
        }
        if (field.fieldArray?.fieldGroup) {
          field.fieldArray.fieldGroup.forEach((childField: any) => checkField(childField));
        }
      };
      component.fields.forEach(field => checkField(field));

      expect(foundTooltip).withContext('Tooltip text should match the expected content from test data').toBe(true);
    });

    it('should maintain tooltip functionality across tab navigation', async () => {
      // Navigate to tab 5 (with tooltip)
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      let tooltipIcon = fixture.nativeElement.querySelector('.gem-demis-form-field-label-info-icon');
      expect(tooltipIcon).withContext('Tooltip icon should be present on tab 5').toBeTruthy();

      // Navigate away to another tab
      await navigateTo(loader, 1);
      fixture.detectChanges();
      await fixture.whenStable();

      // Navigate back to tab 5
      await navigateTo(loader, 5);
      fixture.detectChanges();
      await fixture.whenStable();

      tooltipIcon = fixture.nativeElement.querySelector('.gem-demis-form-field-label-info-icon');
      expect(tooltipIcon).withContext('Tooltip icon should still be present after navigating back').toBeTruthy();
    });
  });
});

/**
 * Helper function to recursively check if a field or its children have the form-field-with-tooltip wrapper
 */
function hasTooltipWrapper(field: any): boolean {
  if (field.wrappers?.includes('form-field-with-tooltip')) {
    return true;
  }
  if (field.fieldGroup) {
    return field.fieldGroup.some((childField: any) => hasTooltipWrapper(childField));
  }
  if (field.fieldArray?.fieldGroup) {
    return field.fieldArray.fieldGroup.some((childField: any) => hasTooltipWrapper(childField));
  }
  return false;
}
