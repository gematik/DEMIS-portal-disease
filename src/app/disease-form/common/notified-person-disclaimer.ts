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

export const NotifiedPersonDisclaimer = {
  DEFAULT_DISCLAIMER:
    'Grundsätzlich müssen Sie gemäß Infektionsschutzgesetz alle Ihnen vorliegenden Informationen im Meldeformular angeben, um die Meldepflicht zu erfüllen. Die Nachmeldung oder Korrektur von Angaben hat unverzüglich zu erfolgen.',
  FOLLOW_UP_DISCLAIMER:
    "Sie sind im Prozess des Absetzens einer Folgemeldung. Informationen zur betroffenen Person liegen dem zuständigen Gesundheitsamt bereits im Rahmen der getätigten Initialmeldung vor. Erneute Angaben zur betroffenen Person ermöglichen es dem Gesundheitsamt Plausibilitätschecks im Kontext des Zusammenführens der Meldungen durchzuführen. Bitte machen Sie daher, falls möglich, wiederholt Angaben zu 'Geschlecht' sowie 'Geburtsmonat/-jahr'",
} as const;
