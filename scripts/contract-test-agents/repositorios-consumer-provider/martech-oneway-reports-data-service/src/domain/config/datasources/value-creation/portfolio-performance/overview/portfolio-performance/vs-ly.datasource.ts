import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { portfolioPerformanceTableHandler } from "@domain/handlers/value-creation/portfolio-performance/overview/portfolio-performance-table.handler";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const config: DatasourceConfig = {
  datasets: [
    {
      id: "vs-ly",
      config: createDeltalakeFetchDataConfig({
        query:
          "value-creation/portfolio-performance/overview/portfolio-performance/vs-ly",
      }),
    },
  ],
  handler: portfolioPerformanceTableHandler,
  filters: [
    {
      name: "dt_ini",
      required: true,
    },
    {
      name: "dt_end",
      required: true,
    },
    {
      name: "country",
      required: true,
    },
    {
      name: "zone",
      required: true,
    },
    {
      name: "viewtype",
      required: true,
    },
  ],
};

export default config;
