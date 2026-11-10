import { ViewConfig } from "@domain/entities/view.entity";

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: [],
  },
  components: [
    {
      id: "rank",
      formatter: "value-creation/growth-league/overview/rank",
      datasources: [
        {
          name: "value-creation_growth-league_overview_rank",
        },
      ],
    },
  ],
};

export default config;
