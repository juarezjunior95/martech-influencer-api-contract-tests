"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: [
            { name: "country" },
            { name: "dt_end" },
            { name: "dt_ini" },
            { name: "viewtype" },
            { name: "growth_lever" },
            { name: "period" },
            { name: "period_type" },
            { name: "timeframe" },
            { name: "kpi" },
            { name: "waterfall_filter" },
            { name: "zone" },
            { name: "portfolio" },
            { name: "segment" },
            { name: "brand" },
            { name: "sub_brand" },
            { name: "page_filter" },
        ],
    },
    components: [
        {
            id: "waterfall",
            formatter: "mobile/value-creation/deep-dive/shared/waterfall-finance",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_finance_net-revenue_waterfall",
                    title: "waterfall",
                    filters: [
                        { name: "kpi", defaultValue: "nr" },
                        { name: "max_ranked", defaultValue: 15 },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=waterfall.view.js.map