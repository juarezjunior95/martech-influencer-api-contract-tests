"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const filters = [
    {
        name: "period",
        required: false,
    },
    {
        name: "scope",
        required: false,
    },
    {
        name: "segmented_control",
        required: false,
    },
    {
        name: "sub_scope",
        required: false,
    },
    {
        name: "template",
        required: false,
    },
    {
        name: "timeframe",
        required: false,
    },
    {
        name: "type",
        required: false,
    },
    {
        name: "zone",
        required: false,
    },
    {
        name: "country",
        required: false,
    },
    {
        name: "insights_title",
        required: false,
    },
];
const config = {
    version: "1.0.0",
    datasets: [
        {
            id: "brand-power-book-export-insights",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_brand-power-results-export_insigths",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=insights.datasource.js.map