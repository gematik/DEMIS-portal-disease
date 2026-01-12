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

import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { environment } from '../../../../environments/environment';
import { HexhexbuttonComponent } from './hexhexbutton.component';

describe('HexhexbuttonComponent', () => {
  let component: HexhexbuttonComponent;
  let fixture: MockedComponentFixture<HexhexbuttonComponent>;

  beforeEach(() => {
    return MockBuilder(HexhexbuttonComponent);
  });

  beforeEach(() => {
    fixture = MockRender(HexhexbuttonComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add hexhexbutton class to element on construction', () => {
    // The constructor already ran, so we need to check the component's nativeElement
    const element = component['targetElement'].nativeElement;
    expect(element.classList.contains('hexhexbutton')).toBeTruthy();
  });

  it('should emit paste event when doPaste is called', () => {
    spyOn(component.paste, 'emit');

    component.doPaste();

    expect(component.paste.emit).toHaveBeenCalled();
  });

  it('should show hexhex button when not in production', () => {
    spyOnProperty(environment, 'isProduction', 'get').and.returnValue(false);

    const result = component.showHexHex();

    expect(result).toBeTruthy();
  });

  it('should not show hexhex button when in production', () => {
    spyOnProperty(environment, 'isProduction', 'get').and.returnValue(true);

    const result = component.showHexHex();

    expect(result).toBeFalsy();
  });

  it('should animate button on click', () => {
    const mockButton = {
      classList: {
        remove: jasmine.createSpy('remove'),
        add: jasmine.createSpy('add'),
      },
    };

    const targetElement = component['targetElement'].nativeElement;
    spyOn(targetElement, 'querySelector').and.returnValue(mockButton);

    component.animate();

    expect(mockButton.classList.remove).toHaveBeenCalledWith('animate');

    // Test that add is called after timeout
    setTimeout(() => {
      expect(mockButton.classList.add).toHaveBeenCalledWith('animate');
    }, 15);
  });

  it('should handle animate when button is not found', () => {
    const targetElement = component['targetElement'].nativeElement;
    spyOn(targetElement, 'querySelector').and.returnValue(null);

    // Should not throw error
    expect(() => component.animate()).not.toThrow();
  });
});
