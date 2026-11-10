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
        name: "brand",
      },
      {
        name: "country",
      },
      {
        name: "competitor",
      },
      {
        name: "kpi_name",
      },
    ],
  },
  components: [
    {
      id: "breakdown",
      formatter: "consumer/audience-targeting/performance/breakdown",
      datasources: [
        {
          name: "consumer_audience-targeting_performance_breakdown",
        },
      ],
    },
  ],
};

export default config;
