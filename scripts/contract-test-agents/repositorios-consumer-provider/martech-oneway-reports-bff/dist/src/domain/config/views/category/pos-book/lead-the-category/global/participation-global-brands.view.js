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
                name: "cohort",
            },
            {
                name: "timeperiod",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "participation-global-brands",
            formatter: "category/pos-book/lead-the-category/global/participation-global-brands",
            datasources: [
                {
                    name: "category_pos-book_lead-the-category_global_participation-global-brands",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=participation-global-brands.view.js.map