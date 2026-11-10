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
      id: "ka-dashboard-league-b",
      formatter: "value-creation/growth-league/rankings/ka-dashboard-league-b",
      datasources: [
        {
          name: "value-creation_growth-league_rankings_ka-dashboard-league-b",
        },
      ],
    },
  ],
};

export default config;
