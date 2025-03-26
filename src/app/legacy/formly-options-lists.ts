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
