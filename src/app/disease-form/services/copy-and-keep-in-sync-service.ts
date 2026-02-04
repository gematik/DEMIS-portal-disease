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

import { inject, Injectable } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AddressType } from '../../../api/notification';
import { findFormlyFieldIterativeByKey } from '../../shared/utils';
import { AddressAsModel, ContactsAsModel } from '../common/formlyConfigs/formly-base';
import { PractitionerInfoAsModel } from '../common/formlyConfigs/notifier';
import { DemisCoding } from '../../demis-types';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';
import { MessageDialogService } from '@gematik/demis-portal-core-library';

@Injectable({
  providedIn: 'root', // Makes it available app-wide
})
export class CopyAndKeepInSyncService {
  private messageDialogService = inject(MessageDialogService);

  static readonly MESSAGE_COPY_IMPOSSIBLE: string = 'Datenübernahme nicht möglich';
  static readonly MESSAGE_ERROR_COPY_CONTACT: string =
    'Option ist nur verfügbar, wenn der derzeitige Aufenthaltsort der betroffenen Person vom Typ "Adresse der meldenden Einrichtung" ist und die Pflichtfelder befüllt sind.';
  static readonly MESSAGE_ERROR_COPY_ADDRESS: string =
    'Option ist nur verfügbar, wenn für die betroffene Person eine Einrichtung als derzeitiger Aufenthaltsort ausgewählt wurde und die Pflichtfelder befüllt sind.';
  static readonly MESSAGE_ERROR_COPY_NOTIFIER: string = 'Bitte geben Sie die Daten im Formular Meldende Person zunächst vollständig an.';

  private subscriptions: Map<string, Subscription>;

  constructor() {
    this.subscriptions = new Map<string, Subscription>();
  }

  addChangeListenersForCopyCheckboxesInHospitalization(diseaseCommonFields: FormlyFieldConfig[], form: FormGroup, model: any, isFollowUpNotification: boolean) {
    const copyNotifiedPersonCurrentAddress = findFormlyFieldIterativeByKey(diseaseCommonFields, 'copyNotifiedPersonCurrentAddress');
    if (copyNotifiedPersonCurrentAddress) {
      copyNotifiedPersonCurrentAddress.expressions = {
        ...copyNotifiedPersonCurrentAddress.expressions,
        hide: () => isFollowUpNotification,
      };
      copyNotifiedPersonCurrentAddress.props = {
        ...copyNotifiedPersonCurrentAddress.props,
        change: (field: FormlyFieldConfig) => {
          this.subscribeToCheckboxCopyNotifiedPersonCurrentAddress(field, form, model);
        },
      };
    }

    const copyNotifierContact = findFormlyFieldIterativeByKey(diseaseCommonFields, 'copyNotifierContact');
    if (copyNotifierContact) {
      copyNotifierContact.expressions = {
        ...copyNotifierContact.expressions,
        hide: () => isFollowUpNotification,
      };
      copyNotifierContact.props = {
        ...copyNotifierContact.props,
        change: (field: FormlyFieldConfig) => {
          this.subscribeToCheckboxCopyNotifierContact(field, form, model);
        },
      };
    }
  }

  private subscribeToCheckboxCopyNotifiedPersonCurrentAddress(field: FormlyFieldConfig, form: FormGroup, model: any) {
    const addressTargetInHospitalization = new AddressTargetInHospitalization(
      field.parent?.fieldGroup?.find(field => field.key === 'name.answer.valueString') as FormlyFieldConfig,
      field.parent?.fieldGroup?.find(field => field.key === 'address') as FormlyFieldConfig
    );

    if (field.formControl?.value) {
      const sourceAddressInstitutionName = this.getCurrentAddressInstitutionNameIfNotBlank(model, form);
      const sourceAddressControl = this.getCurrentAddressIfCopyable(model, form);
      if (sourceAddressControl === null || sourceAddressInstitutionName === null) {
        this.messageDialogService.showErrorDialog({
          errorTitle: CopyAndKeepInSyncService.MESSAGE_COPY_IMPOSSIBLE,
          errors: [
            {
              text: CopyAndKeepInSyncService.MESSAGE_ERROR_COPY_ADDRESS,
            },
          ],
        });
        field.formControl?.setValue(false);
      } else {
        addressTargetInHospitalization.resetIfCurrentAddressTypeChanges(field, form);
        addressTargetInHospitalization.patch(sourceAddressInstitutionName.value, sourceAddressControl.value);
        addressTargetInHospitalization.disableAll();

        sourceAddressInstitutionName.valueChanges.subscribe(newValue => {
          if (field.formControl?.value) {
            addressTargetInHospitalization.patchInstitutionName(newValue);
          }
        });

        sourceAddressControl.valueChanges.subscribe(newValue => {
          if (field.formControl?.value) {
            addressTargetInHospitalization.patchAddressInHospitalization(newValue);
          }
        });
      }
    } else {
      addressTargetInHospitalization.resetAll();
      addressTargetInHospitalization.enableAll();
    }
  }

