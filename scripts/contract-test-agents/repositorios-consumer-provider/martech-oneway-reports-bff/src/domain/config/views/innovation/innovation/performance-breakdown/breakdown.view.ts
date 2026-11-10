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
      {
        name: "country",
      },
      {
        name: "viewtype",
      },
      {
        name: "zone",
      },
    ],
  },
  components: [
    {
      id: "breakdown-volume",
      formatter: "innovation/innovation/performance-breakdown/breakdown",
      datasources: [
        {
          name: "innovation_innovation_performance-breakdown_breakdown",
          filters: [
            {
              name: "kpi",
              defaultValue: "volume",
            },
          ],
        },
      ],
    },
    {
      id: "breakdown-nr",
      formatter: "innovation/innovation/performance-breakdown/breakdown",
      datasources: [
        {
          name: "innovation_innovation_performance-breakdown_breakdown",
          filters: [
            {
              name: "kpi",
              defaultValue: "nr",
            },
          ],
        },
      ],
    },
    {
      id: "breakdown-maco",
      formatter: "innovation/innovation/performance-breakdown/breakdown",
      datasources: [
        {
          name: "innovation_innovation_performance-breakdown_breakdown",
          filters: [
            {
              name: "kpi",
              defaultValue: "maco",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
