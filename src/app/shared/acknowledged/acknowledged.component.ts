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

import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MessageType, SuccessResult } from '../../legacy/message';

@Component({
  selector: 'app-notification-acknowledged',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, MatDialogActions, MatDialogClose],
  templateUrl: './acknowledged.component.html',
  styleUrl: './acknowledged.component.scss',
})
export class AcknowledgedComponent {
  result: SuccessResult | undefined;
  pdfDownloadUrl: SafeUrl | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      response: HttpResponse<any>;
      fileName: string;
      href: string;
    }
  ) {}

  ngOnInit() {
    this.pdfDownloadUrl = this.sanitizer.bypassSecurityTrustUrl(this.data.href);
    this.result = this.toSuccessResult(this.data.response.body);
    this.triggerDownload(this.data.href, this.data.fileName);
  }

  private toSuccessResult(body: any): SuccessResult {
    // this 'any' instead of 'OkResult' makes it compile
    return {
      type: MessageType.SUCCESS,
      status: body.status,
      timestamp: body.timestamp,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      receiptContentType: body.contentType,
      receiptContent: body.content,
      message: body.title,
      notificationId: body.notificationId,
    };
  }

  private triggerDownload(url: string, fileName: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
