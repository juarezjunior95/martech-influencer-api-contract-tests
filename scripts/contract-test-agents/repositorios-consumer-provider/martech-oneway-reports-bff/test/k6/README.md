# Load Testing with k6

This directory contains a reusable and scalable structure for load testing using k6. The test scenarios are generic and can be used with any configuration, while configuration files can be organized by use case or project.

## Project Structure

```
test/k6/
├── config/
│   ├── architecture-redesign-poc/    # Example: Architecture Redesign PoC configurations
│   │   ├── nodejs-postgres.js
│   │   ├── nodejs-databricks.js
│   │   └── drupal-databricks.js
│   └── index.js                       # Configuration index
├── scenarios/
│   ├── http-get-load-test.js          # Reusable load test (ramping-vus, 2min, max 10 VUs)
│   └── http-get-smoke-test.js         # Reusable smoke test (constant-vus, 1 VU, 30s)
├── utils/
│   └── http-helpers.js                # Shared utility functions
└── README.md                          # This file
```

## Overview

### Reusable Scenarios

The test scenarios (`http-get-load-test.js` and `http-get-smoke-test.js`) are **generic and reusable**. They work with any configuration that follows the expected structure:

- `baseUrl`: Object with environment keys (e.g., `{ uat: 'https://...' }`)
- `endpoints`: Array of endpoint paths
- `queryParams`: Array of query parameter objects
- `groupName`: Name for k6 group metrics

### Configuration Organization

Configurations can be organized by use case, project, or any other criteria. For example:

- `architecture-redesign-poc/`: Configurations for Architecture Redesign PoC performance comparison
- `production-api/`: Configurations for production API testing
- `feature-x/`: Configurations for a specific feature

Each configuration folder should export its configs in the main `config/index.js` file.

### Example Use Case: Architecture Redesign PoC

The `architecture-redesign-poc/` folder contains configurations for comparing performance between different architectural implementations:

1. **NodeJS + Postgres**: Implementation using NodeJS as BFF with Postgres as backend
2. **NodeJS + Databricks**: Implementation using NodeJS as BFF with Databricks as backend (✅ **Implemented**)
3. **Drupal + Databricks**: Implementation using Drupal as BFF with Databricks as backend

**Status**: Only **NodeJS + Databricks** is fully configured. Other architectures have empty configurations and will be filled when implemented.

## Prerequisites

- k6 installed locally on your machine
- Node.js (for TypeScript types via `@types/k6`)

### k6 Installation

**macOS (Homebrew):**
```bash
brew install k6
```

**Linux:**
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```bash
choco install k6
```

## Configuration Structure

### Configuration File Format

Each configuration file should export a `config` object with the following structure:

```javascript
export const config = {
  groupName: 'Test Group Name',
  baseUrl: {
    uat: 'https://example.uat.com',
    prod: 'https://example.prod.com'
  },
  endpoints: [
    '/api/endpoint-1',
    '/api/endpoint-2',
    '/api/endpoint-3'
  ],
  queryParams: [
    {
      'filter[key1]': 'value1',
      'filter[key2]': 'value2'
    }
  ]
};
```

### Registering Configurations

Register your configuration in `config/index.js`:

```javascript
import { config as myConfig } from './my-folder/my-config.js';

export const configs = {
  'my-config-name': myConfig
};
```

## Running Tests

### Environment Variables

| Variable | Required | Description | Example Values |
|----------|----------|-------------|----------------|
| `ENV` | Yes | Environment to test | `uat`, `prod`, `local` |
| `CONFIG` | Yes | Configuration name as registered in `index.js` | `architecture-redesign-poc-nodejs-databricks`, `my-config-name` |

### Authentication Setup

The tests support optional authentication via a `.auth` file in the `test/k6/` directory:

1. Copy `.auth.example` to `.auth`:
   ```bash
   cp test/k6/.auth.example test/k6/.auth
   ```

2. Add your Bearer token to `test/k6/.auth`:
   ```
   Bearer your-actual-token-here
   ```

3. The `.auth` file is automatically ignored by git (via `.gitignore`).

**Note:** If no `.auth` file exists, tests will run without authentication (useful for local testing).

### Smoke Test (1 VU, 30 seconds)

**Without authentication:**
```bash
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-smoke-test.js
```

**With authentication (using .auth file):**
```bash
# Just ensure test/k6/.auth exists with your token
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-smoke-test.js
```

### Load Test (Ramping VUs, 2 minutes, max 10 VUs)

The load test uses `ramping-vus` with 3 stages:
- **Ramp-up**: 10s (1 → 10 VUs)
- **Stable**: 100s (10 VUs maintained)
- **Ramp-down**: 10s (10 → 0 VUs)

**Without authentication:**
```bash
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-load-test.js
```

**With authentication (using .auth file):**
```bash
# Just ensure test/k6/.auth exists with your token
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-load-test.js
```

## Usage Examples

### Architecture Redesign PoC - Performance Comparison

```bash
# Smoke test - NodeJS + Databricks (without auth, for local testing)
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-smoke-test.js

# Smoke test - NodeJS + Databricks (with authentication - requires test/k6/.auth file)
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-smoke-test.js

# Load test - NodeJS + Databricks (without auth, for local testing)
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-load-test.js

# Load test - NodeJS + Databricks (with authentication - requires test/k6/.auth file)
k6 run --env ENV=uat --env CONFIG=architecture-redesign-poc-nodejs-databricks test/k6/scenarios/http-get-load-test.js

# Repeat for other architectures when implemented
```

