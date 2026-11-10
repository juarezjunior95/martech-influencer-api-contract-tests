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
            {
                name: "kpi_name",
            },
        ],
    },
    components: [
        {
            id: "campaigns_qwoa_ranking",
            formatter: "connections-and-creativity/resource-allocation-media/overview/campaigns-qwoa-ranking",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_unified-ranking",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=campaigns-qwoa-ranking.view.js.map