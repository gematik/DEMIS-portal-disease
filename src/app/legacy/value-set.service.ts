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

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, retry, shareReplay } from 'rxjs/operators';
import { FormlyConstants } from './formly-constants';
import { environment } from '../../environments/environment';

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
  private http = inject(HttpClient);
  private logger = inject(NGXLogger);

  private valueSetCache: Record<string, Observable<ValueSetOption[]>> = {};

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
      ? `${environment.pathToFuts}/utils/countryCodes`
      : `${environment.pathToFuts}/ValueSet?system=${encodeURI(identifier)}`;
  }

  private getLocalValueSetRequest(url: string): Observable<ValueSetOption[]> {
    return this.http.get<ValueSetResponse[]>(url, { headers: environment.futsHeaders }).pipe(
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
