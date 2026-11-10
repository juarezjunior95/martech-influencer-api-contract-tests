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
        name: "dt_ini",
      },
      {
        name: "dt_end",
      },
    ],
  },
  components: [
    {
      id: "campaigns_performance",
      formatter:
        "connections-and-creativity/resource-allocation-media/campaign-deep-dive/campaigns-performance",
      datasources: [
        {
          name: "connections-and-creativity_resource-allocation-media_campaign-deep-dive_campaign-tracker-by-brand-table",
        },
        {
          name: "connections-and-creativity_resource-allocation-media_campaign-deep-dive_campaign-tracker-by-brand-weekly-calendar",
        },
      ],
    },
  ],
};

export default config;
