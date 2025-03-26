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
import { FieldArrayType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-repeat-section',
  templateUrl: './repeat-section.component.html',
  styleUrls: ['./repeat-section.component.scss'],
})
export class RepeatSectionComponent extends FieldArrayType<FieldTypeConfig> implements OnInit {
  itemName: string = '';

  ngOnInit() {
    if (this.props) this.itemName = this.props['itemName'] || '';
    if (this.props.required && this.field.fieldGroup?.length === 0) {
      this.add();
    }
  }

  formatId(input: string, className: string | undefined): string {
    return input + className?.replace(/ /g, '-');
  }
}
