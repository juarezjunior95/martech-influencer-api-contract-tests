import { ViewConfig } from "@domain/entities/view.entity";

const commonFilters = [
  {
    name: "dt_end",
  },
  {
    name: "page_type",
  },
  {
    name: "price_tier",
  },
  {
    name: "growth_lever",
  },
];

const bigNumbersFilters = [
  {
    name: "dt_end",
  },
  {
    name: "growth_lever",
  },
];

const topBottomBrandsFilters = [
  {
    name: "dt_end",
  },
  {
    name: "growth_lever",
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
    topBottomBrands: topBottomBrandsFilters,
  },
  components: [
    // Main Page
    {
      id: "big-numbers",
      formatter: "value-creation/pr-pages/volume/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
          filterSet: "bigNumbers",
          filters: [
            {
              name: "kpi",
              defaultValue: "volume",
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
      id: "line-chart",
      formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_line-chart",
          filters: [
            {
              name: "dt_end",
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
            },
            {
              name: "period_type",
              defaultValue: "All",
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
      id: "must-win-markets",
      formatter: "value-creation/pr-pages/volume/must-win-markets",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
          filters: [
            {
              name: "country",
              defaultValue: "WIN",
            },
            {
              name: "dt_end",
            },
            {
              name: "page_type",
            },
            {
              name: "kpi",
            },
          ],
        },
      ],
    },
    // Volume by Country
    {
      id: "country-MTD",
      formatter: "value-creation/pr-pages/volume/segments-gb/mtd-by-country",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_segments-gb_mtd-by-country",
          filters: [
            {
              name: "page_type",
              defaultValue: "Global",
            },
            {
              name: "period",
              defaultValue: "MTD",
            },
            {
              name: "dt_end",
            },
          ],
        },
      ],
    },
    {
      id: "country-YTD",
      formatter: "value-creation/pr-pages/volume/segments-gb/mtd-by-country",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_segments-gb_mtd-by-country",
          filters: [
            {
              name: "page_type",
              defaultValue: "Global",
            },
            {
              name: "period",
              defaultValue: "YTD",
            },
            {
              name: "dt_end",
            },
          ],
        },
      ],
    },
    // Top Bottom Brands YTD
    {
      id: "brand-top-YTD",
      formatter: "value-creation/pr-pages/volume/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_top-bottom-brands",
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "view_level",
              defaultValue: "Growth Levers Global",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "page_type",
              defaultValue: "top",
            },
            {
              name: "period",
              defaultValue: "YTD",
            },
            {
              name: "kpi",
            },
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
            },
          ],
        },
      ],
    },
    {
      id: "brand-bottom-YTD",
      formatter: "value-creation/pr-pages/volume/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_top-bottom-brands",
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "view_level",
              defaultValue: "Growth Levers Global",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "page_type",
              defaultValue: "bottom",
            },
            {
              name: "period",
              defaultValue: "YTD",
            },
            {
              name: "kpi",
            },
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
            },
          ],
        },
      ],
    },
    // Top Bottom Brands MTD
    {
      id: "brand-top-MTD",
      formatter: "value-creation/pr-pages/volume/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_top-bottom-brands",
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "view_level",
              defaultValue: "Growth Levers Global",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "page_type",
              defaultValue: "top",
            },
            {
              name: "period",
              defaultValue: "MTD",
            },
            {
              name: "kpi",
            },
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
            },
          ],
        },
      ],
    },
    {
      id: "brand-bottom-MTD",
      formatter: "value-creation/pr-pages/volume/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_top-bottom-brands",
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "view_level",
              defaultValue: "Growth Levers Global",
            },
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "page_type",
              defaultValue: "bottom",
            },
            {
              name: "period",
              defaultValue: "MTD",
            },
            {
              name: "kpi",
            },
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
