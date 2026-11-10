"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const portfolio_performance_handler_1 = require("../../../../../../handlers/value-creation/portfolio-performance/overview/portfolio-performance.handler");
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
            id: "category-growth-levers",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_portfolio-performance_portfolio-performance",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: portfolio_performance_handler_1.portfolioPerformanceHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=portfolio-performance.datasource.js.map