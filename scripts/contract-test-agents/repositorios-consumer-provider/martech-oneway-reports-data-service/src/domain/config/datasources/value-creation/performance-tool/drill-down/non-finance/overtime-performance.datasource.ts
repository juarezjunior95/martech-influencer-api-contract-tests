import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { overtimePerformanceHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/overtime-performance.handler";

const filters = [
  { name: "viewtype", required: true },
  { name: "page_filter", required: true },
  { name: "brand", required: true },
  { name: "country", required: true },
  { name: "region", required: false },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: "big-numbers-st",
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: "7_value_creation_brand-power_big-numbers",
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: overtimePerformanceHandler,
  filters,
};

export default config;
