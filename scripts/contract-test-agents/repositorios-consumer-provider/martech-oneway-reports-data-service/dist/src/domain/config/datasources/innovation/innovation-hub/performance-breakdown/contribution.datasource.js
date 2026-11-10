"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_SP_NAME = exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const contribution_handler_1 = require("../../../../../handlers/innovation/innovation-hub/performance-breakdown/contribution.handler");
exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_DATASET_ID = "contribution";
exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_SP_NAME = "4_innovation_innovation-performance_performance-&-breakdown_innovation-contribution";
const filters = [
    { name: "kpi", required: true },
    { name: "country", required: true },
    { name: "dt_end", required: true },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: contribution_handler_1.contributionHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=contribution.datasource.js.map