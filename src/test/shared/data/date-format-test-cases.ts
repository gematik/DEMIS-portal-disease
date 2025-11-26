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

export interface DateFormatTestCase {
  disease: { code: string; display: RegExp };
  tabIndex: number;
  tabLabelForErrorMsg: string;
  fieldSelector: string;
  inputText: string;
  expectedDate: string;
  description: string;
}

export const SYMPTOMS_TAB_INDEX = 3;
export const CLINICAL_TAB_INDEX = 4;
export const MELDESTATBESTAND_TAB_INDEX = 2;

export const DATE_FORMAT_TEST_CASES: DateFormatTestCase[] = [
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: SYMPTOMS_TAB_INDEX,
    tabLabelForErrorMsg: 'Angaben zu Symptomen',
    fieldSelector: '.LinkId_recordedDate',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Symptoms - recordedDate full',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: SYMPTOMS_TAB_INDEX,
    tabLabelForErrorMsg: 'Angaben zu Symptomen',
    fieldSelector: '.LinkId_recordedDate',
    inputText: '022000',
    expectedDate: '02.20.00',
    description: 'HCV - Symptoms - recordedDate partial',
  },
  {
    disease: { code: 'vchd', display: /Cholera/i },
    tabIndex: SYMPTOMS_TAB_INDEX,
    tabLabelForErrorMsg: 'Angaben zu Symptomen',
    fieldSelector: '.LinkId_recordedDate',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'Cholera - Symptoms - recordedDate full',
  },
  {
    disease: { code: 'vchd', display: /Cholera/i },
    tabIndex: SYMPTOMS_TAB_INDEX,
    tabLabelForErrorMsg: 'Angaben zu Symptomen',
    fieldSelector: '.LinkId_recordedDate',
    inputText: '022000',
    expectedDate: '02.20.00',
    description: 'Cholera - Symptoms - recordedDate partial',
  },
  {
    disease: { code: 'vchd', display: /Cholera/i },
    tabIndex: SYMPTOMS_TAB_INDEX,
    tabLabelForErrorMsg: 'Angaben zu Symptomen',
    fieldSelector: '.LinkId_onset',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'Cholera - Symptoms - onset full',
  },
  {
    disease: { code: 'vchd', display: /Cholera/i },
    tabIndex: SYMPTOMS_TAB_INDEX,
    tabLabelForErrorMsg: 'Angaben zu Symptomen',
    fieldSelector: '.LinkId_onset',
    inputText: '022000',
    expectedDate: '02.20.00',
    description: 'Cholera - Symptoms - onset partial',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: CLINICAL_TAB_INDEX,
    tabLabelForErrorMsg: 'Klinische und epidemiologische Angaben',
    fieldSelector: '.hospitalizationStartDate',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Clinical - hospitalizationStartDate',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: CLINICAL_TAB_INDEX,
    tabLabelForErrorMsg: 'Klinische und epidemiologische Angaben',
    fieldSelector: '.hospitalizationEndDate',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Clinical - hospitalizationEndDate',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: CLINICAL_TAB_INDEX,
    tabLabelForErrorMsg: 'Klinische und epidemiologische Angaben',
    fieldSelector: '.LinkId_infectProtectFacilityBegin',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Clinical - infectProtectFacilityBegin',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: CLINICAL_TAB_INDEX,
    tabLabelForErrorMsg: 'Klinische und epidemiologische Angaben',
    fieldSelector: '.LinkId_infectProtectFacilityEnd',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Clinical - infectProtectFacilityEnd',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: CLINICAL_TAB_INDEX,
    tabLabelForErrorMsg: 'Klinische und epidemiologische Angaben',
    fieldSelector: '.LinkId_placeExposureBegin',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Clinical - placeExposureBegin',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: CLINICAL_TAB_INDEX,
    tabLabelForErrorMsg: 'Klinische und epidemiologische Angaben',
    fieldSelector: '.LinkId_placeExposureEnd',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Clinical - placeExposureEnd',
  },
  {
    disease: { code: 'hcvd', display: /Hepatitis C/i },
    tabIndex: CLINICAL_TAB_INDEX,
    tabLabelForErrorMsg: 'Klinische und epidemiologische Angaben',
    fieldSelector: '.LinkId_deathDate',
    inputText: '02022000',
    expectedDate: '02.02.2000',
    description: 'HCV - Clinical - deathDate',
  },
];
