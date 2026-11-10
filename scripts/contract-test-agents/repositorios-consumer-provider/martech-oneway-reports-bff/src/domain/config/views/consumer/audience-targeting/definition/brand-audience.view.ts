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
      id: "audience-cards",
      formatter: "consumer/audience-targeting/definition/audience-cards",
      datasources: [
        {
          name: "consumer_audience-targeting_definition_brand-audience",
        },
      ],
    },
    {
      id: "participation-breakdown",
      formatter:
        "consumer/audience-targeting/definition/participation-breakdown",
      datasources: [
        {
          name: "consumer_audience-targeting_definition_participation-breakdown",
        },
      ],
    },
  ],
};

export default config;
