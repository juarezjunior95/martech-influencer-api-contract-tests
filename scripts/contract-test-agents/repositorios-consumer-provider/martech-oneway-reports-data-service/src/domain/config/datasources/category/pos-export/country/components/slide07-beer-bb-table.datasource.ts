import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

export const POS_EXPORT_SLIDE07_BEER_BB_TABLE_DATASET_ID =
  "slide07-beer-bb-table" as const;

export const POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME =
  "1_category_pos-results-export_cohort" as const;

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
 * The procedure also accepts a `viewtype` argument, sent here as a static param
 * on purpose: the request already carries a `viewtype` filter (country/global)
 * used by other pages, and a dynamic parameter would be overwritten by it.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE07_BEER_BB_TABLE_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: { viewtype: "category" },
      }),
    },
  ],
  filters,
};

export default config;
