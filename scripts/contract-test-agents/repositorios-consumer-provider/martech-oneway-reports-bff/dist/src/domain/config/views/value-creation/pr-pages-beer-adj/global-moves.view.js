"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonFilters = [
    {
        name: "dt_end",
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
    },
    components: [
        {
            id: "big-numbers-corona",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "brand",
                            defaultValue: "Corona",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "line-chart-corona",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Corona",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "brand",
                            defaultValue: "Corona",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "bar-chart-corona",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/bar-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_bar-chart",
                    filters: [
                        {
                            name: "page_filter",
                            defaultValue: "Corona",
                        },
                        {
                            name: "period_type",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
            ],
        },
        {
            id: "must-win-markets-corona",
            formatter: "value-creation/pr-pages/volume/must-win-markets",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Corona",
                        },
                        {
                            name: "country",
                            defaultValue: "WIN",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-corona-YTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Corona",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-corona-MTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Corona",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
            ],
        },
        {
            id: "big-numbers-corona-cero",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "brand",
                            defaultValue: "Corona",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "Corona Cero",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "line-chart-corona-cero",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "All",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "brand",
                            defaultValue: "Corona",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "Corona Cero",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "bar-chart-corona-cero",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/bar-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_bar-chart",
                    filters: [
                        {
                            name: "page_filter",
                            defaultValue: "Corona Cero",
                        },
                        {
                            name: "period_type",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
            ],
        },
        {
            id: "must-win-markets-corona-cero",
            formatter: "value-creation/pr-pages/volume/must-win-markets",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Corona Cero",
                        },
                        {
                            name: "country",
                            defaultValue: "WIN",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-corona-cero-YTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Corona Cero",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-corona-cero-MTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Corona Cero",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "big-numbers-budweiser",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "brand",
                            defaultValue: "Budweiser",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "line-chart-budweiser",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Budweiser",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "brand",
                            defaultValue: "Budweiser",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "bar-chart-budweiser",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/bar-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_bar-chart",
                    filters: [
                        {
                            name: "page_filter",
                            defaultValue: "Budweiser",
                        },
                        {
                            name: "period_type",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "must-win-markets-budweiser",
            formatter: "value-creation/pr-pages/volume/must-win-markets",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Budweiser",
                        },
                        {
                            name: "country",
                            defaultValue: "WIN",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-budweiser-YTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Budweiser",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-budweiser-MTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Budweiser",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "big-numbers-stella",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "brand",
                            defaultValue: "Stella Artois",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "line-chart-stella",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Stella Artois",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "brand",
                            defaultValue: "Stella Artois",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "bar-chart-stella",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/bar-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_bar-chart",
                    filters: [
                        {
                            name: "page_filter",
                            defaultValue: "Stella Artois",
                        },
                        {
                            name: "period_type",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "must-win-markets-stella",
            formatter: "value-creation/pr-pages/volume/must-win-markets",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Stella Artois",
                        },
                        {
                            name: "country",
                            defaultValue: "WIN",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-stella-YTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Stella Artois",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-stella-MTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Stella Artois",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "big-numbers-michelob",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "brand",
                            defaultValue: "Michelob Ultra",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "line-chart-michelob",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Michelob Ultra",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "brand",
                            defaultValue: "Michelob Ultra",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "bar-chart-michelob",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/bar-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_bar-chart",
                    filters: [
                        {
                            name: "page_filter",
                            defaultValue: "Michelob Ultra",
                        },
                        {
                            name: "period_type",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "must-win-markets-michelob",
            formatter: "value-creation/pr-pages/volume/must-win-markets",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Michelob Ultra",
                        },
                        {
                            name: "country",
                            defaultValue: "WIN",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-michelob-YTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Michelob Ultra",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-michelob-MTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Michelob Ultra",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "big-numbers-flying-fish",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "brand",
                            defaultValue: "Flying Fish",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "line-chart-flying-fish",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "All",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "brand",
                            defaultValue: "Flying Fish",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "bar-chart-flying-fish",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/bar-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_bar-chart",
                    filters: [
                        {
                            name: "page_filter",
                            defaultValue: "Flying Fish",
                        },
                        {
                            name: "period_type",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "must-win-markets-flying-fish",
            formatter: "value-creation/pr-pages/volume/must-win-markets",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Flying Fish",
                        },
                        {
                            name: "country",
                            defaultValue: "WIN",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-flying-fish-YTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Flying Fish",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "waterfall-flying-fish-MTD",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_brands-by-segments_top-15-countries",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Flying Fish",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=global-moves.view.js.map