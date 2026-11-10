"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const breakdown_handler_1 = require("../../../../../handlers/innovation/innovation/performance-breakdown/breakdown.handler");
const filters = [
    {
        name: "viewtype",
    },
    {
        name: "country",
    },
    {
        name: "dt_end",
    },
    {
        name: "kpi",
    },
    {
        name: "filter",
    },
];
const config = {
    datasets: [
        {
            id: "innovation-breakdown",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "4_innovation_innovation-performance_performance-&-breakdown_breakdown",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: breakdown_handler_1.breakdownHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=breakdown.datasource.js.map