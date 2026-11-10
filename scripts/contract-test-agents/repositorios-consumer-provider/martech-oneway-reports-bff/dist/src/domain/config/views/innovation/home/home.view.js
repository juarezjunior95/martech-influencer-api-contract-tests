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
                name: "zone",
            },
            {
                name: "dt_end",
            },
            {
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "innovation-home-big-numbers-trend",
            formatter: "innovation/home/big-numbers-trend",
            datasources: [
                {
                    name: "innovation_home_overtime-performance",
                },
            ],
        },
        {
            id: "innovation-home-big-numbers",
            formatter: "innovation/home/big-numbers",
            datasources: [
                {
                    name: "innovation_home_how-we-do-it",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=home.view.js.map