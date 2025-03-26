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
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ErrorResult } from '../../legacy/message';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-notification-rejected',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatTableModule, MatDialogModule, MatButton],
  templateUrl: './rejected.component.html',
  styleUrl: './rejected.component.scss',
})
export class RejectedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public result: ErrorResult) {}
}
