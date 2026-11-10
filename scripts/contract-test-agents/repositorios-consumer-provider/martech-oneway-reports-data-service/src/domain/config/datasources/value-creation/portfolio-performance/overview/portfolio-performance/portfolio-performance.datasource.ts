import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { portfolioPerformanceHandler } from "@domain/handlers/value-creation/portfolio-performance/overview/portfolio-performance.handler";

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
      id: "category-growth-levers",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_portfolio-performance_portfolio-performance",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: portfolioPerformanceHandler,
  filters,
};

export default config;
