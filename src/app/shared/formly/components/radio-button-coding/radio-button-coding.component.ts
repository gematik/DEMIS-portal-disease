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

import { Component, OnInit } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { Subscription } from 'rxjs';
import { DemisCoding } from '../../../../demis-types';

@Component({
  selector: 'app-radio-button-coding',
  templateUrl: './radio-button-coding.component.html',
  styleUrls: ['./radio-button-coding.component.scss'],
  standalone: false,
})
export class RadioButtonCodingComponent extends FieldType<FieldTypeConfig> implements OnInit {
  codings: DemisCoding[] = [];
  private changesSubscription?: Subscription;

  ngOnInit() {
    this.codings = this.props['options'] as DemisCoding[];

    // convert an external coding value (which is not ===) to an internal one
    this.changesSubscription = this.formControl.valueChanges.subscribe((value: any) => {
      if (value && !this.codings.find(c => c === value)) {
        const internalValue = this.codings.find(c => c.code === value.code);
        this.formControl.setValue(internalValue);
      }
    });

    const defaultCode: string | undefined = this.props['defaultCode'];
    if (defaultCode) {
      const defaultCoding = this.codings.find(coding => coding.code === defaultCode);
      if (defaultCoding) {
        this.formControl.setValue(defaultCoding);
      }
    }
  }

  override ngOnDestroy() {
    this.changesSubscription?.unsubscribe();
  }
}