  private subscribeToCheckboxCopyNotifierContact(field: FormlyFieldConfig, form: FormGroup, model: any) {
    const contactTargetInHospitalization = new ContactTargetInHospitalization(
      findFormlyFieldIterativeByKey([field.parent] as FormlyFieldConfig[], 'name.prefix.answer.valueString') as FormlyFieldConfig,
      findFormlyFieldIterativeByKey([field.parent] as FormlyFieldConfig[], 'name.given.answer.valueString') as FormlyFieldConfig,
      findFormlyFieldIterativeByKey([field.parent] as FormlyFieldConfig[], 'name.family.answer.valueString') as FormlyFieldConfig,
      findFormlyFieldIterativeByKey([field?.parent?.parent] as FormlyFieldConfig[], 'phone.answer.valueString') as FormlyFieldConfig,
      findFormlyFieldIterativeByKey([field?.parent?.parent] as FormlyFieldConfig[], 'email.answer.valueString') as FormlyFieldConfig
    );

    let keyForContactPersonSubscription = field.id + '-subscribeToContactPerson';
    let keyForContactPhoneEmailSubscription = field.id + '-subscribeToContactPhoneEmail';

    if (field.formControl?.value) {
      const sourceNotifierContactPersonControl = this.getNotifierContactControlIfCopyable(model, form);
      const sourceNotifierPhoneAndEmail = this.getNotifierPhoneAndEmail(form);
      if (sourceNotifierContactPersonControl === null) {
        this.messageDialogService.showErrorDialog({
          errorTitle: CopyAndKeepInSyncService.MESSAGE_COPY_IMPOSSIBLE,
          errors: [
            {
              text: CopyAndKeepInSyncService.MESSAGE_ERROR_COPY_CONTACT,
            },
          ],
        });
        field.formControl?.setValue(false);
      } else {
        contactTargetInHospitalization.resetIfCurrentAddressTypeChanges(field, form);
        contactTargetInHospitalization.patch(sourceNotifierContactPersonControl.value, sourceNotifierPhoneAndEmail?.value);
        contactTargetInHospitalization.disableAll();

        const subscriptionContactPerson = sourceNotifierContactPersonControl.valueChanges.subscribe(newValue => {
          contactTargetInHospitalization.patchContactPerson(newValue);
        });
        this.subscriptions.set(keyForContactPersonSubscription, subscriptionContactPerson);

        const subscriptionPhoneAndEmail = sourceNotifierPhoneAndEmail!.valueChanges.subscribe(newValue => {
          contactTargetInHospitalization.patchPhoneAndEmail(newValue);
        });
        this.subscriptions.set(keyForContactPhoneEmailSubscription, subscriptionPhoneAndEmail);
      }
    } else {
      contactTargetInHospitalization.resetAll();
      contactTargetInHospitalization.enableAll();
      contactTargetInHospitalization.removeAllSubscriptionsForField(this.subscriptions, field);
    }
  }

