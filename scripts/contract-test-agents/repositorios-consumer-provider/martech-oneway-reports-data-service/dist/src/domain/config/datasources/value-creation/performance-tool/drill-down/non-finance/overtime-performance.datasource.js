"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const overtime_performance_handler_1 = require("../../../../../../handlers/value-creation/performance-tool/drill-down/non-finance/overtime-performance.handler");
const filters = [
    { name: "viewtype", required: true },
    { name: "page_filter", required: true },
    { name: "brand", required: true },
    { name: "country", required: true },
    { name: "region", required: false },
    { name: "dt_end", required: true },
];
const config = {
    version: "1.0.0",
    datasets: [
        {
            id: "big-numbers-st",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "7_value_creation_brand-power_big-numbers",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: overtime_performance_handler_1.overtimePerformanceHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=overtime-performance.datasource.js.map