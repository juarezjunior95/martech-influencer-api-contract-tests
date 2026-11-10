const { execSync } = require('node:child_process');

const getGitValue = (command) => execSync(command, { encoding: 'utf8' }).trim();

const providerVersion =
  process.env.PACT_PROVIDER_VERSION || getGitValue('git rev-parse --short HEAD');
const providerBranch =
  process.env.PACT_PROVIDER_BRANCH || getGitValue('git rev-parse --abbrev-ref HEAD');

const env = {
  ...process.env,
  PACT_PUBLISH_RESULTS: process.env.PACT_PUBLISH_RESULTS || 'true',
  PACT_PROVIDER_VERSION: providerVersion,
  PACT_PROVIDER_BRANCH: providerBranch,
};

execSync('yarn test:provider:publish', {
  stdio: 'inherit',
  env,
});
