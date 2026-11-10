/**
 * Configuration index
 * Exports all configurations for k6 tests
 */

import { config as architectureRedesignPocNodejsPostgresConfig } from './architecture-redesign-poc/nodejs-postgres.js';
import { config as architectureRedesignPocNodejsDatabricksConfig } from './architecture-redesign-poc/nodejs-databricks.js';
import { config as architectureRedesignPocDrupalDatabricksConfig } from './architecture-redesign-poc/drupal-databricks.js';

export const configs = {
  'architecture-redesign-poc-nodejs-postgres': architectureRedesignPocNodejsPostgresConfig,
  'architecture-redesign-poc-nodejs-databricks': architectureRedesignPocNodejsDatabricksConfig,
  'architecture-redesign-poc-drupal-databricks': architectureRedesignPocDrupalDatabricksConfig
};