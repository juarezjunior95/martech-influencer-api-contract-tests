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
      id: "portfolio",
      formatter: "value-creation/pr-pages/volume/portfolio",
      datasources: [
        {
          name: "value-creation_pr-pages_volume_portfolio",
          filters: [
            {
              name: "country",
              defaultValue: "ABI",
            },
            {
              name: "kpi",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
