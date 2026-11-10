"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const overview_handler_1 = require("../../../../../handlers/trade-execution/bees-distribution/overview.handler");
const config = {
    version: "1.0.0",
    datasets: [
        {
            id: "bar-chart",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "trade-execution/bees-distribution/overview/bar-chart",
            }),
        },
        {
            id: "line-chart",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "trade-execution/bees-distribution/overview/line-chart",
            }),
        },
        {
            id: "card-chart",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "trade-execution/bees-distribution/overview/card-chart",
            }),
        },
    ],
    handler: overview_handler_1.beesDistributionOverviewHandler,
    filters: [
        {
            name: "country",
            required: true,
        },
        {
            name: "viewtype",
            required: true,
        },
        {
            name: "scope",
            required: true,
        },
        {
            name: "pageview",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overview.datasource.js.map