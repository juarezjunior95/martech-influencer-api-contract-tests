"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "ai-summary",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "ai-summary/ai-summary",
            }),
        },
    ],
    filters: [
        {
            name: "country",
            required: false,
        },
        {
            name: "timeperiod",
            required: false,
        },
        {
            name: "price_segment",
            required: false,
        },
        {
            name: "cohort",
            required: false,
        },
        {
            name: "page",
            required: true,
        },
        {
            name: "viewtype",
            required: false,
        },
        {
            name: "scope",
            required: false,
        },
        {
            name: "pos_kpi",
            required: false,
        },
        {
            name: "brand",
            required: false,
        },
        {
            name: "page_filter",
            required: false,
        },
        {
            name: "sub_brand",
            required: false,
        },
        {
            name: "zone",
            required: false,
        },
        {
            name: "period",
            required: false,
        },
        {
            name: "growth_lever",
            required: false,
        },
        {
            name: "competitor",
            required: false,
        },
        {
            name: "period_type",
            required: false,
        },
        {
            name: "kpi",
            required: false,
        },
        {
            name: "waterfall_filter",
            required: false,
        },
        {
            name: "product_scope",
            required: false,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=ai-summary.datasource.js.map