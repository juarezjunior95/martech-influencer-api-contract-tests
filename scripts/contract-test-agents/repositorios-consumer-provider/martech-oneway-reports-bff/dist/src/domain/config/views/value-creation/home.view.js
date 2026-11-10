"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonFilters = [
    {
        name: "country",
    },
    {
        name: "dt_end",
    },
    {
        name: "viewtype",
    },
    {
        name: "growth_lever",
    },
    {
        name: "period",
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
        finance: commonFilters,
        market_share: commonFilters,
        power: commonFilters,
        pos: commonFilters,
    },
    components: [
        {
            id: "sustainable-growth-overview",
            formatter: "value-creation/home/sustainable-growth-overview",
            datasources: [
                {
                    name: "value-creation_home_sustainable-growth-overview_non-finance",
                    title: "brandPower",
                    filterSet: "power",
                    filters: [
                        {
                            name: "kpi_name",
                            defaultValue: "power",
                        },
                    ],
                },
                {
                    name: "value-creation_home_sustainable-growth-overview_non-finance",
                    title: "marketShare",
                    filterSet: "market_share",
                    filters: [
                        {
                            name: "kpi_name",
                            defaultValue: "market_share",
                        },
                    ],
                },
                {
                    name: "value-creation_home_sustainable-growth-overview_finance",
                    title: "volume",
                    filters: [
                        {
                            name: "kpi_name",
                            defaultValue: "volume",
                        },
                    ],
                },
                {
                    name: "value-creation_home_sustainable-growth-overview_finance",
                    title: "finance",
                    filterSet: "finance",
                    filters: [
                        {
                            name: "kpi_name",
                            defaultValue: "finance",
                        },
                    ],
                },
            ],
        },
        {
            id: "strategy-drivers",
            formatter: "value-creation/home/strategy-drivers/pos",
            datasources: [
                {
                    name: "value-creation_home_strategy-drivers_pos",
                    filterSet: "pos",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "strategy-drivers-growth-levers",
            formatter: "value-creation/home/strategy-drivers/growth-levers",
            datasources: [
                {
                    name: "value-creation_home_strategy-drivers_growth-levers",
                    title: "growth_levers",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=home.view.js.map