import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

export const POS_EXPORT_SLIDE13_BEER_BB_BRANDS_DATASET_ID =
  "slide13-beer-bb-brands-bar" as const;

export const POS_EXPORT_BRANDS_SP_NAME =
  "1_category_pos-results-export_brands" as const;

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
      id: POS_EXPORT_SLIDE13_BEER_BB_BRANDS_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_BRANDS_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: { category: "Beer + Beyond Beer" },
      }),
    },
  ],
  filters,
};

export default config;
