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
    name: "period",
  },
  {
    name: "viewtype",
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "strategy-drivers-growth-levers",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "7_value_creation_home_growth-levers",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
