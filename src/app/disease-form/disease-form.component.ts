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

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, inject, OnInit, Signal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';
import { lastValueFrom, Subscription, take, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FACILITY_RULES, PERSON_ADDRESS_RULES, PERSON_RULES } from '../data-transfer/functionRules';
import { DemisCoding, QuestionnaireDescriptor } from '../demis-types';
import { formatItems, makeFieldSequence, sortItems } from '../format-items';
import { Ifsg61Service } from '../ifsg61.service';
import { ErrorResult, MessageType } from '../legacy/message';
import { AddressType, DiseaseNotification, DiseaseStatus, NotifiedPersonAddressInfo } from '../../api/notification';
import { ErrorMessage } from '../shared/error-message';
import { ErrorMessageDialogComponent } from '../shared/error-message-dialog/error-message-dialog.component';
import { TabsNavigationService } from '../shared/formly/components/tabs-navigation/tabs-navigation.service';
import { HelpersService } from '../shared/helpers.service';
import { ProgressService } from '../shared/progress.service';
import { createExpressions, dateStringToIso } from '../shared/utils';
import { getDiseaseChoiceFields } from './common/formlyConfigs/disease-choice';
import { MaxMasern } from './common/maxMasern';
import { notifiedPersonFormConfigFields } from './common/formlyConfigs/notified-person';
import { notifierFacilityFormConfigFields } from './common/formlyConfigs/notifier';
import { ImportFieldValuesService, ImportTargetComponent } from './services/import-field-values.service';
import { cloneObject, trimStrings } from '@gematik/demis-portal-core-library';
import { ExtendedSalutationEnum } from '../legacy/common-utils';
import { CopyCheckboxesInHospitalization } from './services/copy-checkboxes-in-hospitalization-service';
import StatusEnum = DiseaseStatus.StatusEnum;

const CLIPBOARD_ERROR_DIALOG_TITLE = 'Fehler beim Einlesen der Daten aus der Zwischenablage';
const CLIPBOARD_ERROR_DIALOG_MESSAGE = 'Bei der Datenübernahme ist ein Fehler aufgetreten.';
const CLIPBOARD_ERROR_DIALOG_MESSAGE_DETAILS =
  'Diese Daten werden aus der Zwischenablage importiert. Bitte wenden Sie sich an Ihre IT zur Konfiguration des Datenimports. Weitere Informationen finden Sie in der DEMIS Wissensdatenbank unter "<a href="https://wiki.gematik.de/x/fGFCH" target="_blank">Übergabe von Daten aus dem Primärsystem</a>".';

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

function makeCondition(condition: Record<string, any> | undefined) {
  return {
    recordedDate: dateStringToIso(answer(condition, 'recordedDate', 'valueDate')),
    onset: dateStringToIso(answer(condition, 'onset', 'valueDate')),
    note: answer(condition, 'note', 'valueString'),
    evidence: answer(condition, 'evidence', 'valueCoding'),
    verificationStatus: answer(condition, 'verificationStatus', 'valueCoding')?.code,
  };
}

