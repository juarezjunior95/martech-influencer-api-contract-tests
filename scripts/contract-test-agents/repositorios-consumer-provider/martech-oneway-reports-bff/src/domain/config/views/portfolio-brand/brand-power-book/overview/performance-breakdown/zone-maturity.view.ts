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
        name: "viewtype",
      },
      {
        name: "page_filter",
      },
      {
        name: "dt_end",
      },
    ],
  },
  components: [
    {
      id: "zonePowerPerformance",
      formatter:
        "portfolio-brand/brand-power-book/overview/performance-breakdown/zonePowerPerformanceFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_performance-breakdown_by-zone",
        },
      ],
    },
    {
      id: "maturityPowerPerformance",
      formatter:
        "portfolio-brand/brand-power-book/overview/performance-breakdown/maturityPowerPerformanceFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_performance-breakdown_by-maturity",
        },
      ],
    },
  ],
};

export default config;
