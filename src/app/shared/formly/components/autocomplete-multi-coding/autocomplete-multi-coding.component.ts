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
import { FieldType } from '@ngx-formly/material';
import { FieldTypeConfig } from '@ngx-formly/core';
import { DemisCoding } from '../../../../demis-types';
import { take } from 'rxjs';

@Component({
  selector: 'app-autocomplete-multi-coding',
  templateUrl: 'autocomplete-multi-coding.component.html',
  styleUrls: ['./autocomplete-multi-coding.component.scss'],
  standalone: false,
})
export class AutocompleteMultiCodingComponent extends FieldType<FieldTypeConfig> implements OnInit {
  codings: DemisCoding[] = [];

  ngOnInit() {
    this.codings = this.props['options'] as DemisCoding[];
    if (this.props['defaultCode']) {
      const defaultCode = this.codings.find(coding => coding.code === this.props['defaultCode']);
      if (defaultCode) {
        this.formControl.setValue([defaultCode]);
        if (defaultCode.code === 'NASK') {
          this.removeDefaultValueAfterFirstSelection(defaultCode);
        }
      }
    }
  }

  private removeDefaultValueAfterFirstSelection(defaultCode: DemisCoding) {
    this.formControl.valueChanges.pipe(take(1)).subscribe(selectedValues => {
      if (!Array.isArray(selectedValues)) return;
      const userSelectedOtherValue = selectedValues.some(item => item.code !== defaultCode.code);
      if (userSelectedOtherValue) {
        this.formControl.setValue(selectedValues.filter(item => item.code !== defaultCode.code));
      }
    });
  }
}
