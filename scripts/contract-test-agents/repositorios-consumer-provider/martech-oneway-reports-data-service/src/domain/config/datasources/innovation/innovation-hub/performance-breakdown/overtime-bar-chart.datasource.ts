import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { overtimeBarChartHandler } from "@domain/handlers/innovation/innovation-hub/performance-breakdown/overtime-bar-chart.handler";

export const INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_DATASET_ID =
  "overtime-bar-chart" as const;

export const INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_SP_NAME =
  "4_innovation_innovation-performance_performance-&-breakdown_overtime-performance-bar-chart" as const;

const filters = [
  { name: "kpi", required: true },
  { name: "country", required: true },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: overtimeBarChartHandler,
  filters,
};

export default config;
