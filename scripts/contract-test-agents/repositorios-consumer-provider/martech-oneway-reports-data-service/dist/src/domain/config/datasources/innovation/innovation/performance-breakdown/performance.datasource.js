"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const performance_handler_1 = require("../../../../../handlers/innovation/innovation/performance-breakdown/performance.handler");
const config = {
    datasets: [
        {
            id: "innovation-performance",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "innovation/innovation/performance-breakdown/performance",
            }),
        },
        {
            id: "innovation-performance-contribution",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "innovation/innovation/performance-breakdown/performance-contribution",
            }),
        },
    ],
    handler: performance_handler_1.performanceHandler,
    filters: [
        {
            name: "dt_end",
        },
        {
            name: "country",
        },
        {
            name: "viewtype",
        },
        {
            name: "kpi",
        },
    ],
};
exports.default = config;
//# sourceMappingURL=performance.datasource.js.map