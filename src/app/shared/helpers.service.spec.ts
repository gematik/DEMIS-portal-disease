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

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MockBuilder, MockRender } from 'ng-mocks';
import { NGXLogger } from 'ngx-logger';

import { HelpersService } from './helpers.service';

describe('HelpersService', () => {
  let service: HelpersService;
  let routerSpy: jasmine.SpyObj<Router>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;

  beforeEach(() => MockBuilder(HelpersService).mock(Router).mock(MatDialog).mock(NGXLogger));

  beforeEach(() => {
    const fixture = MockRender();
    service = fixture.point.injector.get(HelpersService);
    routerSpy = fixture.point.injector.get(Router) as jasmine.SpyObj<Router>;
    matDialogSpy = fixture.point.injector.get(MatDialog) as jasmine.SpyObj<MatDialog>;
    loggerSpy = fixture.point.injector.get(NGXLogger) as jasmine.SpyObj<NGXLogger>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exitApplication', () => {
    it('should navigate to welcome page', () => {
      routerSpy.navigate = jasmine.createSpy('navigate');

      service.exitApplication();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/welcome']);
    });
  });
});
