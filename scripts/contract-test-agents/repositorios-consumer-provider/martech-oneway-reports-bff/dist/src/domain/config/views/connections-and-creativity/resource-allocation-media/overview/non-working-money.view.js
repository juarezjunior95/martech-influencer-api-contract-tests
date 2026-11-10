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
                name: "dt_ini",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "non_working_money",
            formatter: "connections-and-creativity/resource-allocation-media/overview/non-working-money",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_non-working-money",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=non-working-money.view.js.map