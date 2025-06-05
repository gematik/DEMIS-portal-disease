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

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabHeader, MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { AppComponent } from './app.component';
import { DiseaseFormComponent } from './disease-form/disease-form.component';
import { NotificationFormValidationModule } from './legacy/notification-form-validation-module';
import { RepeatComponent } from './legacy/repeat/repeat.component';
import { ValidationWrapperComponent } from './legacy/validation-wrapper/validation-wrapper.component';
import { AutocompleteCodingComponent } from './shared/formly/components/autocomplete-coding/autocomplete-coding.component';
import { RadioButtonCodingComponent } from './shared/formly/components/radio-button-coding/radio-button-coding.component';
import { RepeatSectionComponent } from './shared/formly/components/repeat-section/repeat-section.component';
import { SelectCodingComponent } from './shared/formly/components/select-coding/select-coding.component';
import { TabsNavigationComponent } from './shared/formly/components/tabs-navigation/tabs-navigation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoggerModule } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth.interceptor';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { IconLoaderService } from './legacy/icon-loader.service';
import { registerValueSetExtension } from './legacy/value-set.extension';
import { ValueSetService } from './legacy/value-set.service';
import { HexhexbuttonComponent } from './shared/components/hexhexbutton/hexhexbutton.component';
import { PasteBoxComponent as DeprecatedPasteBoxComponent } from './shared/components/paste-box/paste-box.component';
import { AddBreadcrumbDirective } from './shared/formly/components/autocomplete-coding/add-breadcrumb.directive';
import { Date123Validator, Date1Validator, Date2Validator, Date3Validator } from './shared/formly/validators/validators';
import { ExpansionPanelWrapperComponent } from './shared/formly/wrappers/expansion-panel-wrapper/expansion-panel.wrapper';
import { PanelWrapperComponent } from './shared/formly/wrappers/panel-wrapper/panel-wrapper.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutocompleteMultiCodingComponent } from './shared/formly/components/autocomplete-multi-coding/autocomplete-multi-coding.component';
import { AutocompleteComponent } from './shared/components/autocomplete/autocomplete.component';
import { environment } from '../environments/environment';
import { FormlyRepeaterComponent, MaxHeightContentContainerComponent, PasteBoxComponent } from '@gematik/demis-portal-core-library';
import { defaultAppearanceExtension, defaultPlaceholderExtension } from './shared/formly-extensions';
import { CheckLabelLengthDirective } from './shared/directives/check-label-length.directive';

export function initIconLoaderService(iconLoaderService: IconLoaderService) {
  return (): Promise<void> => {
    return iconLoaderService.init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    RepeatSectionComponent,
    AutocompleteComponent,
    AutocompleteCodingComponent,
    AutocompleteMultiCodingComponent,
    TabsNavigationComponent,
    DiseaseFormComponent,
    SelectCodingComponent,
    RadioButtonCodingComponent,
    ValidationWrapperComponent,
    RepeatComponent,
    EmptyRouteComponent,
    PanelWrapperComponent,
    DeprecatedPasteBoxComponent,
    HexhexbuttonComponent,
    ExpansionPanelWrapperComponent,
    AddBreadcrumbDirective,
    CheckLabelLengthDirective,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LoggerModule.forRoot(environment.ngxLoggerConfig),
    MatInputModule,
    NotificationFormValidationModule,
    FormlyModule.forRoot({
      types: [
        { name: 'repeater', component: FormlyRepeaterComponent },
        { name: 'repeat', component: RepeatComponent },
        { name: 'repeat-section', component: RepeatSectionComponent },
        {
          name: 'autocomplete-coding',
          component: AutocompleteCodingComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'autocomplete-multi-coding',
          component: AutocompleteMultiCodingComponent,
          wrappers: ['form-field'],
        },
        { name: 'tabs-navigation', component: TabsNavigationComponent },
        { name: 'drop-down-coding', component: SelectCodingComponent },
        { name: 'radio-button-coding', component: RadioButtonCodingComponent },
      ],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
        { name: 'expansion-panel', component: ExpansionPanelWrapperComponent },
      ],
      validators: [
        { name: 'date123', validation: Date123Validator },
        { name: 'date1', validation: Date1Validator },
        { name: 'date2', validation: Date2Validator },
        { name: 'date3', validation: Date3Validator },
      ],
      validationMessages: [
        { name: 'date1', message: 'Bitte geben Sie nur das Jahr an (JJJJ)' },
        {
          name: 'date2',
          message: 'Bitte geben Sie Monat und Jahr an (MM.JJJJ)',
        },
        {
          name: 'date3',
          message: 'Bitte geben Sie Tag, Monat und Jahr an (TT.MM.JJJJ)',
        },
        { name: 'date123', message: 'TT.MM.JJJJ  oder MM.JJJJ oder JJJJ' },
      ],
      extensions: [
        {
          name: 'default-placeholder',
          extension: defaultPlaceholderExtension,
        },
        {
          name: 'default-appearance',
          extension: defaultAppearanceExtension,
        },
      ],
    }),
    ReactiveFormsModule,
    FormlyMaterialModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    FormlyMatDatepickerModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatRadioModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTabHeader,
    PasteBoxComponent,
    MaxHeightContentContainerComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initIconLoaderService,
      deps: [IconLoaderService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE',
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerValueSetExtension,
      deps: [ValueSetService],
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
