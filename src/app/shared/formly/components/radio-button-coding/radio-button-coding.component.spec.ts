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

import { RadioButtonCodingComponent } from './radio-button-coding.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { AppModule } from '../../../../app.module';

//@todo Component needs many formly-inputs, disabled -> need to fix initialization
xdescribe('RadioButtonCodingComponent', () => {
  let fixture: MockedComponentFixture<RadioButtonCodingComponent>;
  let component: RadioButtonCodingComponent;

  const createComponent = () => {
    fixture = MockRender(RadioButtonCodingComponent);
    component = fixture.point.componentInstance;
  };

  beforeEach(() => MockBuilder(RadioButtonCodingComponent, AppModule));

  it('should create', () => {
    createComponent();
    expect(component).withContext('component was not created').toBeTruthy();
  });
});
