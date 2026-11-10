const { execSync } = require('node:child_process');

const getGitValue = (command) => execSync(command, { encoding: 'utf8' }).trim();

const env = {
  ...process.env,
  PACT_BROKER_BASE_URL:
    process.env.PACT_BROKER_BASE_URL || 'http://localhost:9292',
  PACT_BROKER_USERNAME: process.env.PACT_BROKER_USERNAME || 'pact',
  PACT_BROKER_PASSWORD: process.env.PACT_BROKER_PASSWORD || 'pact',
  PACT_CONSUMER_APP_VERSION:
    process.env.PACT_CONSUMER_APP_VERSION ||
    `${getGitValue('git rev-parse --short HEAD')}-local`,
  PACT_CONSUMER_BRANCH: process.env.PACT_CONSUMER_BRANCH || 'local',
  PACT_CONSUMER_TAG: process.env.PACT_CONSUMER_TAG || 'local',
};

execSync('node scripts-pact/publish.js', {
  stdio: 'inherit',
  env,
});
