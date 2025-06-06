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

import { Routes } from '@angular/router';
import { DiseaseFormComponent } from './disease-form/disease-form.component';

const DISEASE_NOTIFICATION_PATH = 'disease-notification';

const diseaseNotificationRoutes: Routes = [
  { path: '7_3/non-nominal', component: DiseaseFormComponent },
  { path: '7_3/anonymous', component: DiseaseFormComponent },
  { path: '7_1', component: DiseaseFormComponent },
  { path: '', component: DiseaseFormComponent },
];

export const routes: Routes = [
  ...diseaseNotificationRoutes.map(route => ({
    ...route,
    path: `${DISEASE_NOTIFICATION_PATH}/${route.path}`,
  })),
  { path: '**', component: DiseaseFormComponent },
];
