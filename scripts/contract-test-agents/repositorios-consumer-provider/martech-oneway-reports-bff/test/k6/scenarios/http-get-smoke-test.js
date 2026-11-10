import { check, group, sleep } from 'k6';
import { configs } from '../config/index.js';
import { selectQueryParamsForVu, callEndpoint } from '../utils/http-helpers.js';
import { readAuthFromFile } from '../utils/auth-helpers.js';

/**
 * Configuration via environment variables (required)
 */
const ENV = __ENV.ENV;
const CONFIG_NAME = __ENV.CONFIG;

/**
 * Optional authorization header (e.g., Bearer token)
 * Read from .auth file in test/k6 directory
 */
const AUTHORIZATION = readAuthFromFile();

if (!ENV) {
  throw new Error('ENV is required');
}

if (!CONFIG_NAME) {
  throw new Error('CONFIG is required');
}

// Load configuration based on CONFIG_NAME from terminal
const config = configs[CONFIG_NAME];
if (!config) {
  throw new Error(`Configuration ${CONFIG_NAME} not found`);
}

const baseUrl = config.baseUrl[ENV];
if (!baseUrl) {
  throw new Error(`Environment ${ENV} not found in configuration ${CONFIG_NAME}`);
}

/**
 * k6 configuration
 * Smoke test: 1 VU for 30 seconds
 */
export const options = {
  scenarios: {
    smoke_test: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5s'
    }
  }
};

/**
 * Main test function executed by each virtual user
 * Groups all endpoint calls together and distributes query params across VUs
 */
export default function() {
  const vuIndex = __VU - 1;

  group(config.groupName || 'API Calls', () => {
    const queryParams = selectQueryParamsForVu(config.queryParams, vuIndex);

    const callOptions = {};
    if (config.randomFilters) {
      callOptions.randomFilters = config.randomFilters;
    }
    if (AUTHORIZATION) {
      callOptions.headers = { 'Authorization': AUTHORIZATION };
    }

    config.endpoints.forEach(endpoint => {
      const response = callEndpoint(endpoint, queryParams, baseUrl, callOptions);
      
      check(response, {
        [`${endpoint} status is 200`]: (r) => r.status === 200
      });
    });
  });

  sleep(1);
}

/**
 * Setup function executed once before the test starts
 * Logs configuration information for the test run
 */
export function setup() {
  console.log(`Group Name: ${config.groupName}`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Query Params Count: ${config.queryParams?.length || 0}`);
}
