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
      id: "investment_breakdown",
      formatter:
        "connections-and-creativity/resource-allocation-media/investment-breakdown/table",
      datasources: [
        {
          name: "connections-and-creativity_resource-allocation-media_investment-breakdown_media-full-year-kpis",
        },
        {
          name: "connections-and-creativity_resource-allocation-media_investment-breakdown_volume-kpi",
        },
        {
          name: "connections-and-creativity_resource-allocation-media_investment-breakdown_media-ytd-kpis",
        },
      ],
    },
  ],
};

export default config;
