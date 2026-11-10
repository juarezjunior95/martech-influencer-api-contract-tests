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
                name: "period_type",
            },
            {
                name: "waterfall_filter",
            },
        ],
    },
    components: [
        {
            id: "line-bar-charts",
            formatter: "value-creation/performance-tool/drill-down/finance/net-revenue/line-bar-charts",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_finance_net-revenue_line-chart",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "nr",
                        },
                    ],
                },
                {
                    name: "value-creation_performance-tool_drill-down_finance_net-revenue_bar-chart",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "nr",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=line-bar-charts.view.js.map