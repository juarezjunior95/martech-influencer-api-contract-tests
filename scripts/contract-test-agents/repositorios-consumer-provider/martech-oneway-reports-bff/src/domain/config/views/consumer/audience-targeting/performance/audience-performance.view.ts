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
    ],
  },
  components: [
    {
      id: "core-audience-performance",
      formatter:
        "consumer/audience-targeting/performance/core-audience-performance",
      datasources: [
        {
          name: "consumer_audience-targeting_performance_core-audience-performance",
        },
      ],
    },
  ],
};

export default config;
