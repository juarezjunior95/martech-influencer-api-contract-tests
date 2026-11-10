import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = [
  {
    name: "viewtype",
  },
  {
    name: "country",
  },
  {
    name: "dt_end",
  },
  {
    name: "kpi",
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "yoy-growth",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "4_innovation_innovation-performance_performance-&-breakdown_yoy-growth",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
