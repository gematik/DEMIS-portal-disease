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

import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MockBuilder, MockRender } from 'ng-mocks';
import { LabelInfoIconComponent } from 'src/app/shared/components/label-info-icon/label-info-icon.component';
import { FormFieldWithTooltipWrapperComponent } from './form-field-with-tooltip-wrapper.component';

describe('FormFieldWithTooltipComponent', () => {
  beforeEach(() => {
    return MockBuilder(FormFieldWithTooltipWrapperComponent).mock(LabelInfoIconComponent);
  });

  describe('component creation', () => {
    it('should create the component', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {},
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should not attach tooltip icon when tooltip property is not set', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {},
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const attachSpy = spyOn<any>(component, 'attachTooltipIconToLabel');
      const adjustSpy = spyOn<any>(component, 'adjustLabelStyles');

      component.ngAfterViewInit();

      expect(attachSpy).not.toHaveBeenCalled();
      expect(adjustSpy).not.toHaveBeenCalled();
    });

    it('should not attach tooltip icon when tooltip property is empty string', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          tooltip: '',
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const attachSpy = spyOn<any>(component, 'attachTooltipIconToLabel');
      const adjustSpy = spyOn<any>(component, 'adjustLabelStyles');

      component.ngAfterViewInit();

      expect(attachSpy).not.toHaveBeenCalled();
      expect(adjustSpy).not.toHaveBeenCalled();
    });

    it('should not attach tooltip icon when label element is not found', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          tooltip: 'Test tooltip text',
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      // Mock querySelector to return null
      const elementRef = fixture.debugElement.injector.get(ElementRef);
      spyOn(elementRef.nativeElement, 'querySelector').and.returnValue(null);

      const attachSpy = spyOn<any>(component, 'attachTooltipIconToLabel');
      const adjustSpy = spyOn<any>(component, 'adjustLabelStyles');

      component.ngAfterViewInit();

      expect(attachSpy).not.toHaveBeenCalled();
      expect(adjustSpy).not.toHaveBeenCalled();
    });
  });

  describe('attachTooltipIconToLabel', () => {
    it('should pass tooltip text to component input', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          tooltip: 'Important information',
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const labelElement = document.createElement('label');

      // We cannot easily test the DomPortalOutlet in unit tests, so we test the behavior indirectly
      // by verifying the method can be called without errors
      expect(() => component['attachTooltipIconToLabel'](labelElement)).not.toThrow();
    });
  });

  describe('adjustLabelStyles', () => {
    it('should set display style to inline-flex', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {},
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const labelElement = document.createElement('label');
      document.body.appendChild(labelElement);

      component['adjustLabelStyles'](labelElement);

      expect(labelElement.style.display).toBe('inline-flex');

      document.body.removeChild(labelElement);
    });

    it('should set vertical-align style to top', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {},
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const labelElement = document.createElement('label');
      document.body.appendChild(labelElement);

      component['adjustLabelStyles'](labelElement);

      expect(labelElement.style.verticalAlign).toBe('top');

      document.body.removeChild(labelElement);
    });

    it('should set align-items style to center', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {},
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const labelElement = document.createElement('label');
      document.body.appendChild(labelElement);

      component['adjustLabelStyles'](labelElement);

      expect(labelElement.style.alignItems).toBe('center');

      document.body.removeChild(labelElement);
    });

    it('should set margin-top style to -6px', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {},
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const labelElement = document.createElement('label');
      document.body.appendChild(labelElement);

      component['adjustLabelStyles'](labelElement);

      expect(labelElement.style.marginTop).toBe('-6px');

      document.body.removeChild(labelElement);
    });

    it('should apply all four styles in correct order', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {},
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      const labelElement = document.createElement('label');
      document.body.appendChild(labelElement);

      component['adjustLabelStyles'](labelElement);

      expect(labelElement.style.display).toBe('inline-flex');
      expect(labelElement.style.verticalAlign).toBe('top');
      expect(labelElement.style.alignItems).toBe('center');
      expect(labelElement.style.marginTop).toBe('-6px');

      document.body.removeChild(labelElement);
    });
  });

  describe('field configuration variations', () => {
    it('should handle field with FormControl', () => {
      const testControl = new FormControl('initial value');
      const testField: FormlyFieldConfig = {
        key: 'testField',
        formControl: testControl,
        props: {
          tooltip: 'Field tooltip',
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(component.field.formControl).toBe(testControl);
    });

    it('should handle field with nested props', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          label: 'Test Label',
          placeholder: 'Enter value',
          tooltip: 'Helpful text',
          required: true,
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;
      fixture.detectChanges();

      expect(component.field.props?.['tooltip']).toBe('Helpful text');
      expect(component.field.props?.['label']).toBe('Test Label');
      expect(component.field.props?.['required']).toBe(true);
    });

    it('should handle undefined props gracefully', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(component.field.props?.['tooltip']).toBeUndefined();
    });
  });

  describe('integration with tooltip text values', () => {
    it('should handle tooltip with special characters', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          tooltip: 'Special chars: <>&"\'',
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;
      fixture.detectChanges();

      expect(component.field.props?.['tooltip']).toBe('Special chars: <>&"\'');
    });

    it('should handle tooltip with long text', () => {
      const longText = 'This is a very long tooltip text that contains multiple sentences. '.repeat(5);
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          tooltip: longText,
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;
      fixture.detectChanges();

      expect(component.field.props?.['tooltip']).toBe(longText);
    });

    it('should handle tooltip with unicode characters', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          tooltip: 'Unicode: 你好 🌍 Ω',
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;
      fixture.detectChanges();

      expect(component.field.props?.['tooltip']).toBe('Unicode: 你好 🌍 Ω');
    });
  });

  describe('ngAfterViewInit with real DOM', () => {
    it('should call attachTooltipIconToLabel and adjustLabelStyles when label exists with tooltip', () => {
      const testField: FormlyFieldConfig = {
        key: 'testField',
        props: {
          tooltip: 'Test tooltip',
        },
      };

      const fixture = MockRender(FormFieldWithTooltipWrapperComponent, {}, { detectChanges: false });
      const component = fixture.point.componentInstance;
      component.field = testField;

      // Create a label element in the component's nativeElement
      const labelElement = document.createElement('label');
      labelElement.textContent = 'Test Label';
      fixture.point.nativeElement.appendChild(labelElement);

      // Spy on the private methods
      const attachSpy = spyOn<any>(component, 'attachTooltipIconToLabel');
      const adjustSpy = spyOn<any>(component, 'adjustLabelStyles');

      // Call ngAfterViewInit manually
      component.ngAfterViewInit();

      expect(attachSpy).toHaveBeenCalledWith(labelElement);
      expect(adjustSpy).toHaveBeenCalledWith(labelElement);
    });
  });
});
