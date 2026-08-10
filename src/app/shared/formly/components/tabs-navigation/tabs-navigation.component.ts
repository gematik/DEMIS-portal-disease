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

import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, signal, viewChild, WritableSignal, inject } from '@angular/core';
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs';
import { FieldTypeConfig, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { Subject, takeUntil } from 'rxjs';
import { TabsNavigationService } from './tabs-navigation.service';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsFooterComponent, MaxHeightContentContainerComponent, PasteBoxComponent, SectionHeaderComponent } from '@gematik/demis-portal-core-library';
import { environment } from '../../../../../environments/environment';
import { HexhexbuttonComponent } from '../../../components/hexhexbutton/hexhexbutton.component';

/*
 * If we ever need more than one TabsNavigationComponent on a page, we could give em names
 * and keep em here in a map (keyed by name)
 * */
@Component({
  selector: 'app-tabs-navigation',
  templateUrl: './tabs-navigation.component.html',
  styleUrls: ['./tabs-navigation.component.scss'],
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    NgClass,
    MatIcon,
    SectionHeaderComponent,
    FormsFooterComponent,
    PasteBoxComponent,
    HexhexbuttonComponent,
    MaxHeightContentContainerComponent,
    FormlyModule,
  ],
})
export class TabsNavigationComponent extends FieldType<FieldTypeConfig> implements OnInit, AfterViewInit, OnDestroy {
  private readonly tabsNavigationService = inject(TabsNavigationService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly navtabs = viewChild<MatTabGroup>('navtabs');
  protected readonly featureFlagFooterLinksCorrection = environment.featureFlags?.FEATURE_FLAG_FOOTER_LINKS_CORRECTION ?? false;
  // FLAG_CLEANUP(FEATURE_FLAG_PORTAL_DISEASE_LAYOUT): Remove this toggle and legacy rendering path when the flag is retired.
  protected readonly isPortalDiseaseLayoutEnabled = environment.featureFlags?.FEATURE_FLAG_PORTAL_DISEASE_LAYOUT ?? false;

  matTabGroup?: MatTabGroup;
  unsubscribed = new Subject<void>();
  tabCount: WritableSignal<number> = signal(0);

  currentIndex: WritableSignal<number | undefined> = signal(0);

  sideNavTitle(): string {
    return typeof this.props['sideNavTitle'] === 'string' ? this.props['sideNavTitle'] : '';
  }

  sideNavDescription(): string {
    return typeof this.props['sideNavDescription'] === 'string' ? this.props['sideNavDescription'] : '';
  }

  handleHexHex(): void {
    const onHexHex = this.props['onHexHex'];
    if (typeof onHexHex === 'function') {
      onHexHex();
    }
  }

  handlePaste(clipboardData: Map<string, string>): void {
    const onPaste = this.props['onPaste'];
    if (typeof onPaste === 'function') {
      onPaste(clipboardData);
    }
  }

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
    const matTabGroup = this.navtabs();

    if (matTabGroup) {
      this.matTabGroup = matTabGroup;
      this.matTabGroup.selectedTabChange.pipe(takeUntil(this.unsubscribed)).subscribe(e => this.currentIndex.set(e.index));
    }

    this.chooseTab(0);
  }

  override ngOnDestroy() {
    this.tabsNavigationService.unregister(this);
    this.unsubscribed.next();
    this.unsubscribed.complete();
  }
}
