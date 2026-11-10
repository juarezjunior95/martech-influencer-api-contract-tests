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
    //Big Numbers Datasources
    {
      id: "big-numbers",
      formatter: "innovation/innovation/overview/big-numbers",
      datasources: [
        {
          name: "innovation_innovation_overview_big-numbers",
        },
      ],
    },
    // Performance Datasources
    {
      id: "performance-volume",
      formatter: "innovation/innovation/performance-breakdown/performance",
      datasources: [
        {
          name: "innovation_innovation_performance-breakdown_yoy-growth",
          filters: [
            {
              name: "kpi",
              defaultValue: "volume",
            },
          ],
        },
        {
          name: "innovation_innovation_performance-breakdown_yoy-growth-contribution",
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
      id: "performance-nr",
      formatter: "innovation/innovation/performance-breakdown/performance",
      datasources: [
        {
          name: "innovation_innovation_performance-breakdown_yoy-growth",
          filters: [
            {
              name: "kpi",
              defaultValue: "nr",
            },
          ],
        },
        {
          name: "innovation_innovation_performance-breakdown_yoy-growth-contribution",
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
      id: "performance-maco",
      formatter: "innovation/innovation/performance-breakdown/performance",
      datasources: [
        {
          name: "innovation_innovation_performance-breakdown_yoy-growth",
          filters: [
            {
              name: "kpi",
              defaultValue: "maco",
            },
          ],
        },
        {
          name: "innovation_innovation_performance-breakdown_yoy-growth-contribution",
          filters: [
            {
              name: "kpi",
              defaultValue: "maco",
            },
          ],
        },
      ],
    },

    // Breakdown Datasources
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
            {
              name: "filter",
              defaultValue: "all",
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
            {
              name: "filter",
              defaultValue: "all",
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
            {
              name: "filter",
              defaultValue: "all",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
