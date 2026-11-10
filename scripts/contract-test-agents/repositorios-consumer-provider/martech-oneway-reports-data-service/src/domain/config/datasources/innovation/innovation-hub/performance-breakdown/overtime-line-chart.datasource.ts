import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { overtimeLineChartHandler } from "@domain/handlers/innovation/innovation-hub/performance-breakdown/overtime-line-chart.handler";

export const INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_DATASET_ID =
  "overtime-line-chart" as const;

export const INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_SP_NAME =
  "4_innovation_innovation-performance_performance-&-breakdown_overtime-performance-line-chart" as const;

const filters = [
  { name: "kpi", required: true },
  { name: "country", required: true },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  datasets: [
    {
      id: INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName:
          INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: overtimeLineChartHandler,
  filters,
};

export default config;
