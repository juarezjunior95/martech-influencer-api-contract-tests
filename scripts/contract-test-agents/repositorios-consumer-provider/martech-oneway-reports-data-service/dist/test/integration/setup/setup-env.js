"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, "../.env.test"), quiet: true });
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.DATABRICKS_SERVER_HOSTNAME =
    process.env.DATABRICKS_SERVER_HOSTNAME ||
        "test-databricks.cloud.databricks.com";
process.env.DATABRICKS_HTTP_PATH =
    process.env.DATABRICKS_HTTP_PATH || "/sql/1.0/warehouses/test123";
process.env.DATABRICKS_ACCESS_TOKEN =
    process.env.DATABRICKS_ACCESS_TOKEN || "test-token-12345";
process.env.DATABRICKS_CATALOG =
    process.env.DATABRICKS_CATALOG || "test_catalog";
process.env.DATABRICKS_SCHEMA = process.env.DATABRICKS_SCHEMA || "test_schema";
process.env.DATABRICKS_AZURE_TENANT_ID =
    process.env.DATABRICKS_AZURE_TENANT_ID || "test-tenant-id";
process.env.DATABRICKS_OAUTH_CLIENT_ID =
    process.env.DATABRICKS_OAUTH_CLIENT_ID || "test-client-id";
process.env.DATABRICKS_OAUTH_CLIENT_SECRET =
    process.env.DATABRICKS_OAUTH_CLIENT_SECRET || "test-client-secret";
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_PORT = process.env.DB_PORT || "5432";
process.env.DB_NAME = process.env.DB_NAME || "test_oneway_reports";
process.env.DB_USER = process.env.DB_USER || "test_user";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "test_password";
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";
//# sourceMappingURL=setup-env.js.map