  subscribeToCurrentAddressTypeChanges(e: FormlyValueChangeEvent, notifiedPersonFields: FormlyFieldConfig[], form: FormGroup, model: any) {
    const currentAddressField = notifiedPersonFields.find(field => field.key === 'currentAddress') as FormlyFieldConfig;
    const currentAddressTypeField = notifiedPersonFields.find(field => field.id === 'currentAddressType') as FormlyFieldConfig;
    const currentAddressInstitutionNameField = notifiedPersonFields.find(field => field.id === 'currentAddressInstitutionName') as FormlyFieldConfig;

    let keyForNotifierAddressSubscription = e.field.id + '-subscribeToNotifierAddress';
    let keyForNotifierInstitutionNameSubscription = e.field.id + '-subscribeToNotifierInstitutionName';

    //reset input data on value change
    setTimeout(() => {
      currentAddressField?.formControl?.reset();
      currentAddressInstitutionNameField?.formControl?.reset();
      if (!model.tabPatient.currentAddress?.fromClipboard) {
        currentAddressField?.fieldGroup?.forEach(f => {
          f.formControl?.setValue(f.key === 'country' ? 'DE' : '');
        });
        currentAddressInstitutionNameField?.formControl?.setValue('');
      }
    });

    if (e.value === AddressType.SubmittingFacility) {
      const sourceAddressInstitutionName = this.getNotifierInstitutionNameIfNotBlank(model, form);
      const sourceAddress = this.getNotifierAddressIfCopyable(model, form);
      if (sourceAddressInstitutionName === null || sourceAddress === null) {
        this.changeToSubmittingFacilityImpossible(currentAddressTypeField);
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
      CopyTargetField.removeSubscriptions(this.subscriptions, [keyForNotifierInstitutionNameSubscription, keyForNotifierAddressSubscription]);
    }
  }

  private changeToSubmittingFacilityImpossible(currentAddressTypeField: FormlyFieldConfig) {
    this.messageDialogService.showErrorDialog({
      errorTitle: CopyAndKeepInSyncService.MESSAGE_COPY_IMPOSSIBLE,
      errors: [
        {
          text: CopyAndKeepInSyncService.MESSAGE_ERROR_COPY_NOTIFIER,
        },
      ],
    });
    setTimeout(() => {
      currentAddressTypeField?.formControl?.setValue(null);
    });
  }

  private getCurrentAddressInstitutionNameIfNotBlank(model: any, form: FormGroup): AbstractControl<string> | null {
    if (!model.tabPatient?.currentAddressInstitutionName?.trim()) {
      return null;
    }
    return form.get('tabPatient.currentAddressInstitutionName');
  }

  private getCurrentAddressIfCopyable(model: any, form: FormGroup): AbstractControl<AddressAsModel> | null {
    const wrongAddressType =
      model.tabPatient?.currentAddressType !== AddressType?.SubmittingFacility && model.tabPatient?.currentAddressType !== AddressType.OtherFacility;
    const mandatoryFieldsNotFilled = !model.tabPatient?.currentAddress?.zip?.trim() || !model.tabPatient?.currentAddress?.country?.trim();
    if (wrongAddressType || mandatoryFieldsNotFilled) {
      return null;
    }
    return form.get('tabPatient.currentAddress');
  }

  private getNotifierContactControlIfCopyable(model: any, form: FormGroup): AbstractControl<PractitionerInfoAsModel> | null {
    const wrongAddressType = model.tabPatient?.currentAddressType !== AddressType.SubmittingFacility;
    const mandatoryFieldsNotFilled = !model.tabNotifier?.contact?.firstname?.trim() || !model.tabNotifier?.contact?.lastname?.trim();
    if (wrongAddressType || mandatoryFieldsNotFilled) {
      return null;
    }
    return form.get('tabNotifier.contact');
  }

  private getNotifierInstitutionNameIfNotBlank(model: any, form: FormGroup): AbstractControl | null {
    if (!model?.tabNotifier?.facilityInfo?.institutionName?.trim()) {
      return null;
    }
    return form.get('tabNotifier.facilityInfo.institutionName');
  }

  private getNotifierPhoneAndEmail(form: FormGroup): AbstractControl<ContactsAsModel> | null {
    return form.get('tabNotifier.contacts');
  }

  private patchAddressInNotifiedPersonCurrentAddress(targetAddressField: FormlyFieldConfig, sourceAddressValue: any) {
    targetAddressField?.formControl?.patchValue({
      street: sourceAddressValue.street,
      houseNumber: sourceAddressValue.houseNumber,
      zip: sourceAddressValue.zip,
      city: sourceAddressValue.city,
    });
  }

  private getNotifierAddressIfCopyable(model: any, form: FormGroup): AbstractControl | null {
    const address = model.tabNotifier.address;
    const mandatoryFieldsNotFilled = !address.street?.trim() || !address.zip?.trim() || !address.city?.trim() || !address.houseNumber?.trim();
    if (mandatoryFieldsNotFilled) {
      return null;
    }
    return form.get('tabNotifier.address');
  }
}

class CopyTargetField {
  resetIfCurrentAddressTypeChanges(field: FormlyFieldConfig, form: FormGroup): void {
    form
      .get('tabPatient.currentAddressType')
      ?.valueChanges.pipe(take(1))
      .subscribe(() => {
        field.formControl?.setValue(false);
        this.resetAll();
        this.enableAll();
      });
  }

