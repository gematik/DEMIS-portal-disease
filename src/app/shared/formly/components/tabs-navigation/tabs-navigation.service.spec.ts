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

import { signal } from '@angular/core';
import { MockBuilder, MockRender } from 'ng-mocks';
import { NGXLogger } from 'ngx-logger';

import { TabsNavigationComponent } from './tabs-navigation.component';
import { TabsNavigationService } from './tabs-navigation.service';

describe('TabsNavigationService', () => {
  let service: TabsNavigationService;
  let mockTabsComponent: jasmine.SpyObj<TabsNavigationComponent>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;

  beforeEach(() => {
    return MockBuilder(TabsNavigationService).mock(NGXLogger);
  });

  beforeEach(() => {
    const fixture = MockRender();
    service = fixture.point.injector.get(TabsNavigationService);
    loggerSpy = fixture.point.injector.get(NGXLogger) as jasmine.SpyObj<NGXLogger>;

    mockTabsComponent = jasmine.createSpyObj('TabsNavigationComponent', ['chooseTab'], {
      currentIndex: signal<number | undefined>(0),
      tabCount: signal(3),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register and unregister tabs component', () => {
    expect(service.tnc()).toBeUndefined();

    service.register(mockTabsComponent);
    expect(service.tnc()).toBe(mockTabsComponent);

    service.unregister(mockTabsComponent);
    expect(service.tnc()).toBeUndefined();
  });

  it('should navigate to tab when component is registered', () => {
    service.register(mockTabsComponent);
    service.navigateToTab(2);
    expect(mockTabsComponent.chooseTab).toHaveBeenCalledWith(2);
  });

  it('should not navigate when no component is registered', () => {
    service.navigateToTab(2);
    expect(mockTabsComponent.chooseTab).not.toHaveBeenCalled();
  });

  it('should check if can go back', () => {
    // No component registered
    expect(service.canGoBack()).toBeFalsy();

    // Register component at index 0
    service.register(mockTabsComponent);
    expect(service.canGoBack()).toBeFalsy();

    // Create a new mock at index 1
    const mockAtIndex1 = jasmine.createSpyObj('TabsNavigationComponent', ['chooseTab'], {
      currentIndex: signal<number | undefined>(1),
      tabCount: signal(3),
    });
    service.register(mockAtIndex1);
    expect(service.canGoBack()).toBeTruthy();
  });

  it('should go back when component is registered', () => {
    const mockAtIndex1 = jasmine.createSpyObj('TabsNavigationComponent', ['chooseTab'], {
      currentIndex: signal<number | undefined>(1),
      tabCount: signal(3),
    });
    service.register(mockAtIndex1);
    service.goBack();
    expect(mockAtIndex1.chooseTab).toHaveBeenCalledWith(0);
  });

  it('should not go back when no component is registered', () => {
    service.goBack();
    expect(mockTabsComponent.chooseTab).not.toHaveBeenCalled();
  });

  it('should log error when goBack is called with undefined index', () => {
    const mockWithUndefinedIndex = jasmine.createSpyObj('TabsNavigationComponent', ['chooseTab'], {
      currentIndex: signal<number | undefined>(undefined),
      tabCount: signal(3),
    });
    service.register(mockWithUndefinedIndex);

    spyOn(service['logger'], 'error');
    service.goBack();
    expect(service['logger'].error).toHaveBeenCalledWith('Ups, there is no tabs navigation');
  });

  it('should check if can go forward', () => {
    // No component registered
    expect(service.canGoForward()).toBeFalsy();

    // Register component at index 0 (can go forward)
    service.register(mockTabsComponent);
    expect(service.canGoForward()).toBeTruthy();

    // Create a mock at the last index (cannot go forward)
    const mockAtLastIndex = jasmine.createSpyObj('TabsNavigationComponent', ['chooseTab'], {
      currentIndex: signal<number | undefined>(2),
      tabCount: signal(3),
    });
    service.register(mockAtLastIndex);
    expect(service.canGoForward()).toBeFalsy();
  });

  it('should go forward when component is registered', () => {
    service.register(mockTabsComponent);
    service.goForward();
    expect(mockTabsComponent.chooseTab).toHaveBeenCalledWith(1);
  });

  it('should not go forward when no component is registered', () => {
    service.goForward();
    expect(mockTabsComponent.chooseTab).not.toHaveBeenCalled();
  });

  it('should log error when goForward is called with undefined index', () => {
    const mockWithUndefinedIndex = jasmine.createSpyObj('TabsNavigationComponent', ['chooseTab'], {
      currentIndex: signal<number | undefined>(undefined),
      tabCount: signal(3),
    });
    service.register(mockWithUndefinedIndex);

    spyOn(service['logger'], 'error');
    service.goForward();
    expect(service['logger'].error).toHaveBeenCalledWith('Ups, there is no tabs navigation');
  });
});
