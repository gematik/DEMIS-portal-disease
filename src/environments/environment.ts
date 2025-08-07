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

import { HttpHeaders } from '@angular/common/http';
import { NgxLoggerLevel } from 'ngx-logger';
import { assetUrl } from '../single-spa/asset-url';

interface NgxLoggerConfig {
  level: number;
  disableConsoleLogging: boolean;
  serverLogLevel: number;
}

interface GatewayPaths {
  [key: string]: string;
}

interface FutsPaths {
  [key: string]: string;
}

interface Configuration {
  production: boolean;
  gatewayPaths: GatewayPaths;
  futsPaths: FutsPaths;
  featureFlags: any;
  ngxLoggerConfig: NgxLoggerConfig;
  pathToFuts: string;
}

export class Environment {
  public headers: HttpHeaders;
  public local: boolean = false;
  public diseaseConfig: any;

  constructor() {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  public get pathToEnvironment() {
    return assetUrl('../environment.json');
  }

  private get config(): Configuration {
    return this.diseaseConfig;
  }

  public get isProduction(): boolean {
    return !!this.config?.production;
  }

  public get ngxLoggerConfig(): NgxLoggerConfig {
    return this.config?.ngxLoggerConfig ? this.config?.ngxLoggerConfig : this.defaultNgxLoggerConfig;
  }

  public get defaultNgxLoggerConfig(): NgxLoggerConfig {
    return {
      level: NgxLoggerLevel.OFF,
      disableConsoleLogging: true,
      serverLogLevel: NgxLoggerLevel.OFF,
    };
  }

  // remove all unused none-paragraph paths with FEATURE_FLAG_NON_NOMINAL_NOTIFICATION
  public get pathToGatewayDisease(): string {
    return this.config?.gatewayPaths?.['main'];
  }

  public get pathToGatewayDiseaseNonNominal(): string {
    return this.config?.gatewayPaths?.['main'] + this.config?.gatewayPaths?.['disease_7_3_non_nominal'];
  }

  /**
   * Meldetatbestände §6.1
   */
  public get pathToDisease(): string {
    return this.config?.futsPaths?.['main'];
  }

  public get pathToNotificationCategories6_1(): string {
    return this.config?.futsPaths?.['main'] + this.config.futsPaths?.['notificationCategories_6_1'];
  }

  /**
   * Meldetatbestände §7.3 (nichtnamentlich)
   */
  public get pathToNotificationCategories7_3(): string {
    return this.config?.futsPaths?.['main'] + this.config.futsPaths?.['notificationCategories_7_3'];
  }

  /**
   * Fragebögen §6.1
   */
  public get pathToDiseaseQuestionnaire(): string {
    return this.config?.futsPaths?.['main'] + this.config.futsPaths?.['questionnaire'];
  }

  public get pathToDiseaseQuestionnaire6_1(): string {
    return this.config?.futsPaths?.['main'] + this.config.futsPaths?.['questionnaire_6_1'];
  }

  /**
   * Fragebögen §7.3 (nichtnamentlich)
   */
  public get pathToDiseaseQuestionnaire7_3(): string {
    return this.config?.futsPaths?.['main'] + this.config.futsPaths?.['questionnaire_7_3'];
  }

  public get pathToFuts(): string {
    return this.config?.pathToFuts;
  }

  public get futsHeaders(): HttpHeaders {
    return this.headers.set(this.config?.featureFlags?.FEATURE_FLAG_NEW_API_ENDPOINTS ? 'x-fhir-profile' : 'fhirProfile', 'fhir-profile-snapshots');
  }
}

export const environment = new Environment();
