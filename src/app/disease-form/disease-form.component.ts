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

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';
import { distinctUntilChanged, filter, lastValueFrom, Subject, take, takeUntil, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ANONYMOUS_PERSON_RULES, FACILITY_RULES, NOMINAL_PERSON_ADDRESS_RULES, NOMINAL_PERSON_RULES } from '../data-transfer/functionRules';
import { allowedRoutes, DemisCoding, getNotificationTypeByRouterUrl, NotificationType, QuestionnaireDescriptor } from '../demis-types';
import { makeFieldSequence, sortItems } from '../format-items';
import { Ifsg61Service } from '../ifsg61.service';
import { CodeDisplay, DiseaseStatus, TerminologyVersion } from '../../api/notification';
import { ErrorMessage } from '../shared/error-message';
import { TabsNavigationService } from '../shared/formly/components/tabs-navigation/tabs-navigation.service';
import { HelpersService } from '../shared/helpers.service';
import { createExpressions, findQuantityFieldsByProp } from '../shared/utils';
import { getDiseaseChoiceFields } from './common/formlyConfigs/disease-choice';
import { HexHexDummy } from './common/hexHexDummy';
import { notifierFacilityFormConfigFields } from './common/formlyConfigs/notifier';
import { ImportFieldValuesService, ImportTargetComponent } from './services/import-field-values.service';
import { CopyAndKeepInSyncService } from './services/copy-and-keep-in-sync-service';
import { ProcessFormService } from './services/process-form-service';
import { NGXLogger } from 'ngx-logger';
import {
  cloneObject,
  FollowUpNotificationIdService,
  MessageDialogService,
  notifiedPersonAnonymousConfigFields,
  notifiedPersonNotByNameConfigFields,
} from '@gematik/demis-portal-core-library';
import { Router } from '@angular/router';
import { ValueSetOption, ValueSetService } from '../legacy/value-set.service';
import { FormlyConstants } from '../legacy/formly-constants';
import { GENDER_OPTION_LIST } from '../legacy/formly-options-lists';
import { notifiedPersonFormConfigFields } from './common/formlyConfigs/notified-person';
import StatusEnum = DiseaseStatus.StatusEnum;

const IFSG61_NOTIFIER = 'IFSG61_NOTIFIER'; // key into local storage

const VALUE_SET_ORGANIZATION_TYPE: string = 'https://demis.rki.de/fhir/ValueSet/organizationType';

const NO_DISEASE_CHOOSEN: FormlyFieldConfig[] = [
  {
    template: 'Bitte wählen Sie einen Meldetatbestand aus!',
    className: 'MISSING_MELDETATBESTAND',
  },
  {
    key: 'invalidator',
    type: 'input',
    className: 'hidden-invalidator',
    props: {
      required: true,
      label: 'dummy',
    },
  },
];

@Component({
  selector: 'app-disease-form',
  templateUrl: './disease-form.component.html',
  styleUrls: ['./disease-form.component.scss'],
  standalone: false,
})
export class DiseaseFormComponent implements OnInit, ImportTargetComponent, OnDestroy {
  get formlyConfigFields(): FormlyFieldConfig[] {
    return this.fields;
  }

