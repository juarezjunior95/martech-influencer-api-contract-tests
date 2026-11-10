import { ViewConfig } from "@domain/entities/view.entity";

const commonFilters = [
  {
    name: "dt_end",
  },
  {
    name: "page_type",
  },
];

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: commonFilters,
  },
  components: [
    {
      id: "segments-table",
      formatter: "value-creation/pr-pages/volume/segments-gb/segments-table",
      datasources: [
        {
          name: "value-creation_pr-pages_volume-beer-adj_segments-gb_table",
        },
      ],
    },
  ],
};

export default config;
