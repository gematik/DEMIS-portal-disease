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

import { ConfigOption } from '@ngx-formly/core';
import { defaultAppearanceExtension, defaultPlaceholderExtension } from '../formly-extensions';
import { AutocompleteCodingComponent } from './components/autocomplete-coding/autocomplete-coding.component';
import { AutocompleteMultiCodingComponent } from './components/autocomplete-multi-coding/autocomplete-multi-coding.component';
import { RadioButtonCodingComponent } from './components/radio-button-coding/radio-button-coding.component';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { SelectCodingComponent } from './components/select-coding/select-coding.component';
import { TabsNavigationComponent } from './components/tabs-navigation/tabs-navigation.component';
import { ExpansionPanelWrapperComponent } from './wrappers/expansion-panel-wrapper/expansion-panel.wrapper';
import { FormFieldWithTooltipWrapperComponent } from './wrappers/form-field-with-tooltip-wrapper/form-field-with-tooltip-wrapper.component';
import { PanelWrapperComponent } from './wrappers/panel-wrapper/panel-wrapper.component';

/**
 * Shared Formly config (types/wrappers/extensions/validation messages)
 * used by the application bootstrap (main.single-spa.ts) AND by integration tests.
 *
 * Keeping this in one place ensures the standalone DiseaseFormComponent has
 * its custom Formly types (e.g. `tabs-navigation`, `repeat-section`,
 * autocompletes, wrappers) registered identically in production and tests.
 */
export const APP_FORMLY_CONFIG: ConfigOption = {
  types: [
    { name: 'repeat-section', component: RepeatSectionComponent },
    { name: 'autocomplete-coding', component: AutocompleteCodingComponent, wrappers: ['form-field'] },
    { name: 'autocomplete-multi-coding', component: AutocompleteMultiCodingComponent, wrappers: ['form-field'] },
    { name: 'tabs-navigation', component: TabsNavigationComponent },
    { name: 'drop-down-coding', component: SelectCodingComponent },
    { name: 'radio-button-coding', component: RadioButtonCodingComponent },
  ],
  wrappers: [
    { name: 'panel', component: PanelWrapperComponent },
    { name: 'expansion-panel', component: ExpansionPanelWrapperComponent },
    { name: 'form-field-with-tooltip', component: FormFieldWithTooltipWrapperComponent },
  ],
  validators: [],
  validationMessages: [],
  extensions: [
    { name: 'default-placeholder', extension: defaultPlaceholderExtension },
    { name: 'default-appearance', extension: defaultAppearanceExtension },
  ],
};
