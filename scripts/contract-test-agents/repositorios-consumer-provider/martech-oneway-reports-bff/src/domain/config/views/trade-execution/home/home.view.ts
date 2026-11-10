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
        name: "country",
      },
      {
        name: "viewtype",
      },
    ],
  },
  components: [
    {
      id: "total-distribution",
      formatter: "trade-execution/home/home",
      datasources: [
        {
          name: "trade-execution_home_home",
          filters: [
            {
              name: "pageview",
              defaultValue: "distribution",
            },
            {
              name: "scope",
              defaultValue: "All",
            },
          ],
        },
      ],
    },
    {
      id: "total-megabrands-distribution",
      formatter: "trade-execution/home/home",
      datasources: [
        {
          name: "trade-execution_home_home",
          filters: [
            {
              name: "pageview",
              defaultValue: "distribution",
            },
            {
              name: "scope",
              defaultValue: "megabrand",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
