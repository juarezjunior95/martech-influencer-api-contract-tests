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
            id: "overtime-performance",
            formatter: "value-creation/performance-tool/drill-down/non-finance/big-numbers",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_non-finance_overtime-performance",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "power",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overtime-performance.view.js.map