### Using with Custom Configurations

```bash
# Run smoke test with your custom config (without auth)
k6 run --env ENV=uat --env CONFIG=my-custom-config test/k6/scenarios/http-get-smoke-test.js

# Run smoke test with your custom config (with auth - requires test/k6/.auth file)
k6 run --env ENV=uat --env CONFIG=my-custom-config test/k6/scenarios/http-get-smoke-test.js

# Run load test with your custom config (without auth)
k6 run --env ENV=prod --env CONFIG=my-custom-config test/k6/scenarios/http-get-load-test.js

# Run load test with your custom config (with auth - requires test/k6/.auth file)
k6 run --env ENV=prod --env CONFIG=my-custom-config test/k6/scenarios/http-get-load-test.js
```

## How It Works

### Test Structure

Each test executes all configured endpoints for the selected configuration:

1. **Setup**: Runs once before the test, logging:
   - Group Name
   - Base URL
   - Configured endpoints
   - Query params count

2. **Execution**: Each VU executes:
   - Selects query params based on VU index (sequential distribution)
   - Calls all configured endpoints in the same group
   - Validates that each response has status 200

3. **Utility Functions** (`utils/http-helpers.js`):
   - `buildUrl(baseUrl, endpoint)`: Builds complete URL
   - `buildQueryString(queryParams)`: Builds query string
   - `selectQueryParamsForVu(configQueryParams, vuIndex)`: Selects query params for specific VU
   - `callEndpoint(endpoint, queryParams, baseUrl, options)`: Performs GET request

### Query Params Distribution

Query params are distributed sequentially among VUs using modulo operation:
- VU 1: queryParams[0]
- VU 2: queryParams[1]
- ...
- VU N: queryParams[N % queryParams.length]

### Headers and Timeout Configuration

By default, `callEndpoint` uses:
- **Headers**: `Content-Type: application/json`, `Accept: application/json`
- **Authorization**: Read from `test/k6/.auth` file (optional). If file doesn't exist, no Authorization header is sent.
- **Timeout**: `30s`

These can be customized by passing `options` to `callEndpoint`:

```javascript
callEndpoint(endpoint, queryParams, baseUrl, {
  headers: { 'Custom-Header': 'value' },
  timeout: '60s'
});
```

**Note**: Authorization is automatically read from `test/k6/.auth` file if it exists. You don't need to pass it manually via options.

### Response Validation

Response check is done at the `export default function()` level:

```javascript
check(response, {
  [`${endpoint} status is 200`]: (r) => r.status === 200
});
```

## Metrics

Tests do not have configured thresholds. Metrics are automatically collected by k6 and can be viewed in the final report:

- **http_req_duration**: Request duration
- **http_req_failed**: Failure rate
- **http_reqs**: Total requests
- **vus**: Active virtual users

## Customization

### Creating New Configuration Folders

1. Create a new folder in `config/` for your use case:
   ```bash
   mkdir config/my-project
   ```

2. Create configuration files following the structure:
   ```javascript
   // config/my-project/api-v1.js
   export const config = {
     groupName: 'API v1 Tests',
     baseUrl: { uat: 'https://api.uat.com' },
     endpoints: ['/endpoint1', '/endpoint2'],
     queryParams: [{ 'param': 'value' }]
   };
   ```

3. Register in `config/index.js`:
   ```javascript
   import { config as apiV1Config } from './my-project/api-v1.js';
   
   export const configs = {
     'my-project-api-v1': apiV1Config
   };
   ```

### Adding New Endpoints

Edit your configuration file:

```javascript
endpoints: [
  '/api/endpoint-1',
  '/api/endpoint-2',
  '/api/endpoint-3'
]
```

### Adding New Query Params

Add new query param sets to the array:

```javascript
queryParams: [
  { 'filter[key1]': 'value1', 'filter[key2]': 'value2' },
  { 'filter[key1]': 'value3', 'filter[key2]': 'value4' }
]
```

### Adding New Environments

Add new environments to the `baseUrl`:

```javascript
baseUrl: {
  uat: 'https://example.uat.com',
  prod: 'https://example.prod.com',
  local: 'http://localhost:3000'
}
```

Then use `--env ENV=prod` when running.

## Troubleshooting

### Error: ENV is required

You need to pass the `ENV` variable:
```bash
k6 run --env ENV=uat --env CONFIG=your-config-name test/k6/scenarios/http-get-smoke-test.js
```

### Error: CONFIG is required

You need to pass the `CONFIG` variable. Check `config/index.js` for available config names:
```bash
k6 run --env ENV=uat --env CONFIG=your-config-name test/k6/scenarios/http-get-smoke-test.js
```

### Error: Configuration not found

Check if the config name is correctly registered in `config/index.js`. Valid names are listed in the `configs` object.

### Error: Environment not found in configuration

Check if the environment (`ENV`) is configured in the `baseUrl` of your configuration file.

### Endpoint returns 404

Check if the endpoints are correct in your configuration file.

## Logs

The setup displays information at the start of the test:
```
Group Name: NodeJS + Databricks - Brand Power Book Overview (Main Filters)
Base URL: https://one.martech.uat.bees-platform.dev
Endpoints: /api/..., /api/..., /api/...
Query Params Count: 1
```

During execution, k6 displays real-time metrics and a final report upon completion.