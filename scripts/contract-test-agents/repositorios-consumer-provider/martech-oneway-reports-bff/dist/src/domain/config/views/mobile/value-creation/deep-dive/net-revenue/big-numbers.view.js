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
            id: "big-numbers",
            formatter: "mobile/value-creation/deep-dive/shared/big-numbers",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-performance",
                    title: "bigNumbers",
                    filters: [{ name: "kpi", defaultValue: "nr" }],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=big-numbers.view.js.map