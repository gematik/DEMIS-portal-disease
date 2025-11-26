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

import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { environment } from '../environments/environment';
import { DemisCoding, NotificationType, QuestionnaireDescriptor } from './demis-types';
import { NGXLogger } from 'ngx-logger';
import { FileService } from './legacy/file.service';
import { DiseaseNotification, TerminologyVersion, ValidationError } from '../api/notification';
import { infoOutline } from './disease-form/common/formlyConfigs/formly-base';
import { MessageDialogService, SubmitDialogProps } from '@gematik/demis-portal-core-library';
import { map } from 'rxjs/operators';

const PREFFERED_LANGUAGES = [/de-DE/, /de.*/];

@Injectable({
  providedIn: 'root',
})
export class Ifsg61Service {
  private readonly httpClient = inject(HttpClient);
  private readonly logger = inject(NGXLogger);
  private readonly fileService = inject(FileService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly ngZone = inject(NgZone); // ensure we can force change detection

  // TODO würde eigentlich in core-lib reingehören, die gibt es aber nicht mehr
  getCodeValueSet(system: string): Observable<DemisCoding[]> {
    const systemEncoded: string = encodeURIComponent(system);
    const url = `${environment.pathToFuts}/ValueSet?system=${systemEncoded}`;
    return this.httpClient.get<DemisCoding[]>(url, {
      headers: environment.futsHeaders,
    });
  }

  getCodeSystemVersions(): Observable<TerminologyVersion[]> {
    const url = `${environment.pathToFuts}/CodeSystem`;
    return this.httpClient
      .get<string[]>(url, {
        headers: environment.futsHeaders,
      })
      .pipe(
        map((values: string[]) =>
          values
            .filter(item => item.includes('|'))
            .map(item => {
              const [system, version] = item.split('|');
              return { system, version };
            })
        )
      );
  }

  getDiseaseOptions(type: NotificationType): Observable<DemisCoding[]> {
    let url = type === NotificationType.NonNominalNotification7_3 ? environment.pathToNotificationCategories7_3 : environment.pathToNotificationCategories6_1;
    if (!environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION) {
      url = environment.pathToDisease;
    }
    return this.httpClient.get<DemisCoding[]>(url, { headers: environment.futsHeaders });
  }

  getQuestionnaire(questionnaireName: string, type: NotificationType): Observable<QuestionnaireDescriptor> {
    let basePath = type === NotificationType.NonNominalNotification7_3 ? environment.pathToDiseaseQuestionnaire7_3 : environment.pathToDiseaseQuestionnaire6_1;
    if (!environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION) {
      basePath = environment.pathToDiseaseQuestionnaire;
    }
    const url = `${basePath}/${questionnaireName}/formly`;

    return this.httpClient.get<QuestionnaireDescriptor>(url, { headers: environment.futsHeaders }).pipe(
      tap(questionnaire => {
        updateQuestionnaireConfigsI18n(questionnaire);
        setQuestionnaireFieldDefaults(questionnaire);
        addQuestionnaireInfoOutline(questionnaire);
      })
    );
  }

  submitNotification(notification: DiseaseNotification, notificationType: NotificationType) {
    this.messageDialogService.showSpinnerDialog({ message: 'Erkrankungsmeldung wird gesendet' });
    let fullUrl = this.getFullUrl(notificationType);

    this.httpClient
      .post(fullUrl, JSON.stringify(notification), {
        headers: environment.headers,
        observe: 'response',
      })
      .pipe(
        finalize(() => {
          this.ngZone.run(() => this.messageDialogService.closeSpinnerDialog());
        })
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ngZone.run(() => {
            const submitDialogData = this.createSubmitDialogData(response, notificationType, notification);
            this.messageDialogService.showSubmitDialog(submitDialogData);
          });
        },
        error: err => {
          this.ngZone.run(() => {
            this.logger.error('error', err);
            const errors = this.extractErrorDetails(err);
            this.messageDialogService.showErrorDialog({
              errorTitle: 'Meldung konnte nicht zugestellt werden!',
              errors,
            });
          });
        },
      });
  }

  private getFullUrl(notificationType: NotificationType): string {
    let fullUrl =
      notificationType === NotificationType.NonNominalNotification7_3 ? environment.pathToGatewayDiseaseNonNominal : environment.pathToGatewayDisease;
    if (!environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION) {
      fullUrl = environment.pathToGatewayDisease;
    }
    return fullUrl;
  }

  private createSubmitDialogData(response: HttpResponse<any>, notificationType: NotificationType, notification: DiseaseNotification): SubmitDialogProps {
    const content = encodeURIComponent(response.body.content);
    const href = 'data:application/actet-stream;base64,' + content;
    return {
      authorEmail: response.body.authorEmail,
      fileName: this.fileService.getFileNameByNotificationType(response.body?.notificationId, notificationType, notification),
      href: href,
      notificationId: response.body.notificationId,
      timestamp: response.body.timestamp,
    };
  }

  private extractErrorDetails(err: any): { text: string; queryString: string }[] {
    const response = err?.error ?? err;
    const errorMessage = this.messageDialogService.extractMessageFromError(response);
    const validationErrors = response?.validationErrors || [];
    if (validationErrors.length > 0) {
      return validationErrors.map((ve: ValidationError) => ({
        text: ve.message,
        queryString: ve.message || '',
      }));
    } else {
      return [
        {
          text: errorMessage,
          queryString: errorMessage || '',
        },
      ];
    }
  }
}

