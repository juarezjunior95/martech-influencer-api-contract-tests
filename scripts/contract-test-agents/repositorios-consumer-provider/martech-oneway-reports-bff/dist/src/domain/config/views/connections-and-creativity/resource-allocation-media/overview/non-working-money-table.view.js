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
            id: "resource_allocation",
            formatter: "connections-and-creativity/resource-allocation-media/overview/non-working-money-table",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_non-working-money-table",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=non-working-money-table.view.js.map