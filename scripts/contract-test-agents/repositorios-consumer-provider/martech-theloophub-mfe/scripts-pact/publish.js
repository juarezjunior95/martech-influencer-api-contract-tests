const { execSync } = require('node:child_process');

const getGitValue = (command) => execSync(command, { encoding: 'utf8' }).trim();

const consumerVersion =
  process.env.PACT_CONSUMER_APP_VERSION ||
  getGitValue('git rev-parse --short HEAD');
const consumerBranch =
  process.env.PACT_CONSUMER_BRANCH ||
  getGitValue('git rev-parse --abbrev-ref HEAD');

const brokerUrl =
  process.env.PACT_BROKER_BASE_URL || process.env.PACT_BROKER_URL;
const brokerUsername = process.env.PACT_BROKER_USERNAME || 'pact';
const brokerPassword = process.env.PACT_BROKER_PASSWORD || 'pact';

if (!brokerUrl) {
  throw new Error(
    'PACT_BROKER_BASE_URL or PACT_BROKER_URL is required to publish pacts.',
  );
}

const command = [
  'pact-broker publish ./pacts',
  `--consumer-app-version="${consumerVersion}"`,
  `--branch="${consumerBranch}"`,
  `--broker-base-url="${brokerUrl}"`,
  brokerUsername ? `--broker-username="${brokerUsername}"` : '',
  brokerPassword ? `--broker-password="${brokerPassword}"` : '',
]
  .filter(Boolean)
  .join(' ');

execSync(command, { stdio: 'inherit', env: process.env });