  public disableAll(): void {
    Object.values(this).forEach(field => field?.formControl?.disable());
  }

  public enableAll(): void {
    Object.values(this).forEach(field => field?.formControl?.enable());
  }

  public resetAll(): void {
    Object.values(this).forEach(field => field?.formControl?.reset(null));
  }

  removeAllSubscriptionsForField(subscriptions: Map<string, Subscription>, field: FormlyFieldConfig) {
    const fieldId = field.id;
    if (!fieldId) return;
    const matchingKeys = Array.from(subscriptions.keys()).filter(key => key.includes(fieldId));
    CopyTargetField.removeSubscriptions(subscriptions, matchingKeys);
  }

  public static removeSubscriptions(subscriptions: Map<string, Subscription>, subscriptionKeys: string[]) {
    subscriptionKeys.forEach(key => {
      if (subscriptions.has(key)) {
        subscriptions.get(key)?.unsubscribe(); // Unsubscribe
        subscriptions.delete(key); // Remove from the map
      }
    });
  }
}

/**
 * This class is used to group the fields that are related to the contact person in the hospitalization form.
 */
class ContactTargetInHospitalization extends CopyTargetField {
  constructor(
    public targetPrefixField: FormlyFieldConfig,
    public targetFirstNameField: FormlyFieldConfig,
    public targetLastNameField: FormlyFieldConfig,
    public targetPhoneField: FormlyFieldConfig,
    public targetEmailField: FormlyFieldConfig
  ) {
    super();
  }

  patch(contactPerson: PractitionerInfoAsModel, phoneAndEmail: ContactsAsModel | undefined) {
    this.patchContactPerson(contactPerson);
    this.patchPhoneAndEmail(phoneAndEmail);
  }

  patchContactPerson(value: PractitionerInfoAsModel) {
    const prefix = value.prefix;
    if (prefix) {
      this.targetPrefixField?.formControl?.setValue(prefix);
    }
    this.targetFirstNameField.formControl?.setValue(value.firstname);
    this.targetLastNameField.formControl?.setValue(value.lastname);
  }

  patchPhoneAndEmail(value: ContactsAsModel | undefined) {
    const phone = value?.phoneNumbers[0]?.value;
    const email = value?.emailAddresses[0]?.value;
    if (phone) {
      this.targetPhoneField?.formControl?.setValue(phone);
    }
    if (email) {
      this.targetEmailField?.formControl?.setValue(email);
    }
  }
}

/**
 * This class is used to group the fields that are related to the address (incl. institution's name) in the hospitalization form.
 */
class AddressTargetInHospitalization extends CopyTargetField {
  constructor(
    public institutionNameField: FormlyFieldConfig,
    public addressGroup: FormlyFieldConfig
  ) {
    super();
  }

  patch(newInstitutionsName: string, newAddress: AddressAsModel) {
    this.patchInstitutionName(newInstitutionsName);
    this.patchAddressInHospitalization(newAddress);
  }

  patchInstitutionName(value: string) {
    this.institutionNameField.formControl?.setValue(value);
  }

  patchAddressInHospitalization(sourceAddressValue: AddressAsModel) {
    const countryFormlyField = this.addressGroup?.fieldGroup?.find(field => typeof field?.key === 'string' && field?.key?.includes('country'));
    const countryOptions: DemisCoding[] = countryFormlyField?.props?.options as DemisCoding[];
    const selectedCountryOption = countryOptions.find(opt => opt.code === sourceAddressValue.country);

    this.addressGroup?.formControl?.patchValue({
      street: { answer: { valueString: sourceAddressValue.street } },
      houseNumber: { answer: { valueString: sourceAddressValue.houseNumber } },
      postalCode: { answer: { valueString: sourceAddressValue.zip } },
      city: { answer: { valueString: sourceAddressValue.city } },
      country: {
        answer: {
          valueCoding: selectedCountryOption,
        },
      },
    });
  }
}
