import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  {
    name: "country",
  },
  {
    name: "dt_end",
  },
  {
    name: "viewtype",
  },
  {
    name: "period",
  },
  {
    name: "growth_lever",
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "strategy-drivers-pos",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "7_value_creation_home_growth-levers_strategy-drivers",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
