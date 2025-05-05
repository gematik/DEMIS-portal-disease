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

import { ErrorMessage as ErrorMessageFromCore } from '@gematik/demis-portal-core-library';

const MESSAGES: Record<string, string> = {
  E0000: 'Unbekannter valueType bei Datenübernahme: {0} (import key: {1})',
  E0001: 'Falsche Syntax nahe: {0}',
  E0002: 'Ungültiger Parametername: {0}',
  E0003: 'Systemfehler bei der Datenübernahme ({0} -> {1}). Bitte kontaktieren Sie den Support.',
  E0004: 'Systemfehler bei der Datenübernahme ({0}). Ist das auszufüllende Feld wirklich sichtbar? Bitte kontaktieren Sie den Support.',
  E0005: 'Systemfehler beim Laden des Fragebogens ({0}). Bitte kontaktieren Sie den Support.',
  E0006: 'Systemfehler bei der Datenübernahme ({0}). Bitte kontaktieren Sie den Support.',
  E0007: 'Fehler bei der Datenübernahme. Ungültiger code "{0}" für "{1}".',
  E0008: 'Systemfehler bei der Datenübernahme ({0}). Bitte kontaktieren Sie den Support.',
  E9000: 'componentType ist kein string: {0}. Bitte kontaktieren Sie den Support.',
  E9001: 'componentType ist nicht definiert: {0}. Bitte kontaktieren Sie den Support.',
  E9002: 'componentType ist nicht bekannt: {0}. Bitte kontaktieren Sie den Support.',
};

export class ErrorMessage {
  readonly message: string;

  constructor(
    readonly code: string,
    ...args: string[]
  ) {
    if (MESSAGES[code]) {
      this.message = MESSAGES[code].replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    } else {
      this.message = 'Systemfehler. Bitte kontaktieren Sie den Support unter ...';
    }
  }

  toErrorMessageFromCoreLibrary(): ErrorMessageFromCore {
    return {
      text: this.message,
    };
  }
}
