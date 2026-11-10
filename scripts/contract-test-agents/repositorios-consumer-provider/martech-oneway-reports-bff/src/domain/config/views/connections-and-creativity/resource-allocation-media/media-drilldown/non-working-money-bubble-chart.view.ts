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
        name: "country",
      },
      {
        name: "dt_ini",
      },
      {
        name: "dt_end",
      },
    ],
  },
  components: [
    {
      id: "non_working_money",
      formatter:
        "connections-and-creativity/resource-allocation-media/media-drilldown/non-working-money-bubble-chart",
      datasources: [
        {
          name: "connections-and-creativity_resource-allocation-media_media-drilldown_non-working-money-bubble-chart",
        },
        {
          name: "connections-and-creativity_resource-allocation-media_media-drilldown_non-working-money-guideline",
        },
      ],
    },
  ],
};

export default config;
