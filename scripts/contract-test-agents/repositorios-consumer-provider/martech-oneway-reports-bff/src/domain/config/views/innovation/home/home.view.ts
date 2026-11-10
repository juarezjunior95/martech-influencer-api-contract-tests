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
        name: "dt_end",
      },
    ],
  },
  components: [
    {
      id: "innovation-home-big-numbers-trend",
      formatter: "innovation/home/big-numbers-trend",
      datasources: [
        {
          name: "innovation_home_big-numbers-trend",
        },
      ],
    },
    {
      id: "innovation-home-big-numbers",
      formatter: "innovation/home/big-numbers",
      datasources: [
        {
          name: "innovation_innovation_overview_portfolio-health-phi",
          filterSet: "portfolio-health",
        },
        {
          name: "innovation_innovation_overview_strategic-innovation-pillars",
          title: "strategic-innovation-pillars-renovation",
          filterSet: "pillar-rennovation",
          filters: [
            {
              name: "kpi",
              defaultValue: "renovation",
            },
          ],
        },
        {
          name: "innovation_innovation_overview_strategic-innovation-pillars",
          title: "strategic-innovation-pillars-pack-price",
          filters: [
            {
              name: "kpi",
              defaultValue: "pack_price",
            },
          ],
        },
        {
          name: "innovation_innovation_overview_strategic-innovation-pillars",
          title: "strategic-innovation-pillars-new-opportunities",
          filters: [
            {
              name: "kpi",
              defaultValue: "new_opportunities",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
