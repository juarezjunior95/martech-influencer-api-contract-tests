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
                name: "waterfall_filter",
            },
        ],
    },
    components: [
        {
            id: "overtime-performance",
            formatter: "value-creation/performance-tool/drill-down/finance/cores/big-numbers",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_finance_cores_overtime-performance",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "cores",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overtime-performance.view.js.map