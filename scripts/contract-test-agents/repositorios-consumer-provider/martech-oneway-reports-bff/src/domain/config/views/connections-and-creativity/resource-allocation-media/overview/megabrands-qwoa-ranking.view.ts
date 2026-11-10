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
        name: "dt_ini",
      },
      {
        name: "dt_end",
      },
      {
        name: "kpi_name",
      },
    ],
  },
  components: [
    {
      id: "megabrands_qwoa_ranking",
      formatter:
        "connections-and-creativity/resource-allocation-media/overview/megabrands-qwoa-ranking",
      datasources: [
        {
          name: "connections-and-creativity_resource-allocation-media_overview_unified-ranking",
        },
      ],
    },
  ],
};

export default config;
