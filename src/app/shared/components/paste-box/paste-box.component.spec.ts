/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */

import { PasteBoxComponent } from './paste-box.component';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { AppComponent } from '../../../app.component';
import { AppModule } from '../../../app.module';

describe('PasteBoxComponent', () => {
  let fixture: MockedComponentFixture<PasteBoxComponent>;
  let component: AppComponent;

  const createComponent = () => {
    fixture = MockRender(PasteBoxComponent);
    component = fixture.point.componentInstance;
  };

  beforeEach(() => MockBuilder(PasteBoxComponent, AppModule));

  it('should create', () => {
    createComponent();
    expect(component).withContext('component was not created').toBeTruthy();
  });
});
