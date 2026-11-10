import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

export const POS_EXPORT_SLIDE15_PARTICIPATION_TOP12_DATASET_ID =
  "slide15-countries-participation-performance-global" as const;

export const POS_EXPORT_PARTICIPATION_TOP12_SP_NAME =
  "1_category_pos-results-export_participation-top-12" as const;

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
 * Shared by slides 15 and 16, which differ only by the delta unit. The
 * procedure always returns the 12 countries plus the ABI aggregate, so
 * `country` only satisfies the required-filter contract.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE15_PARTICIPATION_TOP12_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_PARTICIPATION_TOP12_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
