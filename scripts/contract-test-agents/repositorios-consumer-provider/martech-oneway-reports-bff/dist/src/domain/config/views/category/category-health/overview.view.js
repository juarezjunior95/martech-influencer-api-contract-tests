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
                name: "year",
            },
            {
                name: "category",
            },
        ],
    },
    components: [
        {
            id: "category-health_overview",
            formatter: "category/category-health/overview",
            datasources: [
                {
                    name: "category_category-health_overview",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overview.view.js.map