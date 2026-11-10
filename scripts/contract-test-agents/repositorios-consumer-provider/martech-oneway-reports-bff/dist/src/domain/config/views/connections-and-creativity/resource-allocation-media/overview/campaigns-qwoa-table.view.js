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
            id: "campaigns",
            formatter: "connections-and-creativity/resource-allocation-media/overview/campaigns-qwoa-table",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa-table",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=campaigns-qwoa-table.view.js.map