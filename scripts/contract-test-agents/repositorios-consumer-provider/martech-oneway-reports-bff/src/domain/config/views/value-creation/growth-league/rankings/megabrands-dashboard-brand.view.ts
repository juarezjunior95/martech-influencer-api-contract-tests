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
      id: "megabrands-dashboard-brand",
      formatter:
        "value-creation/growth-league/rankings/megabrands-dashboard-brand",
      datasources: [
        {
          name: "value-creation_growth-league_rankings_megabrands-dashboard-brand",
        },
      ],
    },
  ],
};

export default config;
