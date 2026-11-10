import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import rankingBrandsHandler from "@domain/handlers/category/pos-export/ranking-brands.handler";

export const POS_EXPORT_SLIDE20_BRANDS_GROWTH_LEVER_GLOBAL_DATASET_ID =
  "slide20-brands-growth-lever-global" as const;

export const POS_EXPORT_RANKING_GROWTH_LEVERS_SP_NAME =
  "1_category_pos-results-export_ranking-growth-levers" as const;

/**
 * The procedure always ranks the Top 12 countries, so it takes no `country`
 * argument — only the closing date.
 */
const filters = [
  {
    name: "dt_end",
    required: true,
  },
];

/**
 * Leading brand per growth lever across the Top 12 countries. The handler renames
 * `brand` and `country` so the entity, applied afterwards, can resolve the brand
 * artwork and the country flags the slide renders.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  entityClassAfterHandler: true,
  handler: rankingBrandsHandler,
  datasets: [
    {
      id: POS_EXPORT_SLIDE20_BRANDS_GROWTH_LEVER_GLOBAL_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_RANKING_GROWTH_LEVERS_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
