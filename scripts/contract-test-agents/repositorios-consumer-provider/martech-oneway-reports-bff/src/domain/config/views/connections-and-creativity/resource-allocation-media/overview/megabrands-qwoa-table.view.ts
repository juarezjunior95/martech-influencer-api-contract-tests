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
    ],
  },
  components: [
    {
      id: "megabrands",
      formatter:
        "connections-and-creativity/resource-allocation-media/overview/megabrands-qwoa-table",
      datasources: [
        {
          name: "connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa-media-qwoa-table",
        },
      ],
    },
  ],
};

export default config;
