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
            id: "media_qwoa",
            formatter: "connections-and-creativity/resource-allocation-media/media-drilldown/media-qwoa-bubble-chart",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_media-drilldown_media-qwoa-bubble-chart",
                },
                {
                    name: "connections-and-creativity_resource-allocation-media_media-drilldown_megabrands-over-45-qwoa-brands-over-guideline",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=media-qwoa-bubble-chart.view.js.map