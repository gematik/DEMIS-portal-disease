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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, retry, shareReplay } from 'rxjs/operators';
import { FormlyConstants } from './formly-constants';

export interface ValueSetOption {
  value: string | number;
  label: string;
}

export interface Designation {
  language: string;
  value: string;
}

export interface ValueSetResponse {
  code: string;
  display: string;
  designations: Designation[];
  system: string;
}

@Injectable({
  providedIn: 'root',
})
export class ValueSetService {
  private valueSetCache: Record<string, Observable<ValueSetOption[]>> = {};
  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {}

  get(identifier: string): Observable<ValueSetOption[]> {
    let cached = this.valueSetCache[identifier];
    if (!cached) {
      this.logger.log('ValueSetService :: loading value set ::', identifier);
      cached = this.valueSetCache[identifier] = this.getLocalValueSetRequest(this.getValueSetURL(identifier)).pipe(shareReplay(1), retry(3));
    }
    return cached;
  }

  private getValueSetURL(identifier: string): string {
    return identifier === FormlyConstants.COUNTRY_CODES
      ? '/fhir-ui-data-model-translation/utils/countryCodes'
      : `/fhir-ui-data-model-translation/ValueSet?system=${encodeURI(identifier)}`;
  }

  private getLocalValueSetRequest(url: string): Observable<ValueSetOption[]> {
    return this.http.get<ValueSetResponse[]>(url).pipe(
      map(res =>
        res.map(val => {
          const option: ValueSetOption = {
            value: val.code,
            label: val.display,
          };
          const translation = val.designations.find(des => des.language === 'de-DE');
          if (translation) {
            option.label = translation.value;
          }
          return option;
        })
      )
    );
  }
}
