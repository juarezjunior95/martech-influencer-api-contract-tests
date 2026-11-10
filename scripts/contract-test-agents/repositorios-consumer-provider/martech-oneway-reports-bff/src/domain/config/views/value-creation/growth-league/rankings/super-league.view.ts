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
      id: "super-league",
      formatter: "value-creation/growth-league/rankings/super-league",
      datasources: [
        {
          name: "value-creation_growth-league_rankings_super-league",
        },
      ],
    },
  ],
};

export default config;
