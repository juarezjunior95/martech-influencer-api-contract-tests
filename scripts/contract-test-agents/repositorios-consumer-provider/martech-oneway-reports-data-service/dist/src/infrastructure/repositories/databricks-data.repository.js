"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabricksDataRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabricksDataRepository = void 0;
const common_1 = require("@nestjs/common");
const dataset_repository_factory_1 = require("../../domain/factories/dataset-repository.factory");
const procedure_environment_1 = require("../../domain/factories/procedure-environment");
const databricks_client_1 = require("../services/databricks.client");
const path = __importStar(require("path"));
const sql_1 = require("@databricks/sql");
const environment_config_service_1 = require("../../common/config/environment-config.service");
const file_loader_service_1 = require("../../common/services/file-loader.service");
const period_utils_1 = require("../../common/utils/period.utils");
let DatabricksDataRepository = DatabricksDataRepository_1 = class DatabricksDataRepository {
    constructor(databricksClient, envConfigService, fileLoaderService) {
        this.databricksClient = databricksClient;
        this.envConfigService = envConfigService;
        this.fileLoaderService = fileLoaderService;
        this.logger = new common_1.Logger(DatabricksDataRepository_1.name);
        this.cache = new Map();
        this.sqlDirectory = path.join(process.cwd(), "src", "infrastructure", "sql", "databricks");
    }
    async fetchData(fetchDataConfig, filters, entityClass) {
        try {
            const namedParameters = this.convertFiltersToNamedParameters(filters);
            this.applyProcedureEnvironmentParameter(fetchDataConfig, namedParameters);
            const sqlQuery = await this.resolveStatement(fetchDataConfig, namedParameters, filters);
            const queryParameters = this.shouldExecuteProcedure(fetchDataConfig)
                ? this.retainProcedureParameters(fetchDataConfig, namedParameters)
                : namedParameters;
            const result = await this.databricksClient.executeQuery(sqlQuery, queryParameters);
            if (entityClass)
                return result.map((r) => new entityClass(r));
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to fetch data: ${error.message}`);
            throw error;
        }
    }
    async resolveStatement(fetchDataConfig, namedParameters, filters) {
        if (this.shouldExecuteProcedure(fetchDataConfig)) {
            return this.buildProcedureStatement(fetchDataConfig, namedParameters, filters);
        }
        if (!fetchDataConfig.query) {
            throw new Error("Databricks datasource config must define a query");
        }
        const sqlFilePath = path.join(this.sqlDirectory, `${fetchDataConfig.query}.sql`);
        const sqlFile = await this.fileLoaderService.load(sqlFilePath);
        return this.replacePlaceholders(sqlFile);
    }
    shouldExecuteProcedure(fetchDataConfig) {
        return (fetchDataConfig.executionType === dataset_repository_factory_1.DeltalakeExecutionType.procedure ||
            Boolean(fetchDataConfig.procedure));
    }
    retainProcedureParameters(fetchDataConfig, namedParameters) {
        if (!fetchDataConfig.parameters)
            return namedParameters;
        const parameterNames = new Set(fetchDataConfig.parameters);
        return Object.fromEntries(Object.entries(namedParameters).filter(([name]) => parameterNames.has(name)));
    }
    buildProcedureStatement(fetchDataConfig, namedParameters, filters) {
        if (!fetchDataConfig.procedure) {
            throw new Error("Databricks procedure config must define a procedure");
        }
        const procedure = this.replacePlaceholders(fetchDataConfig.procedure.trim());
        const inlinedProcedure = this.inlineStatementParameters(procedure, filters, namedParameters);
        if (/^CALL\s+/i.test(inlinedProcedure)) {
            return inlinedProcedure;
        }
        if (/\([^)]*\)\s*;?$/.test(inlinedProcedure)) {
            return `CALL ${inlinedProcedure}`;
        }
        const procedureName = inlinedProcedure.replace(/;$/, "");
        const parameterNames = fetchDataConfig.parameters ?? Object.keys(namedParameters);
        const parameterMarkers = parameterNames
            .map((parameterName) => `:${parameterName}`)
            .join(", ");
        return `CALL ${procedureName}(${parameterMarkers})`;
    }
    inlineStatementParameters(statement, filters, namedParameters) {
        if (!filters || filters.length === 0) {
            return statement;
        }
        const filterValuesByName = new Map(filters.map((filter) => [
            filter.name,
            filter.name === "period"
                ? (0, period_utils_1.normalizePeriodFilterValue)(filter.value)
                : String(filter.value),
        ]));
        return statement.replace(/:(\w+)/g, (marker, name) => {
            if (!filterValuesByName.has(name)) {
                return marker;
            }
            delete namedParameters[name];
            return this.toQuotedSqlString(filterValuesByName.get(name));
        });
    }
    toQuotedSqlString(value) {
        return JSON.stringify(value)
            .replaceAll("\\", "\\\\")
            .replaceAll("'", "\\'");
    }
    applyProcedureEnvironmentParameter(fetchDataConfig, namedParameters) {
        if (!fetchDataConfig.injectProcedureEnvironment) {
            return;
        }
        namedParameters.environment = new sql_1.DBSQLParameter({
            value: (0, procedure_environment_1.getProcedureEnvironment)(),
        });
    }
    convertFiltersToNamedParameters(filters) {
        if (!filters || filters.length === 0) {
            return {};
        }
        const namedParameters = {};
        filters.forEach((filter) => {
            namedParameters[filter.name] = new sql_1.DBSQLParameter({
                value: filter.name === "period"
                    ? (0, period_utils_1.normalizePeriodFilterValue)(filter.value)
                    : filter.value,
            });
        });
        return namedParameters;
    }
    replacePlaceholders(sqlContent) {
        const placeholders = this.envConfigService.databricks.sqlPlaceholders;
        return sqlContent.replace(/\{\{(\w+)}}/g, (placeholder, name) => {
            if (!(name in placeholders)) {
                this.logger.warn(`Unknown placeholder: ${name}`);
            }
            return placeholders[name] ?? placeholder;
        });
    }
};
exports.DatabricksDataRepository = DatabricksDataRepository;
exports.DatabricksDataRepository = DatabricksDataRepository = DatabricksDataRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DatabricksClient")),
    __metadata("design:paramtypes", [databricks_client_1.DatabricksClient,
        environment_config_service_1.EnvironmentConfigService,
        file_loader_service_1.FileLoaderService])
], DatabricksDataRepository);
//# sourceMappingURL=databricks-data.repository.js.map