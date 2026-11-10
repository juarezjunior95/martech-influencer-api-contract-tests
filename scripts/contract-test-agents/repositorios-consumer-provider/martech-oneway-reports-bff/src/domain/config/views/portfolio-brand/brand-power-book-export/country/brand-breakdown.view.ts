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
        name: "country",
      },
      {
        name: "zone",
      },
      {
        name: "breakdown_filter",
      },
    ],
  },
  components: [
    {
      id: "brandBreakdown",
      formatter:
        "portfolio-brand/brand-power-book-export/brand-breakdown/brandBreakdown",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_summary-power_by-brand-breakdown",
        },
      ],
    },
  ],
};

export default config;
