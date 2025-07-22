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

import { HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MockBuilder, MockRender } from 'ng-mocks';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { ProgressService } from './progress.service';
import { SuperSpinnerComponent } from './super-spinner/super-spinner.component';

describe('ProgressService', () => {
  let service: ProgressService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => MockBuilder(ProgressService).mock(MatDialog));

  beforeEach(() => {
    const fixture = MockRender();
    service = fixture.point.injector.get(ProgressService);
    matDialogSpy = fixture.point.injector.get(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startSpinner', () => {
    it('should open dialog with indeterminate mode by default', () => {
      const mockDialogRef = { close: jasmine.createSpy('close') };
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);

      const result = service.startSpinner('Test Title');

      expect(matDialogSpy.open).toHaveBeenCalledWith(
        SuperSpinnerComponent,
        jasmine.objectContaining({
          height: '250px',
          width: '300px',
          disableClose: true,
          data: jasmine.objectContaining({
            title: 'Test Title',
            mode: 'indeterminate',
            progress$: jasmine.any(Object),
          }),
        })
      );
      expect(result).toBeDefined();
    });

    it('should open dialog with determinate mode when isTotalAvailable is true', () => {
      const mockDialogRef = { close: jasmine.createSpy('close') };
      const mockProgress$ = new BehaviorSubject(50);
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);

      const result = service.startSpinner('Test Title', mockProgress$, true);

      expect(matDialogSpy.open).toHaveBeenCalledWith(
        SuperSpinnerComponent,
        jasmine.objectContaining({
          height: '250px',
          width: '300px',
          disableClose: true,
          data: jasmine.objectContaining({
            title: 'Test Title',
            mode: 'determinate',
            progress$: mockProgress$,
          }),
        })
      );
      expect(result).toBeDefined();
    });
  });

  describe('showProgress', () => {
    it('should handle successful HTTP response', async () => {
      const mockDialogRef = { close: jasmine.createSpy('close') };
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);

      const httpEvent$ = new HttpResponse({ body: { test: 'data' } });

      const result = await service.showProgress(of(httpEvent$), 'Test Progress');

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(result).toEqual(httpEvent$);
    });

    it('should handle HTTP upload progress', async () => {
      const mockDialogRef = { close: jasmine.createSpy('close') };
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);

      const uploadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.UploadProgress,
        loaded: 50,
        total: 100,
      };

      const responseEvent = new HttpResponse({ body: { test: 'data' } });

      const result = await service.showProgress(of(uploadProgressEvent, responseEvent), 'Test Progress', true);

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(result).toEqual(responseEvent);
    });

    it('should handle HTTP download progress', async () => {
      const mockDialogRef = { close: jasmine.createSpy('close') };
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);

      const downloadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.DownloadProgress,
        loaded: 75,
        total: 100,
      };

      const responseEvent = new HttpResponse({ body: { test: 'data' } });

      const result = await service.showProgress(of(downloadProgressEvent, responseEvent), 'Test Progress', true);

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(result).toEqual(responseEvent);
    });

    it('should handle errors and close dialog', async () => {
      const mockDialogRef = { close: jasmine.createSpy('close') };
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);

      const error$ = throwError(() => new Error('Test error'));

      try {
        await service.showProgress(error$, 'Test Progress');
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should handle progress event without total', async () => {
      const mockDialogRef = { close: jasmine.createSpy('close') };
      matDialogSpy.open = jasmine.createSpy('open').and.returnValue(mockDialogRef);

      const uploadProgressEvent: HttpProgressEvent = {
        type: HttpEventType.UploadProgress,
        loaded: 50,
        total: undefined,
      };

      const responseEvent = new HttpResponse({ body: { test: 'data' } });

      const result = await service.showProgress(of(uploadProgressEvent, responseEvent), 'Test Progress');

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(result).toEqual(responseEvent);
    });
  });
});
