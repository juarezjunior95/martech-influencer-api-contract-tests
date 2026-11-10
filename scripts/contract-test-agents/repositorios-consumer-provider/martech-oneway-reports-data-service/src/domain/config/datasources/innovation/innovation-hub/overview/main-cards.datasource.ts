import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { mainCardsHandler } from "@domain/handlers/innovation/innovation-hub/overview/main-cards.handler";

export const INNOVATION_HUB_OVERVIEW_MAIN_CARDS_DATASET_ID =
  "main-cards" as const;

export const INNOVATION_HUB_OVERVIEW_MAIN_CARDS_SP_NAME =
  "4_innovation_innovation-performance_overview_global-total-innovation-performance" as const;

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
      id: INNOVATION_HUB_OVERVIEW_MAIN_CARDS_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: INNOVATION_HUB_OVERVIEW_MAIN_CARDS_SP_NAME,
        parameters: filters.map((f) => f.name),
      }),
    },
  ],
  handler: mainCardsHandler,
  filters,
};

export default config;
