import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

export const INNOVATION_HOME_OVERTIME_PERFORMANCE_DATASET_ID =
  "overtime-performance" as const;

export const INNOVATION_HOME_OVERTIME_PERFORMANCE_SP_NAME =
  "4_innovation_home_overtime-performance" as const;

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
];

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: INNOVATION_HOME_OVERTIME_PERFORMANCE_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: INNOVATION_HOME_OVERTIME_PERFORMANCE_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
