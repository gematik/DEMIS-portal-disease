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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { ErrorMessageDialogComponent } from './error-message-dialog/error-message-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  private matDialog = inject(MatDialog);
  private router = inject(Router);
  private logger = inject(NGXLogger);

  exitApplication() {
    this.router.navigate(['/welcome']);
  }

  /**
   * Can be removed as soon as feature flag "FEATURE_FLAG_PORTAL_ERROR_DIALOG" is active on all stages
   */
  displayError(error: unknown, title: string = 'Systemfehler', message: string = 'Es ist ein Fehler aufgetreten') {
    this.logger.error(error);
    const dialogRef = this.matDialog.open(ErrorMessageDialogComponent, ErrorMessageDialogComponent.getErrorDialogCommonData(error, title, message));
    return lastValueFrom(dialogRef.afterClosed());
  }
}
