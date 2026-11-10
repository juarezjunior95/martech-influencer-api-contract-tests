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
            id: "connections-and-creativity-home-big-numbers-trend",
            formatter: "connections-and-creativity/home/big-numbers-trend",
            datasources: [
                {
                    name: "connections-and-creativity_home_media-spend",
                    title: "media-spend",
                },
                {
                    name: "connections-and-creativity_home_non-working-money",
                    title: "non-working-money",
                },
            ],
        },
        {
            id: "connections-and-creativity-home-resource-allocation",
            formatter: "connections-and-creativity/home/resource-allocation",
            datasources: [
                {
                    name: "connections-and-creativity_home_megabrands-qwoa",
                    title: "megabrands-qwoa",
                },
                {
                    name: "connections-and-creativity_home_campaigns-qwoa",
                    title: "campaigns-qwoa",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=home.view.js.map