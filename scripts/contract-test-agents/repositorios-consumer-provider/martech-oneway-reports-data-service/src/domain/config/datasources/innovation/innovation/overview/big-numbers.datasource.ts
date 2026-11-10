import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { bigNumbersHandler } from "@domain/handlers/innovation/innovation/overview/big-numbers.handler";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

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
  datasets: [
    {
      id: "big-numbers",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "4_innovation_innovation-performance_overview_big-numbers",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  handler: bigNumbersHandler,
  filters,
};

export default config;
