"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portfolio_performance_table_handler_1 = require("../../../../../../handlers/value-creation/portfolio-performance/overview/portfolio-performance-table.handler");
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
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
        name: "dt_ini",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "zone",
        required: true,
    },
];
const config = {
    datasets: [
        {
            id: "volume",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_portfolio-performance_overview_portfolio-performance",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: portfolio_performance_table_handler_1.portfolioPerformanceTableHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=volume.datasource.js.map