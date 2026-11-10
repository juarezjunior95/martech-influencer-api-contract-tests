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
        name: "country",
      },
      {
        name: "zone",
      },
      {
        name: "brand",
      },
      {
        name: "sub_brand",
      },
      {
        name: "dt_end",
      },
    ],
  },
  components: [
    {
      id: "brand-power-chart",
      formatter: "portfolio-brand/brand-analysis/brand-power/chart",
      datasources: [
        { name: "portfolio-brand_brand-analysis_overview_full-year" },
        { name: "portfolio-brand_brand-analysis_overview_per-month" },
        { name: "portfolio-brand_brand-analysis_overview_ytd" },
        { name: "portfolio-brand_brand-analysis_overview_tooltip" },
      ],
    },
  ],
};

export default config;
