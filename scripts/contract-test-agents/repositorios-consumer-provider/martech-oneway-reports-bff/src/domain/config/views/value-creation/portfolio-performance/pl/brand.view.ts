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
        name: "dt_ini",
      },
      {
        name: "country",
      },
    ],
  },
  components: [
    {
      id: "pl-brand",
      formatter: "value-creation/portfolio-performance/pl/plFormatter",
      datasources: [
        {
          name: "value-creation_portfolio-performance_pl_brand_growth-contribution",
        },
        {
          name: "value-creation_portfolio-performance_pl_brand_volume",
        },
        {
          name: "value-creation_portfolio-performance_pl_brand_output",
        },
      ],
    },
  ],
};

export default config;
