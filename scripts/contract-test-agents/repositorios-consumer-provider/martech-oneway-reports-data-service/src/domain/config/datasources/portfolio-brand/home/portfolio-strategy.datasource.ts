import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

const filters = [
  {
    name: "country",
    required: true,
  },
  {
    name: "timeperiod",
    required: false,
  },
];

const config: DatasourceConfig = {
  entityClass: KpiEntity,
  datasets: [
    {
      id: "portfolio-strategy",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "3_portfolio_brand_home_portfolio-strategy_hybrid-version",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
