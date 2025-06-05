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

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, inject, OnInit, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';
import { lastValueFrom, take, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FACILITY_RULES, PERSON_ADDRESS_RULES, PERSON_RULES } from '../data-transfer/functionRules';
import { DemisCoding, QuestionnaireDescriptor } from '../demis-types';
import { makeFieldSequence, sortItems } from '../format-items';
import { Ifsg61Service } from '../ifsg61.service';
import { ErrorResult, MessageType } from '../legacy/message';
import { DiseaseStatus } from '../../api/notification';
import { ErrorMessage } from '../shared/error-message';
import { ErrorMessageDialogComponent } from '../shared/error-message-dialog/error-message-dialog.component';
import { TabsNavigationService } from '../shared/formly/components/tabs-navigation/tabs-navigation.service';
import { HelpersService } from '../shared/helpers.service';
import { ProgressService } from '../shared/progress.service';
import { createExpressions } from '../shared/utils';
import { getDiseaseChoiceFields } from './common/formlyConfigs/disease-choice';
import { MaxMasern } from './common/maxMasern';
import { notifiedPersonFormConfigFields } from './common/formlyConfigs/notified-person';
import { notifierFacilityFormConfigFields } from './common/formlyConfigs/notifier';
import {
  CLIPBOARD_ERROR_DIALOG_MESSAGE,
  CLIPBOARD_ERROR_DIALOG_MESSAGE_DETAILS,
  CLIPBOARD_ERROR_DIALOG_TITLE,
  ImportFieldValuesService,
  ImportTargetComponent,
} from './services/import-field-values.service';
import { CopyAndKeepInSyncService } from './services/copy-and-keep-in-sync-service';
import { ProcessFormService } from './services/process-form-service';
import { NGXLogger } from 'ngx-logger';
import { cloneObject, MessageDialogService } from '@gematik/demis-portal-core-library';
import { Router } from '@angular/router';
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
})
export class DiseaseFormComponent implements OnInit, ImportTargetComponent {
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
      template: '<div class="loading-message"><h1>Bitte einen Moment Geduld</h1><p>Erkrankungsmeldung wird geladen...</p></div>',
    },
  ];

  private readonly matDialog = inject(MatDialog);
  private readonly ifsg61Service = inject(Ifsg61Service);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly tabsNavigationService = inject(TabsNavigationService);
  private readonly helpers = inject(HelpersService);
  private readonly importFieldValuesService = inject(ImportFieldValuesService);
  private readonly progressService = inject(ProgressService);
  private readonly copyAndKeepInSyncService = inject(CopyAndKeepInSyncService);
  private readonly processFormService = inject(ProcessFormService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly logger = inject(NGXLogger);
  private readonly router = inject(Router);

  isNonNominal: boolean = false;

  constructor() {
    this.token = (window as any)['token'];
  }

  notifierFields: FormlyFieldConfig[] = [];
  notifiedPersonFields: FormlyFieldConfig[] = [];
  diseaseChoiceFields: FormlyFieldConfig[] = [];
  conditionFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
  diseaseCommonFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
  questionnaireFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;

  prevDiseaseCode?: string;
  formOptions: FormlyFormOptions = {};

  initHook = (field: FormlyFieldConfig) => {
    return field.options!.fieldChanges!.pipe(
      tap((e: FormlyValueChangeEvent) => {
        this.storeFacilityOnUpdate(e);
        this.handleFieldChange(e);
      })
    );
  };

  ngOnInit() {
    const notifierJson = localStorage.getItem(IFSG61_NOTIFIER);
    this.model.tabNotifier = notifierJson ? JSON.parse(notifierJson) : {};
    if (this.router.url === '/disease-notification/7_3/non-nominal' && environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION) {
      this.isNonNominal = true;
    }
    //set default country for all addresses to germany.
    this.model.tabNotifier.address = {
      ...this.model.tabNotifier.address,
      country: 'DE',
    };

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
        statusNote: '',
        initialNotificationId: '',
      },
    };

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

          this.notifiedPersonFields = notifiedPersonFormConfigFields(true);

          this.ifsg61Service
            .getDiseaseOptions()
            .pipe(take(1))
            .subscribe({
              next: (diseaseOptions: DemisCoding[]) => {
                this.diseaseChoiceFields = getDiseaseChoiceFields(diseaseOptions);
                this.combineFields();
              },
              error: (err: any) => {
                this.handleError(err, 'Meldetatbestände nicht verfügbar');
              },
            });
        },
        error: (err: any) => {
          this.handleError(err, 'Typen nicht abrufbar');
        },
      });
  }

  // TODO: Remove this getter, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
  public get FEATURE_FLAG_PORTAL_PASTEBOX(): boolean {
    return environment.diseaseConfig.featureFlags?.FEATURE_FLAG_PORTAL_PASTEBOX;
  }

  private handleError(error: any, message: string) {
    if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_PORTAL_ERROR_DIALOG) {
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
    } else {
      this.helpers.displayError(error, 'Systemfehler: ' + message);
      // timeout to give the user a chance to read the error message
      setTimeout(() => {
        this.helpers.exitApplication();
      }, 2000);
    }
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

    if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_HOSP_COPY_CHECKBOXES) {
      this.copyAndKeepInSyncService.addChangeListenersForCopyCheckboxesInHospitalization(this.diseaseCommonFields, this.form, this.model);
    }

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
          {
            key: 'tabDiseaseCommon',
            props: { label: 'Klinische und epidemiologische Angaben' },
            fieldGroup: cloneObject(this.diseaseCommonFields),
          },
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

  chooseTabAfterChoosing() {
    this.navigateToTab(2);
  }

  async submitForm() {
    const notification = this.processFormService.createNotification(this.model);
    sortItems(notification.common.item, this.fieldSequence.tabDiseaseCommon);
    sortItems(notification.disease.item, this.fieldSequence.tabQuestionnaire);
    this.ifsg61Service.sendNotification(notification);
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
      if (e.value.code !== this.prevDiseaseCode) {
        if (e.value.code) {
          this.loadQuestionnaire(e.value.code).then(problems => {
            if (problems.length > 0) {
              if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_PORTAL_ERROR_DIALOG) {
                this.messageDialogService.showErrorDialog({
                  errorTitle: 'Systemfehler',
                  errors: problems.map(it => it.toErrorMessageFromCoreLibrary()),
                });
              } else {
                this.showErrorDialog('Systemfehler', problems);
              }
            }
          });
        } else if (this.prevDiseaseCode) {
          this.prevDiseaseCode = e.value.code;
        }
      }
    }
  }

  async loadQuestionnaire(diseaseCode: string): Promise<ErrorMessage[]> {
    this.prevDiseaseCode = diseaseCode;

    return lastValueFrom(
      this.ifsg61Service.getQuestionnaire(diseaseCode).pipe(
        tap((descriptor: QuestionnaireDescriptor) => {
          if (document.activeElement) (document.activeElement as HTMLInputElement)['blur']();
          this.resetDiseaseChoiceDependentInput();
          this.questionnaireFields = descriptor.questionnaireConfigs;
          this.conditionFields = descriptor.conditionConfigs || [];
          this.diseaseCommonFields = descriptor.commonConfig;
          this.combineFields();
          this.changeDetector.detectChanges();
          this.chooseTabAfterChoosing();
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
    const maxMasern = new MaxMasern();
    const j = JSON.stringify(maxMasern.maxMasernDummy);
    this.model = JSON.parse(j);
    const descriptor = await this.loadQuestionnaire(maxMasern.maxMasernDummy.tabDiseaseChoice.diseaseChoice.answer.valueCoding.code);
    setTimeout(() => {
      this.model = JSON.parse(j);
    }, 10);
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
    const dialogRef = this.progressService.startSpinner('Zwischenablage wird übernommen');
    try {
      window.focus();
      const keyValuePairs: string[][] = this.FEATURE_FLAG_PORTAL_PASTEBOX
        ? [...(keyValuePairsFromClipboard ?? [])]
        : await this.importFieldValuesService.getClipboardKVs();
      const problems: ErrorMessage[] = await this.importFieldValuesService.fillModelFromKVs(this, keyValuePairs, {
        ...PERSON_RULES,
        ...PERSON_ADDRESS_RULES,
        ...FACILITY_RULES,
      });

      if (problems.length > 0) {
        if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_PORTAL_ERROR_DIALOG) {
          this.messageDialogService.showErrorDialog({
            errorTitle: 'Fehler bei der Datenübernahme',
            errors: problems.map(it => it.toErrorMessageFromCoreLibrary()),
          });
        } else {
          this.showErrorDialog('Fehler bei der Datenübernahme', problems);
        }
      } else {
        window.navigator.clipboard.writeText('');
      }
    } catch (error) {
      this.logger.error(error);
      if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_PORTAL_ERROR_DIALOG) {
        this.logger.error(error);
        this.messageDialogService.showErrorDialogInsertDataFromClipboard();
      } else {
        this.matDialog.open(
          ErrorMessageDialogComponent,
          ErrorMessageDialogComponent.getErrorDialogClose({
            title: CLIPBOARD_ERROR_DIALOG_TITLE,
            message: CLIPBOARD_ERROR_DIALOG_MESSAGE,
            messageDetails: CLIPBOARD_ERROR_DIALOG_MESSAGE_DETAILS,
            type: MessageType.WARNING,
            error,
          })
        );
      }
    } finally {
      dialogRef?.close();
    }
  }

  /**
   * Can be removed as soon as feature flag "FEATURE_FLAG_PORTAL_ERROR_DIALOG" is active on all stages
   * */
  private showErrorDialog(title: string, problems: ErrorMessage[]) {
    const error: ErrorResult = {
      type: MessageType.ERROR,
      title,
      message: '',
      messageDetails: ' ',
      problems,
    };
    this.matDialog.open(ErrorMessageDialogComponent, {
      maxWidth: '50vw',
      minHeight: '40vh',
      data: error,
    });
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
}
