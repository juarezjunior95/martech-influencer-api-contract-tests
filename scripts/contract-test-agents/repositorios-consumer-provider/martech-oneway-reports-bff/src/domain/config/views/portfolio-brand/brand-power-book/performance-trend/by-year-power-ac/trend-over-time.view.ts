import { ViewConfig } from "@domain/entities/view.entity";

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: [
      {
        name: "dt_end",
      },
      {
        name: "viewtype",
      },
      {
        name: "page_filter",
      },
      {
        name: "country",
      },
      {
        name: "zone",
      },
    ],
  },
  components: [
    {
      id: "trend-over-time",
      formatter:
        "portfolio-brand/brand-power-book/performance-trend/by-year-power-ac/trend-over-time",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time",
        },
        {
          name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-year-power-ac",
        },
        {
          name: "portfolio-brand_brand-power-book_overview_power-performance-trend_year-by-year-power-ac-power-mix",
        },
        {
          name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time-power-mix",
        },
      ],
    },
  ],
};

export default config;