// The display of options can be overwritten by designations.
// This is needed to compensate for a bit of inconsistent usage of display/designations in current profiles
function updateOptions(options: DemisCoding[], preferredLanguages: RegExp[]) {
  options.forEach((option: DemisCoding) => {
    if (option.designations) {
      for (const preferredLanguage of preferredLanguages) {
        // first, try designations in given order
        const kv = option.designations.find(designation => preferredLanguage.test(designation.language));
        if (kv) {
          option.display = kv.value;
          break;
        }
      }
    }
    if (!option.display) {
      option.display = option.code;
    }
  });
}

function updateQuestionnaireConfigsI18n(questionnaire: QuestionnaireDescriptor): void {
  updateConfigsI18n(questionnaire.questionnaireConfigs, PREFFERED_LANGUAGES);
  updateConfigsI18n(questionnaire.conditionConfigs, PREFFERED_LANGUAGES);
  updateConfigsI18n(questionnaire.commonConfig, PREFFERED_LANGUAGES);
}

function addQuestionnaireInfoOutline(questionnaire: QuestionnaireDescriptor): void {
  questionnaire.conditionConfigs = [infoOutline].concat(questionnaire.conditionConfigs);
  questionnaire.commonConfig = [infoOutline].concat(questionnaire.commonConfig);
  questionnaire.questionnaireConfigs = [infoOutline].concat(questionnaire.questionnaireConfigs);
}

function updateConfigsI18n(configs: FormlyFieldConfig[], preferredLanguages: RegExp[]): void {
  function updateFieldConfig(fc: FormlyFieldConfig, preferredLanguages: RegExp[]) {
    if (fc.props?.options) {
      updateOptions(fc.props?.options as DemisCoding[], preferredLanguages);
    }
    if (fc.fieldGroup) {
      updateConfigsI18n(fc.fieldGroup, preferredLanguages);
    }
    if (fc.fieldArray) {
      updateFieldConfig(fc.fieldArray as FormlyFieldConfig, preferredLanguages);
    }
  }

  if (configs) {
    configs.forEach(fc => updateFieldConfig(fc, preferredLanguages));
  }
}

function setQuestionnaireFieldDefaults(questionnaire: QuestionnaireDescriptor) {
  setFieldDefaults(questionnaire.conditionConfigs);
  setFieldDefaults(questionnaire.commonConfig);
  setFieldDefaults(questionnaire.questionnaireConfigs);
}

function setFieldDefaults(configs: FormlyFieldConfig[]) {
  function recurse(fc: FormlyFieldConfig) {
    // Whenever the BE delivers, remove the next three lines of code
    // For the backend, providing Regexps seems more appropriate
    if (typeof fc.key === 'string' && fc.key.endsWith('valueDate')) {
      if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_DISEASE_DATEPICKER) {
        fc.wrappers = [];
        fc.props = {
          ...fc.props,
          appearance: 'fill', // TODO: Should not be necessary and be controlled by the form-field wrapper itself. Will be fixed with DEMIS-4007
          allowedPrecisions: fc.props?.['allowedPrecisions'] ? fc.props['allowedPrecisions'] : ['day', 'month', 'year'],
        };
        // TODO: Remove this workaround in DEMIS-4098
        if (fc.props['minDate']) {
          delete fc.props['minDate'];
        }
        if (fc.props['maxDate']) {
          delete fc.props['maxDate'];
        }
      } else {
        fc.modelOptions = {
          updateOn: 'blur',
        };
        fc.validators = { validation: ['date123'] };
      }
    }

    if (fc.type === 'input' && fc.defaultValue === undefined) {
      fc.defaultValue = '';
    }
    if (fc.type === 'textarea' && fc.defaultValue === undefined) {
      fc.defaultValue = '';
    }
    if (fc.type === 'repeat-section' && fc.defaultValue === undefined) {
      fc.defaultValue = [];
    }

    if (fc.fieldGroup) {
      setFieldDefaults(fc.fieldGroup);
    }
    if (fc.fieldArray) {
      recurse(fc.fieldArray as FormlyFieldConfig);
    }
  }

  if (configs) {
    configs.forEach(fc => recurse(fc));
  }
}
