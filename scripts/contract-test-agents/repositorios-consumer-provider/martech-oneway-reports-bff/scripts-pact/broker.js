const { execSync } = require('node:child_process');

const env = {
  ...process.env,
  PACT_BROKER_BASE_URL: process.env.PACT_BROKER_BASE_URL || 'http://localhost:9292',
  PACT_PROVIDER_BRANCH: process.env.PACT_PROVIDER_BRANCH || 'local',
  PACT_BROKER_USERNAME: process.env.PACT_BROKER_USERNAME || 'pact',
  PACT_BROKER_PASSWORD: process.env.PACT_BROKER_PASSWORD || 'pact',


};

execSync('jest --config jest.contract.config.json --testPathPatterns=test/contract/provider', {
  stdio: 'inherit',
  env,
});
