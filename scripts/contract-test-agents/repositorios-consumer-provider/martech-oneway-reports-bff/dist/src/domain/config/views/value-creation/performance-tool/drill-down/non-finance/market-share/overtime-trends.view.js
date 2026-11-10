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
            {
                name: "dt_end",
            },
            {
                name: "dt_ini",
            },
            {
                name: "growth_lever",
            },
            {
                name: "page_filter",
            },
            {
                name: "country",
            },
            {
                name: "viewtype",
            },
            {
                name: "zone",
            },
            {
                name: "portfolio",
            },
            {
                name: "segment",
            },
            {
                name: "brand",
            },
            {
                name: "sub_brand",
            },
            {
                name: "kpi",
            },
            {
                name: "waterfall_filter",
            },
        ],
    },
    components: [
        {
            id: "overtime-trends",
            formatter: "value-creation/performance-tool/drill-down/non-finance/market-share/overtime-trends-charts",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends_by-granularity",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
                {
                    name: "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends_snapshot",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overtime-trends.view.js.map