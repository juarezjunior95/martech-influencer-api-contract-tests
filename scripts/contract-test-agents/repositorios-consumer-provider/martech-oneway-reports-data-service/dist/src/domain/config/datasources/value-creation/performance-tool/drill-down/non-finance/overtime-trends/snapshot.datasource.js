"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const overtime_trends_handler_1 = require("../../../../../../../handlers/value-creation/performance-tool/drill-down/non-finance/overtime-trends/overtime-trends.handler");
const dataset_repository_factory_1 = require("../../../../../../../factories/dataset-repository.factory");
const filters = [
    {
        name: "viewtype",
        required: true,
    },
    {
        name: "page_filter",
        required: true,
    },
    {
        name: "brand",
        required: true,
    },
    {
        name: "country",
        required: true,
    },
    {
        name: "region",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "timeframe",
        required: true,
    },
];
const config = {
    version: "1.0.0",
    datasets: [
        {
            id: "non-finance-overtime-trends-by-snapshot",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "7_value_creation_brand-power_bar-chart",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: overtime_trends_handler_1.performanceToolByOverTimeTrendsHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=snapshot.datasource.js.map