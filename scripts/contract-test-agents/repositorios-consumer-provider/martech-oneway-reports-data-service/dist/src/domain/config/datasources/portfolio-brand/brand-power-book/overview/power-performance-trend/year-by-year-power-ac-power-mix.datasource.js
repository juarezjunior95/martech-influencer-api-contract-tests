"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const year_by_year_power_ac_power_mix_handler_1 = require("../../../../../../handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/year-by-year-power-ac-power-mix.handler");
const filters = [
    {
        name: "country",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "page_filter",
        required: true,
    },
    {
        name: "viewtype",
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
            id: "yearly_power_ac_power_mix",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_power-book_power-performance_trend",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: year_by_year_power_ac_power_mix_handler_1.yearByYearPowerAcPowerMixHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=year-by-year-power-ac-power-mix.datasource.js.map