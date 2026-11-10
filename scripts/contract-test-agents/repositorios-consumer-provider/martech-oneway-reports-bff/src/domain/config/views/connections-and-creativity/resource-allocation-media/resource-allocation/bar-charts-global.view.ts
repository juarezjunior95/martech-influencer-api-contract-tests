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
        name: "kpi_name",
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
    ],
  },
  components: [
    {
      id: "bar_charts_global",
      formatter:
        "connections-and-creativity/resource-allocation-media/resource-allocation/bar-charts-global",
      datasources: [
        {
          name: "connections-and-creativity_resource-allocation-media_resource-allocation_bar-charts-global",
        },
      ],
    },
  ],
};

export default config;
