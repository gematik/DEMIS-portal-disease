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

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { LabelInfoIconComponent } from './label-info-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('LabelInfoIconComponent', () => {
  beforeEach(() => {
    return MockBuilder(LabelInfoIconComponent, [MatIconModule, MatTooltipModule]);
  });

  it('should create', () => {
    const fixture = MockRender(LabelInfoIconComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render mat-icon with text "info"', () => {
    MockRender(LabelInfoIconComponent);
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.textContent.trim()).toBe('info');
  });

  it('should have class "gem-demis-form-field-label-info-icon"', () => {
    MockRender(LabelInfoIconComponent);
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.classList.contains('gem-demis-form-field-label-info-icon')).toBe(true);
  });

  it('should set default empty string for tooltipId input when explicitly provided', () => {
    const fixture = MockRender(LabelInfoIconComponent, { tooltipId: '' });
    const component = fixture.point.componentInstance;
    expect(component.tooltipId()).toBe('');
  });

  it('should set default empty string for tooltipText input when explicitly provided', () => {
    const fixture = MockRender(LabelInfoIconComponent, { tooltipText: '' });
    const component = fixture.point.componentInstance;
    expect(component.tooltipText()).toBe('');
  });

  it('should accept and set tooltipId input', () => {
    const fixture = MockRender(LabelInfoIconComponent, { tooltipId: 'test-id' });
    const component = fixture.point.componentInstance;
    expect(component.tooltipId()).toBe('test-id');
  });

  it('should accept and set tooltipText input', () => {
    const fixture = MockRender(LabelInfoIconComponent, { tooltipText: 'Test tooltip text' });
    const component = fixture.point.componentInstance;
    expect(component.tooltipText()).toBe('Test tooltip text');
  });

  it('should render id attribute with tooltipId value', () => {
    MockRender(LabelInfoIconComponent, { tooltipId: 'my-tooltip' });
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.getAttribute('id')).toBe('info-icon-my-tooltip');
  });

  it('should render id attribute with empty tooltipId when not provided', () => {
    MockRender(LabelInfoIconComponent);
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.getAttribute('id')).toBe('info-icon-');
  });

  it('should have matTooltip attribute with tooltipText value', () => {
    MockRender(LabelInfoIconComponent, { tooltipText: 'Information text' });
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.getAttribute('ng-reflect-message')).toBe('Information text');
  });

  it('should have matTooltipClass set to "wide-tooltip"', () => {
    MockRender(LabelInfoIconComponent);
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.getAttribute('ng-reflect-tooltip-class')).toBe('wide-tooltip');
  });

  it('should have matTooltipPosition set to "above"', () => {
    MockRender(LabelInfoIconComponent);
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.getAttribute('ng-reflect-position')).toBe('above');
  });

  it('should have tabindex set to 0', () => {
    MockRender(LabelInfoIconComponent);
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('should accept both tooltipId and tooltipText inputs simultaneously', () => {
    const fixture = MockRender(LabelInfoIconComponent, {
      tooltipId: 'combined-id',
      tooltipText: 'Combined tooltip text',
    });
    const component = fixture.point.componentInstance;
    expect(component.tooltipId()).toBe('combined-id');
    expect(component.tooltipText()).toBe('Combined tooltip text');
  });

  it('should render correctly with both inputs set', () => {
    MockRender(LabelInfoIconComponent, {
      tooltipId: 'full-test',
      tooltipText: 'Full test tooltip',
    });
    const matIcon = ngMocks.find('mat-icon');
    expect(matIcon.nativeElement.getAttribute('id')).toBe('info-icon-full-test');
    expect(matIcon.nativeElement.getAttribute('ng-reflect-message')).toBe('Full test tooltip');
  });
});
