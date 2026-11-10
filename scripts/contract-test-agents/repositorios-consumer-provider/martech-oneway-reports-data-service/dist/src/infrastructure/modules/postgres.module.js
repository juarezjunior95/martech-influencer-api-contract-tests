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
exports.PostgresModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const environment_config_service_1 = require("../../common/config/environment-config.service");
const postgres_client_1 = require("../services/postgres.client");
const pg_1 = require("pg");
const common_module_1 = require("../../common/common.module");
let PostgresModule = class PostgresModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    onApplicationShutdown() {
        const pool = this.moduleRef.get("POSTGRES_POOL");
        return pool.end();
    }
};
exports.PostgresModule = PostgresModule;
exports.PostgresModule = PostgresModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule],
        providers: [
            {
                provide: "POSTGRES_POOL",
                useFactory: async (environmentConfigService) => {
                    const config = environmentConfigService.postgres;
                    return new pg_1.Pool({
                        host: config.host,
                        port: config.port,
                        user: config.user,
                        password: config.password,
                        database: config.database,
                        ssl: config.ssl,
                        min: config.poolMin,
                        max: config.poolMax,
                        idleTimeoutMillis: 30000,
                        allowExitOnIdle: false,
                        connectionTimeoutMillis: config.timeout,
                        options: `-c search_path=${config.schema}`,
                    });
                },
                inject: [environment_config_service_1.EnvironmentConfigService],
            },
            {
                provide: "PostgresClient",
                useClass: postgres_client_1.PostgresClient,
            },
        ],
        exports: ["PostgresClient"],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], PostgresModule);
//# sourceMappingURL=postgres.module.js.map