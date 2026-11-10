import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { portfolioBigNumbersHandler } from "@domain/handlers/innovation/innovation-hub/overview/portfolio-big-numbers.handler";

export const INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_DATASET_ID =
  "portfolio-big-numbers" as const;

export const INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_SP_NAME =
  "4_innovation_innovation-performance_overview_innovation-portfolio-big-numbers" as const;

const filters = [
  { name: "country", required: true },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_SP_NAME,
        parameters: filters.map((f) => f.name),
        staticParams: { kpi: "all" },
      }),
    },
  ],
  handler: portfolioBigNumbersHandler,
  filters,
};

export default config;
