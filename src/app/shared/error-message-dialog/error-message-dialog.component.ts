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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { DialogNotificationData, ErrorResult, MessageType } from '../../legacy/message';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './error-message-dialog.component.html',
  styleUrl: './error-message-dialog.component.scss',
  imports: [MatExpansionModule, MatIcon, MatTableModule, MatDialogModule, MatIcon, MatButton],
  standalone: true,
})
export class ErrorMessageDialogComponent {
  displayedColumns: string[] = ['code', 'message'];

  constructor(@Inject(MAT_DIALOG_DATA) public error: ErrorResult) {}

  isError(messageType: MessageType) {
    return messageType === MessageType.ERROR;
  }

  static getErrorDialogCommonData(error: any, title: string, message: string) {
    return {
      maxWidth: '40vw',
      minHeight: '30vh',
      panelClass: 'app-submit-notification-dialog-panel',
      data: {
        type: MessageType.ERROR,
        title: title,
        message: message,
        messageDetails: error.error ? error?.error?.message : error.message,
        statusCode: error.error ? error?.error?.statusCode : null,
        problems: error.error ? error.error?.validationErrors : [],
      } as DialogNotificationData,
    };
  }

  static getErrorDialogClose(details: { title: string; message: string; messageDetails?: string; type: MessageType; error: any }) {
    return {
      maxWidth: '40vw',
      minHeight: '30vh',
      panelClass: 'app-close-notification-dialog-panel',
      data: {
        type: details.type,
        title: details.title,
        message: details.message,
        messageDetails: details.messageDetails || details.error?.error?.message || details.error?.message,
        statusCode: details.error?.error?.statusCode || null,
        problems: details.error.error?.validationErrors || [],
      } as DialogNotificationData,
    };
  }
}
