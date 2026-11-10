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
    ],
  },
  components: [
    {
      id: "dtc-dashboard",
      formatter: "value-creation/growth-league/rankings/dtc-dashboard",
      datasources: [
        {
          name: "value-creation_growth-league_rankings_dtc-dashboard",
        },
      ],
    },
  ],
};

export default config;
