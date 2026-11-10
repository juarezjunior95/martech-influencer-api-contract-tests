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
    // Main Page
    {
      id: "big-numbers-global",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filters: [
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
              name: "dt_end",
            },
          ],
        },
      ],
    },
    {
      id: "line-chart-global",
      formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_line-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Global",
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
              defaultValue: "All",
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
      id: "growth-levers-priorities",
      formatter: "value-creation/pr-pages/market-share/growth-levers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_growth-levers",
          filters: [
            {
              name: "view_level",
              defaultValue: "Growth Levers Global",
            },
            {
              name: "dt_end",
            },
            {
              name: "country",
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
      id: "must-win-markets",
      formatter: "value-creation/pr-pages/market-share/must-win-markets",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_must-win-markets",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "segment",
              defaultValue: "Global",
            },
            {
              name: "brand",
              defaultValue: "",
            },
            {
              name: "sub_brand",
              defaultValue: "",
            },
            {
              name: "growth_lever",
              defaultValue: "",
            },
          ],
        },
      ],
    },
    {
      id: "country-MTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "dt_end",
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
              defaultValue: "All",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "period_type",
              defaultValue: "MTD",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
            {
              name: "waterfall_filter",
              defaultValue: "country",
            },
          ],
        },
      ],
    },
    {
      id: "country-YTD",
      formatter: "value-creation/pr-pages/market-share/top-15-countries",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-15-countries",
          filters: [
            {
              name: "dt_end",
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
              defaultValue: "All",
            },
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "period_type",
              defaultValue: "YTD",
            },
            {
              name: "max_ranked",
              defaultValue: 15,
            },
            {
              name: "waterfall_filter",
              defaultValue: "country",
            },
          ],
        },
      ],
    },
    {
      id: "brand-top-YTD",
      formatter: "value-creation/pr-pages/market-share/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-bottom-brands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "period_type",
              defaultValue: "YTD",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "direction",
              defaultValue: "top",
            },
          ],
        },
      ],
    },
    {
      id: "brand-bottom-YTD",
      formatter: "value-creation/pr-pages/market-share/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-bottom-brands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "period_type",
              defaultValue: "YTD",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "direction",
              defaultValue: "bottom",
            },
          ],
        },
      ],
    },
    {
      id: "brand-top-MTD",
      formatter: "value-creation/pr-pages/market-share/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-bottom-brands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "period_type",
              defaultValue: "MTD",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "direction",
              defaultValue: "top",
            },
          ],
        },
      ],
    },
    {
      id: "brand-bottom-MTD",
      formatter: "value-creation/pr-pages/market-share/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-bottom-brands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "All",
            },
            {
              name: "period_type",
              defaultValue: "MTD",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "direction",
              defaultValue: "bottom",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
