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

import { allowedRoutes, getNotificationTypeByRouterUrl, NotificationType } from './demis-types';

describe('demis-types utilities', () => {
  describe('getNotificationTypeByRouterUrl', () => {
    it('should return FollowUpNotification6_1 when url includes follow-up route', () => {
      const url = `http://localhost:4200/${allowedRoutes['followUp']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.FollowUpNotification6_1);
    });

    it('should return NonNominalNotification7_3 when url includes non-nominal route', () => {
      const url = `http://localhost:4200/${allowedRoutes['nonNominal']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.NonNominalNotification7_3);
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
      const url = `http://localhost:4200/${allowedRoutes['nonNominal']}/${allowedRoutes['followUp']}`;
      const result = getNotificationTypeByRouterUrl(url);
      expect(result).toBe(NotificationType.NonNominalNotification7_3);
    });
  });
});
