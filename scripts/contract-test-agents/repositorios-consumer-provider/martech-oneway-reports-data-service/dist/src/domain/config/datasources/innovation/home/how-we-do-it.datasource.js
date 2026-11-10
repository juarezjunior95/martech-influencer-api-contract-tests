"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INNOVATION_HOME_HOW_WE_DO_IT_SP_NAME = exports.INNOVATION_HOME_HOW_WE_DO_IT_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
exports.INNOVATION_HOME_HOW_WE_DO_IT_DATASET_ID = "how-we-do-it";
exports.INNOVATION_HOME_HOW_WE_DO_IT_SP_NAME = "4_innovation_home_how-we-do-it";
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
        name: "zone",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "period_type",
        required: true,
    },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: exports.INNOVATION_HOME_HOW_WE_DO_IT_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.INNOVATION_HOME_HOW_WE_DO_IT_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=how-we-do-it.datasource.js.map