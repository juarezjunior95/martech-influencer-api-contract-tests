"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waterfall_handler_1 = require("../../../../../../../handlers/value-creation/performance-tool/drill-down/non-finance/contribution/waterfall.handler");
const dataset_repository_factory_1 = require("../../../../../../../factories/dataset-repository.factory");
const filters = [
    {
        name: "timeframe",
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
        name: "viewtype",
        required: true,
    },
    {
        name: "max_ranked",
        required: true,
    },
    {
        name: "brand",
        required: true,
    },
    {
        name: "portfolio",
        required: true,
    },
    {
        name: "region",
        required: true,
    },
];
const config = {
    datasets: [
        {
            id: "non-finance-contribution-large",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "7_value_creation_performance-tool_power_waterfall",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: waterfall_handler_1.waterfallHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=waterfall.datasource.js.map