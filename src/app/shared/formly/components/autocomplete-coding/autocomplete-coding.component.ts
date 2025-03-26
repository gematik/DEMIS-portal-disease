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

import { Component, OnInit } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { DemisCoding } from '../../../../demis-types';

@Component({
  selector: 'app-autocomplete-coding',
  templateUrl: './autocomplete-coding.component.html',
  styleUrls: ['./autocomplete-coding.component.scss'],
})
export class AutocompleteCodingComponent extends FieldType<FieldTypeConfig> implements OnInit {
  codings: DemisCoding[] = [];

  ngOnInit() {
    this.codings = this.props['options'] as DemisCoding[];
    if (this.props['defaultCode']) {
      this.formControl.setValue(this.codings.find(coding => coding.code === this.props['defaultCode']));
    }
  }
}
