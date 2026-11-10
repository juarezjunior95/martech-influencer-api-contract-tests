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
            id: "campaigns_qwoa",
            formatter: "connections-and-creativity/resource-allocation-media/overview/campaigns-qwoa",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=campaigns-qwoa.view.js.map