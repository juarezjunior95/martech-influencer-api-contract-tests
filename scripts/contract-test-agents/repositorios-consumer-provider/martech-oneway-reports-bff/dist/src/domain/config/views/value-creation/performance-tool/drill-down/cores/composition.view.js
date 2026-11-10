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
                name: "country",
            },
            {
                name: "zone",
            },
            {
                name: "brand",
            },
            {
                name: "page_filter",
            },
            {
                name: "period_type",
            },
            {
                name: "kpi",
            },
        ],
    },
    components: [
        {
            id: "composition",
            formatter: "value-creation/performance-tool/drill-down/finance/cores/composition-waterfall",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_finance_cores_composition",
                    title: "composition",
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
//# sourceMappingURL=composition.view.js.map