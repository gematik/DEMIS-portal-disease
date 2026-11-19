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

import { computed, DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup } from '@angular/forms';
import {
  customCodeDisplay,
  FollowUpMixedCodesService,
  FollowUpNotificationIdService,
  MessageDialogService,
  notifiedPersonAnonymousConfigFields,
  notifiedPersonNotByNameConfigFields,
} from '@gematik/demis-portal-core-library';
import { FormlyFieldConfig, FormlyFormBuilder, FormlyFormOptions } from '@ngx-formly/core';
import { NGXLogger } from 'ngx-logger';
import { catchError, distinctUntilChanged, EMPTY, filter, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { CodeDisplay } from '../../api/notification';
import { environment } from '../../environments/environment';
import { allowedRoutes, NotificationType } from '../demis-types';
import { getDiseaseChoiceFields } from '../disease-form/common/formlyConfigs/disease-choice';
import { notifiedPersonFormConfigFields } from '../disease-form/common/formlyConfigs/notified-person';
import { notifierFacilityFormConfigFields } from '../disease-form/common/formlyConfigs/notifier';
import { NotifiedPersonDisclaimer } from '../disease-form/common/notified-person-disclaimer';
import { Ifsg61Service } from '../ifsg61.service';
import { findCodeDisplayByCodeValue } from '../legacy/common-utils';
import { FormlyConstants } from '../legacy/formly-constants';
import { GENDER_OPTION_LIST } from '../legacy/formly-options-lists';
import { ValueSetOption, ValueSetService } from '../legacy/value-set.service';
import { createExpressions, modifyFieldsByPredicate } from '../shared/utils';
import { DiseaseQuestionnaireFormContext, DiseaseQuestionnaireService, QUESTIONNAIRE_STEP_KEYS } from './disease-questionnaire.service';
import { DISEASE_STEP_KEYS, DiseaseStepKey } from './disease-form.model';
import { toDiseaseNotification, usesCommonQuestionnaire } from './disease-notification.mapper';
import { FieldMirroringService } from './field-mirroring.service';

/** Local-storage key used to preserve notifier details between notification visits. */
export const IFSG61_NOTIFIER = 'IFSG61_NOTIFIER';

/** Value-set URL used to load notifier organization types. */
const VALUE_SET_ORGANIZATION_TYPE = 'https://demis.rki.de/fhir/ValueSet/organizationType';

/** Formly model path containing the selected disease's coding. */
const DISEASE_CODE_PATH = 'diseaseChoice.answer.valueCoding';

/**
 * State and flow of the side-navigation based disease notification (FEATURE_FLAG_CORE_SIDENAV).
 * Provided per host component, so every visit starts with a fresh state.
 * The model is structured as described by `DiseaseFormModel`.
 */
@Injectable()
export class DiseaseNotificationService {
  private readonly ifsg61Service = inject(Ifsg61Service);
  private readonly diseaseQuestionnaireService = inject(DiseaseQuestionnaireService);
  private readonly valueSetService = inject(ValueSetService);
  private readonly fieldMirroringService = inject(FieldMirroringService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly followUpNotificationIdService = inject(FollowUpNotificationIdService);
  private readonly followUpMixedCodesService = inject(FollowUpMixedCodesService);
  private readonly formlyBuilder = inject(FormlyFormBuilder);
  private readonly logger = inject(NGXLogger);
  private readonly destroyRef = inject(DestroyRef);

  /** Root form, with one independently enabled or disabled group for each navigation step. */
  readonly form = new FormGroup(Object.fromEntries(DISEASE_STEP_KEYS.map(stepKey => [stepKey, new FormGroup({})])) as Record<DiseaseStepKey, FormGroup>);

  /** Formly model, one entry per step; see `DiseaseFormModel` for its structure once the form is valid. */
  readonly model = Object.fromEntries(DISEASE_STEP_KEYS.map(stepKey => [stepKey, {}])) as Record<DiseaseStepKey, any>;

  /** Reactive Formly field configuration for each step; questionnaire entries are replaced per disease. */
  readonly fields = Object.fromEntries(DISEASE_STEP_KEYS.map(stepKey => [stepKey, signal<FormlyFieldConfig[]>([])])) as Record<
    DiseaseStepKey,
    WritableSignal<FormlyFieldConfig[]>
  >;

  /** Formly options associated with each step's model and field configuration. */
  readonly formOptions = Object.fromEntries(DISEASE_STEP_KEYS.map(stepKey => [stepKey, {}])) as Record<DiseaseStepKey, FormlyFormOptions>;

  /** Becomes true once required reference data has loaded and the initial steps have been built. */
  readonly isReady = signal(false);

  /** Notification variant that determines fields, questionnaire content, and submission behavior. */
  readonly notificationType = signal(NotificationType.NominalNotification6_1);

  /** Disease code whose questionnaire is currently built into the dependent steps. */
  readonly loadedDiseaseCode = this.diseaseQuestionnaireService.loadedDiseaseCode;

  /** True only when the loaded questionnaire belongs to the currently selected disease. */
  readonly questionnaireStepsEnabled = this.diseaseQuestionnaireService.questionnaireStepsEnabled;

  /**
   * Disease code displays loaded for the active notification type.
   *
   * The list populates the disease-choice step and resolves disease codes returned by the
   * follow-up notification lookup to the corresponding selectable display.
   */
  private diseaseCodeDisplays: CodeDisplay[] = [];

  /** Whether the current variant is either of the two follow-up notification types. */
  readonly isFollowUp = computed(
    () => this.notificationType() === NotificationType.FollowUpNotification6_1 || this.notificationType() === NotificationType.FollowUpNotification7_3
  );

  /** Whether the current variant uses the full common-questionnaire section. */
  readonly isFullQuestionnaire = computed(() => usesCommonQuestionnaire(this.notificationType()));

  /** Short title displayed for this notification variant in the side navigation. */
  readonly sideNavTitle = computed(() => {
    switch (this.notificationType()) {
      case NotificationType.NonNominalNotification7_3:
        return 'Krankheit';
      case NotificationType.FollowUpNotification6_1:
      case NotificationType.FollowUpNotification7_3:
        return 'Folgemeldung';
      default:
        return 'Krankheitsmeldung (§ 6.1)';
    }
  });

  /** Descriptive text displayed for non-nominal and follow-up variants; empty for nominal reports. */
  readonly sideNavDescription = computed(() => {
    switch (this.notificationType()) {
      case NotificationType.NonNominalNotification7_3:
      case NotificationType.FollowUpNotification7_3:
        return 'Meldung eines Nachweises von Infektionskrankheiten gemäß § 7 Abs. 3 IfSG ohne Angaben von Personendaten';
      case NotificationType.FollowUpNotification6_1:
        return 'Meldung eines Nachweises von Infektionskrankheiten gemäß § 6 IfSG ohne Angaben von Personendaten';
      default:
        return '';
    }
  });

  constructor() {
    QUESTIONNAIRE_STEP_KEYS.forEach(stepKey => this.form.controls[stepKey].disable());
    // The follow-up ID is scoped to this component-provided service instance.
    this.destroyRef.onDestroy(() => this.followUpNotificationIdService.resetState());
  }

  /**
   * Returns the form group for one notification step.
   *
   * @param stepKey Key identifying the requested step.
   * @returns The step's group within the root form.
   */
  stepGroup(stepKey: DiseaseStepKey): FormGroup {
    return this.form.controls[stepKey];
  }

  /**
   * Resets the initial model and starts asynchronous setup for a notification variant. The service
   * becomes ready only after the required reference data has loaded and the initial fields and
   * observers have been configured; readiness is therefore not guaranteed when this method returns.
   *
   * For follow-up notifications, also starts initial-ID handling and opens its dialog unless this
   * visit is a redirect. A failure to load mandatory reference data is logged and shown as an error
   * that redirects the user to the home page.
   *
   * @param notificationType Variant that controls the form and questionnaire configuration.
   * @param isRedirect Whether this visit resulted from redirecting back from the follow-up ID flow.
   */
  initialize(notificationType: NotificationType, isRedirect: boolean): void {
    this.notificationType.set(notificationType);
    this.initializeModel();

    // Load the data together so all initial steps use the same set of reference options.
    forkJoin({
      diseaseOptions: this.ifsg61Service
        .getDiseaseOptions(notificationType)
        .pipe(catchError(err => throwError(() => ({ cause: err, message: 'Meldetatbestände nicht verfügbar' })))),
      typeOptions: this.ifsg61Service
        .getCodeValueSet(VALUE_SET_ORGANIZATION_TYPE)
        .pipe(catchError(err => throwError(() => ({ cause: err, message: 'Typen nicht abrufbar' })))),
      // Part of the join, so the person fields never get built with a not yet loaded country list
      countryCodes: this.valueSetService.get(FormlyConstants.COUNTRY_CODES).pipe(
        catchError(err => {
          this.logger.error(err);
          return of([] as ValueSetOption[]);
        })
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ diseaseOptions, typeOptions, countryCodes }) => {
          this.diseaseCodeDisplays = diseaseOptions;

          // Build the first three (static) steps before attaching observers that depend on their controls.
          this.setStepFields('notifier', this.withHiddenHoneypot(notifierFacilityFormConfigFields(typeOptions)));
          this.setStepFields('notifiedPerson', this.getNotifiedPersonFields(notificationType, countryCodes));
          this.setStepFields('notificationCategory', getDiseaseChoiceFields(this.diseaseCodeDisplays, notificationType));

          // Attach observers only after the corresponding controls and field configurations exist.
          this.observeNotifierForStorage();
          this.observeCurrentAddressType();
          const diseaseChoiceControl = this.stepGroup('notificationCategory').get(DISEASE_CODE_PATH) as AbstractControl<CodeDisplay | null>;
          // Selection and loading are handled separately; form and model changes stay in this service.
          const questionnaireFormContext = {
            form: this.form,
            setStepFieldsFn: (stepKey, fields) => this.setStepFields(stepKey, fields),
            resetQuestionnaireModelsFn: () => this.resetQuestionnaireModels(),
          } satisfies DiseaseQuestionnaireFormContext;
          this.diseaseQuestionnaireService.observeDiseaseSelection(diseaseChoiceControl, notificationType, questionnaireFormContext);

          // Resolve follow-up selections after the disease choice options are available.
          if (this.isFollowUp()) {
            this.observeFollowUpNotificationId();
            if (!isRedirect) {
              this.openFollowUpDialog();
            }
          }

          // The host can render the form only after its initial fields and observers are ready.
          this.isReady.set(true);
        },
        error: ({ cause, message }: { cause: unknown; message: string }) => {
          this.logger.error(cause);
          this.messageDialogService.showErrorDialog({ redirectToHome: true, errorTitle: 'Systemfehler', errors: [{ text: message }] });
        },
      });
  }

  /**
   * Checks whether submission is currently permitted.
   *
   * The service must have finished initialization, the questionnaire must match the current
   * disease selection, and all enabled controls in the root form must be valid.
   *
   * @returns `true` when the entire notification can be submitted.
   */
  isFormValid(): boolean {
    return this.isReady() && this.questionnaireStepsEnabled() && this.form.valid;
  }

  /**
   * Creates and submits the notification for the current model.
   *
   * Invalid or not-yet-ready forms are ignored. The common questionnaire is omitted for variants
   * that do not use the full questionnaire. Questionnaire items are built in questionnaire order.
   */
  sendData(): void {
    if (!this.isFormValid()) {
      return;
    }
    const questionnaireFields = {
      common: this.fields.commonQuestionnaire(),
      specific: this.fields.specificQuestionnaire(),
    };
    const notification = toDiseaseNotification(this.model, this.notificationType(), questionnaireFields);
    this.ifsg61Service.submitNotification(notification, this.notificationType());
  }

  /** Initializes the step models with stored notifier data and German address defaults. */
  private initializeModel(): void {
    const storedNotifier = this.readStoredNotifier();
    this.model.notifier = { ...storedNotifier, address: { ...storedNotifier['address'], country: 'DE' } };
    this.model.notifiedPerson = {
      currentAddress: { country: 'DE' },
      primaryAddress: { country: 'DE' },
      ordinaryAddress: { country: 'DE' },
    };
    this.model.notificationCategory = {
      diseaseChoice: { answer: { valueCoding: null } },
      clinicalStatus: { answer: { valueString: null } },
      statusNoteGroup: {
        statusNote: { answer: { valueString: '' } },
        initialNotificationId: { answer: { valueString: '' } },
      },
    };
  }

  /**
   * Reads notifier details saved by a previous visit.
   *
   * The one-time honeypot code is deliberately excluded. Invalid or unavailable JSON is treated
   * as empty stored data and reported as a warning.
   *
   * @returns Stored notifier properties, or an empty object when no usable data exists.
   */
  private readStoredNotifier(): Record<string, any> {
    try {
      const { oneTimeCode, ...notifier } = JSON.parse(localStorage.getItem(IFSG61_NOTIFIER) ?? '{}') ?? {};
      return notifier;
    } catch (error) {
      this.logger.warn('Ignoring unreadable notifier data in local storage', error);
      return {};
    }
  }

  /** Persists notifier form changes without storing the one-time honeypot value. */
  private observeNotifierForStorage(): void {
    this.stepGroup('notifier')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const { oneTimeCode, ...notifier } = this.model.notifier;
        localStorage.setItem(IFSG61_NOTIFIER, JSON.stringify(notifier));
      });
  }

  /**
   * Replaces a step's controls and Formly configuration, then builds its controls against the
   * existing step model and options. Existing controls are removed silently to avoid emitting
   * intermediate form-change events while a questionnaire is being replaced.
   *
   * @param stepKey Step whose controls and field configuration are being installed.
   * @param fields New Formly configuration for that step; expressions and tooltip wrappers are added in place.
   */
  private setStepFields(stepKey: DiseaseStepKey, fields: FormlyFieldConfig[]): void {
    const group = this.stepGroup(stepKey);
    Object.keys(group.controls).forEach(name => group.removeControl(name, { emitEvent: false }));
    createExpressions(fields);
    addTooltipWrapper(fields);
    modifyFieldsByPredicate(
      fields,
      field =>
        ['autocomplete-coding', 'drop-down-coding', 'radio-button-coding'].includes(field.type as string) &&
        field.defaultValue === undefined &&
        !!field.props?.['defaultCode'],
      field => {
        const defaultCoding = (field.props!['options'] as CodeDisplay[] | undefined)?.find(coding => coding.code === field.props!['defaultCode']);
        if (defaultCoding) {
          field.defaultValue = defaultCoding;
        }
      }
    );
    this.fields[stepKey].set(fields);
    this.formlyBuilder.buildForm(group, fields, this.model[stepKey], this.formOptions[stepKey]);
  }

  /**
   * Returns field rows with the shared honeypot excluded from keyboard navigation and assistive
   * technology. The shared field configuration is copied where changed, so its original config is
   * not mutated.
   *
   * @param fields Formly rows that may contain the `oneTimeCode` honeypot.
   * @returns Rows with the honeypot marked `tabindex=-1` and `aria-hidden=true`.
   */
  private withHiddenHoneypot(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
    return fields.map(row => {
      const honeypot = row.fieldGroup?.find(field => field.key === 'oneTimeCode');
      if (!honeypot) {
        return row;
      }
      const hiddenHoneypot: FormlyFieldConfig = {
        ...honeypot,
        props: { ...honeypot.props, attributes: { ...honeypot.props?.attributes, tabindex: -1, 'aria-hidden': 'true' } },
      };
      return { ...row, fieldGroup: row.fieldGroup!.map(field => (field === honeypot ? hiddenHoneypot : field)) };
    });
  }

  /**
   * Selects the notified-person field configuration appropriate to the notification variant.
   *
   * @param notificationType Variant that determines whether details are anonymous or named.
   * @param countryCodes Loaded country options supplied to the address fields.
   * @returns Formly fields for the notified person step.
   */
  private getNotifiedPersonFields(notificationType: NotificationType, countryCodes: ValueSetOption[]): FormlyFieldConfig[] {
    switch (notificationType) {
      case NotificationType.FollowUpNotification6_1:
        return notifiedPersonAnonymousConfigFields(countryCodes, GENDER_OPTION_LIST, NotifiedPersonDisclaimer.FOLLOW_UP_DISCLAIMER);
      case NotificationType.FollowUpNotification7_3:
        return notifiedPersonAnonymousConfigFields(countryCodes, GENDER_OPTION_LIST, NotifiedPersonDisclaimer.NON_NOMINAL_FOLLOW_UP_DISCLAIMER);
      case NotificationType.NonNominalNotification7_3:
        return notifiedPersonNotByNameConfigFields(countryCodes, GENDER_OPTION_LIST, NotifiedPersonDisclaimer.NON_NOMINAL_DISCLAIMER);
      default:
        return notifiedPersonFormConfigFields(true);
    }
  }

  /** Mirrors changes to the patient's current-address type into the patient and notifier fields. */
  private observeCurrentAddressType(): void {
    this.stepGroup('notifiedPerson')
      .get('currentAddressType')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value =>
        this.fieldMirroringService.onCurrentAddressTypeChange(
          value,
          this.fields.notifiedPerson(),
          this.form,
          !!this.model.notifiedPerson.currentAddress?.fromClipboard
        )
      );
  }

  /** Clears model values belonging to the condition, common, and disease-specific question steps. */
  private resetQuestionnaireModels(): void {
    QUESTIONNAIRE_STEP_KEYS.forEach(stepKey => (this.model[stepKey] = {}));
  }

  /** Opens the initial-notification-ID dialog for the appropriate nominality and lookup route. */
  private openFollowUpDialog(): void {
    const is6_1 = this.notificationType() === NotificationType.FollowUpNotification6_1;
    this.followUpNotificationIdService.openDialog({
      dialogData: {
        routerLink: '/' + allowedRoutes[is6_1 ? 'nominal' : 'nonNominal'],
        linkTextContent: is6_1 ? 'einer namentlichen Infektionskrankheit nach § 6 IfSG' : 'einer nichtnamentlichen Infektionskrankheit nach § 7 Abs. 3 IfSG',
        pathToDestinationLookup: environment.pathToDestinationLookup,
      },
    });
  }

  /**
   * Waits for a validated follow-up notification ID, resolves its disease code, and applies the
   * result to the disease-choice step. Invalid or unknown codes are ignored; lookup errors are
   * already reported and handled by `Ifsg61Service`.
   */
  private observeFollowUpNotificationId(): void {
    this.followUpNotificationIdService.hasValidNotificationId$
      .pipe(
        distinctUntilChanged(),
        filter(hasValid => hasValid === true),
        switchMap(() =>
          this.ifsg61Service
            .fetchFollowUpCode(this.followUpNotificationIdService.followUpNotificationCategory()!, this.notificationType())
            // Ifsg61Service already informs the user and redirects to home
            .pipe(catchError(() => EMPTY))
        ),
        switchMap(codes => this.selectFollowUpCode(codes)),
        map(code => (code ? findCodeDisplayByCodeValue(this.diseaseCodeDisplays, code) : undefined)),
        filter((codeDisplay): codeDisplay is CodeDisplay => !!codeDisplay),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(codeDisplay => this.applyFollowUpDisease(codeDisplay));
  }

  /**
   * Resolves the disease code associated with the validated follow-up notification ID.
   *
   * When multiple codes are returned, closes the ID dialog and asks the user to choose one. An
   * empty result represents leaving that choice flow without selecting a disease.
   *
   * @param codes Disease codings returned for the follow-up notification ID.
   * @returns The selected disease code, or `undefined` if none is available or chosen.
   */
  private selectFollowUpCode(codes: CodeDisplay[]): Observable<string | undefined> {
    if (codes.length > 1) {
      this.followUpNotificationIdService.closeDialog();
      // Resolves with undefined when the user leaves via "Zurück zur Startseite"
      return this.followUpMixedCodesService.openDialog(codes as customCodeDisplay[]);
    }
    return of(codes[0]?.code);
  }

  /** Writes the validated follow-up ID and its disease coding into the disease-choice step. */
  private applyFollowUpDisease(codeDisplay: CodeDisplay): void {
    this.setStepValue(
      'notificationCategory',
      'statusNoteGroup.initialNotificationId.answer.valueString',
      this.followUpNotificationIdService.validatedNotificationId()
    );
    this.setStepValue('notificationCategory', DISEASE_CODE_PATH, codeDisplay);
  }

  /**
   * Writes a value to both the step model and its current control.
   *
   * Formly synchronizes values only for rendered fields and restores model values when a field is
   * rendered. Updating both locations therefore preserves programmatic values for fields that are
   * currently not rendered.
   *
   * @param stepKey Step model and form group to update.
   * @param path Dot-separated path relative to that step, matching the Formly field key path.
   * @param value Value to assign to the model and, when present, the matching control.
   */
  private setStepValue(stepKey: DiseaseStepKey, path: string, value: unknown): void {
    const segments = path.split('.');
    const parent = segments.slice(0, -1).reduce((node, segment) => (node[segment] ??= {}), this.model[stepKey]);
    parent[segments.at(-1)!] = value;
    this.stepGroup(stepKey).get(path)?.setValue(value);
  }
}

/** Adds the tooltip-aware wrapper to eligible Formly fields, modifying their wrapper lists in place. */
function addTooltipWrapper(fields: FormlyFieldConfig[]): void {
  modifyFieldsByPredicate(
    fields,
    field => !!field.wrappers?.includes('form-field') && !!field.props?.['tooltip'] && !field.wrappers.includes('form-field-with-tooltip'),
    field => field.wrappers!.unshift('form-field-with-tooltip')
  );
}
