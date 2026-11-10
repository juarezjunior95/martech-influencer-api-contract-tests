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
      id: "summaryPowerBreakdown",
      formatter:
        "portfolio-brand/brand-power-book/overview/summary/summaryPowerBreakdownFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_summary-power_by-brand-breakdown",
        },
      ],
    },
    {
      id: "summaryPowerBreakdownComp",
      formatter:
        "portfolio-brand/brand-power-book/overview/summary/summaryPowerBreakdownCompFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_summary-power_by-brand-breakdown",
        },
      ],
    },
  ],
};

export default config;
