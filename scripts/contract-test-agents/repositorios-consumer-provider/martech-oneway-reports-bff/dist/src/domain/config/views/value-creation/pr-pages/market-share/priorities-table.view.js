"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonFilters = [
    {
        name: "dt_end",
    },
    {
        name: "page_type",
    },
];
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: commonFilters,
    },
    components: [
        {
            id: "segments-table",
            formatter: "value-creation/pr-pages/market-share/growth-levers",
            datasources: [
                {
                    name: "value-creation_pr-pages_market-share_growth-levers",
                    filters: [
                        {
                            name: "view_level",
                            defaultValue: "Priorities Global",
                        },
                        {
                            name: "dt_end",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=priorities-table.view.js.map