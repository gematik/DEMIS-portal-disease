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

import { defineConfig } from 'vitest/config';
import { transformWithEsbuild } from 'vite';
import { playwright } from '@vitest/browser-playwright';
import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath, URL } from 'node:url';
import { name as pkgName } from './package.json';

export default defineConfig({
  plugins: [
    angular({ tsconfig: './tsconfig.spec.json' }),
    {
      // Like the Angular CLI for zone.js apps: downlevel native async/await, which zone.js cannot track.
      name: 'downlevel-async-await-for-zone',
      enforce: 'post',
      async transform(code, id) {
        if (!/\.ts(\?|$)/.test(id) || id.includes('node_modules')) {
          return null;
        }
        const result = await transformWithEsbuild(code, id, { loader: 'js', supported: { 'async-await': false } });
        return { code: result.code, map: result.map ? JSON.stringify(result.map) : null };
      },
    },
  ],
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
    // With npm-linked libraries (e.g. demis-portal-core-library), Vite otherwise resolves the
    // symlink's real path and picks up a second copy of @angular/* from that package's own
    // node_modules, causing duplicate Angular instances (NG0203 inject() context errors).
    preserveSymlinks: true,
  },
  optimizeDeps: {
    // The root tsconfig.json is solution-style without compilerOptions; the dependency scan needs
    // experimentalDecorators for parameter decorators in the generated API code.
    esbuildOptions: {
      tsconfig: './tsconfig.spec.json',
      supported: { 'async-await': false },
    },
  },
  test: {
    globals: true,
    api: {
      host: '127.0.0.1',
      port: 51204,
    },
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default', ['junit', { suiteName: pkgName }]],
    outputFile: {
      junit: `./coverage/TEST-${pkgName}.xml`,
    },
    browser: {
      enabled: true,
      api: {
        host: '127.0.0.1',
        port: 51205,
      },
      provider: playwright({
        launchOptions: {
          args: ['--no-sandbox'],
        },
      }),
      headless: true,
      viewport: { width: 1280, height: 1024 },
      instances: [{ browser: 'chromium' }],
    },
    testTimeout: 10000,
    coverage: {
      provider: 'istanbul',
      exclude: ['src/api/**', 'src/test/**'],
      reporter: ['text', 'text-summary', 'html', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
    },
  },
});
