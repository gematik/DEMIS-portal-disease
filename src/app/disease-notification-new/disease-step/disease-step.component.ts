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

import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { GemDemisAriaDisabledButtonDirective, SectionHeaderComponent, StepContentComponent, StepNavigation } from '@gematik/demis-portal-core-library';
import { FormlyForm } from '@ngx-formly/core';
import { DiseaseStepKey } from '../disease-form.model';
import { DiseaseNotificationService } from '../disease-notification.service';
import { DISEASE_STEP_LABELS } from '../step-data';

export interface DiseaseStepInput {
  stepKey: DiseaseStepKey;
}

@Component({
  selector: 'app-disease-step',
  imports: [ReactiveFormsModule, FormlyForm, SectionHeaderComponent, MatButton, MatIcon, GemDemisAriaDisabledButtonDirective],
  templateUrl: './disease-step.component.html',
})
export class DiseaseStepComponent extends StepContentComponent<DiseaseStepInput> {
  protected readonly navigation = inject(StepNavigation);
  protected readonly notificationService = inject(DiseaseNotificationService);
  protected readonly stepKey = computed(() => this.inputData()!.stepKey);
  protected readonly title = computed(() => DISEASE_STEP_LABELS[this.stepKey()]);
  protected readonly isLastStep = computed(() => this.stepKey() === 'specificQuestionnaire');
}
