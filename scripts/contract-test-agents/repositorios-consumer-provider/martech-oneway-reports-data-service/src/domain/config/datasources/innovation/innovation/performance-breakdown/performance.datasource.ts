import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { performanceHandler } from "@domain/handlers/innovation/innovation/performance-breakdown/performance.handler";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "innovation-performance",
      config: createDeltalakeFetchDataConfig({
        query: "innovation/innovation/performance-breakdown/performance",
      }),
    },
    {
      id: "innovation-performance-contribution",
      config: createDeltalakeFetchDataConfig({
        query:
          "innovation/innovation/performance-breakdown/performance-contribution",
      }),
    },
  ],
  handler: performanceHandler,
  filters: [
    {
      name: "dt_end",
    },
    {
      name: "country",
    },
    {
      name: "viewtype",
    },
    {
      name: "kpi",
    },
  ],
};

export default config;
