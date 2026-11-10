import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { contributionHandler } from "@domain/handlers/innovation/innovation-hub/performance-breakdown/contribution.handler";

export const INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_DATASET_ID =
  "contribution" as const;

export const INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_SP_NAME =
  "4_innovation_innovation-performance_performance-&-breakdown_innovation-contribution" as const;

const filters = [
  { name: "kpi", required: true },
  { name: "country", required: true },
  { name: "dt_end", required: true },
];

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: INNOVATION_HUB_PERFORMANCE_BREAKDOWN_CONTRIBUTION_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: contributionHandler,
  filters,
};

export default config;
