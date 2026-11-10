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
            id: "participation-ranking",
            formatter: "category/pos-book/lead-the-category/global/participation-ranking",
            datasources: [
                {
                    name: "category_pos-book_lead-the-category_global_participation-ranking",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=participation-ranking.view.js.map