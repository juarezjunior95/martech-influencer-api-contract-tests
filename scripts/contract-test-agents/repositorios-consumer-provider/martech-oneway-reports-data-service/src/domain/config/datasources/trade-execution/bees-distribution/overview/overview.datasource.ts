import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { beesDistributionOverviewHandler } from "@domain/handlers/trade-execution/bees-distribution/overview.handler";

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: "bar-chart",
      config: createDeltalakeFetchDataConfig({
        query: "trade-execution/bees-distribution/overview/bar-chart",
      }),
    },
    {
      id: "line-chart",
      config: createDeltalakeFetchDataConfig({
        query: "trade-execution/bees-distribution/overview/line-chart",
      }),
    },
    {
      id: "card-chart",
      config: createDeltalakeFetchDataConfig({
        query: "trade-execution/bees-distribution/overview/card-chart",
      }),
    },
  ],
  handler: beesDistributionOverviewHandler,
  filters: [
    {
      name: "country",
      required: true,
    },
    {
      name: "viewtype",
      required: true,
    },
    {
      name: "scope",
      required: true,
    },
    {
      name: "pageview",
      required: true,
    },
  ],
};

export default config;
