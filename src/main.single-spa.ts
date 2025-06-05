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

import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NavigationStart, Router } from '@angular/router';

import { getSingleSpaExtraProviders, singleSpaAngular } from 'single-spa-angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { AppProps } from 'single-spa';
import { setPublicPath } from 'systemjs-webpack-interop';

const appId = 'notification-portal-mf-disease';
let router: Router;

if (environment.isProduction) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: async singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    const appRef = await platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
    if (environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION) {
      router = appRef.injector.get(Router);
      syncUrlWithRouter();
    }
    return appRef;
  },
  template: '<app-disease-root />',
  Router,
  NavigationStart,
  NgZone,
});

function init() {
  setPublicPath(appId);
  return fetch(environment.pathToEnvironment)
    .then(response => response.json())
    .then(config => {
      environment.diseaseConfig = config;
      if (environment.isProduction) {
        enableProdMode();
      }
    });
}

function bootstrapFn(props: AppProps) {
  return init().then(() => {
    if (typeof lifecycles.bootstrap == 'function') {
      return lifecycles.bootstrap(props);
    } else {
      return lifecycles.bootstrap;
    }
  });
}

/**
 * shell and microfrontend are using different routers
 * when switching tabs, the shell is switching the URL, but the angular router of this microfrontend is not updated automatically
 * this is a workaround for this issue
 */
function syncUrlWithRouter() {
  if (router) {
    const currentUrl = window.location.href; // current url from portal-shell
    if (router.url !== currentUrl) {
      router.navigateByUrl(currentUrl).catch(err => console.error('Navigation Error:', err));
    }
  }
}

export const bootstrap = bootstrapFn;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
