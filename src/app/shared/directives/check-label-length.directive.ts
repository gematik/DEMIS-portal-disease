/*
    Copyright (c) 2025 gematik GmbH
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

import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

// delete with FEATURE_FLAG_OUTLINE_DESIGN and remove from sonar properties
@Directive({
  selector: '[appCheckLabelLength]',
  standalone: false,
})
export class CheckLabelLengthDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private mutationObserver?: MutationObserver;

  ngAfterViewInit() {
    if (!environment.diseaseConfig.featureFlags.FEATURE_FLAG_OUTLINE_DESIGN) {
      this.checkAndModifyLabels();

      // MutationObserver einrichten, um auf Änderungen zu reagieren
      this.mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          this.checkAndModifyLabels();
        });
      });

      this.mutationObserver.observe(this.el.nativeElement, {
        childList: true,
        subtree: true,
      });
    }
  }

  ngOnDestroy() {
    if (!environment.diseaseConfig.featureFlags.FEATURE_FLAG_OUTLINE_DESIGN) {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
      }
    }
  }

  private checkAndModifyLabels() {
    const formFields = this.el.nativeElement.querySelectorAll('label');

    formFields.forEach((formField: any) => {
      const matLabel = formField.querySelector('mat-label');

      if (matLabel) {
        const labelText = matLabel.textContent.trim();

        if (labelText.length > 0) {
          this.renderer.setProperty(matLabel, 'textContent', '');
          this.renderer.setStyle(matLabel.parentElement, 'display', 'none');

          const div = this.renderer.createElement('div');
          const text = this.renderer.createText(labelText);
          this.renderer.appendChild(div, text);

          this.renderer.setStyle(div, 'color', 'black');
          this.renderer.setStyle(div, 'font-size', '12px');

          let parentElement = matLabel.parentElement;
          for (let i = 0; i < 4; i++) {
            if (parentElement) {
              parentElement = parentElement.parentElement;
              this.adjustPaddings(parentElement);
            }
          }

          if (parentElement) {
            this.renderer.insertBefore(parentElement, div, parentElement.firstChild);
          }
        }
      }
    });
  }

  private adjustPaddings(element: any) {
    let elementToAdjust = element;
    while (!elementToAdjust || elementToAdjust?.tagName?.toLowerCase() !== 'mat-form-field') {
      elementToAdjust = elementToAdjust.parentElement;
    }

    if (!!elementToAdjust) {
      if (elementToAdjust.className?.includes?.('mat-mdc-form-field-type-radio')) {
        this.renderer.setStyle(elementToAdjust.querySelector('.mat-mdc-form-field-infix'), 'padding-top', '8px');
      } else if (!!elementToAdjust.querySelector('.mat-mdc-text-field-wrapper')) {
        this.renderer.setStyle(elementToAdjust.querySelector('.mat-mdc-form-field-infix'), 'padding-top', '16px');
      }
      if (elementToAdjust.className?.includes?.('mat-mdc-form-field-type-mat-select')) {
        this.renderer.setStyle(elementToAdjust.querySelector('.mat-mdc-select-arrow-wrapper'), 'padding-top', '16px');
      }
    }
  }
}
