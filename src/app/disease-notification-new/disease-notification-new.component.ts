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

import { Component, computed, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { createStepContent, MaxHeightContentContainerComponent, provideStepNavigation, SideNavigationComponent } from '@gematik/demis-portal-core-library';
import { getNotificationTypeByRouterUrl } from '../demis-types';
import { DiseaseQuestionnaireService } from './disease-questionnaire.service';
import { FieldMirroringService } from './field-mirroring.service';
import { DiseaseStepKey } from './disease-form.model';
import { DiseaseNotificationService } from './disease-notification.service';
import { DiseaseStepComponent } from './disease-step/disease-step.component';
import { getStepData } from './step-data';

@Component({
  selector: 'app-disease-notification-new',
  imports: [MaxHeightContentContainerComponent, SideNavigationComponent, MatProgressSpinner],
  providers: [provideStepNavigation(), DiseaseNotificationService, DiseaseQuestionnaireService, FieldMirroringService],
  templateUrl: './disease-notification-new.component.html',
  styleUrl: './disease-notification-new.component.scss',
})
export class DiseaseNotificationNewComponent implements OnInit {
  protected readonly notificationService = inject(DiseaseNotificationService);
  private readonly router = inject(Router);

  readonly stepsMap = computed(() => {
    if (!this.notificationService.isReady()) {
      return new Map();
    }
    return new Map(
      getStepData(this.notificationService).map(step => [
        step,
        createStepContent({ component: DiseaseStepComponent, inputData: { stepKey: step.key as DiseaseStepKey } }),
      ])
    );
  });

  ngOnInit(): void {
    // The follow-up ID flow returns here with `redirect` in the navigation state so the ID dialog
    // is not opened a second time. Angular also stores that state in history.state, which is the
    // fallback when this component initializes after the navigation has already completed.
    const state = this.router.currentNavigation()?.extras.state ?? globalThis.history.state;
    this.notificationService.initialize(getNotificationTypeByRouterUrl(this.router.url), !!state?.redirect);
  }
}
