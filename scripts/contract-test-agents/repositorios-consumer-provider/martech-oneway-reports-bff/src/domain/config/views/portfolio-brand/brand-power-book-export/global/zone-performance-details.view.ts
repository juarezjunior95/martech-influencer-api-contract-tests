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
        name: "zone_maturity",
      },
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
      id: "performanceDetails",
      formatter:
        "portfolio-brand/brand-power-book-export/performance-breakdown/exportPerformanceDetailsFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_performance-breakdown_by-zone-maturity-performance-details",
        },
      ],
    },
  ],
};

export default config;
