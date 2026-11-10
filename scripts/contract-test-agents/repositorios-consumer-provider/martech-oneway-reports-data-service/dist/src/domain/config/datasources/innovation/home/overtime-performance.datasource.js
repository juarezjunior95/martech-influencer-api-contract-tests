"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INNOVATION_HOME_OVERTIME_PERFORMANCE_SP_NAME = exports.INNOVATION_HOME_OVERTIME_PERFORMANCE_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
exports.INNOVATION_HOME_OVERTIME_PERFORMANCE_DATASET_ID = "overtime-performance";
exports.INNOVATION_HOME_OVERTIME_PERFORMANCE_SP_NAME = "4_innovation_home_overtime-performance";
const filters = [
    {
        name: "viewtype",
        required: true,
    },
    {
        name: "country",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: exports.INNOVATION_HOME_OVERTIME_PERFORMANCE_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.INNOVATION_HOME_OVERTIME_PERFORMANCE_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=overtime-performance.datasource.js.map