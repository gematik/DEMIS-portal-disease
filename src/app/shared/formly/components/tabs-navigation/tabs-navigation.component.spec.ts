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

import { TabsNavigationComponent } from './tabs-navigation.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { environment } from '../../../../../environments/environment';

describe('TabsNavigationComponent', () => {
  let fixture: ComponentFixture<MockComponent>;
  let component: TabsNavigationComponent;

  beforeEach(() => {
    environment.diseaseConfig = {
      featureFlags: {
        FEATURE_FLAG_PORTAL_DISEASE_LAYOUT: false,
      },
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoggerTestingModule,
        FormlyModule.forRoot({
          types: [{ name: 'tabs-navigation', component: TabsNavigationComponent }],
        }),
        TabsNavigationComponent,
        MockComponent,
      ],
    });
    fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(TabsNavigationComponent)).componentInstance as TabsNavigationComponent;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the footer', () => {
    environment.diseaseConfig.featureFlags.FEATURE_FLAG_PORTAL_DISEASE_LAYOUT = true;

    fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();

    const footerEl: HTMLElement | null = fixture.nativeElement.querySelector('gem-demis-forms-footer');

    expect(footerEl).toBeTruthy();
  });

  it('isPortalDiseaseLayoutEnabled defaults to false when featureFlags are not set', () => {
    environment.diseaseConfig = {};

    fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();

    const inst = fixture.debugElement.query(By.directive(TabsNavigationComponent)).componentInstance as TabsNavigationComponent;
    expect(inst['isPortalDiseaseLayoutEnabled']).toBeFalse();
  });

  describe('sideNavTitle', () => {
    it('returns the sideNavTitle prop when it is a string', () => {
      component.field.props['sideNavTitle'] = 'Custom Title';
      expect(component.sideNavTitle()).toBe('Custom Title');
    });

    it('returns an empty string when sideNavTitle prop is not a string', () => {
      delete component.field.props['sideNavTitle'];
      expect(component.sideNavTitle()).toBe('');
    });
  });

  describe('sideNavDescription', () => {
    it('returns the sideNavDescription prop when it is a string', () => {
      component.field.props['sideNavDescription'] = 'Custom Description';
      expect(component.sideNavDescription()).toBe('Custom Description');
    });

    it('returns an empty string when sideNavDescription prop is not a string', () => {
      delete component.field.props['sideNavDescription'];
      expect(component.sideNavDescription()).toBe('');
    });
  });

  describe('handleHexHex', () => {
    it('calls the onHexHex prop when it is a function', () => {
      const spy = jasmine.createSpy('onHexHex');
      component.field.props['onHexHex'] = spy;
      component.handleHexHex();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('does nothing when onHexHex prop is not a function', () => {
      delete component.field.props['onHexHex'];
      expect(() => component.handleHexHex()).not.toThrow();
    });
  });

  describe('handlePaste', () => {
    it('calls the onPaste prop with clipboardData when it is a function', () => {
      const spy = jasmine.createSpy('onPaste');
      const data = new Map<string, string>([['key', 'value']]);
      component.field.props['onPaste'] = spy;
      component.handlePaste(data);
      expect(spy).toHaveBeenCalledWith(data);
    });

    it('does nothing when onPaste prop is not a function', () => {
      delete component.field.props['onPaste'];
      const data = new Map<string, string>();
      expect(() => component.handlePaste(data)).not.toThrow();
    });
  });

  describe('ngAfterViewInit', () => {
    it('skips subscription setup when navtabs signal returns no MatTabGroup', () => {
      // Replace the viewChild signal with a plain Angular signal returning undefined
      // to cover the if(matTabGroup) false branch
      (component as any).navtabs = signal<undefined>(undefined);
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });
});

describe('TabsNavigationComponent – ngAfterViewInit without navtabs', () => {
  it('leaves matTabGroup unset when #navtabs is absent from the template', async () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoggerTestingModule,
        FormlyModule.forRoot({
          types: [{ name: 'tabs-navigation', component: TabsNavigationComponent }],
        }),
        TabsNavigationComponent,
        MockComponentNoNavtabs,
      ],
    });

    // Override must happen before module instantiation (i.e. before createComponent)
    TestBed.overrideComponent(TabsNavigationComponent, { set: { template: '<div></div>' } });

    const fixture = TestBed.createComponent(MockComponentNoNavtabs);
    fixture.detectChanges();
    await fixture.whenStable();

    const inst = fixture.debugElement.query(By.directive(TabsNavigationComponent)).componentInstance as TabsNavigationComponent;
    expect(inst.matTabGroup).toBeUndefined();
  });
});

describe('TabsNavigationComponent – tabCount without fieldGroup', () => {
  it('defaults tabCount to 0 when fieldGroup is not provided', () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoggerTestingModule,
        FormlyModule.forRoot({
          types: [{ name: 'tabs-navigation', component: TabsNavigationComponent }],
        }),
        TabsNavigationComponent,
        MockComponentWithoutFieldGroup,
      ],
    });

    const fixture = TestBed.createComponent(MockComponentWithoutFieldGroup);
    fixture.detectChanges();

    const inst = fixture.debugElement.query(By.directive(TabsNavigationComponent)).componentInstance as TabsNavigationComponent;
    expect(inst.tabCount()).toBe(0);
  });
});

@Component({
  selector: 'app-test-form',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'test',
      type: 'tabs-navigation',
      fieldGroup: [],
    },
  ];
}

@Component({
  selector: 'app-test-form-no-navtabs',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponentNoNavtabs {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'test',
      type: 'tabs-navigation',
      fieldGroup: [],
    },
  ];
}

@Component({
  selector: 'app-test-form-no-fg',
  template: `
    <form [formGroup]="form">
      <formly-form [fields]="fields" [form]="form" [model]="model"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyModule],
})
class MockComponentWithoutFieldGroup {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'test',
      type: 'tabs-navigation',
      // no fieldGroup set → field.fieldGroup is undefined
    },
  ];
}
