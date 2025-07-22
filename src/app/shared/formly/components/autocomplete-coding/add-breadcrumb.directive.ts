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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { ChangeDetectorRef, Directive, ElementRef, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, inject, input } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appAddBreadcrumb]',
  standalone: false,
})
export class AddBreadcrumbDirective implements OnInit, OnDestroy, OnChanges {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  readonly currentSelectionBreadcrumb = input<string | undefined | null>(null);
  readonly hasError = input<boolean>(false);

  private subscription: Subscription = new Subscription();
  private breadcrumbDiv: HTMLElement | null = null;

  ngOnInit() {
    this.updateBreadcrumb();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hasError'] || changes['currentSelectionBreadcrumb']) {
      this.updateBreadcrumb();
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateBreadcrumb() {
    const parentFormField = this.findParentFormField(this.el.nativeElement);
    if (parentFormField) {
      const currentSelectionBreadcrumb = this.currentSelectionBreadcrumb();
      if (!this.hasError() && currentSelectionBreadcrumb) {
        if (!this.breadcrumbDiv) {
          this.breadcrumbDiv = this.renderer.createElement('div');
          const text = this.renderer.createText(currentSelectionBreadcrumb);
          this.renderer.appendChild(this.breadcrumbDiv, text);
          this.renderer.addClass(this.breadcrumbDiv, 'autocomplete-breadcrumb');
          this.renderer.appendChild(parentFormField, this.breadcrumbDiv);
        } else {
          this.renderer.setProperty(this.breadcrumbDiv, 'innerText', currentSelectionBreadcrumb);
        }
      } else {
        if (this.breadcrumbDiv) {
          this.renderer.removeChild(parentFormField, this.breadcrumbDiv);
          this.breadcrumbDiv = null;
        }
      }
    }
  }

  private findParentFormField(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;
    while (parent) {
      if (parent.tagName.toLowerCase() === 'formly-field') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }
}
