import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_BRANDS_SP_NAME } from "./slide13-beer-bb-brands-bar.datasource";

export const POS_EXPORT_SLIDE14_BEER_BRANDS_DATASET_ID =
  "slide14-beer-brands-bar" as const;

const filters = [
  {
    name: "country",
    required: true,
  },
  {
    name: "dt_end",
    required: true,
  },
];

/**
 * Shared by both brand slides and scoped by `category`, which is fixed per
 * slide and therefore a static param rather than a filter.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE14_BEER_BRANDS_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_BRANDS_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: { category: "Beer" },
      }),
    },
  ],
  filters,
};

export default config;