function answer(condition: Record<string, any | undefined> | undefined, key: string, typeTag: string): any {
  if (!condition) return undefined;
  const prop = condition[key];
  if (!prop) return undefined;
  if (Array.isArray(prop)) {
    return prop.filter(item => item).map(item => item.answer[typeTag]);
  } else {
    return prop?.answer[typeTag];
  }
}

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
  private readonly copyCheckboxesInHospitalization = inject(CopyCheckboxesInHospitalization);

  private subscriptions = new Map<string, Subscription>();

  constructor() {
    this.token = (window as any)['token'];
  }

  notifierFields: FormlyFieldConfig[] = [];
  notifiedPersonFields: FormlyFieldConfig[] = [];
  diseaseChoiceFields: FormlyFieldConfig[] = [];
  diseaseCommonFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
  questionnaireFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
  conditionFields: FormlyFieldConfig[] = NO_DISEASE_CHOOSEN;
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

    //set default country for all addresses to germany.
    this.model.tabNotifier.address = {
      ...this.model.tabNotifier.address,
      country: 'DE',
    };
    //initialize contacts with one empty phone because phone number of email is required
    if (!this.model.tabNotifier.contacts || (!this.model.tabNotifier.contacts.phoneNumbers && !this.model.tabNotifier.contacts.emailAddresses)) {
      this.model.tabNotifier.contacts = {
        ...this.model.tabNotifier.contacts,
        phoneNumbers: [
          {
            contactType: 'phone',
            value: '',
          },
        ],
      };
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
                this.helpers.displayError(err, 'Systemfehler: Meldetatbestände nicht verfügbar');
                this.helpers.exitApplication();
              },
            });
        },
        error: (err: any) => {
          this.helpers.displayError(err, 'Systemfehler: Typen nicht abrufbar');
          this.helpers.exitApplication();
        },
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

    if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_HOSP_COPY_CHECKBOXES) {
      this.copyCheckboxesInHospitalization.addChangeListeners(this.diseaseCommonFields, this.form, this.model);
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

  subscribeToCurrentAddressTypeChanges(e: FormlyValueChangeEvent) {
    const currentAddressField = this.notifiedPersonFields.find(field => field.key === 'currentAddress') as FormlyFieldConfig;
    const currentAddressTypeField = this.notifiedPersonFields.find(field => field.id === 'currentAddressType') as FormlyFieldConfig;
    const currentAddressInstitutionNameField = this.notifiedPersonFields.find(field => field.id === 'currentAddressInstitutionName') as FormlyFieldConfig;

    let keyForNotifierAddressSubscription = e.field.id + '-subscribeToNotifierAddress';
    let keyForNotifierInstitutionNameSubscription = e.field.id + '-subscribeToNotifierInstitutionName';

    //reset input data on value change
    setTimeout(() => {
      currentAddressField?.formControl?.reset();
      currentAddressInstitutionNameField?.formControl?.reset();
      if (!this.model.tabPatient.currentAddress?.fromClipboard) {
        currentAddressField?.fieldGroup?.forEach(f => {
          f.formControl?.setValue(f.key === 'country' ? 'DE' : '');
        });
        currentAddressInstitutionNameField?.formControl?.setValue('');
      }
    });

    if (e.value === AddressType.SubmittingFacility) {
      const sourceAddressInstitutionName = this.getNotifierInstitutionNameIfNotBlank();
      const sourceAddress = this.getNotifierAddressIfCopyable();
      if (sourceAddressInstitutionName === null || sourceAddress === null) {
        this.showErrorDialog('Fehler bei der Auswahl der Adresse. Bitte geben Sie die Daten im Formular Meldende Person zunächst vollständig an.', [
          { message: 'Bitte geben Sie die Daten im Formular Meldende Person zunächst vollständig an.' } as ErrorMessage,
        ]);
        setTimeout(() => {
          currentAddressTypeField?.formControl?.setValue(null);
        });
      } else {
        setTimeout(() => {
          //InstitutionName
          currentAddressInstitutionNameField?.formControl?.setValue(sourceAddressInstitutionName.value);
          const subscriptionInstitutionName = sourceAddressInstitutionName.valueChanges.subscribe(newValue => {
            currentAddressInstitutionNameField?.formControl?.setValue(newValue);
          });
          this.subscriptions.set(keyForNotifierInstitutionNameSubscription, subscriptionInstitutionName);

          //Address
          this.patchAddressInNotifiedPersonCurrentAddress(currentAddressField, sourceAddress.value);
          const subscriptionCurrentAddress = sourceAddress.valueChanges.subscribe(newValue => {
            this.patchAddressInNotifiedPersonCurrentAddress(currentAddressField, newValue);
          });
          this.subscriptions.set(keyForNotifierAddressSubscription, subscriptionCurrentAddress);
        });
      }
    } else {
      this.removeSubscriptions([keyForNotifierInstitutionNameSubscription, keyForNotifierAddressSubscription]);
    }
  }

  async submitForm() {
    const message: DiseaseNotification = {
      status: {
        category: this.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding.code,
        status: this.model.tabDiseaseChoice.clinicalStatus.answer.valueString,
        note: this.model.tabDiseaseChoice.statusNoteGroup.statusNote.answer?.valueString,
        initialNotificationId: this.model.tabDiseaseChoice.statusNoteGroup.initialNotificationId.answer?.valueString,
      },
      notifierFacility: {
        address: this.model.tabNotifier.address,
        contact: {
          ...this.model.tabNotifier.contact,
          salutation:
            !!this.model.tabNotifier.contact?.salutation && this.model.tabNotifier.contact.salutation !== ExtendedSalutationEnum.None
              ? this.model.tabNotifier.contact.salutation
              : undefined,
        },
        contacts: [...this.model.tabNotifier.contacts.emailAddresses, ...this.model.tabNotifier.contacts.phoneNumbers],
        facilityInfo: {
          ...this.model.tabNotifier.facilityInfo,
          organizationType: this.model.tabNotifier.facilityInfo.organizationType.answer.valueCoding.code,
        },
        oneTimeCode: this.model.tabNotifier.oneTimeCode,
      },
      notifiedPerson: {
        info: this.model.tabPatient.info,
        currentAddress: this.addAddressType(
          this.model.tabPatient.currentAddressType === 'primaryAsCurrent' ? this.model.tabPatient.residenceAddress : this.model.tabPatient.currentAddress,
          this.model.tabPatient.currentAddressType,
          this.model.tabPatient.currentAddressInstitutionName
        ),
        residenceAddress: this.addAddressType(this.model.tabPatient.residenceAddress, this.model.tabPatient.residenceAddressType),
        contacts: [...this.model.tabPatient.contacts.emailAddresses, ...this.model.tabPatient.contacts.phoneNumbers],
      },
      condition: makeCondition(this.model.tabDiseaseCondition),
      common: {
        questionnaire: 'common',
        item: formatItems(this.model.tabDiseaseCommon),
      },
      disease: {
        questionnaire: this.model.tabDiseaseChoice.diseaseChoice.answer.valueCoding.code,
        item: formatItems(this.model.tabQuestionnaire),
      },
    };

    // final cleanup
    const trimmedMessage: DiseaseNotification = trimStrings(message);
    trimmedMessage.notifiedPerson.info.birthDate = dateStringToIso(trimmedMessage.notifiedPerson.info.birthDate);
    sortItems(trimmedMessage.common.item, this.fieldSequence.tabDiseaseCommon);
    sortItems(trimmedMessage.disease.item, this.fieldSequence.tabQuestionnaire);

    this.ifsg61Service.sendNotification(trimmedMessage);
  }

  private addAddressType(address: NotifiedPersonAddressInfo, type: AddressType, institutionName?: string): NotifiedPersonAddressInfo {
    return { ...address, addressType: type, ...(institutionName ? { additionalInfo: institutionName } : {}) };
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
      this.subscribeToCurrentAddressTypeChanges(e);
    }

    if (e.field.id === 'disease-choice' && e.type === 'valueChanges') {
      if (e.value.code !== this.prevDiseaseCode) {
        if (e.value.code) {
          this.loadQuestionnaire(e.value.code).then(problems => {
            if (problems.length > 0) {
              this.showErrorDialog('Systemfehler', problems);
            }
          });
        } else if (this.prevDiseaseCode) {
          this.prevDiseaseCode = e.value.code;
        }
      }
    }
  }

  private removeSubscriptions(subscriptionKeys: string[]) {
    subscriptionKeys.forEach(key => {
      if (this.subscriptions.has(key)) {
        this.subscriptions.get(key)?.unsubscribe(); // Unsubscribe
        this.subscriptions.delete(key); // Remove from the map
      }
    });
  }

  private patchAddressInNotifiedPersonCurrentAddress(targetAddressField: FormlyFieldConfig, sourceAddressValue: any) {
    targetAddressField?.formControl?.patchValue({
      street: sourceAddressValue.street,
      houseNumber: sourceAddressValue.houseNumber,
      zip: sourceAddressValue.zip,
      city: sourceAddressValue.city,
    });
  }

  private getNotifierInstitutionNameIfNotBlank(): AbstractControl | null {
    if (!this.model?.tabNotifier?.facilityInfo?.institutionName?.trim()) {
      return null;
    }
    return this.form.get('tabNotifier.facilityInfo.institutionName');
  }

  private getNotifierAddressIfCopyable(): AbstractControl | null {
    const address = this.model.tabNotifier.address;
    const mandatoryFieldsNotFilled = !address.street?.trim() || !address.zip?.trim() || !address.city?.trim() || !address.houseNumber?.trim();
    if (mandatoryFieldsNotFilled) {
      return null;
    }
    return this.form.get('tabNotifier.address');
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
          return [new ErrorMessage('E0005', (reason as HttpErrorResponse).error?.message)];
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

  async paste() {
    const dialogRef = this.progressService.startSpinner('Zwischenablage wird übernommen');
    try {
      window.focus();
      const keyValuePairs: string[][] = await this.importFieldValuesService.getClipboardKVs();
      const problems: ErrorMessage[] = await this.importFieldValuesService.fillModelFromKVs(this, keyValuePairs, {
        ...PERSON_RULES,
        ...PERSON_ADDRESS_RULES,
        ...FACILITY_RULES,
      });

      if (problems.length > 0) {
        this.showErrorDialog('Fehler bei der Datenübernahme', problems);
      } else {
        window.navigator.clipboard.writeText('');
      }
    } catch (error) {
      console.error(error);

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
    } finally {
      dialogRef?.close();
    }
  }

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
