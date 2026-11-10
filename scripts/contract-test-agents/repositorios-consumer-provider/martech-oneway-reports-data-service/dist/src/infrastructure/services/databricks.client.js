"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabricksClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabricksClient = void 0;
const common_1 = require("@nestjs/common");
const sql_1 = require("@databricks/sql");
const environment_config_service_1 = require("../../common/config/environment-config.service");
let DatabricksClient = DatabricksClient_1 = class DatabricksClient {
    constructor(environmentConfigService) {
        this.environmentConfigService = environmentConfigService;
        this.logger = new common_1.Logger(DatabricksClient_1.name);
        this.session = null;
        this.connection = null;
        this.sessionCreationPromise = null;
        this.host = this.environmentConfigService.databricks?.host || "";
        this.path = this.environmentConfigService.databricks?.path || "";
        this.catalog = this.environmentConfigService.databricks?.catalog || "";
        this.schema = this.environmentConfigService.databricks?.schema || "";
        this.azureTenantId =
            this.environmentConfigService.databricks?.azureTenantId || "";
        this.oauthClientId =
            this.environmentConfigService.databricks?.oauthClientId || "";
        this.oauthClientSecret =
            this.environmentConfigService.databricks?.oauthClientSecret || "";
        if (!this.host) {
            throw new Error("DATABRICKS_SERVER_HOSTNAME environment variable is required");
        }
        if (!this.path) {
            throw new Error("DATABRICKS_HTTP_PATH environment variable is required");
        }
        if (!this.catalog) {
            throw new Error("DATABRICKS_CATALOG environment variable is required");
        }
        if (!this.schema) {
            throw new Error("DATABRICKS_SCHEMA environment variable is required");
        }
        if (!this.azureTenantId) {
            throw new Error("DATABRICKS_AZURE_TENANT_ID environment variable is required");
        }
        if (!this.oauthClientId) {
            throw new Error("DATABRICKS_OAUTH_CLIENT_ID environment variable is required");
        }
        if (!this.oauthClientSecret) {
            throw new Error("DATABRICKS_OAUTH_CLIENT_SECRET environment variable is required");
        }
    }
    async getSession() {
        if (this.session) {
            this.logger.log("Reusing existing session");
            return this.session;
        }
        if (this.sessionCreationPromise) {
            this.logger.log("Waiting for session creation in progress");
            return await this.sessionCreationPromise;
        }
        this.sessionCreationPromise = this.createNewSession()
            .then((session) => {
            this.sessionCreationPromise = null;
            return session;
        })
            .catch((error) => {
            this.sessionCreationPromise = null;
            throw error;
        });
        return await this.sessionCreationPromise;
    }
    async createNewSession() {
        await this.closeConnection();
        const client = new sql_1.DBSQLClient();
        const connectOptions = {
            authType: "databricks-oauth",
            host: this.host,
            path: this.path,
            azureTenantId: this.azureTenantId,
            useDatabricksOAuthInAzure: true,
            oauthClientId: this.oauthClientId,
            oauthClientSecret: this.oauthClientSecret,
        };
        this.logger.log("Creating new connection to Databricks");
        const connection = await client.connect(connectOptions);
        const session = await connection.openSession({
            initialCatalog: this.catalog,
            initialSchema: this.schema,
            ...this.environmentConfigService.databricks.sessionConfig,
        });
        this.connection = connection;
        this.session = session;
        this.logger.log("New session created");
        return session;
    }
    async executeQuery(query, namedParameters) {
        try {
            const session = await this.getSession();
            const executeStatementOptions = {
                runAsync: false,
                ...(namedParameters ? { namedParameters } : {}),
            };
            try {
                const queryOperation = await session.executeStatement(query, executeStatementOptions);
                const result = await queryOperation.fetchAll();
                await queryOperation.close();
                return result;
            }
            catch (queryError) {
                this.logger.warn(`Query failed, retrying: ${queryError.message}`);
                this.session = null;
                const newSession = await this.getSession();
                const queryOperation = await newSession.executeStatement(query, executeStatementOptions);
                const result = await queryOperation.fetchAll();
                await queryOperation.close();
                return result;
            }
        }
        catch (error) {
            this.logger.error(`Query failed: ${error.message}`);
            throw error;
        }
    }
    async closeConnection() {
        if (this.sessionCreationPromise) {
            try {
                await this.sessionCreationPromise;
            }
            catch {
            }
        }
        if (this.session) {
            try {
                await this.session.close();
                this.logger.log("Session closed");
            }
            catch (error) {
                this.logger.error(`Error closing session: ${error.message}`);
            }
            this.session = null;
        }
        if (this.connection) {
            try {
                await this.connection.close();
                this.logger.log("Connection closed");
            }
            catch (error) {
                this.logger.error(`Error closing connection: ${error.message}`);
            }
            this.connection = null;
        }
        this.sessionCreationPromise = null;
    }
};
exports.DatabricksClient = DatabricksClient;
exports.DatabricksClient = DatabricksClient = DatabricksClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [environment_config_service_1.EnvironmentConfigService])
], DatabricksClient);
//# sourceMappingURL=databricks.client.js.map