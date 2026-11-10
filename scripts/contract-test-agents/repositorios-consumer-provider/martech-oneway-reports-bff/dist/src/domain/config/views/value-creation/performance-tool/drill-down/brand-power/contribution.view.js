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
                name: "page_filter",
            },
            {
                name: "timeframe",
            },
        ],
    },
    components: [
        {
            id: "contribution",
            formatter: "value-creation/performance-tool/drill-down/non-finance/contribution-waterfall",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_non-finance_contribution_waterfall",
                    title: "large",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "power",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "country",
                        },
                        {
                            name: "max_ranked",
                            defaultValue: "15",
                        },
                    ],
                },
                {
                    name: "value-creation_performance-tool_drill-down_non-finance_contribution_waterfall",
                    title: "small",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "power",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "country",
                        },
                        {
                            name: "max_ranked",
                            defaultValue: "10",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=contribution.view.js.map