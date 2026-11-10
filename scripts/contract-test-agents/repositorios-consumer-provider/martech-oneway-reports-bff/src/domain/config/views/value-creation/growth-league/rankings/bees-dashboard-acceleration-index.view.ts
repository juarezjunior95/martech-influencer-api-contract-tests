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
      id: "bees-dashboard-acceleration-index",
      formatter:
        "value-creation/growth-league/rankings/bees-dashboard-acceleration-index",
      datasources: [
        {
          name: "value-creation_growth-league_rankings_bees-dashboard-acceleration-index",
        },
      ],
    },
  ],
};

export default config;
