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

import { DestroyRef, inject, Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { asapScheduler, merge, Subscription } from 'rxjs';
import { AddressType } from '../../api/notification';
import { DemisCoding } from '../demis-types';
// RETIRING(FEATURE_FLAG_CORE_SIDENAV): Rename to findFormlyFieldByKey when FEATURE_FLAG_CORE_SIDENAV is removed; the legacy strand still uses the current name.
import { findFormlyFieldIterativeByKey } from '../shared/utils';
import { clearFieldValue, disableField, enableField, writeFieldValue } from './formly-field-value.util';

/** Title of the error dialog shown when a mirror cannot be started. */
export const MIRROR_IMPOSSIBLE = 'Datenübernahme nicht möglich';
/** Shown when the notifier contact cannot be mirrored into the hospitalization contact. */
export const MIRROR_CONTACT_ERROR =
  'Option ist nur verfügbar, wenn der derzeitige Aufenthaltsort der betroffenen Person vom Typ "Adresse der meldenden Einrichtung" ist und die Pflichtfelder befüllt sind.';
/** Shown when the current address of the notified person cannot be mirrored into the hospitalization address. */
export const MIRROR_ADDRESS_ERROR =
  'Option ist nur verfügbar, wenn für die betroffene Person eine Einrichtung als derzeitiger Aufenthaltsort ausgewählt wurde und die Pflichtfelder befüllt sind.';
/** Shown when the notifier facility is incomplete and cannot be mirrored into the current address. */
export const MIRROR_NOTIFIER_ERROR = 'Bitte geben Sie die Daten im Formular Meldende Person zunächst vollständig an.';

/** Questionnaire keys defined by the backend; they control the hospitalization mirrors. */
const ADDRESS_MIRROR_CHECKBOX_KEY = 'copyNotifiedPersonCurrentAddress';
const CONTACT_MIRROR_CHECKBOX_KEY = 'copyNotifierContact';

/** An active mirror into the hospitalization section, started by one mirror checkbox. */
interface HospitalizationMirror {
  /** The mirror checkbox that controls this mirror. */
  checkbox: FormlyFieldConfig;
  /** Fields that receive the mirrored values and are locked while the mirror is active. */
  targets: FormlyFieldConfig[];
  /** Subscription to the source controls; ends when the mirror is released or discarded. */
  subscription: Subscription;
}

/** Target fields of the hospitalization contact; each is missing if the questionnaire lacks it. */
interface ContactTargets {
  prefix?: FormlyFieldConfig;
  firstName?: FormlyFieldConfig;
  lastName?: FormlyFieldConfig;
  phone?: FormlyFieldConfig;
  email?: FormlyFieldConfig;
}

/** Address structure of the notifier facility and the current address of the notified person. */
interface AddressValue {
  street?: string;
  houseNumber?: string;
  zip?: string;
  city?: string;
  country?: string;
}

const isBlank = (value: unknown) => typeof value !== 'string' || value.trim() === '';

/**
 * Mirrors source fields one-way into locked target fields across the side-navigation steps.
 *
 * A mirror copies the current source values into its targets, locks the targets and keeps them
 * up to date while the source changes. Releasing a mirror stops the updates, clears the targets
 * and unlocks them again. Three mirrors exist:
 *
 * - Notifier facility -> current address of the notified person, active while the current address
 *   type is "submitting facility".
 * - Current address of the notified person -> hospitalization address, controlled by the address
 *   mirror checkbox of the common questionnaire ({@link ADDRESS_MIRROR_CHECKBOX_KEY}).
 * - Notifier contact person -> hospitalization contact, controlled by the contact mirror checkbox
 *   of the common questionnaire ({@link CONTACT_MIRROR_CHECKBOX_KEY}).
 *
 * Values are written into the Formly model and the control, because the targets usually belong to
 * a step that is not rendered at that moment (see {@link writeFieldValue}).
 *
 * Provide this service in the host component: every mirror owns its subscriptions, which end on
 * unchecking, on questionnaire changes and when the host component is destroyed.
 */
@Injectable()
export class FieldMirroringService {
  private readonly messageDialogService = inject(MessageDialogService);
  /** Active hospitalization mirrors, keyed by their mirror checkbox. */
  private readonly hospitalizationMirrors = new Map<FormlyFieldConfig, HospitalizationMirror>();
  /** Keeps the current address in sync with the notifier facility while the type is "submitting facility". */
  private notifierToCurrentAddress?: Subscription;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.discardHospitalizationMirrors();
      this.notifierToCurrentAddress?.unsubscribe();
    });
  }

  /**
   * Connects the mirror checkboxes of a freshly loaded common questionnaire with this service.
   *
   * Discards subscriptions associated with the previous questionnaire, then configures handlers
   * on the new common fields. For follow-up notifications, both mirror checkboxes are hidden and
   * get no handler because hidden fields cannot emit a `change` event. Otherwise their existing
   * expressions are left untouched.
   *
   * Must be called before the common fields are built, because Formly reads `hide` and `props`
   * while building.
   * Existing mirrors are discarded before handlers are attached to the new fields.
   *
   * @param commonFields Field configuration of the common questionnaire; modified in place.
   * @param form Root form containing the `notifier` and `notifiedPerson` step groups used as sources.
   * @param isFollowUp Whether the notification is a follow-up notification.
   */
  attachHospitalizationMirrors(commonFields: FormlyFieldConfig[], form: FormGroup, isFollowUp: boolean): void {
    this.discardHospitalizationMirrors();
    if (isFollowUp) {
      this.hideMirrorCheckboxes(commonFields);
      return;
    }
    this.registerMirrorCheckboxChangeHandler(commonFields, ADDRESS_MIRROR_CHECKBOX_KEY, checkbox => this.toggleAddressMirror(checkbox, form));
    this.registerMirrorCheckboxChangeHandler(commonFields, CONTACT_MIRROR_CHECKBOX_KEY, checkbox => this.toggleContactMirror(checkbox, form));
  }

  /**
   * Hides both mirror checkboxes of the common questionnaire.
   *
   * @param commonFields Field configuration of the common questionnaire; modified in place.
   */
  private hideMirrorCheckboxes(commonFields: FormlyFieldConfig[]): void {
    for (const key of [ADDRESS_MIRROR_CHECKBOX_KEY, CONTACT_MIRROR_CHECKBOX_KEY]) {
      const checkbox = findFormlyFieldIterativeByKey(commonFields, key);
      if (checkbox) {
        checkbox.hide = true;
      }
    }
  }

  /**
   * Registers a `change` handler on a mirror checkbox of the common questionnaire.
   *
   * @param commonFields Field configuration of the common questionnaire; modified in place.
   * @param key Questionnaire key of the mirror checkbox.
   * @param onChange Called with the checkbox field whenever the user toggles it.
   */
  private registerMirrorCheckboxChangeHandler(commonFields: FormlyFieldConfig[], key: string, onChange: (checkbox: FormlyFieldConfig) => void): void {
    const checkbox = findFormlyFieldIterativeByKey(commonFields, key);
    if (checkbox) {
      checkbox.props = { ...checkbox.props, change: (field: FormlyFieldConfig) => onChange(field) };
    }
  }

  /**
   * Reacts to a changed current address type of the notified person.
   *
   * 1. Releases and unchecks all hospitalization mirrors, because their preconditions depend on the type.
   * 2. Stops mirroring the notifier facility into the current address.
   * 3. Resets the institution name and the current address (country to "DE"), unless the values
   *    were set by the clipboard import.
   * 4. For "submitting facility": mirrors the notifier's institution name and address into the
   *    current address and keeps them in sync. If the notifier facility is incomplete, an error
   *    dialog is shown and the type is reset to `null` instead.
   *
   * @param addressType The newly selected current address type.
   * @param patientFields Field configuration of the notified person step.
   * @param form Root form containing the `notifier` step group used as source.
   * @param currentAddressFromClipboard Whether the current address was set by the clipboard import and must be kept.
   */
  onCurrentAddressTypeChange(addressType: string | null, patientFields: FormlyFieldConfig[], form: FormGroup, currentAddressFromClipboard: boolean): void {
    // A type change invalidates both kinds of mirrors established for the previous type.
    this.releaseHospitalizationMirrors();
    this.notifierToCurrentAddress?.unsubscribe();
    this.notifierToCurrentAddress = undefined;

    // Resolve the fields once; they are used for reset, mirroring and expression updates below.
    const currentAddressTypeField = patientFields.find(field => field.key === 'currentAddressType');
    const targetInstitutionNameField = patientFields.find(field => field.key === 'currentAddressInstitutionName');
    const targetAddressField = patientFields.find(field => field.key === 'currentAddress');
    // TEMPORARY(clipboard-import-refactor): Replace this bypass when import processing handles
    // the address type and its dependent fields as one ordered update. Current per-value
    // callbacks would otherwise clear address values already applied by the same import.
    if (!currentAddressFromClipboard) {
      if (targetInstitutionNameField) writeFieldValue(targetInstitutionNameField, '');
      targetAddressField?.fieldGroup?.forEach(field => field.key && writeFieldValue(field, field.key === 'country' ? 'DE' : ''));
    }

    // Update the current-address expressions for the new type; only the submitting-facility type mirrors notifier data.
    if (addressType !== AddressType.SubmittingFacility) {
      this.scheduleCurrentAddressFieldExpressionUpdate(targetInstitutionNameField, targetAddressField);
      return;
    }
    const sourceNotifierName = form.get('notifier.facilityInfo.institutionName');
    const sourceNotifierAddress = form.get('notifier.address');
    const sourceNotifierAddressValue = sourceNotifierAddress?.value;
    if (
      !sourceNotifierName ||
      !sourceNotifierAddress ||
      isBlank(sourceNotifierName.value) ||
      ['street', 'zip', 'city', 'houseNumber'].some(key => isBlank(sourceNotifierAddressValue?.[key]))
    ) {
      this.showMirrorError(MIRROR_NOTIFIER_ERROR);
      // Reject the selected type instead of leaving the form in a state that claims an unavailable mirror.
      // The type control is still emitting, so the reset must happen after Formly has stored the current value
      if (currentAddressTypeField) {
        asapScheduler.schedule(() => {
          writeFieldValue(currentAddressTypeField, null);
          this.scheduleCurrentAddressFieldExpressionUpdate(targetInstitutionNameField, targetAddressField);
        });
      }
      return;
    }

    // Copy the current values once, then keep the patient address synchronized with notifier edits.
    this.writeCurrentAddress(targetInstitutionNameField, targetAddressField, sourceNotifierName, sourceNotifierAddress);
    this.scheduleCurrentAddressFieldExpressionUpdate(targetInstitutionNameField, targetAddressField);
    this.notifierToCurrentAddress = merge(sourceNotifierName.valueChanges, sourceNotifierAddress.valueChanges).subscribe(() =>
      this.writeCurrentAddress(targetInstitutionNameField, targetAddressField, sourceNotifierName, sourceNotifierAddress)
    );
  }

  /**
   * Writes the notifier facility into the current address of the notified person.
   *
   * @param targetInstitutionNameField Institution name field of the current address.
   * @param targetAddressField Address field group of the current address.
   * @param sourceNotifierName Institution name control of the notifier facility.
   * @param sourceNotifierAddress Address group of the notifier facility.
   */
  private writeCurrentAddress(
    targetInstitutionNameField: FormlyFieldConfig | undefined,
    targetAddressField: FormlyFieldConfig | undefined,
    sourceNotifierName: AbstractControl,
    sourceNotifierAddress: AbstractControl
  ): void {
    if (targetInstitutionNameField) writeFieldValue(targetInstitutionNameField, sourceNotifierName.value);
    if (targetAddressField) this.writeAddressParts(targetAddressField, sourceNotifierAddress.value);
  }

  /** Schedules Formly expression reevaluation after the parent form processes the changed control. */
  private scheduleCurrentAddressFieldExpressionUpdate(...fields: (FormlyFieldConfig | undefined)[]): void {
    // Child valueChanges fires before the parent FormGroup has recalculated its value.
    asapScheduler.schedule(() => fields.forEach(field => field?.options?.detectChanges?.(field)));
  }

  /**
   * Starts or releases the mirror from the current address of the notified person into the
   * hospitalization address (institution name and address), depending on the checkbox value.
   *
   * Starting requires the current address type "submitting facility" or "other facility", an
   * institution name, a zip code and a country. Otherwise an error dialog is shown and the
   * checkbox is unchecked again.
   *
   * @param checkbox The address mirror checkbox; its siblings are the targets.
   * @param form Root form containing the `notifiedPerson` step group used as source.
   */
  private toggleAddressMirror(checkbox: FormlyFieldConfig, form: FormGroup): void {
    if (!checkbox.formControl?.value) {
      this.releaseMirror(checkbox);
      return;
    }

    const nameTarget = checkbox.parent?.fieldGroup?.find(field => field.key === 'name.answer.valueString');
    const addressTarget = checkbox.parent?.fieldGroup?.find(field => field.key === 'address');
    const addressType = form.get('notifiedPerson.currentAddressType')?.value;
    const sourceName = form.get('notifiedPerson.currentAddressInstitutionName');
    const sourceAddress = form.get('notifiedPerson.currentAddress');
    const isMirrorable =
      [AddressType.SubmittingFacility, AddressType.OtherFacility].includes(addressType) &&
      !isBlank(sourceName?.value) &&
      !isBlank(sourceAddress?.value?.zip) &&
      !isBlank(sourceAddress?.value?.country);
    if (!isMirrorable || !sourceName || !sourceAddress || !nameTarget || !addressTarget) {
      this.rejectMirror(checkbox, MIRROR_ADDRESS_ERROR);
      return;
    }

    const targets: FormlyFieldConfig[] = [nameTarget, addressTarget];
    const addressMirrorFn = () => this.writeHospitalizationFacility(nameTarget, addressTarget, sourceName, sourceAddress);
    const sources = [sourceName, sourceAddress];
    this.startMirror(checkbox, targets, addressMirrorFn, sources);
  }

  /**
   * Writes the current address of the notified person into the hospitalization facility.
   *
   * @param nameTarget Institution name field of the hospitalization section.
   * @param addressTarget Address field group of the hospitalization section.
   * @param sourceName Institution name control of the current address.
   * @param sourceAddress Current address group of the notified person.
   */
  private writeHospitalizationFacility(
    nameTarget: FormlyFieldConfig,
    addressTarget: FormlyFieldConfig,
    sourceName: AbstractControl,
    sourceAddress: AbstractControl
  ): void {
    writeFieldValue(nameTarget, sourceName.value);
    this.writeHospitalizationAddress(addressTarget, sourceAddress.value);
  }

  /**
   * Starts or releases the mirror from the notifier contact person into the hospitalization
   * contact (prefix, first and last name, first phone number and first email address), depending
   * on the checkbox value.
   *
   * Starting requires the current address type "submitting facility" and the first and last name
   * of the notifier contact. Otherwise an error dialog is shown and the checkbox is unchecked again.
   * Prefix, phone and email are only written when the notifier provides them.
   *
   * @param checkbox The contact mirror checkbox; the targets are located relative to it.
   * @param form Root form containing the `notifier` and `notifiedPerson` step groups.
   */
  private toggleContactMirror(checkbox: FormlyFieldConfig, form: FormGroup): void {
    if (!checkbox.formControl?.value) {
      this.releaseMirror(checkbox);
      return;
    }

    const nameSection = checkbox.parent ? [checkbox.parent] : [];
    const contactSection = checkbox.parent?.parent ? [checkbox.parent.parent] : [];
    const targets: ContactTargets = {
      prefix: findFormlyFieldIterativeByKey(nameSection, 'name.prefix.answer.valueString'),
      firstName: findFormlyFieldIterativeByKey(nameSection, 'name.given.answer.valueString'),
      lastName: findFormlyFieldIterativeByKey(nameSection, 'name.family.answer.valueString'),
      phone: findFormlyFieldIterativeByKey(contactSection, 'phone.answer.valueString'),
      email: findFormlyFieldIterativeByKey(contactSection, 'email.answer.valueString'),
    };

    const contact = form.get('notifier.contact');
    const contacts = form.get('notifier.contacts');
    const isMirrorable =
      form.get('notifiedPerson.currentAddressType')?.value === AddressType.SubmittingFacility &&
      !isBlank(contact?.value?.firstname) &&
      !isBlank(contact?.value?.lastname);
    if (!isMirrorable || !contact || !targets.firstName || !targets.lastName) {
      this.rejectMirror(checkbox, MIRROR_CONTACT_ERROR);
      return;
    }

    const targetFields = Object.values(targets).filter((field): field is FormlyFieldConfig => !!field);
    const contactMirrorFn = () => this.writeHospitalizationContact(targets, contact, contacts);
    const sources = contacts ? [contact, contacts] : [contact];
    this.startMirror(checkbox, targetFields, contactMirrorFn, sources);
  }

  /**
   * Mirrors the notifier contact person into the hospitalization contact. Every available target
   * receives the current source value; optional prefix, phone and email targets are cleared when
   * their source value disappears (for example, when the last repeater entry is removed).
   *
   * @param targets Fields of the hospitalization contact.
   * @param contact Contact person group of the notifier.
   * @param contacts Phone numbers and email addresses of the notifier, if present.
   */
  private writeHospitalizationContact(targets: ContactTargets, contact: AbstractControl, contacts: AbstractControl | null): void {
    const phoneNumber = contacts?.value?.phoneNumbers?.[0]?.value;
    const emailAddress = contacts?.value?.emailAddresses?.[0]?.value;
    if (targets.prefix) writeFieldValue(targets.prefix, contact.value.prefix ?? null);
    if (targets.firstName) writeFieldValue(targets.firstName, contact.value.firstname ?? null);
    if (targets.lastName) writeFieldValue(targets.lastName, contact.value.lastname ?? null);
    if (targets.phone) writeFieldValue(targets.phone, phoneNumber ?? null);
    if (targets.email) writeFieldValue(targets.email, emailAddress ?? null);
  }

  /**
   * Starts a hospitalization mirror: writes the current source values, locks the targets and
   * repeats the mirroring on every change of a source control. An already active mirror of the
   * same checkbox is replaced.
   *
   * @param checkbox The mirror checkbox that controls the mirror.
   * @param targets Fields that receive the values and are locked.
   * @param mirrorFn Writes the current source values into the targets.
   * @param sources Controls whose changes trigger the mirroring.
   */
  private startMirror(checkbox: FormlyFieldConfig, targets: FormlyFieldConfig[], mirrorFn: () => void, sources: AbstractControl[]): void {
    // Replace any prior start for this checkbox so stale subscriptions cannot keep mirroring.
    this.hospitalizationMirrors.get(checkbox)?.subscription.unsubscribe();
    mirrorFn();
    targets.forEach(target => disableField(target));
    const subscription = merge(...sources.map(source => source.valueChanges)).subscribe(() => mirrorFn());
    this.hospitalizationMirrors.set(checkbox, { checkbox, targets, subscription });
  }

  /**
   * Releases a hospitalization mirror while its fields stay in the form: ends its subscription,
   * unchecks its checkbox, clears and unlocks its targets. Unchecking an already unchecked checkbox
   * has no effect, because Formly only calls `change` for user interactions.
   * Does nothing if the checkbox has no active mirror, so manual entries are never cleared.
   *
   * @param checkbox The mirror checkbox that controls the mirror.
   */
  private releaseMirror(checkbox: FormlyFieldConfig): void {
    const mirror = this.hospitalizationMirrors.get(checkbox);
    if (!mirror) {
      return;
    }
    mirror.subscription.unsubscribe();
    this.hospitalizationMirrors.delete(checkbox);
    if (checkbox.formControl?.value !== false) {
      writeFieldValue(checkbox, false);
    }
    mirror.targets.forEach(target => {
      clearFieldValue(target);
      enableField(target);
    });
  }

  /**
   * Fully releases mirrors whose checkbox and target fields remain in the active form.
   *
   * For each mirror, this ends the source subscription, unchecks its checkbox, clears its targets
   * and unlocks them. Use when a current-address-type change invalidates the active mirrors.
   */
  private releaseHospitalizationMirrors(): void {
    Array.from(this.hospitalizationMirrors.keys()).forEach(checkbox => this.releaseMirror(checkbox));
  }

  /**
   * Stops subscriptions and forgets mirrors whose checkbox and target fields are being removed.
   *
   * It deliberately leaves their controls and model values untouched because those field
   * instances are no longer active. Use when the common questionnaire is omitted or replaced;
   * use `releaseHospitalizationMirrors` instead when its fields remain active and must be cleared.
   */
  discardHospitalizationMirrors(): void {
    this.hospitalizationMirrors.forEach(mirror => mirror.subscription.unsubscribe());
    this.hospitalizationMirrors.clear();
  }

  /**
   * Informs the user why a mirror cannot be started and unchecks its checkbox again.
   *
   * @param checkbox The mirror checkbox the user has just checked.
   * @param message Error text explaining the missing precondition.
   */
  private rejectMirror(checkbox: FormlyFieldConfig, message: string): void {
    this.showMirrorError(message);
    writeFieldValue(checkbox, false);
  }

  /**
   * Shows the error dialog for a mirror that cannot be started.
   *
   * @param message Error text explaining the missing precondition.
   */
  private showMirrorError(message: string): void {
    this.messageDialogService.showErrorDialog({ errorTitle: MIRROR_IMPOSSIBLE, errors: [{ text: message }] });
  }

  /**
   * Writes street, house number, zip code and city into an address field group with the same
   * structure as the source. The country is kept, because the current address defaults to "DE".
   *
   * @param targetAddressField Address field group of the current address.
   * @param sourceAddress Address of the notifier facility.
   */
  private writeAddressParts(targetAddressField: FormlyFieldConfig, sourceAddress: AddressValue): void {
    (['street', 'houseNumber', 'zip', 'city'] as const).forEach(key => {
      const targetField = targetAddressField.fieldGroup?.find(child => child.key === key);
      if (targetField) writeFieldValue(targetField, sourceAddress?.[key]);
    });
  }

  /**
   * Writes an address into the questionnaire-based hospitalization address, whose fields use
   * FHIR answer keys (e.g. `postalCode.answer.valueString`).
   *
   * The country is written as coding taken from the field options. It is skipped if the options
   * are not available as an array or do not contain the source country.
   *
   * @param targetAddressField Address field group of the hospitalization section.
   * @param sourceAddress Current address of the notified person.
   */
  private writeHospitalizationAddress(targetAddressField: FormlyFieldConfig, sourceAddress: AddressValue): void {
    const valuesToWrite: Record<string, string | DemisCoding | undefined> = {
      'street.answer.valueString': sourceAddress.street,
      'houseNumber.answer.valueString': sourceAddress.houseNumber,
      'postalCode.answer.valueString': sourceAddress.zip,
      'city.answer.valueString': sourceAddress.city,
    };
    const targetCountryField = targetAddressField.fieldGroup?.find(field => field.key === 'country.answer.valueCoding');
    const targetCountryFieldOptions = targetCountryField?.props?.options;
    const matchingCountryCoding = Array.isArray(targetCountryFieldOptions)
      ? (targetCountryFieldOptions as DemisCoding[]).find(option => option.code === sourceAddress.country)
      : undefined;
    if (matchingCountryCoding) {
      valuesToWrite['country.answer.valueCoding'] = matchingCountryCoding;
    }
    Object.entries(valuesToWrite).forEach(([key, value]) => {
      const targetField = targetAddressField.fieldGroup?.find(child => child.key === key);
      if (targetField) writeFieldValue(targetField, value);
    });
  }
}
