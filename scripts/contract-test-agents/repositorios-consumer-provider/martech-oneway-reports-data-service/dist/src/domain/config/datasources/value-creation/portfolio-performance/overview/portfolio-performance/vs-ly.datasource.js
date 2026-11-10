"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portfolio_performance_table_handler_1 = require("../../../../../../handlers/value-creation/portfolio-performance/overview/portfolio-performance-table.handler");
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "vs-ly",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/portfolio-performance/overview/portfolio-performance/vs-ly",
            }),
        },
    ],
    handler: portfolio_performance_table_handler_1.portfolioPerformanceTableHandler,
    filters: [
        {
            name: "dt_ini",
            required: true,
        },
        {
            name: "dt_end",
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
            name: "viewtype",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=vs-ly.datasource.js.map