import { DatasourceConfig } from "@domain/entities/datasource.entity";
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
    name: "dt_end",
    required: true,
  },
  {
    name: "kpi",
    defaultValue: "pack_price",
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "target-audiences",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "3_portfolio_brand_home_target-audiences",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
