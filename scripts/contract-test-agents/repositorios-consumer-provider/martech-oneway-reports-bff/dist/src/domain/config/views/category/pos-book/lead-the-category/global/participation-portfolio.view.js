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
            id: "participation-portfolio",
            formatter: "category/pos-book/lead-the-category/global/participation-portfolio",
            datasources: [
                {
                    name: "category_pos-book_lead-the-category_global_participation-portfolio",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=participation-portfolio.view.js.map