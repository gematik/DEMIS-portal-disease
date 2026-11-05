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

import { HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { MockBuilder, MockRender } from 'ng-mocks';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockNext: Mock;

  beforeEach(() => MockBuilder(AuthInterceptor));

  beforeEach(() => {
    const fixture = MockRender();
    interceptor = fixture.point.injector.get(AuthInterceptor);
    mockNext = vi.fn().mockReturnValue(of({}));
  });

  afterEach(() => {
    // Clean up window.token after each test
    delete (window as any)['token'];
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when token exists', () => {
    const testToken = 'test-token-123';
    const testUrl = '/api/test';

    // Set token in window
    (window as any)['token'] = testToken;

    // Create a mock request
    const req = new HttpRequest('GET', testUrl);

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was cloned with Authorization header
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          has: expect.any(Function),
        }),
      })
    );

    // Get the cloned request from the spy call
    const clonedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(clonedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });

  it('should not add Authorization header when token is undefined', () => {
    const testUrl = '/api/test';

    // Ensure no token is set
    delete (window as any)['token'];

    // Create a mock request
    const req = new HttpRequest('GET', testUrl);

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was passed through unchanged
    expect(mockNext).toHaveBeenCalledWith(req);

    // Get the request from the spy call
    const passedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(passedRequest.headers.get('Authorization')).toBeNull();
  });

  it('should not add Authorization header when token is null', () => {
    const testUrl = '/api/test';

    // Set token to null
    (window as any)['token'] = null;

    // Create a mock request
    const req = new HttpRequest('GET', testUrl);

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was passed through unchanged
    expect(mockNext).toHaveBeenCalledWith(req);

    // Get the request from the spy call
    const passedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(passedRequest.headers.get('Authorization')).toBeNull();
  });

  it('should not add Authorization header when token is empty string', () => {
    const testUrl = '/api/test';

    // Set token to empty string
    (window as any)['token'] = '';

    // Create a mock request
    const req = new HttpRequest('GET', testUrl);

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was passed through unchanged
    expect(mockNext).toHaveBeenCalledWith(req);

    // Get the request from the spy call
    const passedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(passedRequest.headers.get('Authorization')).toBeNull();
  });

  it('should preserve existing headers when adding Authorization header', () => {
    const testToken = 'test-token-123';
    const testUrl = '/api/test';
    const customHeaderValue = 'custom-value';

    // Set token in window
    (window as any)['token'] = testToken;

    // Create a mock request with custom header
    const req = new HttpRequest('GET', testUrl, null, {
      headers: new HttpHeaders({
        'Custom-Header': customHeaderValue,
      }),
    });

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was cloned with both headers
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          has: expect.any(Function),
        }),
      })
    );

    // Get the cloned request from the spy call
    const clonedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(clonedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(clonedRequest.headers.get('Custom-Header')).toBe(customHeaderValue);
  });

  it('should work with POST requests', () => {
    const testToken = 'test-token-123';
    const testUrl = '/api/test';
    const testData = { key: 'value' };

    // Set token in window
    (window as any)['token'] = testToken;

    // Create a mock POST request
    const req = new HttpRequest('POST', testUrl, testData);

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was cloned with Authorization header
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          has: expect.any(Function),
        }),
      })
    );

    // Get the cloned request from the spy call
    const clonedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(clonedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(clonedRequest.body).toEqual(testData);
  });

  it('should work with PUT requests', () => {
    const testToken = 'test-token-123';
    const testUrl = '/api/test';
    const testData = { key: 'value' };

    // Set token in window
    (window as any)['token'] = testToken;

    // Create a mock PUT request
    const req = new HttpRequest('PUT', testUrl, testData);

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was cloned with Authorization header
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          has: expect.any(Function),
        }),
      })
    );

    // Get the cloned request from the spy call
    const clonedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(clonedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(clonedRequest.body).toEqual(testData);
  });

  it('should work with DELETE requests', () => {
    const testToken = 'test-token-123';
    const testUrl = '/api/test';

    // Set token in window
    (window as any)['token'] = testToken;

    // Create a mock DELETE request
    const req = new HttpRequest('DELETE', testUrl);

    // Call the interceptor
    interceptor.intercept(req, { handle: mockNext } as HttpHandler);

    // Verify that the request was cloned with Authorization header
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          has: expect.any(Function),
        }),
      })
    );

    // Get the cloned request from the spy call
    const clonedRequest = vi.mocked(mockNext).mock.calls[0][0];
    expect(clonedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });
});
