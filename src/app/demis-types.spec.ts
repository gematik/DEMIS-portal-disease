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

import { allowedRoutes, getNotificationTypeByRouterUrl, NotificationType } from './demis-types';
import { environment } from '../environments/environment';

describe('demis-types utilities', () => {
  let originalDiseaseConfig: any;

  beforeEach(() => {
    originalDiseaseConfig = environment.diseaseConfig;
    environment.diseaseConfig = {
      featureFlags: {
        FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE: false,
        FEATURE_FLAG_NON_NOMINAL_NOTIFICATION: false,
        FEATURE_FLAG_ANONYMOUS_NOTIFICATION: false,
      },
    } as any;
  });

  afterEach(() => {
    environment.diseaseConfig = originalDiseaseConfig;
  });

  describe('getNotificationTypeByRouterUrl', () => {
    it('should return FollowUpNotification6_1 when url includes follow-up route', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE = true;
      const url = `http://localhost:4200/${allowedRoutes['followUp']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.FollowUpNotification6_1);
    });

    it('should return NonNominalNotification7_3 when url includes non-nominal route', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = true;
      const url = `http://localhost:4200/${allowedRoutes['nonNominal']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.NonNominalNotification7_3);
    });

    it('should return AnonymousNotification7_3 when url includes anonymous route', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_ANONYMOUS_NOTIFICATION = true;
      const url = `http://localhost:4200/${allowedRoutes['anonymous']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.AnonymousNotification7_3);
    });

    it('should return NominalNotification6_1 for nominal route', () => {
      const url = `http://localhost:4200/${allowedRoutes['nominal']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.NominalNotification6_1);
    });

    it('should return NominalNotification6_1 as default when no specific route matches', () => {
      const url = 'http://localhost:4200/some-other-route';
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.NominalNotification6_1);
    });

    it('should prioritize non-nominal over follow-up when both are in url', () => {
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_FOLLOW_UP_NOTIFICATION_PORTAL_DISEASE = true;
      environment.diseaseConfig.featureFlags.FEATURE_FLAG_NON_NOMINAL_NOTIFICATION = true;
      const url = `http://localhost:4200/${allowedRoutes['nonNominal']}/${allowedRoutes['followUp']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.NonNominalNotification7_3);
    });
  });
});
