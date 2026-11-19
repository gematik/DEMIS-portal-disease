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

import { HttpErrorResponse } from '@angular/common/http';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NGXLogger } from 'ngx-logger';
import { catchError, distinctUntilChanged, EMPTY, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { CodeDisplay } from '../../api/notification';
import { NotificationType, QuestionnaireDescriptor } from '../demis-types';
import { ErrorMessage } from '../shared/error-message';
import { Ifsg61Service } from '../ifsg61.service';
import { FieldMirroringService } from './field-mirroring.service';

/** Steps whose field configuration and availability depend on the selected disease. */
export const QUESTIONNAIRE_STEP_KEYS = ['condition', 'commonQuestionnaire', 'specificQuestionnaire'] as const;

type QuestionnaireStepKey = (typeof QUESTIONNAIRE_STEP_KEYS)[number];

/**
 * Form and callback contract supplied by the notification service that owns the form and model.
 *
 * @remarks
 * - `form` is the root form containing the disease-dependent step groups.
 * - `setStepFieldsFn(stepKey, fields)` The function used to set the Formly fields for a specific dependent step.
 * - `resetQuestionnaireModelsFn()` The function used to reset model values for all the dependent steps.
 */
export interface DiseaseQuestionnaireFormContext {
  readonly form: FormGroup;
  setStepFieldsFn(stepKey: QuestionnaireStepKey, fields: FormlyFieldConfig[]): void;
  resetQuestionnaireModelsFn(): void;
}

/**
 * Manages disease selection, questionnaire loading, and availability of dependent steps.
 *
 * The notification service continues to own the root form, model, and field construction. This
 * service receives the form and the operations it needs to replace dependent fields and reset their
 * model values through `DiseaseQuestionnaireFormContext`.
 * Provide it in the notification component so its subscriptions end with that component.
 */
@Injectable()
export class DiseaseQuestionnaireService {
  private readonly ifsg61Service = inject(Ifsg61Service);
  private readonly fieldMirroringService = inject(FieldMirroringService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly logger = inject(NGXLogger);
  private readonly destroyRef = inject(DestroyRef);

  /** Disease code whose questionnaire has been installed into the dependent steps. */
  readonly loadedDiseaseCode = signal<string | undefined>(undefined);

  private readonly selectedDiseaseCode = signal<string | undefined>(undefined);

  /** True only when the installed questionnaire matches the latest disease selection. */
  readonly questionnaireStepsEnabled = computed(() => !!this.loadedDiseaseCode() && this.loadedDiseaseCode() === this.selectedDiseaseCode());

  /**
   * Observes the selected disease and connects selection changes to the questionnaire request.
   * `switchMap` cancels an obsolete request; `formContext` provides the form operations needed to
   * install or reset dependent steps without transferring ownership of the form or model.
   *
   * @param diseaseControl Control containing the selected disease coding.
   * @param notificationType Variant used to retrieve and shape the questionnaire.
   * @param formContext Root form and callbacks supplied by the notification service.
   */
  observeDiseaseSelection(
    diseaseControl: AbstractControl<CodeDisplay | null>,
    notificationType: NotificationType,
    formContext: DiseaseQuestionnaireFormContext
  ): void {
    diseaseControl.valueChanges
      .pipe(
        startWith(diseaseControl.value),
        map(value => value?.code || undefined),
        distinctUntilChanged(),
        tap(code => {
          this.selectedDiseaseCode.set(code);
          this.updateStepAvailability(formContext.form);
        }),
        switchMap(code => (code && code !== this.loadedDiseaseCode() ? this.loadQuestionnaire(code, notificationType, formContext) : EMPTY)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ code, descriptor }) => this.applyQuestionnaire(code, descriptor, notificationType, formContext));
  }

  private loadQuestionnaire(
    code: string,
    notificationType: NotificationType,
    formContext: DiseaseQuestionnaireFormContext
  ): Observable<{ code: string; descriptor: QuestionnaireDescriptor }> {
    return this.ifsg61Service.getQuestionnaire(code, notificationType).pipe(
      map(descriptor => ({ code, descriptor })),
      catchError(reason => {
        this.logger.error(reason);
        this.resetQuestionnaireSteps(formContext);
        const error = new ErrorMessage('E0005', reason instanceof HttpErrorResponse ? reason.message : String(reason));
        this.messageDialogService.showErrorDialog({ errorTitle: 'Systemfehler', errors: [error.toErrorMessageFromCoreLibrary()] });
        return EMPTY;
      })
    );
  }

  /** Rebuilds the dependent steps from a descriptor and records which disease they now represent. */
  private applyQuestionnaire(
    code: string,
    descriptor: QuestionnaireDescriptor,
    notificationType: NotificationType,
    formContext: DiseaseQuestionnaireFormContext
  ): void {
    const isFollowUp = notificationType === NotificationType.FollowUpNotification6_1 || notificationType === NotificationType.FollowUpNotification7_3;
    const hasCommonQuestionnaire =
      notificationType === NotificationType.NominalNotification6_1 || notificationType === NotificationType.FollowUpNotification6_1;
    const commonFields = hasCommonQuestionnaire ? descriptor.commonConfig : [];

    if (commonFields.length > 0) {
      this.fieldMirroringService.attachHospitalizationMirrors(commonFields, formContext.form, isFollowUp);
    } else {
      this.fieldMirroringService.discardHospitalizationMirrors();
    }
    formContext.resetQuestionnaireModelsFn();
    formContext.setStepFieldsFn('condition', descriptor.conditionConfigs || []);
    // Clear the common step even when it is omitted from navigation for this notification type.
    formContext.setStepFieldsFn('commonQuestionnaire', commonFields);
    // index 0 is the info outline, which is always prepended by Ifsg61Service
    formContext.setStepFieldsFn('specificQuestionnaire', descriptor.questionnaireConfigs[1] ? descriptor.questionnaireConfigs : NO_SPECIFIC_QUESTIONNAIRE);
    this.loadedDiseaseCode.set(code);
    this.updateStepAvailability(formContext.form);
    if (isFollowUp) {
      formContext.form.markAllAsTouched();
    }
  }

  /** Clears questionnaire state and mirror subscriptions, then leaves every dependent step disabled. */
  private resetQuestionnaireSteps(formContext: DiseaseQuestionnaireFormContext): void {
    this.loadedDiseaseCode.set(undefined);
    this.fieldMirroringService.discardHospitalizationMirrors();
    formContext.resetQuestionnaireModelsFn();
    QUESTIONNAIRE_STEP_KEYS.forEach(stepKey => formContext.setStepFieldsFn(stepKey, []));
    this.updateStepAvailability(formContext.form);
  }

  /** Enables dependent form groups only while their installed questionnaire matches the selection. */
  private updateStepAvailability(form: FormGroup): void {
    const enabled = this.questionnaireStepsEnabled();
    QUESTIONNAIRE_STEP_KEYS.forEach(stepKey => {
      const group = form.controls[stepKey] as FormGroup;
      if (enabled) {
        group.enable();
      } else {
        group.disable();
      }
    });
  }
}

const NO_SPECIFIC_QUESTIONNAIRE: FormlyFieldConfig[] = [{ template: 'Für die gewählte Erkrankung sind keine spezifischen Angaben notwendig.' }];
