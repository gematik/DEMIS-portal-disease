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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { ErrorMessageDialogComponent } from './error-message-dialog/error-message-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private logger: NGXLogger
  ) {}

  exitApplication() {
    this.router.navigate(['/welcome']);
  }

  displayError(error: unknown, title: string = 'Systemfehler', message: string = 'Es ist ein Fehler aufgetreten') {
    this.logger.error(error);
    const dialogRef = this.matDialog.open(ErrorMessageDialogComponent, ErrorMessageDialogComponent.getErrorDialogCommonData(error, title, message));
    return lastValueFrom(dialogRef.afterClosed());
  }
}
