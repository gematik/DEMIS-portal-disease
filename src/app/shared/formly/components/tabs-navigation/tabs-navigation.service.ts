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

import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { TabsNavigationComponent } from './tabs-navigation.component';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class TabsNavigationService {
  tnc: WritableSignal<TabsNavigationComponent | undefined> = signal(undefined);

  constructor(private logger: NGXLogger) {}

  register(tnc: TabsNavigationComponent) {
    this.tnc.set(tnc);
  }

  unregister(tnc: TabsNavigationComponent) {
    this.tnc.set(undefined);
  }

  navigateToTab(i: number) {
    if (!this.tnc()) {
      return;
    }
    this.tnc()!.chooseTab(i);
  }

  canGoBack: Signal<boolean> = computed(() => {
    if (!this.tnc()) return false;
    const i = this.tnc()?.currentIndex();
    return i !== undefined && i > 0;
  });

  goBack() {
    if (!this.tnc()) return;
    const i = this.tnc()?.currentIndex();
    if (i !== undefined) this.navigateToTab(i - 1);
    else this.logger.error('Ups, there is no tabs navigation');
  }

  canGoForward: Signal<boolean> = computed(() => {
    if (!this.tnc()) return false;
    const i = this.tnc()?.currentIndex();
    return i !== undefined && this.tnc() !== undefined && i < this.tnc()!.tabCount() - 1;
  });

  goForward() {
    if (!this.tnc()) return;
    const i = this.tnc()?.currentIndex();
    if (i !== undefined) this.navigateToTab(i + 1);
    else this.logger.error('Ups, there is no tabs navigation');
  }
}
