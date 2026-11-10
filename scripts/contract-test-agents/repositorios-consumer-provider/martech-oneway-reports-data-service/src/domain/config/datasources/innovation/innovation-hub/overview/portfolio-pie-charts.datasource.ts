import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { portfolioPieChartsHandler } from "@domain/handlers/innovation/innovation-hub/overview/portfolio-pie-charts.handler";

export const INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_DATASET_ID =
  "portfolio-pie-charts" as const;

export const INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_SP_NAME =
  "4_innovation_innovation-performance_overview_donut-chart" as const;

const filters = [
  { name: "viewtype", required: true },
  { name: "zone", required: true },
  { name: "country", required: true },
  { name: "dt_end", required: true },
  { name: "period_type", required: true },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_SP_NAME,
        parameters: filters.map((f) => f.name),
        staticParams: { viewtype: "all" },
      }),
    },
  ],
  handler: portfolioPieChartsHandler,
  filters,
};

export default config;
