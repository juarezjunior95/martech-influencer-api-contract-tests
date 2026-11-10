import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { portfolioPerformanceTableHandler } from "@domain/handlers/value-creation/portfolio-performance/overview/portfolio-performance-table.handler";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  {
    name: "viewtype",
    required: true,
  },
  {
    name: "country",
    required: true,
  },
  {
    name: "dt_ini",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
  {
    name: "zone",
    required: true,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "brands",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_portfolio-performance_brands",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: portfolioPerformanceTableHandler,
  filters,
};

export default config;
