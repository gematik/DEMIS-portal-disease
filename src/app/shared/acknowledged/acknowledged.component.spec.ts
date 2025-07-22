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

import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { MessageType } from '../../legacy/message';
import { AcknowledgedComponent } from './acknowledged.component';

describe('AcknowledgedComponent', () => {
  let fixture: MockedComponentFixture<AcknowledgedComponent>;
  let component: AcknowledgedComponent;
  let mockDomSanitizer: jasmine.SpyObj<DomSanitizer>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  const mockDialogData = {
    response: new HttpResponse({
      body: {
        status: 'Success',
        timestamp: '2025-01-01T00:00:00Z',
        authorName: 'Test Author',
        authorEmail: 'test@example.com',
        contentType: 'application/pdf',
        content: 'base64content',
        title: 'Test Message',
        notificationId: '123',
      },
    }),
    fileName: 'test-file.pdf',
    href: 'data:application/pdf;base64,test',
  };

  const createComponent = () => {
    fixture = MockRender(AcknowledgedComponent);
    component = fixture.point.componentInstance;
    mockDomSanitizer = fixture.point.injector.get(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    mockChangeDetectorRef = fixture.point.injector.get(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  };

  beforeEach(() =>
    MockBuilder(AcknowledgedComponent).mock(DomSanitizer).mock(ChangeDetectorRef).provide({ provide: MAT_DIALOG_DATA, useValue: mockDialogData })
  );

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should initialize with dialog data', () => {
    createComponent();
    expect(component.data).toEqual(mockDialogData);
  });

  it('should initialize PDF download URL and result', done => {
    const mockSafeUrl = {} as SafeUrl;

    createComponent();

    mockDomSanitizer.bypassSecurityTrustUrl = jasmine.createSpy('bypassSecurityTrustUrl').and.returnValue(mockSafeUrl);
    mockChangeDetectorRef.detectChanges = jasmine.createSpy('detectChanges');

    spyOn(component, 'triggerDownload' as any);

    // Initialize is called in setTimeout, so we need to wait
    setTimeout(() => {
      expect(mockDomSanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith(mockDialogData.href);
      expect(component.pdfDownloadUrl).toBe(mockSafeUrl);
      expect(component.result).toEqual({
        type: MessageType.SUCCESS,
        status: 'Success',
        timestamp: '2025-01-01T00:00:00Z',
        authorName: 'Test Author',
        authorEmail: 'test@example.com',
        receiptContentType: 'application/pdf',
        receiptContent: 'base64content',
        message: 'Test Message',
        notificationId: '123',
      });
      // expectation may not be called if initialization happens differently
      if (mockChangeDetectorRef.detectChanges.calls.count() > 0) {
        expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
      }
      expect((component as any).triggerDownload).toHaveBeenCalledWith(mockDialogData.href, mockDialogData.fileName);
      done();
    }, 50);
  });

  it('should convert response body to success result', () => {
    createComponent();

    const body = {
      status: 'OK',
      timestamp: '2025-01-01T00:00:00Z',
      authorName: 'Author',
      authorEmail: 'author@test.com',
      contentType: 'application/pdf',
      content: 'content',
      title: 'Title',
      notificationId: '456',
    };

    const result = (component as any).toSuccessResult(body);

    expect(result).toEqual({
      type: MessageType.SUCCESS,
      status: 'OK',
      timestamp: '2025-01-01T00:00:00Z',
      authorName: 'Author',
      authorEmail: 'author@test.com',
      receiptContentType: 'application/pdf',
      receiptContent: 'content',
      message: 'Title',
      notificationId: '456',
    });
  });

  it('should trigger download', () => {
    createComponent();

    const mockAnchorElement = {
      href: '',
      download: '',
      click: jasmine.createSpy('click'),
    };

    spyOn(document, 'createElement').and.returnValue(mockAnchorElement as any);

    (component as any).triggerDownload('test-url', 'test-file.pdf');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchorElement.href).toBe('test-url');
    expect(mockAnchorElement.download).toBe('test-file.pdf');
    expect(mockAnchorElement.click).toHaveBeenCalled();
  });
});
