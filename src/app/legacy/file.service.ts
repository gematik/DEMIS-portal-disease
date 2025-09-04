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

import { Injectable } from '@angular/core';
import { NotifiedPersonBasicInfo } from '../../api/notification';
import { transliterator } from './transliterator';
import { NotificationType } from '../demis-types';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  abbreviation = '.pdf';

  constructor() {}

  public getFileNameByNotificationType(person: NotifiedPersonBasicInfo, notificationType: NotificationType, notificationId: string): string {
    if (notificationType === NotificationType.NonNominalNotification7_3) {
      return this.convertFileNameForNonNominal(notificationId);
    }
    return this.convertFileNameForPerson(person);
  }

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
   * @param birthDate in format "YYYY-MM-DD"
   * @returns birthDate as "YYMMDD"
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

  private convertFileNameForNonNominal(notificationId: string) {
    const time = this.getCurrentTime();
    return `${time}-${notificationId ?? ''}${this.abbreviation}`;
  }

  // TODO: This method uses little trick in the use with the person properties lastname and firstname.
  // Because of business logic requirements by pathogen in terms of follow up notifications the persons lastname and firstname
  // are made optional. In order to avoid tricking the compiler into correct behavior here, the data structures should be
  // distinguished in the future.
  private convertFileNameForPerson(person: NotifiedPersonBasicInfo) {
    return (
      this.getCurrentTime() +
      ' ' +
      this.transliterateNameFromUnicodeToAscii(`${person.lastname}`) +
      ', ' +
      this.transliterateNameFromUnicodeToAscii(`${person.firstname}`) +
      this.isoDateToDigits(person?.birthDate) +
      this.abbreviation
    );
  }
}
