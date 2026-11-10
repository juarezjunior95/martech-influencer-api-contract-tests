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
                name: "growth_lever",
            },
            {
                name: "page_filter",
            },
            {
                name: "brand",
            },
            {
                name: "sub_brand",
            },
            {
                name: "zone",
            },
            {
                name: "country",
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
            id: "big-numbers",
            formatter: "value-creation/performance-tool/drill-down/finance/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_finance_volume_big-numbers",
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
//# sourceMappingURL=big-numbers.view.js.map