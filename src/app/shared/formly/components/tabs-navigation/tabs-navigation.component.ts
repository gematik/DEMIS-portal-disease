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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
  inject,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { Subject, takeUntil } from 'rxjs';
import { TabsNavigationService } from './tabs-navigation.service';

/*
 * If we ever need more than one TabsNavigationComponent on a page, we could give em names
 * and keep em here in a map (keyed by name)
 * */
@Component({
  selector: 'app-tabs-navigation',
  templateUrl: './tabs-navigation.component.html',
  styleUrls: ['./tabs-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
})
export class TabsNavigationComponent extends FieldType<FieldTypeConfig> implements OnInit, AfterViewInit, OnDestroy {
  private tabsNavigationService = inject(TabsNavigationService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  matTabGroup?: MatTabGroup;
  unsubscribed = new Subject<void>();
  tabCount: WritableSignal<number> = signal(0);

  @ViewChild('navtabs', { static: false }) set navtabs(mtg: MatTabGroup) {
    this.matTabGroup = mtg;
    this.matTabGroup!.selectedTabChange.pipe(takeUntil(this.unsubscribed)).subscribe(e => this.currentIndex.set(e.index));
  }

  currentIndex: WritableSignal<number | undefined> = signal(this.matTabGroup ? this.matTabGroup.selectedIndex || 0 : undefined);

  isValid(fielFormlyFieldConfig: FormlyFieldConfig): boolean {
    return !!fielFormlyFieldConfig.formControl?.valid;
  }

  chooseTab(i: number) {
    if (this.matTabGroup) {
      this.matTabGroup.selectedIndex = i;
      this.currentIndex.set(i);
      this.changeDetectorRef.markForCheck();
    }
  }

  ngOnInit() {
    this.tabCount.set(this.field.fieldGroup?.length ?? 0);
    this.tabsNavigationService.register(this);
    // this.focusFirstFieldOfTab()
  }

  ngAfterViewInit() {
    this.chooseTab(0);
  }

  // @todo deactivated: it shows some strange behaviour when selecting disease because it creates a new formly config
  // focusFirstFieldOfTab() {
  //   setTimeout(() => {
  //     const fieldsOnTab = this.matTabGroup!._elementRef.nativeElement
  //     const firstInputOrSelect = fieldsOnTab.querySelector('input, mat-select') // do we also need textarea?
  //     firstInputOrSelect?.focus()
  //   }, 600)
  // }

  override ngOnDestroy() {
    this.tabsNavigationService.unregister(this);
    this.unsubscribed.next();
    this.unsubscribed.complete();
  }
}
