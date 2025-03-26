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

import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-validation-wrapper',
  templateUrl: './validation-wrapper.component.html',
  styleUrls: ['./validation-wrapper.component.scss'],
})
export class ValidationWrapperComponent extends FieldWrapper implements OnInit {
  stateChanges = new Subject<void>();
  _errorState = false;

  constructor(
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef
  ) {
    super();
  }

  // @ts-ignore
  get showError(): boolean {
    return true;

    /*const showError = this.options.showError(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }

    return showError;*/
  }

  ngOnInit(): void {
    /*this.focusMonitor.monitor(this.elementRef, true).subscribe(origin => {
      this.field.focus = !!origin;
      this.stateChanges.next();
    });*/
  }
}
