"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceModule = void 0;
const common_1 = require("@nestjs/common");
const datasource_controller_1 = require("../controllers/datasource.controller");
const fetch_datasource_usecase_1 = require("../../application/usecases/fetch-datasource.usecase");
const postgres_data_repository_1 = require("../repositories/postgres-data.repository");
const databricks_data_repository_1 = require("../repositories/databricks-data.repository");
const datasource_config_repository_1 = require("../repositories/datasource-config.repository");
const common_module_1 = require("../../common/common.module");
const postgres_module_1 = require("./postgres.module");
const databricks_module_1 = require("./databricks.module");
const datasource_factory_1 = require("../../domain/factories/datasource.factory");
const dataset_repository_factory_1 = require("../../domain/factories/dataset-repository.factory");
let DataSourceModule = class DataSourceModule {
};
exports.DataSourceModule = DataSourceModule;
exports.DataSourceModule = DataSourceModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, postgres_module_1.PostgresModule, databricks_module_1.DatabricksModule],
        controllers: [datasource_controller_1.DataSourceController],
        providers: [
            {
                provide: "PostgresDataRepository",
                useClass: postgres_data_repository_1.PostgresDataRepository,
            },
            {
                provide: "DatabricksDataRepository",
                useClass: databricks_data_repository_1.DatabricksDataRepository,
            },
            {
                provide: "DatasetRepositoryFactory",
                useClass: dataset_repository_factory_1.DatasetRepositoryFactory,
            },
            {
                provide: "DatasourceConfigRepository",
                useClass: datasource_config_repository_1.DatasourceConfigRepository,
            },
            {
                provide: "DatasourceFactory",
                useClass: datasource_factory_1.DatasourceFactory,
            },
            {
                provide: "FetchDataSourceUseCase",
                useClass: fetch_datasource_usecase_1.FetchDataSourceUseCase,
            },
        ],
    })
], DataSourceModule);
//# sourceMappingURL=datasource.module.js.map