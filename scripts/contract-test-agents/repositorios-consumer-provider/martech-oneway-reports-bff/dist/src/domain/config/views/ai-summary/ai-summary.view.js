"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["ai-summary"],
    },
    filters: {
        default: [
            {
                name: "country",
            },
            {
                name: "timeperiod",
            },
            {
                name: "price_segment",
            },
            {
                name: "dt_end",
            },
            {
                name: "cohort",
            },
            {
                name: "page",
            },
            {
                name: "viewtype",
            },
            {
                name: "scope",
            },
            {
                name: "pos_kpi",
            },
            {
                name: "brand",
            },
            {
                name: "page_filter",
            },
            {
                name: "sub_brand",
            },
            {
                name: "zone",
            },
            {
                name: "period",
            },
            {
                name: "growth_lever",
            },
            {
                name: "competitor",
            },
            {
                name: "period_type",
            },
            {
                name: "kpi",
            },
            {
                name: "waterfall_filter",
            },
            {
                name: "product_scope",
            },
        ],
    },
    components: [
        {
            id: "ai-summary",
            formatter: "ai-summary/ai-summary",
            datasources: [
                {
                    name: "ai-summary_ai-summary",
                    filters: [
                        { name: "country", defaultValue: "" },
                        { name: "cohort", defaultValue: "" },
                        { name: "page", defaultValue: "" },
                        { name: "viewtype", defaultValue: "" },
                        { name: "price_segment", defaultValue: "" },
                        { name: "dt_end", defaultValue: "" },
                        { name: "timeperiod", defaultValue: "" },
                        { name: "scope", defaultValue: "" },
                        { name: "pos_kpi", defaultValue: "" },
                        { name: "brand", defaultValue: "" },
                        { name: "page_filter", defaultValue: "" },
                        { name: "sub_brand", defaultValue: "" },
                        { name: "zone", defaultValue: "" },
                        { name: "period", defaultValue: "" },
                        { name: "growth_lever", defaultValue: "" },
                        { name: "competitor", defaultValue: "" },
                        { name: "period_type", defaultValue: "" },
                        { name: "kpi", defaultValue: "" },
                        { name: "waterfall_filter", defaultValue: "" },
                        { name: "product_scope", defaultValue: "" },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=ai-summary.view.js.map