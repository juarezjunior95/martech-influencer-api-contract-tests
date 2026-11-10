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
            id: "megabrands_qwoa",
            formatter: "connections-and-creativity/resource-allocation-media/overview/megabrands-qwoa",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=megabrands-qwoa.view.js.map