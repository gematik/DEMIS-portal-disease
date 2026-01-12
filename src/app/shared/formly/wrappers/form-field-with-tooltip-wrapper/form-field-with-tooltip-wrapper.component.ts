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

import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ApplicationRef, Component, ElementRef, inject, Injector, Renderer2 } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { LabelInfoIconComponent } from 'src/app/shared/components/label-info-icon/label-info-icon.component';

@Component({
  selector: 'app-form-field-with-tooltip-wrapper',
  imports: [CommonModule, FormlyModule, MatFormFieldModule, MatIconModule, MatTooltipModule],
  templateUrl: './form-field-with-tooltip-wrapper.component.html',
})
export class FormFieldWithTooltipWrapperComponent extends FieldWrapper implements AfterViewInit {
  private readonly nativeElement = inject(ElementRef).nativeElement;
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);
  private readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    if (this.field.props?.['tooltip']) {
      const label = this.nativeElement.querySelector('label');
      if (label) {
        this.attachTooltipIconToLabel(label);
        this.adjustLabelStyles(label);
      }
    }
  }

  private attachTooltipIconToLabel(label: HTMLElement) {
    const outlet = new DomPortalOutlet(label, this.injector, this.appRef);
    const portal = new ComponentPortal(LabelInfoIconComponent);
    const componentRef = outlet.attach(portal);

    // Pass tooltip id and text as input parameter
    componentRef.setInput('tooltipId', this.field.id);
    componentRef.setInput('tooltipText', this.field.props?.['tooltip']);
  }

  private adjustLabelStyles(label: HTMLElement) {
    this.renderer.setStyle(label, 'display', 'inline-flex');
    this.renderer.setStyle(label, 'vertical-align', 'top');
    this.renderer.setStyle(label, 'align-items', 'center');
    this.renderer.setStyle(label, 'margin-top', '-6px');
  }
}
