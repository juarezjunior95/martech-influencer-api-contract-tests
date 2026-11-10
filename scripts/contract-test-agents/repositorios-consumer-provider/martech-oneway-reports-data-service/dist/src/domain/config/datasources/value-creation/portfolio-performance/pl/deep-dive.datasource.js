"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deep_dive_handler_1 = require("../../../../../handlers/value-creation/portfolio-performance/pl/deep-dive.handler");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
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
        name: "dt_ini",
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
            id: "deep-dive",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_country-brand-and-portfolio-p&l_overview-deep-dive",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: deep_dive_handler_1.deepDiveHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=deep-dive.datasource.js.map