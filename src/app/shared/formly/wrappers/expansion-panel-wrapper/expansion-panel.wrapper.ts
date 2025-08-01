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

import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-expansion-panel',
  template: `
    <div class="row">
      <div class="col-sm-12 mt-sm-3 mb-sm-3">
        <mat-accordion>
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title style="margin-top: 15px">
                <h2>{{ field.props!.label }}</h2>
              </mat-panel-title>
            </mat-expansion-panel-header>
            @if (field.props!.description) {
              <div class="lead mt-4 mb-4">
                {{ field.props!.description }}
              </div>
            }
            <ng-container #fieldComponent></ng-container>
          </mat-expansion-panel>
        </mat-accordion>
      </div>
    </div>
  `,
  standalone: false,
})
export class ExpansionPanelWrapperComponent extends FieldWrapper {}
