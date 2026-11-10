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
      {
        name: "kpi_name",
      },
    ],
  },
  components: [
    {
      id: "non_working_money_ranking",
      formatter:
        "connections-and-creativity/resource-allocation-media/overview/non-working-money-ranking",
      datasources: [
        {
          name: "connections-and-creativity_resource-allocation-media_overview_unified-ranking",
        },
      ],
    },
  ],
};

export default config;
