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

import { MockBuilder, MockRender } from 'ng-mocks';
import { beforeEach, describe, expect, it } from 'vitest';
import { PanelWrapperComponent } from './panel-wrapper.component';

describe('PanelWrapperComponent', () => {
  beforeEach(() => MockBuilder(PanelWrapperComponent));

  it('renders the panel label and indentation for a regular field', () => {
    const fixture = MockRender(PanelWrapperComponent, {}, { detectChanges: false });
    fixture.point.componentInstance.field = {
      id: 'test-panel',
      props: { label: 'Aufenthalt' },
      fieldGroup: [],
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').textContent).toContain('Aufenthalt');
    expect(fixture.nativeElement.querySelector('.card').classList.contains('demis-indent-group')).toBe(true);
  });
});
