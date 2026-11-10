"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waterfall_handler_1 = require("../../../../../../../handlers/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall.handler");
const dataset_repository_factory_1 = require("../../../../../../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "non-finance-market-share-waterfall",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/performance-tool/drill-down/non-finance/market-share/waterfall",
            }),
        },
    ],
    handler: waterfall_handler_1.marketShareWaterfallHandler,
    filters: [
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "period_type",
            required: true,
        },
        {
            name: "waterfall_filter",
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
            name: "brand",
            required: true,
        },
        {
            name: "max_ranked",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=waterfall.datasource.js.map