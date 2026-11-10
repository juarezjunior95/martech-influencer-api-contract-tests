"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const by_trend_over_time_power_mix_handler_1 = require("../../../../../../handlers/portfolio-brand/brand-power-book/overview/power-performance-trend/by-trend-over-time-power-mix.handler");
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
            id: "trend_over_time_power_mix",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_power-book_power-mix_qtr",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: by_trend_over_time_power_mix_handler_1.byTrendOverTimePowerMixHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=by-trend-over-time-power-mix.datasource.js.map