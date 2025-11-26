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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import GenderEnum = NotifiedPersonBasicInfo.GenderEnum;

import { AddressType, NotifiedPersonBasicInfo } from '../../api/notification';

export const RESIDENCE_ADDRESS_TYPE_OPTION_LIST = [
  { value: AddressType.Primary, label: 'Hauptwohnung' },
  { value: AddressType.Ordinary, label: 'Gewöhnlicher Aufenthaltsort' },
];

export const CURRENT_ADDRESS_TYPE_OPTION_LIST = [
  { value: AddressType.PrimaryAsCurrent, label: 'Wohnsitz' },
  { value: AddressType.SubmittingFacility, label: 'Adresse der meldenden Einrichtung' },
  { value: AddressType.Current, label: 'anderer Wohnsitz' },
  { value: AddressType.OtherFacility, label: 'andere Einrichtung / Unterkunft' },
];

export const GENDER_OPTION_LIST = [
  { value: GenderEnum.Male, label: 'Männlich' },
  { value: GenderEnum.Female, label: 'Weiblich' },
  { value: GenderEnum.Other, label: 'Divers' },
  { value: GenderEnum.Unknown, label: 'Keine Angabe' },
];
