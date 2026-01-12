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
import { FieldArrayType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-repeat-section',
  templateUrl: './repeat-section.component.html',
  styleUrls: ['./repeat-section.component.scss'],
  standalone: false,
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
