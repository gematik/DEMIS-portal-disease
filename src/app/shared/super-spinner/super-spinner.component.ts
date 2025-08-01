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

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

/*
 * The name SuperSpinner is quite a mouth full, but at least it
 * 1) has a title and
 * 2) display the percentage from progress$ stream in 'determinate' mode
 */
@Component({
  selector: 'app-super-spinner',
  imports: [MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './super-spinner.component.html',
  styleUrl: './super-spinner.component.scss',
})
export class SuperSpinnerComponent {
  data = inject<{
    title: string;
    mode: ProgressSpinnerMode;
    progress$: Observable<number>;
  }>(MAT_DIALOG_DATA);
}
