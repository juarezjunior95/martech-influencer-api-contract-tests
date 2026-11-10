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
            id: "bar-charts",
            formatter: "mobile/value-creation/home/bar-charts",
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
            id: "big-numbers",
            formatter: "mobile/value-creation/home/big-numbers",
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
    ],
};
exports.default = config;
//# sourceMappingURL=home.view.js.map