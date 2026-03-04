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

const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function readTokenFromInput() {
  return new Promise((resolve, reject) => {
    // Check if stdin is a TTY (interactive terminal)
    if (!process.stdin.isTTY) {
      reject(new Error('No TTY available for secure input. Please set GITLAB_ACCESS_TOKEN environment variable.'));
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: new (require('stream').Writable)({
        write: (chunk, encoding, callback) => callback(),
      }),
      terminal: true,
    });

    process.stdout.write('Enter GitLab Access Token: ');

    rl.question('', answer => {
      process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });

    // Prevent echoing by using muted output stream
    rl._writeToOutput = () => {};
  });
}

async function main() {
  let token;
  try {
    token = await readTokenFromInput();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  if (!token) {
    console.error('Error: No token provided.');
    process.exit(1);
  }

  const baseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'openapitools-ci.json'), 'utf8'));

  // Inject token
  const remoteGenerator = baseConfig['generator-cli'].generators.remote;
  remoteGenerator.inputSpec = remoteGenerator.inputSpec.replace('InjectedFromJenkins', token);

  // Backup original openapitools.json and temporarily replace it
  const openapiToolsFile = path.join(__dirname, 'openapitools.json');
  const backupFile = path.join(__dirname, 'openapitools.json.bak');
  const originalExists = fs.existsSync(openapiToolsFile);

  // Cleanup function to restore original openapitools.json
  const cleanup = () => {
    if (originalExists && fs.existsSync(backupFile)) {
      fs.copyFileSync(backupFile, openapiToolsFile);
      fs.unlinkSync(backupFile);
    } else if (!originalExists && fs.existsSync(openapiToolsFile)) {
      fs.unlinkSync(openapiToolsFile);
    }
  };

  // Register signal handlers for cleanup on interruption
  const signalHandler = signal => {
    console.log(`\nReceived ${signal}, cleaning up...`);
    cleanup();
    process.exit(1);
  };
  process.on('SIGINT', signalHandler);
  process.on('SIGTERM', signalHandler);

  if (originalExists) {
    fs.copyFileSync(openapiToolsFile, backupFile);
  }
  fs.writeFileSync(openapiToolsFile, JSON.stringify(baseConfig, null, 2));

  const { spawnSync } = require('child_process');

  // Helper to mask token in output
  const maskToken = text => {
    if (!text || !token) return text;
    return text.toString().replaceAll(token, '***MASKED***');
  };

  try {
    const result = spawnSync('npx openapi-generator-cli generate', {
      cwd: __dirname,
      env: {
        ...process.env,
        COLUMNS: '200',
      },
      shell: true,
      encoding: 'utf8',
    });

    // Output with masked token
    if (result.stdout) {
      process.stdout.write(maskToken(result.stdout));
    }
    if (result.stderr) {
      process.stderr.write(maskToken(result.stderr));
    }

    if (result.status !== 0) {
      process.exitCode = result.status;
    }
  } finally {
    cleanup();
  }
}

main();
