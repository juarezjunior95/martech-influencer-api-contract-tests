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
    // Superior Core
    {
      id: "big-numbers",
      formatter: "value-creation/pr-pages/market-share/big-numbers",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_big-numbers",
          filterSet: "bigNumbers",
          filters: [
            {
              name: "dt_end",
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
              name: "growth_lever",
              defaultValue: "Superior Core",
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
              defaultValue: "Superior Core",
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
              defaultValue: "Growth Levers",
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
              name: "growth_lever",
              defaultValue: "Superior Core",
            },
          ],
        },
      ],
    },
    // Volume by Country
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
    // Top Bottom Brands YTD
    {
      id: "brand-top-YTD",
      formatter: "value-creation/pr-pages/market-share/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-bottom-brands",
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "Superior Core",
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
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "Superior Core",
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
    // Top Bottom Brands MTD
    {
      id: "brand-top-MTD",
      formatter: "value-creation/pr-pages/market-share/top-bottom-brands",
      datasources: [
        {
          name: "value-creation_pr-pages_market-share_top-bottom-brands",
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "Superior Core",
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
          filterSet: "topBottomBrands",
          filters: [
            {
              name: "dt_end",
            },
            {
              name: "growth_lever",
              defaultValue: "Superior Core",
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
