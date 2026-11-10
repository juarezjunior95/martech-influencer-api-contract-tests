import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { deepDiveHandler } from "@domain/handlers/value-creation/portfolio-performance/pl/deep-dive.handler";
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
    name: "zone",
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
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "deep-dive",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_country-brand-and-portfolio-p&l_overview-deep-dive",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: deepDiveHandler,
  filters,
};

export default config;
