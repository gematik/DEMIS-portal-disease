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

import { SelectCodingComponent } from './select-coding.component';
import { DemisCoding } from '../../../../demis-types';
import { Subject } from 'rxjs';

describe('SelectCodingComponent', () => {
  let underTest: SelectCodingComponent;
  let valueChanges$: Subject<DemisCoding>;
  let formControl: {
    value: DemisCoding | null | undefined | string;
    valueChanges: Subject<DemisCoding>;
    setValue: jasmine.Spy;
  };

  const codings: DemisCoding[] = [
    {
      code: 'NASK',
      display: 'not asked',
      system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
      breadcrumb: 'NullFlavor > not asked',
    },
    {
      code: '423590009',
      display: 'Endoscopic evidence of pseudomembranous colitis',
      system: 'http://snomed.info/sct',
      breadcrumb: 'SNOMED > pseudomembranous colitis',
    },
  ];

  const createComponent = ({
    defaultCode,
    value,
  }: {
    defaultCode?: string;
    value?: DemisCoding | null | undefined | string;
  } = {}) => {
    valueChanges$ = new Subject<DemisCoding>();
    formControl = {
      value,
      valueChanges: valueChanges$,
      setValue: jasmine.createSpy('setValue').and.callFake((newValue: DemisCoding) => {
        formControl.value = newValue;
      }),
    };

    underTest = Object.create(SelectCodingComponent.prototype) as SelectCodingComponent;
    (underTest as any).field = {
      formControl,
      props: {
        options: codings,
        defaultCode,
      },
    };
  };

  it('should create', () => {
    createComponent();
    underTest.ngOnInit();

    expect(underTest).withContext('component was not created').toBeTruthy();
    expect(underTest.codings).toEqual(codings);
  });

  it('applies default code when form control is empty', () => {
    createComponent({ defaultCode: 'NASK', value: undefined });
    underTest.ngOnInit();

    expect(formControl.setValue).toHaveBeenCalledWith(codings[0]);
    expect(formControl.value).toBe(codings[0]);
    expect(underTest.currentSelectionBreadcrumb).toBe('NullFlavor > not asked');
  });

  it('does not overwrite an imported model value with the default code', () => {
    const importedValue = {
      code: '423590009',
      display: 'Endoscopic evidence of pseudomembranous colitis',
      system: 'http://snomed.info/sct',
      breadcrumb: 'SNOMED > pseudomembranous colitis',
    };

    createComponent({ defaultCode: 'NASK', value: importedValue });
    underTest.ngOnInit();

    expect(formControl.setValue).not.toHaveBeenCalled();
    expect(formControl.value).toBe(importedValue);
  });

  it('normalizes external coding objects to the internal option reference', () => {
    createComponent();
    underTest.ngOnInit();

    const externalValue = {
      ...codings[1],
    };

    valueChanges$.next(externalValue);

    expect(formControl.setValue).toHaveBeenCalledWith(codings[1]);
    expect(formControl.value).toBe(codings[1]);
    expect(underTest.currentSelectionBreadcrumb).toBe('SNOMED > pseudomembranous colitis');
  });

  it('clears breadcrumb when value is not part of available options', () => {
    createComponent();
    underTest.ngOnInit();

    valueChanges$.next({ ...codings[1] });
    expect(underTest.currentSelectionBreadcrumb).toBe('SNOMED > pseudomembranous colitis');

    valueChanges$.next({ code: 'UNKNOWN' } as DemisCoding);

    expect(underTest.currentSelectionBreadcrumb).toBeUndefined();
  });

  it('unsubscribes from valueChanges on destroy', () => {
    createComponent();
    underTest.ngOnInit();

    const unsubscribeSpy = spyOn((underTest as any).changesSubscription, 'unsubscribe').and.callThrough();

    underTest.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
