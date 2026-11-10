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
exports.DatasetRepositoryFactory = exports.DeltalakeExecutionType = exports.RepositoryType = void 0;
exports.createDeltalakeFetchDataConfig = createDeltalakeFetchDataConfig;
exports.createDeltalakeProcedureFetchDataConfig = createDeltalakeProcedureFetchDataConfig;
exports.createDatabaseFetchDataConfig = createDatabaseFetchDataConfig;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const procedure_environment_1 = require("./procedure-environment");
var RepositoryType;
(function (RepositoryType) {
    RepositoryType["deltalake"] = "DatabricksDataRepository";
    RepositoryType["database"] = "PostgresDataRepository";
})(RepositoryType || (exports.RepositoryType = RepositoryType = {}));
var DeltalakeExecutionType;
(function (DeltalakeExecutionType) {
    DeltalakeExecutionType["query"] = "query";
    DeltalakeExecutionType["procedure"] = "procedure";
})(DeltalakeExecutionType || (exports.DeltalakeExecutionType = DeltalakeExecutionType = {}));
const DEFAULT_DELTALAKE_RESULT_QUERY_PROCEDURE = "{{DATABRICKS_SCHEMA}}.owr_result_query_sp";
function createDeltalakeFetchDataConfig(params) {
    return {
        query: params.query,
        executionType: DeltalakeExecutionType.query,
        type: RepositoryType.deltalake,
        ...(params.injectProcedureEnvironment
            ? { injectProcedureEnvironment: true }
            : {}),
    };
}
function createDeltalakeProcedureFetchDataConfig(params) {
    const dynamic = params.parameters.map((p) => `"${p}": :${p}`);
    const statics = Object.entries({
        ...params.staticParams,
        environment: (0, procedure_environment_1.getProcedureEnvironment)(),
    }).map(([k, v]) => `"${k}": ${JSON.stringify(v)}`);
    const payload = [...dynamic, ...statics].join(", ");
    return {
        procedure: `
        CALL ${DEFAULT_DELTALAKE_RESULT_QUERY_PROCEDURE}(
          '${params.functionName}',
          '{${payload}}'
        );
      `,
        executionType: DeltalakeExecutionType.procedure,
        type: RepositoryType.deltalake,
    };
}
function createDatabaseFetchDataConfig(params) {
    return {
        query: params.query,
        type: RepositoryType.database,
    };
}
let DatasetRepositoryFactory = class DatasetRepositoryFactory {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    resolveRepository(type) {
        try {
            return this.moduleRef.get(type);
        }
        catch (error) {
            throw new Error(`Failed to resolve repository: ${type} with error: ${error.message}`);
        }
    }
};
exports.DatasetRepositoryFactory = DatasetRepositoryFactory;
exports.DatasetRepositoryFactory = DatasetRepositoryFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], DatasetRepositoryFactory);
//# sourceMappingURL=dataset-repository.factory.js.map