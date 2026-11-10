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
                name: "viewtype",
            },
            {
                name: "country",
            },
            {
                name: "category",
            },
            {
                name: "kpi_name",
            },
        ],
    },
    components: [
        {
            id: "category-health_drill-down-line-chart-drill",
            formatter: "category/category-health/drill-down/line-chart-drill",
            datasources: [
                {
                    name: "category_category-health_drill-down_line-chart-drill",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=line-chart-drill.view.js.map