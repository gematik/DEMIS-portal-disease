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

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, createEnvironmentInjector, EnvironmentInjector, importProvidersFrom, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MessageDialogService, withDemisFormlyCore } from '@gematik/demis-portal-core-library';
import { FORMLY_CONFIG, FormlyFieldConfig, FormlyForm, FormlyFormBuilder, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { AddressType } from '../../api/notification';
import { notifiedPersonFormConfigFields } from '../disease-form/common/formlyConfigs/notified-person';
import { notifierFacilityFormConfigFields } from '../disease-form/common/formlyConfigs/notifier';
import { NotificationFormValidationModule } from '../legacy/notification-form-validation-module';
import { registerValueSetExtension } from '../legacy/value-set.extension';
import { ValueSetService } from '../legacy/value-set.service';
import { APP_FORMLY_CONFIG } from '../shared/formly/formly-app-config';
import { findFormlyFieldIterativeByKey } from '../shared/utils';
import { FieldMirroringService, MIRROR_ADDRESS_ERROR, MIRROR_CONTACT_ERROR, MIRROR_NOTIFIER_ERROR } from './field-mirroring.service';
import { writeFieldValue } from './formly-field-value.util';

const GERMANY = { code: 'DE', display: 'Deutschland' };

@Component({
  imports: [ReactiveFormsModule, FormlyForm],
  template: `<form [formGroup]="form()"><formly-form [form]="form()" [model]="model()" [fields]="fields()" /></form>`,
})
class StepHostComponent {
  readonly form = input.required<FormGroup>();
  readonly model = input.required<Record<string, unknown>>();
  readonly fields = input.required<FormlyFieldConfig[]>();
}

const hospitalizationFields = (): FormlyFieldConfig[] => [
  {
    key: 'hospitalizedEncounter',
    fieldGroup: [
      { key: 'copyNotifiedPersonCurrentAddress', type: 'checkbox', defaultValue: false },
      { key: 'name.answer.valueString', type: 'input' },
      {
        key: 'address',
        fieldGroup: [
          { key: 'street.answer.valueString', type: 'input' },
          { key: 'houseNumber.answer.valueString', type: 'input' },
          { key: 'postalCode.answer.valueString', type: 'input' },
          { key: 'city.answer.valueString', type: 'input' },
          { key: 'country.answer.valueCoding', type: 'select', props: { options: [GERMANY] } },
        ],
      },
      {
        key: 'contact',
        fieldGroup: [
          { key: 'copyNotifierContact', type: 'checkbox', defaultValue: false },
          { key: 'name.prefix.answer.valueString', type: 'input' },
          { key: 'name.given.answer.valueString', type: 'input' },
          { key: 'name.family.answer.valueString', type: 'input' },
        ],
      },
      { key: 'phone.answer.valueString', type: 'input' },
      { key: 'email.answer.valueString', type: 'input' },
    ],
  },
];

describe('FieldMirroringService', () => {
  let injector: ReturnType<typeof createEnvironmentInjector>;
  let service: FieldMirroringService;
  let showErrorDialog: Mock;
  let form: FormGroup<Record<string, FormGroup>>;
  let model: Record<string, any>;
  let patientFields: FormlyFieldConfig[];
  let commonFields: FormlyFieldConfig[];
  let builder: FormlyFormBuilder;

  beforeEach(() => {
    showErrorDialog = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        importProvidersFrom(NotificationFormValidationModule),
        provideFormlyCore([APP_FORMLY_CONFIG, ...withFormlyMaterial(), ...withDemisFormlyCore()]),
        { provide: FORMLY_CONFIG, multi: true, useFactory: registerValueSetExtension, deps: [ValueSetService] },
        { provide: ValueSetService, useValue: { get: vi.fn().mockReturnValue(of([])) } },
        { provide: MessageDialogService, useValue: { showErrorDialog } },
      ],
    });
    injector = createEnvironmentInjector([FieldMirroringService], TestBed.inject(EnvironmentInjector));
    service = injector.get(FieldMirroringService);

    form = new FormGroup<Record<string, FormGroup>>({ notifier: new FormGroup({}), notifiedPerson: new FormGroup({}), commonQuestionnaire: new FormGroup({}) });
    model = { notifier: { address: { country: 'DE' } }, notifiedPerson: {}, commonQuestionnaire: {} };
    patientFields = notifiedPersonFormConfigFields(true);
    commonFields = hospitalizationFields();
    service.attachHospitalizationMirrors(commonFields, form, false);
    builder = TestBed.inject(FormlyFormBuilder);
    builder.buildForm(form.controls['notifier'], notifierFacilityFormConfigFields([]), model['notifier'], {});
    builder.buildForm(form.controls['notifiedPerson'], patientFields, model['notifiedPerson'], {});
    builder.buildForm(form.controls['commonQuestionnaire'], commonFields, model['commonQuestionnaire'], {});
  });

  afterEach(() => {
    if (!injector.destroyed) {
      injector.destroy();
    }
  });

  const control = (path: string) => form.get(path)!;
  const common = (key: string) => findFormlyFieldIterativeByKey(commonFields, key)!;
  const hospitalization = () => model['commonQuestionnaire'].hospitalizedEncounter;

  function fillNotifier() {
    control('notifier.facilityInfo.institutionName').setValue('Klinik Nord');
    control('notifier.address').patchValue({ street: 'Hauptstraße', houseNumber: '1', zip: '10115', city: 'Berlin' });
    control('notifier.contact').patchValue({ prefix: 'Dr.', firstname: 'Erika', lastname: 'Muster' });
  }

  function chooseCurrentAddressType(type: string | null) {
    writeFieldValue(
      patientFields.find(f => f.key === 'currentAddressType')!,
      type
    );
    service.onCurrentAddressTypeChange(type, patientFields, form, false);
    // Re-evaluates hide expressions like the rendered patient step does
    builder.buildForm(form.controls['notifiedPerson'], patientFields, model['notifiedPerson'], {});
  }

  function setCurrentFacility(type: string, name: string) {
    chooseCurrentAddressType(type);
    writeFieldValue(
      patientFields.find(f => f.key === 'currentAddressInstitutionName')!,
      name
    );
    control('notifiedPerson.currentAddress').patchValue({ street: 'Allee', houseNumber: '2', zip: '20095', city: 'Hamburg', country: 'DE' });
  }

  // Formly sets the rendered checkbox value and then calls props.change
  function toggle(key: string, checked: boolean) {
    const checkbox = common(key);
    writeFieldValue(checkbox, checked);
    checkbox.props!['change']!(checkbox, undefined);
  }

  describe('current address of the notified person', () => {
    it('shows the mirrored address immediately each time the submitting facility type is selected', async () => {
      fillNotifier();
      const typeControl = control('notifiedPerson.currentAddressType');
      typeControl.valueChanges.subscribe(value => service.onCurrentAddressTypeChange(value, patientFields, form, false));

      const fixture = TestBed.createComponent(StepHostComponent);
      fixture.componentRef.setInput('form', form.controls['notifiedPerson']);
      fixture.componentRef.setInput('model', model['notifiedPerson']);
      fixture.componentRef.setInput('fields', patientFields);
      fixture.detectChanges();
      const radioGroup = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatRadioGroupHarness.with({ selector: '#currentAddressType' }));
      const currentAddressField = patientFields.find(field => field.key === 'currentAddress')!;
      const currentAddressTypesAtExpressionCheck: unknown[] = [];
      const fieldOptions = currentAddressField.options;
      if (!fieldOptions?.detectChanges) throw new Error('Current address expression updates are not configured');
      const detectExpressions = fieldOptions.detectChanges;
      vi.spyOn(fieldOptions, 'detectChanges').mockImplementation(field => {
        currentAddressTypesAtExpressionCheck.push(form.controls['notifiedPerson'].value.currentAddressType);
        detectExpressions(field);
      });
      const expectCurrentAddressInputVisible = () => {
        const streetInput = fixture.nativeElement.querySelector('#current-address-street') as HTMLInputElement | null;
        expect(streetInput).not.toBeNull();
        expect(streetInput!.getBoundingClientRect().height).toBeGreaterThan(0);
      };

      await radioGroup.checkRadioButton({ label: 'Adresse der meldenden Einrichtung' });
      fixture.detectChanges();

      expect(currentAddressField.hide).toBe(false);
      expect(model['notifiedPerson'].currentAddress).toEqual(expect.objectContaining({ street: 'Hauptstraße', city: 'Berlin' }));
      expectCurrentAddressInputVisible();
      expect(currentAddressTypesAtExpressionCheck.at(-1)).toBe(AddressType.SubmittingFacility);

      await radioGroup.checkRadioButton({ label: 'anderer Wohnsitz' });
      await radioGroup.checkRadioButton({ label: 'Adresse der meldenden Einrichtung' });
      fixture.detectChanges();

      expect(currentAddressField.hide).toBe(false);
      expect(model['notifiedPerson'].currentAddress).toEqual(expect.objectContaining({ street: 'Hauptstraße', city: 'Berlin' }));
      expectCurrentAddressInputVisible();
      expect(currentAddressTypesAtExpressionCheck.at(-1)).toBe(AddressType.SubmittingFacility);
    });

    it('mirrors the notifier facility and keeps model and control in sync while the patient step is not rendered', () => {
      fillNotifier();

      chooseCurrentAddressType(AddressType.SubmittingFacility);
      control('notifier.address.city').setValue('Potsdam');

      expect(model['notifiedPerson'].currentAddressInstitutionName).toBe('Klinik Nord');
      expect(model['notifiedPerson'].currentAddress).toEqual(expect.objectContaining({ street: 'Hauptstraße', zip: '10115', city: 'Potsdam' }));
      expect(control('notifiedPerson.currentAddress.city').value).toBe('Potsdam');
    });

    it('rejects the submitting facility type when the notifier is incomplete', async () => {
      chooseCurrentAddressType(AddressType.SubmittingFacility);

      expect(showErrorDialog).toHaveBeenCalledWith(expect.objectContaining({ errors: [{ text: MIRROR_NOTIFIER_ERROR }] }));
      await vi.waitFor(() => expect(model['notifiedPerson'].currentAddressType).toBeNull());
      expect(control('notifiedPerson.currentAddressType').value).toBeNull();
    });

    it('stops syncing and resets the address when another type is chosen', () => {
      fillNotifier();
      chooseCurrentAddressType(AddressType.SubmittingFacility);

      chooseCurrentAddressType(AddressType.OtherFacility);
      control('notifier.facilityInfo.institutionName').setValue('Changed');

      expect(model['notifiedPerson'].currentAddressInstitutionName).toBe('');
      expect(model['notifiedPerson'].currentAddress).toEqual(expect.objectContaining({ street: '', city: '', country: 'DE' }));
    });

    it('keeps imported address data when the type is set by the clipboard import', () => {
      writeFieldValue(
        patientFields.find(f => f.key === 'currentAddressInstitutionName')!,
        'Imported'
      );

      service.onCurrentAddressTypeChange(AddressType.OtherFacility, patientFields, form, true);

      expect(model['notifiedPerson'].currentAddressInstitutionName).toBe('Imported');
    });

    it('keeps model, control and radio group consistent when the rendered type selection is rejected', async () => {
      // Subscribed before rendering like DiseaseNotificationService, so Formly's model sync runs after the service
      const typeControl = control('notifiedPerson.currentAddressType');
      typeControl.valueChanges.subscribe(value => service.onCurrentAddressTypeChange(value, patientFields, form, false));
      const fixture = TestBed.createComponent(StepHostComponent);
      fixture.componentRef.setInput('form', form.controls['notifiedPerson']);
      fixture.componentRef.setInput('model', model['notifiedPerson']);
      fixture.componentRef.setInput('fields', patientFields);
      fixture.detectChanges();
      expect(control('notifiedPerson.currentAddressType')).toBe(typeControl);
      const radioGroup = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatRadioGroupHarness.with({ selector: '#currentAddressType' }));

      await radioGroup.checkRadioButton({ label: 'Adresse der meldenden Einrichtung' });

      expect(showErrorDialog).toHaveBeenCalledWith(expect.objectContaining({ errors: [{ text: MIRROR_NOTIFIER_ERROR }] }));
      expect(typeControl.value).toBeNull();
      expect(model['notifiedPerson'].currentAddressType).toBeNull();
      expect(await radioGroup.getCheckedValue()).toBeNull();
    });
  });

  describe('hospitalization address mirror', () => {
    it('mirrors and locks the hospitalization address and follows later changes of the source', () => {
      setCurrentFacility(AddressType.OtherFacility, 'Pflegeheim');

      toggle('copyNotifiedPersonCurrentAddress', true);
      control('notifiedPerson.currentAddress.city').setValue('Lübeck');

      expect(hospitalization().name.answer.valueString).toBe('Pflegeheim');
      expect(hospitalization().address.city.answer.valueString).toBe('Lübeck');
      expect(hospitalization().address.country.answer.valueCoding).toEqual(GERMANY);
      expect(common('address').props?.disabled).toBe(true);
      expect(control('commonQuestionnaire.hospitalizedEncounter.address').disabled).toBe(true);
    });

    it('rejects the copy when the current address is not a facility', () => {
      chooseCurrentAddressType(AddressType.PrimaryAsCurrent);

      toggle('copyNotifiedPersonCurrentAddress', true);

      expect(showErrorDialog).toHaveBeenCalledWith(expect.objectContaining({ errors: [{ text: MIRROR_ADDRESS_ERROR }] }));
      expect(hospitalization().copyNotifiedPersonCurrentAddress).toBe(false);
    });

    it('clears, unlocks and stops syncing when unchecked', () => {
      setCurrentFacility(AddressType.OtherFacility, 'Pflegeheim');
      toggle('copyNotifiedPersonCurrentAddress', true);
      const checkboxValueChanges = vi.fn();
      common('copyNotifiedPersonCurrentAddress').formControl!.valueChanges.subscribe(checkboxValueChanges);

      toggle('copyNotifiedPersonCurrentAddress', false);
      control('notifiedPerson.currentAddress.city').setValue('Kiel');

      expect(checkboxValueChanges).toHaveBeenCalledTimes(1);
      expect(hospitalization().address.city.answer.valueString).toBeNull();
      expect(common('address').props?.disabled).toBe(false);
      expect(control('commonQuestionnaire.hospitalizedEncounter.address').enabled).toBe(true);
    });

    it('keeps manual entries after an unchecked mirror when the current address type changes later', () => {
      setCurrentFacility(AddressType.OtherFacility, 'Pflegeheim');
      toggle('copyNotifiedPersonCurrentAddress', true);
      toggle('copyNotifiedPersonCurrentAddress', false);
      writeFieldValue(common('name.answer.valueString'), 'Manuell eingetragen');

      chooseCurrentAddressType(AddressType.PrimaryAsCurrent);

      expect(hospitalization().name.answer.valueString).toBe('Manuell eingetragen');
    });

    it('unchecks and clears an active mirror when the current address type changes', () => {
      setCurrentFacility(AddressType.OtherFacility, 'Pflegeheim');
      toggle('copyNotifiedPersonCurrentAddress', true);

      chooseCurrentAddressType(AddressType.PrimaryAsCurrent);

      expect(hospitalization().copyNotifiedPersonCurrentAddress).toBe(false);
      expect(hospitalization().name.answer.valueString).toBeNull();
      expect(common('address').props?.disabled).toBe(false);
    });
  });

  describe('hospitalization contact mirror', () => {
    it('mirrors the notifier contact incl. phone and email when the notified person is in the notifying facility', () => {
      fillNotifier();
      control('notifier.contacts').patchValue({ phoneNumbers: [{ value: '0301234' }], emailAddresses: [{ value: 'a@b.de' }] });
      chooseCurrentAddressType(AddressType.SubmittingFacility);

      toggle('copyNotifierContact', true);
      control('notifier.contact.lastname').setValue('Neu');

      expect(hospitalization().contact.name.given.answer.valueString).toBe('Erika');
      expect(hospitalization().contact.name.family.answer.valueString).toBe('Neu');
      expect(hospitalization().contact.name.prefix.answer.valueString).toBe('Dr.');
      expect(common('name.given.answer.valueString').props?.disabled).toBe(true);
    });

    it('clears mirrored phone and email when the last notifier repeater entries are removed', () => {
      fillNotifier();
      const phoneNumbers = new FormArray([new FormGroup({ contactType: new FormControl('phone'), value: new FormControl('0301234') })]);
      const emailAddresses = new FormArray([new FormGroup({ contactType: new FormControl('email'), value: new FormControl('a@b.de') })]);
      form.controls['notifier'].setControl('contacts', new FormGroup({ phoneNumbers, emailAddresses }));
      chooseCurrentAddressType(AddressType.SubmittingFacility);

      toggle('copyNotifierContact', true);

      expect(hospitalization().phone.answer.valueString).toBe('0301234');
      expect(hospitalization().email.answer.valueString).toBe('a@b.de');

      phoneNumbers.removeAt(0);
      emailAddresses.removeAt(0);

      expect(hospitalization().phone.answer.valueString).toBeNull();
      expect(hospitalization().email.answer.valueString).toBeNull();
    });

    it('rejects the contact copy for other current address types', () => {
      fillNotifier();
      chooseCurrentAddressType(AddressType.OtherFacility);

      toggle('copyNotifierContact', true);

      expect(showErrorDialog).toHaveBeenCalledWith(expect.objectContaining({ errors: [{ text: MIRROR_CONTACT_ERROR }] }));
      expect(hospitalization().contact.copyNotifierContact).toBe(false);
    });
  });

  describe('lifecycle', () => {
    it.each(['copyNotifiedPersonCurrentAddress', 'copyNotifierContact'])('hides %s without a change handler for follow-up notifications', key => {
      const fields = hospitalizationFields();

      service.attachHospitalizationMirrors(fields, form, true);

      const checkbox = findFormlyFieldIterativeByKey(fields, key)!;
      expect(checkbox.hide).toBe(true);
      expect(checkbox.props?.['change']).toBeUndefined();
    });

    it.each(['copyNotifiedPersonCurrentAddress', 'copyNotifierContact'])('keeps %s visible and its expressions untouched otherwise', key => {
      const fields = hospitalizationFields();
      const enableWhen = () => false;
      findFormlyFieldIterativeByKey(fields, key)!.expressions = { hide: enableWhen };

      service.attachHospitalizationMirrors(fields, form, false);

      const checkbox = findFormlyFieldIterativeByKey(fields, key)!;
      expect(checkbox.hide).toBeUndefined();
      expect(checkbox.expressions?.['hide']).toBe(enableWhen);
      expect(checkbox.props?.['change']).toEqual(expect.any(Function));
    });

    it('discards active mirrors without writing into the replaced common fields', () => {
      setCurrentFacility(AddressType.OtherFacility, 'Pflegeheim');
      toggle('copyNotifiedPersonCurrentAddress', true);

      service.attachHospitalizationMirrors(hospitalizationFields(), form, false);
      control('notifiedPerson.currentAddress.city').setValue('Kiel');

      expect(hospitalization().address.city.answer.valueString).toBe('Hamburg');
      expect(hospitalization().copyNotifiedPersonCurrentAddress).toBe(true);
      expect(common('address').props?.disabled).toBe(true);
    });

    it('discards active subscriptions without mutating fields that are about to be removed', () => {
      setCurrentFacility(AddressType.OtherFacility, 'Pflegeheim');
      toggle('copyNotifiedPersonCurrentAddress', true);

      service.discardHospitalizationMirrors();
      control('notifiedPerson.currentAddress.city').setValue('Kiel');

      expect(hospitalization().address.city.answer.valueString).toBe('Hamburg');
      expect(hospitalization().copyNotifiedPersonCurrentAddress).toBe(true);
      expect(common('address').props?.disabled).toBe(true);
    });

    it('stops all syncing when destroyed', () => {
      fillNotifier();
      chooseCurrentAddressType(AddressType.SubmittingFacility);

      injector.destroy();
      control('notifier.address.city').setValue('Potsdam');

      expect(model['notifiedPerson'].currentAddress.city).toBe('Berlin');
    });
  });
});
