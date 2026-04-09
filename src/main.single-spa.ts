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

import { enableProdMode, NgZone, provideZoneChangeDetection } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NavigationStart, Router } from '@angular/router';

import { getSingleSpaExtraProviders, singleSpaAngular } from '@single-spa-community/angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { AppProps } from 'single-spa';
import { setPublicPath } from 'systemjs-webpack-interop';
import { allowedRoutes } from './app/demis-types';

const appId = 'notification-portal-mf-disease';
let router: Router;

if (environment.isProduction) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: async singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    const appRef = await platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule, {
      applicationProviders: [provideZoneChangeDetection()],
    });
    if (
      environment.diseaseConfig.featureFlags?.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION ||
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE
    ) {
      router = appRef.injector.get(Router);
      syncUrlWithRouter();
      setupRouterSync();
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

function isSafeRoute(redirectUrl: string) {
  return Object.values(allowedRoutes).some(route => redirectUrl.includes(route));
}

/**
 * Get the current URL from the hash or pathname
 * Since we're using HashLocationStrategy, we need to extract the route from the hash
 */
function getCurrentUrlFromLocation(): string {
  // Check if we're using hash-based routing
  if (window.location.hash) {
    // Extract the path after the # and remove the leading /
    const hashPath = window.location.hash.substring(1); // Remove the #
    return hashPath.startsWith('/') ? hashPath.substring(1) : hashPath;
  }
  // Fallback to pathname if no hash
  const pathname = window.location.pathname;
  return pathname.startsWith('/') ? pathname.substring(1) : pathname;
}

/**
 * shell and microfrontend are using different routers
 * when switching tabs, the shell is switching the URL, but the angular router of this microfrontend is not updated automatically
 * this is a workaround for this issue
 */
function syncUrlWithRouter() {
  if (router) {
    const currentUrl = getCurrentUrlFromLocation();
    const normalizedRouterUrl = router.url.startsWith('/') ? router.url.substring(1) : router.url;

    if (normalizedRouterUrl !== currentUrl && isSafeRoute(currentUrl)) {
      router.navigateByUrl('/' + currentUrl).catch(err => console.error('Navigation Error:', err));
    }
  }
}

/**
 * Set up a listener for popstate events to sync the router when the shell changes the URL
 */
function setupRouterSync() {
  // Listen for hash changes (primary mechanism for HashLocationStrategy)
  window.addEventListener('hashchange', () => {
    syncUrlWithRouter();
  });

  // Listen for browser navigation events (back/forward buttons)
  window.addEventListener('popstate', () => {
    syncUrlWithRouter();
  });
}

export const bootstrap = bootstrapFn;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