  public readonly storage: Record<string, any> = {};
  private fieldSequence: any = 0;
  public previousDate3InputLength: number = 0;
  protected readonly environment = environment;
  model: any = {};
  token: '';
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      template: '',
    },
  ];

  private readonly matDialog = inject(MatDialog);
  private readonly ifsg61Service = inject(Ifsg61Service);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly tabsNavigationService = inject(TabsNavigationService);
  private readonly helpers = inject(HelpersService);
  private readonly importFieldValuesService = inject(ImportFieldValuesService);
  private readonly copyAndKeepInSyncService = inject(CopyAndKeepInSyncService);
  private readonly processFormService = inject(ProcessFormService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly logger = inject(NGXLogger);
  private readonly router = inject(Router);
  private readonly valueSetService = inject(ValueSetService);
  private readonly followUpNotificationIdService = inject(FollowUpNotificationIdService);
  private readonly unsubscriber = new Subject<void>();

  notificationType = NotificationType.NominalNotification6_1;

  constructor() {
    this.token = (window as any)['token'];
  }

  notifierFields: FormlyFieldConfig[] = [];
  notifiedPersonFields: FormlyFieldConfig[] = [];
  diseaseChoiceFields: FormlyFieldConfig[] = [];
  conditionFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
  diseaseCommonFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
  questionnaireFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
  countryCodeList: ValueSetOption[] = [];
  diseaseCodeDisplays: CodeDisplay[] = [];

  prevDiseaseCode?: string;
  formOptions: FormlyFormOptions = {};

  terminologyVersions: TerminologyVersion[] = [];

  initHook = (field: FormlyFieldConfig) => {
    return field.options!.fieldChanges!.pipe(
      tap((e: FormlyValueChangeEvent) => {
        this.storeFacilityOnUpdate(e);
        this.handleFieldChange(e);
      })
    );
  };

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const data = nav?.extras.state ?? window.history.state;

    const notifierJson = localStorage.getItem(IFSG61_NOTIFIER);
    this.model.tabNotifier = notifierJson ? JSON.parse(notifierJson) : {};
    if (
      environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION ||
      environment.diseaseConfig.featureFlags?.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE
    ) {
      this.notificationType = getNotificationTypeByRouterUrl(this.router.url);
    }
    //set default country for all addresses to germany.
    this.model.tabNotifier.address = {
      ...this.model.tabNotifier.address,
      country: 'DE',
    };

    if (environment.featureFlags?.FEATURE_FLAG_DISEASE_STRICT) {
      this.fetchCodesystemVersions();
    }

    this.model.tabPatient = {
      currentAddress: {
        country: 'DE',
      },
      primaryAddress: {
        country: 'DE',
      },
      ordinaryAddress: {
        country: 'DE',
      },
    };

    this.model.tabDiseaseChoice = {
      diseaseChoice: { answer: { valueCoding: null } },
      clinicalStatus: { answer: { valueString: StatusEnum.Final } },
      statusNoteGroup: {
        statusNote: { answer: { valueString: '' } },
        initialNotificationId: { answer: { valueString: '' } },
      },
    };

    this.valueSetService
      .get(FormlyConstants.COUNTRY_CODES)
      .pipe(take(1))
      .subscribe({
        next: countryCodes => {
          this.countryCodeList = countryCodes;
        },
      });
    this.getDiseaseCodeDisplaysAndOpenDialogIfFollowUp(data?.redirect);

    this.ifsg61Service
      .getCodeValueSet(VALUE_SET_ORGANIZATION_TYPE)
      .pipe(take(1))
      .subscribe({
        next: (typeOptions: DemisCoding[]) => {
          this.notifierFields = [
            {
              hooks: {
                onInit: this.initHook,
              },
            },
            ...notifierFacilityFormConfigFields(typeOptions),
          ];

          this.notifiedPersonFields = this.getNotifiedPersonFields(this.notificationType);

          this.diseaseChoiceFields = getDiseaseChoiceFields(this.diseaseCodeDisplays, this.notificationType);
          this.combineFields();
        },
        error: (err: any) => {
          this.handleError(err, 'Typen nicht abrufbar');
        },
      });
    if (this.isFollowUpNotification6_1()) {
      this.handleFollowUpNotification6_1();
    }
  }

  private getNotifiedPersonFields(notificationType: NotificationType): FormlyFieldConfig[] {
    switch (notificationType) {
      case NotificationType.FollowUpNotification6_1:
        return notifiedPersonAnonymousConfigFields(this.countryCodeList, GENDER_OPTION_LIST);
      case NotificationType.NonNominalNotification7_3:
        return notifiedPersonNotByNameConfigFields(this.countryCodeList, GENDER_OPTION_LIST);
      default:
        return notifiedPersonFormConfigFields(true);
    }
  }

  private fetchCodesystemVersions() {
    this.ifsg61Service
      .getCodeSystemVersions()
      .pipe(take(1))
      .subscribe({
        next: versions => {
          this.terminologyVersions = versions;
        },
        error: err => {
          this.logger.warn('Failed to fetch codesystem versions', err);
        },
      });
  }

  // TODO: Remove this getter, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
  public get FEATURE_FLAG_PORTAL_PASTEBOX(): boolean {
    return environment.diseaseConfig.featureFlags?.FEATURE_FLAG_PORTAL_PASTEBOX;
  }

  public isFollowUpNotification6_1(): boolean {
    return this.notificationType === NotificationType.FollowUpNotification6_1;
  }

  public getDiseaseCodeDisplaysAndOpenDialogIfFollowUp(isRedirect: boolean = false): void {
    this.ifsg61Service
      .getDiseaseOptions(this.notificationType)
      .pipe(take(1))
      .subscribe({
        next: (diseaseOptions: CodeDisplay[]) => {
          this.diseaseCodeDisplays = diseaseOptions;
          if (this.isFollowUpNotification6_1() && !isRedirect) {
            this.followUpNotificationIdService.openDialog({
              dialogData: {
                routerLink: '/' + allowedRoutes['nominal'],
                linkTextContent: 'einer namentlichen Infektionskrankheit nach § 6 IfSG',
                pathToDestinationLookup: environment.pathToDestinationLookup,
                errorUnsupportedNotificationCategory:
                  'Aktuell sind Nichtnamentliche Folgemeldungen einer Infektionskrankheit gemäß § 6 Abs. 1 IfSG nur für eine § 6 Abs. 1 IfSG Initialmeldung möglich.',
              },
              notificationCategoryCodes: this.diseaseCodeDisplays.map(codeDisplay => codeDisplay.code),
            });
          }
        },
        error: (err: any) => {
          this.handleError(err, 'Meldetatbestände nicht verfügbar');
        },
      });
  }

  private handleFollowUpNotification6_1() {
    this.followUpNotificationIdService.hasValidNotificationId$
      .pipe(
        takeUntil(this.unsubscriber),
        distinctUntilChanged(),
        filter(hasValid => hasValid === true)
      )
      .subscribe(() => {
        const diseaseCode = this.followUpNotificationIdService.followUpNotificationCategory();
        const diseaseCodeDisplay = this.diseaseCodeDisplays.find(dc => dc.code === diseaseCode);

        if (diseaseCode) {
          this.handleDiseaseSelectionChange(diseaseCode);
          this.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding = diseaseCodeDisplay;
          this.model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer.valueString = this.followUpNotificationIdService.validatedNotificationId();
        } else {
          this.messageDialogService.showErrorDialog({
            errorTitle: 'Fehler',
            errors: [
              {
                text:
                  'Der gespeicherte Erreger ' +
                  this.followUpNotificationIdService.followUpNotificationCategory() +
                  ' für die ID ' +
                  this.followUpNotificationIdService.validatedNotificationId +
                  ' wird für die §6.1er Meldungen nicht unterstützt.',
              },
            ],
            redirectToHome: true,
          });
        }
      });
  }

  private handleError(error: any, message: string) {
    this.logger.error(error);
    this.messageDialogService.showErrorDialog({
      redirectToHome: true,
      errorTitle: 'Systemfehler',
      errors: [
        {
          text: message,
        },
      ],
    });
  }

  private combineFields() {
    // remove these strange 'invalidator' fields which persist although the new formfields do NOT contain em
    if (this.fields[0].fieldGroup) {
      this.fields[0].fieldGroup.forEach(ffc => {
        if (!ffc.formControl) return;
        if (ffc.formControl.hasOwnProperty('controls')) {
          const fg = ffc.formControl as FormGroup;
          if (fg.controls['invalidator']) delete fg.controls['invalidator'];
        }
      });
    }

    this.copyAndKeepInSyncService.addChangeListenersForCopyCheckboxesInHospitalization(this.diseaseCommonFields, this.form, this.model);

    this.fields = [
      {
        type: 'tabs-navigation',
        id: 'NAVIGATION',
        props: {
          title: 'Krankheit melden',
        },
        fieldGroup: [
          {
            key: 'tabNotifier',
            props: { label: 'Meldende Person' },
            fieldGroup: this.notifierFields,
          },
          {
            key: 'tabPatient',
            props: { label: 'Betroffene Person' },
            fieldGroup: this.notifiedPersonFields,
          },
          {
            key: 'tabDiseaseChoice',
            props: { label: 'Meldetatbestand' },
            fieldGroup: this.diseaseChoiceFields,
          },
          {
            key: 'tabDiseaseCondition',
            props: { label: 'Angaben zu Symptomen' },
            fieldGroup: cloneObject(this.conditionFields),
          },
          ...(this.isFullQuestionnaire()
            ? [
                {
                  key: 'tabDiseaseCommon',
                  props: { label: 'Klinische und epidemiologische Angaben' },
                  fieldGroup: cloneObject(this.diseaseCommonFields),
                },
              ]
            : []),
          {
            key: 'tabQuestionnaire',
            props: { label: 'Spezifische Angaben' },
            fieldGroup: this.questionnaireFields[1]
              ? cloneObject(this.questionnaireFields)
              : [
                  {
                    template: 'Für die gewählte Erkrankung sind keine spezifischen Angaben notwendig.',
                  },
                ],
          },
        ],
      },
    ];
    createExpressions(this.fields);
    this.fieldSequence = makeFieldSequence(this.fields);
  }

  isFullQuestionnaire() {
    return this.notificationType === NotificationType.NominalNotification6_1 || this.isFollowUpNotification6_1();
  }

  chooseTabAfterChoosing() {
    this.navigateToTab(2);
  }

  async submitForm() {
    let notification;
    const quantityFields = findQuantityFieldsByProp(this.questionnaireFields);
    notification = this.processFormService.createNotification(this.model, this.notificationType, quantityFields);
    if (notification.common?.item) {
      sortItems(notification.common.item, this.fieldSequence.tabDiseaseCommon);
    }
    if (notification.disease?.item) {
      sortItems(notification.disease.item, this.fieldSequence.tabQuestionnaire);
    }
    notification.terminologyVersions = this.terminologyVersions;
    this.ifsg61Service.submitNotification(notification, this.notificationType);
  }

  private storeFacilityOnUpdate(e: FormlyValueChangeEvent) {
    if (e.type === 'valueChanges' && this.isNotifierField(e.field)) {
      const notifierJson = JSON.stringify(this.model.tabNotifier);
      localStorage.setItem(IFSG61_NOTIFIER, notifierJson);
    }
  }

  private isNotifierField(field: FormlyFieldConfig): boolean {
    if (this.notifierFields.findIndex(nf => nf === field)) return true;
    const parent = field.parent;
    if (!parent) return false;
    return this.isNotifierField(parent);
  }

  public transformDate123Input(date: string): string {
    if (!date) {
      return '';
    }
    if (date.length === 6) {
      return date.slice(0, 2) + '.' + date.slice(2);
    } else if (date.length === 8) {
      return date.slice(0, 2) + '.' + date.slice(2, 4) + '.' + date.slice(4);
    }
    return date;
  }

  public transformDate3Input(date: string): string {
    if (date.includes('..')) {
      return date.replace('..', '.');
    }

    if ((this.previousDate3InputLength === 1 && date.length === 2) || (this.previousDate3InputLength === 4 && date.length === 5)) {
      date += '.';
    }

    this.previousDate3InputLength = date ? date.length : 0;
    return date;
  }

  /**
   * This method reacts to value change events.
   * Be aware that FormlyValueChangeEvent can be triggered not only when the change has been induced by the user
   * but also while angular/formly process. So it can be triggered at unexpected moment. If you want to only react to
   * user changes, it is better to use other strategies, like defining a change method in the props in the formly config
   * of the watched component. For instance:
   *                  {
   *                   id: 'extractionDate',
   *                   key: 'extractionDate',
   *                   type: 'input',
   *                   className: FormlyConstants.COLMD6,
   *                   props: {
   *                     label: 'Entnahmedatum',
   *                     required: false,
   *                     maxLength: 10,
   *                     placeholder: UI_DATE_FORMAT_GER,
   *                     change: (field: FormlyFieldConfig) => {
   *                       const parentFormControl = field?.parent?.formControl as FormControl;
   *                       triggerReceivedDateValidation(parentFormControl);
   *                     },
   *                   },
   *                   validators: {
   *                     validation: ['dateInputValidator'],
   *                   },
   *                 }
   */
  private handleFieldChange(e: FormlyValueChangeEvent) {
    if (e.field.validators?.validation.includes('date123') && e.type === 'valueChanges') {
      const transformedDate = this.transformDate123Input(e.value);
      e.field.formControl?.setValue(transformedDate);
    }

    if ((e.field.validators?.validation.includes('date3') || e.field.validators?.validation.includes('dateInputValidator')) && e.type === 'valueChanges') {
      const transformedDate = this.transformDate3Input(e.value);
      e.field.formControl?.setValue(transformedDate);
    }

    if (e.field.id === 'currentAddressType') {
      this.copyAndKeepInSyncService.subscribeToCurrentAddressTypeChanges(e, this.notifiedPersonFields, this.form, this.model);
    }

    if (e.field.id === 'disease-choice' && e.type === 'valueChanges') {
      this.handleDiseaseSelectionChange(e.value.code);
    }
  }

  handleDiseaseSelectionChange(diseaseCode: string) {
    if (diseaseCode !== this.prevDiseaseCode) {
      if (diseaseCode) {
        this.loadQuestionnaire(diseaseCode).then(problems => {
          if (problems.length > 0) {
            this.messageDialogService.showErrorDialog({
              errorTitle: 'Systemfehler',
              errors: problems.map(it => it.toErrorMessageFromCoreLibrary()),
            });
          }
        });
      } else if (this.prevDiseaseCode) {
        this.prevDiseaseCode = diseaseCode;
      }
    }
  }

  async loadQuestionnaire(diseaseCode: string): Promise<ErrorMessage[]> {
    this.prevDiseaseCode = diseaseCode;

    return lastValueFrom(
      this.ifsg61Service.getQuestionnaire(diseaseCode, this.notificationType).pipe(
        tap((descriptor: QuestionnaireDescriptor) => {
          if (document.activeElement) (document.activeElement as HTMLInputElement)['blur']();
          this.resetDiseaseChoiceDependentInput();
          this.questionnaireFields = descriptor.questionnaireConfigs;
          this.conditionFields = descriptor.conditionConfigs || [];
          this.diseaseCommonFields = !this.isFullQuestionnaire() ? [] : descriptor.commonConfig;
          this.combineFields();
          this.changeDetector.detectChanges();
          if (!this.isFollowUpNotification6_1()) {
            this.chooseTabAfterChoosing();
          }
        })
      )
    ).then(
      descriptor => [],
      reason => {
        console.error(reason);
        if (reason instanceof HttpErrorResponse) {
          return [new ErrorMessage('E0005', reason.message)];
        }
        return [new ErrorMessage('E0005', reason.toString())];
      }
    );
  }

  resetDiseaseChoiceDependentInput() {
    this.model.tabDiseaseCondition = {};
    this.model.tabDiseaseCommon = {};
    this.model.tabQuestionnaire = {};

    // Reset the model is not enough, we need to remove the controls from the form
    ['tabDiseaseCondition', 'tabDiseaseCommon', 'tabQuestionnaire'].forEach(tab => {
      const group = this.form.get(tab) as FormGroup;
      if (group) {
        Object.keys(group.controls).forEach(controlName => {
          group.removeControl(controlName);
        });
      }
    });
  }

  async hexHex() {
    const dummy = new HexHexDummy();
    const dummyData = dummy.getDummy(this.notificationType);

    const diseaseCode = dummyData.tabDiseaseChoice.diseaseChoice.answer.valueCoding.code;
    const j = JSON.stringify(dummyData);
    this.model = JSON.parse(j);
    await this.loadQuestionnaire(diseaseCode);
    setTimeout(() => {
      this.model = JSON.parse(j);
    }, 10);
    if (this.isFollowUpNotification6_1()) {
      this.model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer.valueString = this.followUpNotificationIdService.validatedNotificationId();
    }
  }

  private navigateToTab(i: number) {
    this.tabsNavigationService.navigateToTab(i);
  }

  canGoBack: Signal<boolean> = this.tabsNavigationService.canGoBack;

  goBack() {
    this.tabsNavigationService.goBack();
  }

  canGoForward: Signal<boolean> = this.tabsNavigationService.canGoForward;

  goForward() {
    this.tabsNavigationService.goForward();
  }

  async afterTransfer(importKey: string, value: any): Promise<ErrorMessage[]> {
    switch (importKey) {
      case 'D.code':
        const problems = await this.loadQuestionnaire(value);
        return problems;
      default:
        this.model = { ...this.model }; // angular tricks...
        return Promise.resolve([]);
    }
  }

  /**
   * This method handles the import of data in the form using the clipboard
   *
   * TODO: Make parameter keyValuePairs mandatory, as soon as the feature flag "FEATURE_FLAG_PORTAL_PASTEBOX" is removed
   * @param keyValuePairs - Map of key-value pairs to be imported from clipboard
   */
  async paste(keyValuePairsFromClipboard?: Map<string, string>) {
    this.messageDialogService.showSpinnerDialog({ message: 'Zwischenablage wird übernommen' });
    try {
      window.focus();
      const keyValuePairs: string[][] = this.FEATURE_FLAG_PORTAL_PASTEBOX
        ? [...(keyValuePairsFromClipboard ?? [])]
        : await this.importFieldValuesService.getClipboardKVs();
      const isFollowUp = this.notificationType === NotificationType.FollowUpNotification6_1;
      const personRules = isFollowUp ? ANONYMOUS_PERSON_RULES : NOMINAL_PERSON_RULES;
      const personAddressRules = isFollowUp ? {} : NOMINAL_PERSON_ADDRESS_RULES;

      const problems: ErrorMessage[] = await this.importFieldValuesService.fillModelFromKVs(
        this,
        keyValuePairs,
        {
          ...personRules,
          ...personAddressRules,
          ...FACILITY_RULES,
        },
        this.notificationType
      );

      if (problems.length > 0) {
        this.messageDialogService.showErrorDialog({
          errorTitle: 'Fehler bei der Datenübernahme',
          errors: problems.map(it => it.toErrorMessageFromCoreLibrary()),
        });
      } else {
        window.navigator.clipboard.writeText('');
      }
    } catch (error) {
      this.logger.error(error);
      this.messageDialogService.showErrorDialogInsertDataFromClipboard();
    } finally {
      this.messageDialogService.closeSpinnerDialog();
    }
  }

  @HostListener('window:keydown.control.ArrowRight', ['$event'])
  nextTab(event: KeyboardEvent) {
    if (this.canGoForward()) {
      this.goForward();
    }
  }

  @HostListener('window:keydown.control.ArrowLeft', ['$event'])
  prevTab(event: KeyboardEvent) {
    if (this.canGoBack()) {
      this.goBack();
    }
  }

  protected readonly NotificationType = NotificationType;

  ngOnDestroy(): void {
    this.followUpNotificationIdService.resetState();
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
