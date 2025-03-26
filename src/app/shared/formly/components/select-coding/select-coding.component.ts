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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { Subscription } from 'rxjs';
import { DemisCoding } from '../../../../demis-types';

@Component({
  selector: 'app-select-coding',
  templateUrl: './select-coding.component.html',
  styleUrls: ['./select-coding.component.scss'],
})
export class SelectCodingComponent extends FieldType<FieldTypeConfig> implements OnInit, OnDestroy {
  codings: DemisCoding[] = [];
  private changesSubscription?: Subscription;
  currentSelectionBreadcrumb?: string;

  ngOnInit() {
    // convert an external coding value (which is not ===) to an internal one
    this.changesSubscription = this.formControl.valueChanges.subscribe((value: any) => {
      const selectedCoding = this.codings.find(c => c === value || c.code === value.code);
      if (selectedCoding) {
        this.formControl.setValue(selectedCoding);
        this.currentSelectionBreadcrumb = selectedCoding.breadcrumb;
      } else {
        this.currentSelectionBreadcrumb = undefined;
      }
    });

    this.codings = this.props['options'] as DemisCoding[];

    const defaultCode: string | undefined = this.props['defaultCode'];
    if (defaultCode) {
      const defaultCoding = this.codings.find(coding => coding.code === defaultCode);
      if (defaultCoding) {
        this.formControl.setValue(defaultCoding);
        this.currentSelectionBreadcrumb = defaultCoding.breadcrumb;
      }
    }
  }

  override ngOnDestroy() {
    this.changesSubscription?.unsubscribe();
  }
}
