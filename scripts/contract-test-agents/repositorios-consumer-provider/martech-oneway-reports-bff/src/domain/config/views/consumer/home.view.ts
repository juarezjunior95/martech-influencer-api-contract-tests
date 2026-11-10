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
        name: "zone",
      },
      {
        name: "dt_end",
      },
      {
        name: "timeperiod",
      },
      {
        name: "viewtype",
      },
    ],
  },
  components: [
    {
      id: "increase-participation",
      formatter: "consumer/home/increase-participation",
      datasources: [
        {
          name: "consumer_home_increase-participation",
        },
      ],
    },
    {
      id: "increase-abi-lovers",
      formatter: "consumer/home/increase-abi-lovers",
      datasources: [
        {
          name: "consumer_home_increase-abi-lovers",
        },
      ],
    },
    {
      id: "target-audiences",
      formatter: "consumer/home/target-audiences",
      datasources: [
        {
          name: "consumer_home_target-audiences",
        },
      ],
    },
  ],
};

export default config;
