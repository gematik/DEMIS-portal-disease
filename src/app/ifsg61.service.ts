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
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { environment } from '../environments/environment';
import { DemisCoding, QuestionnaireDescriptor } from './demis-types';
import { ProgressService } from './shared/progress.service';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { FileService } from './legacy/file.service';
import { AcknowledgedComponent } from './shared/acknowledged/acknowledged.component';
import { RejectedComponent } from './shared/rejected/rejected.component';
import { HelpersService } from './shared/helpers.service';
import { DiseaseNotification, ValidationError } from '../api/notification';
import { MessageType } from './legacy/message';
import { infoOutline } from './disease-form/common/formlyConfigs/formly-base';

const PREFFERED_LANGUAGES = [/de-DE/, /de.*/];

@Injectable({
  providedIn: 'root',
})
export class Ifsg61Service {
  constructor(
    private httpClient: HttpClient,
    private progressService: ProgressService,
    private logger: NGXLogger,
    private fileService: FileService,
    private matDialog: MatDialog,
    private helper: HelpersService
  ) {}

  // TODO würde eigentlich in core-lib reingehören, die gibt es aber nicht mehr
  getCodeValueSet(system: string): Observable<DemisCoding[]> {
    const systemEncoded: string = encodeURIComponent(system);
    const url = `${environment.pathToFuts}/ValueSet?system=${systemEncoded}`;
    return this.httpClient.get<DemisCoding[]>(url, {
      headers: environment.headers,
    });
  }

  getDiseaseOptions(): Observable<DemisCoding[]> {
    const url = `${environment.pathToDisease}`;

    return this.httpClient.get<DemisCoding[]>(url, { headers: environment.headers });
  }

  getQuestionnaire(questionnaireName: string): Observable<QuestionnaireDescriptor> {
    const url = `${environment.pathToDiseaseQuestionnaire}/${questionnaireName}/formly`;

    return this.httpClient.get<QuestionnaireDescriptor>(url, { headers: environment.headers }).pipe(
      tap(questionnaire => {
        updateQuestionnaireConfigsI18n(questionnaire);
        setQuestionnaireFieldDefaults(questionnaire);
        addQuestionnaireInfoOutline(questionnaire);
      })
    );
  }

  sendNotification(ifgs61Message: DiseaseNotification) {
    const post$ = this.postMessage(ifgs61Message);
    this.progressService.showProgress(post$, 'Erkrankungsmeldung wird gesendet').then(
      (response: HttpResponse<any>) => {
        const content = encodeURIComponent(response.body.content);
        const href = 'data:application/actet-stream;base64,' + content;

        if (response.body.status === 'All OK') {
          const data = {
            response,
            fileName: this.fileService.convertFileNameForPerson(ifgs61Message.notifiedPerson.info),
            href,
          };
          const dialogRef = this.matDialog.open(AcknowledgedComponent, { height: '450px', width: '700px', data });
          lastValueFrom(dialogRef.afterClosed()).then(
            _ => this.helper.exitApplication(),
            _ => this.helper.exitApplication()
          );
        } else {
          const data = { response };
          this.matDialog.open(RejectedComponent, { height: '500px', width: '600px', data });
        }
      },
      err => {
        this.logger.error('error', err);
        const data = {
          ...err.error,
          ...{
            type: MessageType.ERROR,
            message: 'Es ist ein Fehler aufgetreten.',
            messageDetails: err.error?.message,
            locations: [],
            problems: (err.error.validationErrors || []).map((ve: ValidationError) => ({
              code: ve.field,
              message: ve.message,
            })),
          },
        };
        this.matDialog.open(RejectedComponent, { height: '400px', width: '600px', data });
      }
    );
  }

  postMessage(ifgs61Message: DiseaseNotification): Observable<HttpEvent<Object>> {
    const fullUrl = `${environment.pathToGatewayDisease}`;
    return this.httpClient.post(fullUrl, JSON.stringify(ifgs61Message), {
      headers: environment.headers,
      reportProgress: true,
      observe: 'events',
    });
  }
}

// The display of options can be overwritten by designations.
// This is needed to compensate for a bit inconsistent usage of display/designations in current profiles
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
      fc.validators = { validation: ['date123'] };
      fc.modelOptions = {
        updateOn: 'blur',
      };
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
