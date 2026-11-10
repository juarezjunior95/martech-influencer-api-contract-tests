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
                name: "year",
            },
        ],
    },
    components: [
        {
            id: "category-health_drill-down-big-numbers",
            formatter: "category/category-health/drill-down/big-numbers-drill",
            datasources: [
                {
                    name: "category_category-health_drill-down_big-numbers-drill",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=big-numbers-drill.view.js.map