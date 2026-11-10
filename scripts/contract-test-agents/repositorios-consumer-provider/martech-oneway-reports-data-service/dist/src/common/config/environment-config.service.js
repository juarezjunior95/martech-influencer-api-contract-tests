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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EnvironmentConfigService = class EnvironmentConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get timeout() {
        return this.configService.get("TIMEOUT", 2000);
    }
    get postgres() {
        return {
            host: this.configService.get("POSTGRES_HOST"),
            port: this.configService.get("POSTGRES_PORT"),
            user: this.configService.get("POSTGRES_USER"),
            password: this.configService.get("POSTGRES_PASSWORD"),
            database: this.configService.get("POSTGRES_DATABASE"),
            schema: this.configService.get("POSTGRES_SCHEMA", "public"),
            ssl: this.configService.get("POSTGRES_SSL") === "true",
            timeout: this.timeout,
            poolMin: this.configService.get("POSTGRES_POOL_MIN", 0),
            poolMax: this.configService.get("POSTGRES_POOL_MAX", 20),
        };
    }
    get databricks() {
        const nodeEnv = this.configService.get("NODE_ENV");
        const appName = this.configService.get("APP_NAME");
        return {
            host: this.configService.get("DATABRICKS_SERVER_HOSTNAME"),
            path: this.configService.get("DATABRICKS_HTTP_PATH"),
            catalog: this.configService.get("DATABRICKS_CATALOG"),
            schema: this.configService.get("DATABRICKS_SCHEMA"),
            azureTenantId: this.configService.get("DATABRICKS_AZURE_TENANT_ID"),
            oauthClientId: this.configService.get("DATABRICKS_OAUTH_CLIENT_ID"),
            oauthClientSecret: this.configService.get("DATABRICKS_OAUTH_CLIENT_SECRET"),
            sessionConfig: {
                configuration: {
                    query_tags: `environment:${nodeEnv},app:${appName}`,
                },
            },
            sqlPlaceholders: {
                DATABRICKS_SCHEMA: this.configService.get("DATABRICKS_SCHEMA"),
                KPI_TABLE: this.configService.get("DATABRICKS_KPI_TABLE"),
                KPI_GROUP_TABLE: nodeEnv === "uat" ? "owr_datelimit_gld" : "owr_datelimit_freeze_gld",
            },
        };
    }
    get env() {
        return this.configService.get("NODE_ENV", "production");
    }
};
exports.EnvironmentConfigService = EnvironmentConfigService;
exports.EnvironmentConfigService = EnvironmentConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EnvironmentConfigService);
//# sourceMappingURL=environment-config.service.js.map