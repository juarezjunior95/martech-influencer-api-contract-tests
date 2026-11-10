import { ViewConfig } from "@domain/entities/view.entity";

const commonFilters = [
  {
    name: "dt_end",
  },
  {
    name: "dt_ini",
  },
  {
    name: "country",
  },
  {
    name: "zone",
  },
  {
    name: "page_type",
  },
];
const bigNumbersFilters = [
  {
    name: "dt_end",
  },
  {
    name: "zone",
  },
  {
    name: "country",
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
    bigNumbers: bigNumbersFilters,
  },
  components: [
    // Main Page
    {
      id: "big-numbers",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filterSet: "bigNumbers",
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
          ],
        },
      ],
    },
    {
      id: "line-chart",
      formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_line-chart",
          filters: [
            {
              name: "page_type",
              defaultValue: "Country",
            },
            {
              name: "country",
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
            {
              name: "zone",
              defaultValue: "ABI",
            },
          ],
        },
      ],
    },
    {
      id: "growth-levers",
      formatter: "value-creation/pr-pages/market-share/growth-levers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_growth-levers",
          filters: [
            {
              name: "view_level",
              defaultValue: "Growth Levers Country",
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
    // Brands Volume
    {
      id: "brands-volume-MTD",
      formatter: "value-creation/pr-pages/market-share/div-by-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_div-by-brands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "period_type",
              defaultValue: "MTD",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
          ],
        },
      ],
    },
    {
      id: "brands-volume-YTD",
      formatter: "value-creation/pr-pages/market-share/div-by-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_div-by-brands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "period_type",
              defaultValue: "YTD",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
