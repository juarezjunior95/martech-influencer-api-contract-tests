import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { portfolioHandler } from "@domain/handlers/value-creation/portfolio-performance/pl/portfolio.handler";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  {
    name: "country",
    required: true,
  },
  {
    name: "period",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "portfolio",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_country-brand-and-portfolio-p&l_overview-portfolio",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: portfolioHandler,
  filters,
};

export default config;
