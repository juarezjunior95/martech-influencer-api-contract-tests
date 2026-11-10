const { execSync } = require('node:child_process');

const getGitValue = (command) => execSync(command, { encoding: 'utf8' }).trim();

const providerVersion =
  process.env.PACT_PROVIDER_VERSION || `${getGitValue('git rev-parse --short HEAD')}-local`;
const providerBranch = process.env.PACT_PROVIDER_BRANCH || 'local';

const env = {
  ...process.env,
  PACT_PUBLISH_RESULTS: process.env.PACT_PUBLISH_RESULTS || 'true',
  PACT_PROVIDER_VERSION: providerVersion,
  PACT_PROVIDER_BRANCH: providerBranch,
  PACT_BROKER_BASE_URL: process.env.PACT_BROKER_BASE_URL || 'http://localhost:9292',
  PACT_BROKER_USERNAME: process.env.PACT_BROKER_USERNAME || 'pact',
  PACT_BROKER_PASSWORD: process.env.PACT_BROKER_PASSWORD || 'pact',
};

execSync('jest --config jest.contract.config.json --testPathPatterns=test/contract/provider', {
  stdio: 'inherit',
  env,
});
