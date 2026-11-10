import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { breakdownHandler } from "@domain/handlers/innovation/innovation/performance-breakdown/breakdown.handler";

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
  {
    name: "filter",
  },
];

const config: DatasourceConfig = {
  datasets: [
    {
      id: "innovation-breakdown",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          "4_innovation_innovation-performance_performance-&-breakdown_breakdown",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: breakdownHandler,
  filters,
};

export default config;
