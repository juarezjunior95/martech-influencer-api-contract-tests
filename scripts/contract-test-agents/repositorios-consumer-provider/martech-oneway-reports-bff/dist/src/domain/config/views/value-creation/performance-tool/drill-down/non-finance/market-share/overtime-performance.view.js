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
                name: "brand",
            },
            {
                name: "sub_brand",
            },
            {
                name: "country",
            },
        ],
    },
    components: [
        {
            id: "overtime-performance",
            formatter: "value-creation/performance-tool/drill-down/non-finance/market-share/big-numbers",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance",
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
//# sourceMappingURL=overtime-performance.view.js.map