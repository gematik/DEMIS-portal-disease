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

import { Injectable } from '@angular/core';
import { NotifiedPersonBasicInfo } from '../../api/notification';
import { transliterator } from './transliterator';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  abbreviation = '.pdf';

  constructor() {}

  /**
   * @returns current time as YYMMDDhhmmss
   */
  private getCurrentTime(): string {
    function pad2(n: number) {
      return n < 10 ? '0' + n : n;
    }

    const date = new Date();
    return (
      date.getFullYear().toString().slice(-2) +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes()) +
      pad2(date.getSeconds())
    );
  }

  /**
   *
   * @param birthDate i.e. 05.11.1998
   * @returns birthDate as " YYMMDD"
   */
  private isoDateToDigits(birthDate?: string): string {
    if (birthDate) {
      return ` ${birthDate.slice(2, 4)}${birthDate.slice(5, 7)}${birthDate.slice(8, 10)}`;
    }
    return '';
  }

  private transliterateNameFromUnicodeToAscii(name: string) {
    return transliterator(name);
  }

  public convertFileNameForPerson(person: NotifiedPersonBasicInfo) {
    return (
      this.getCurrentTime() +
      ' ' +
      this.transliterateNameFromUnicodeToAscii(person.lastname) +
      ', ' +
      this.transliterateNameFromUnicodeToAscii(person.firstname) +
      this.isoDateToDigits(person.birthDate) +
      this.abbreviation
    );
  }
}
