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

import { ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appAddBreadcrumb]',
})
export class AddBreadcrumbDirective implements OnInit, OnDestroy, OnChanges {
  @Input() currentSelectionBreadcrumb: string | undefined | null = null;
  @Input() hasError!: boolean;

  private subscription: Subscription = new Subscription();
  private breadcrumbDiv: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

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
      if (!this.hasError && this.currentSelectionBreadcrumb) {
        if (!this.breadcrumbDiv) {
          this.breadcrumbDiv = this.renderer.createElement('div');
          const text = this.renderer.createText(this.currentSelectionBreadcrumb);
          this.renderer.appendChild(this.breadcrumbDiv, text);
          this.renderer.addClass(this.breadcrumbDiv, 'autocomplete-breadcrumb');
          this.renderer.appendChild(parentFormField, this.breadcrumbDiv);
        } else {
          this.renderer.setProperty(this.breadcrumbDiv, 'innerText', this.currentSelectionBreadcrumb);
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
