import { ViewConfig } from "@domain/entities/view.entity";

const commonFilters = [
  {
    name: "dt_end",
  },
];

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: commonFilters,
  },
  components: [
    // Corona
    {
      id: "big-numbers-corona",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filters: [
            {
              name: "dt_end",
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
              name: "country",
              defaultValue: "All",
            },
            {
              name: "zone",
              defaultValue: "ABI",
            },
            {
              name: "growth_lever",
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
          name: "value-creation_pr-pages_market-share_line-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
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
              name: "brand",
              defaultValue: "Corona",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
          ],
        },
      ],
    },
    {
      id: "bar-chart-corona",
      formatter:
        "value-creation/pr-pages/market-share/brands-by-segments/bar-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_brands-by-segments_bar-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
            },
            {
              name: "brand",
              defaultValue: "Corona",
            },
          ],
        },
      ],
    },
    {
      id: "must-win-markets-corona",
      formatter: "value-creation/pr-pages/market-share/must-win-markets",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_must-win-markets",
          filters: [
            {
              name: "dt_end",
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
              name: "segment",
              defaultValue: "Brand",
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-corona-YTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "YTD",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-corona-MTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "MTD",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    // Corona Cero
    {
      id: "big-numbers-corona-cero",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "brand",
              defaultValue: "All",
            },
            {
              name: "sub_brand",
              defaultValue: "Corona Cero",
            },
            {
              name: "country",
              defaultValue: "All",
            },
            {
              name: "zone",
              defaultValue: "ABI",
            },
            {
              name: "growth_lever",
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
          name: "value-creation_pr-pages_market-share_line-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Subbrand",
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
              name: "brand",
              defaultValue: "Corona",
            },
            {
              name: "sub_brand",
              defaultValue: "Corona Cero",
            },
          ],
        },
      ],
    },
    {
      id: "bar-chart-corona-cero",
      formatter:
        "value-creation/pr-pages/market-share/brands-by-segments/bar-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_brands-by-segments_bar-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Subbrand",
            },
            {
              name: "brand",
              defaultValue: "Corona Cero",
            },
          ],
        },
      ],
    },
    {
      id: "must-win-markets-corona-cero",
      formatter: "value-creation/pr-pages/market-share/must-win-markets",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_must-win-markets",
          filters: [
            {
              name: "dt_end",
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
              defaultValue: "Corona Cero",
            },
            {
              name: "segment",
              defaultValue: "Subbrand",
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-corona-cero-YTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "YTD",
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
              name: "growth_lever",
              defaultValue: "All",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-corona-cero-MTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "MTD",
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
              name: "growth_lever",
              defaultValue: "All",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    // Budweiser
    {
      id: "big-numbers-budweiser",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filters: [
            {
              name: "dt_end",
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
              name: "country",
              defaultValue: "All",
            },
            {
              name: "zone",
              defaultValue: "ABI",
            },
            {
              name: "growth_lever",
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
          name: "value-creation_pr-pages_market-share_line-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
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
              name: "brand",
              defaultValue: "Budweiser",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
          ],
        },
      ],
    },
    {
      id: "bar-chart-budweiser",
      formatter:
        "value-creation/pr-pages/market-share/brands-by-segments/bar-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_brands-by-segments_bar-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
            },
            {
              name: "brand",
              defaultValue: "Budweiser",
            },
          ],
        },
      ],
    },
    {
      id: "must-win-markets-budweiser",
      formatter: "value-creation/pr-pages/market-share/must-win-markets",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_must-win-markets",
          filters: [
            {
              name: "dt_end",
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
              name: "segment",
              defaultValue: "Brand",
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-budweiser-YTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "YTD",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-budweiser-MTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "MTD",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    // Stella
    {
      id: "big-numbers-stella",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filters: [
            {
              name: "dt_end",
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
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "zone",
              defaultValue: "ABI",
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
          name: "value-creation_pr-pages_market-share_line-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
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
              name: "brand",
              defaultValue: "Stella Artois",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
          ],
        },
      ],
    },
    {
      id: "bar-chart-stella",
      formatter:
        "value-creation/pr-pages/market-share/brands-by-segments/bar-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_brands-by-segments_bar-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
            },
            {
              name: "brand",
              defaultValue: "Stella Artois",
            },
          ],
        },
      ],
    },
    {
      id: "must-win-markets-stella",
      formatter: "value-creation/pr-pages/market-share/must-win-markets",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_must-win-markets",
          filters: [
            {
              name: "dt_end",
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
              name: "segment",
              defaultValue: "Brand",
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-stella-YTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "YTD",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-stella-MTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "MTD",
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
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    // Michelob
    {
      id: "big-numbers-michelob",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "brand",
              defaultValue: "Michelob",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "zone",
              defaultValue: "ABI",
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
          name: "value-creation_pr-pages_market-share_line-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
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
              name: "brand",
              defaultValue: "Michelob",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
          ],
        },
      ],
    },
    {
      id: "bar-chart-michelob",
      formatter:
        "value-creation/pr-pages/market-share/brands-by-segments/bar-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_brands-by-segments_bar-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Brand",
            },
            {
              name: "brand",
              defaultValue: "Michelob",
            },
          ],
        },
      ],
    },
    {
      id: "must-win-markets-michelob",
      formatter: "value-creation/pr-pages/market-share/must-win-markets",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_must-win-markets",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "brand",
              defaultValue: "Michelob",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "segment",
              defaultValue: "Brand",
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-michelob-YTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "YTD",
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
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "brand",
              defaultValue: "Michelob",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "waterfall_filter",
              defaultValue: "country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    {
      id: "waterfall-michelob-MTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "period_type",
              defaultValue: "MTD",
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
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "brand",
              defaultValue: "Michelob",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "waterfall_filter",
              defaultValue: "Country",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
  ],
};

export default config;
