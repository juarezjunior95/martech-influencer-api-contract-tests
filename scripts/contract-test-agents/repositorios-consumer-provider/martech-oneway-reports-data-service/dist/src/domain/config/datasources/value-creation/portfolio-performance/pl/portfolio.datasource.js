"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portfolio_handler_1 = require("../../../../../handlers/value-creation/portfolio-performance/pl/portfolio.handler");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const filters = [
    {
        name: "country",
        required: true,
    },
    {
        name: "period",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    datasets: [
        {
            id: "portfolio",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_country-brand-and-portfolio-p&l_overview-portfolio",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: portfolio_handler_1.portfolioHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=portfolio.datasource.js.map