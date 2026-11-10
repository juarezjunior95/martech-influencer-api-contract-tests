import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import rankingBrandsHandler from "@domain/handlers/category/pos-export/ranking-brands.handler";
import { POS_EXPORT_RANKING_CATEGORY_SP_NAME } from "./slide17-countries-top-3-beer-bb-brands-global.datasource";

export const POS_EXPORT_SLIDE18_COUNTRIES_TOP3_BEER_BRANDS_GLOBAL_DATASET_ID =
  "slide18-countries-top-3-beer-brands-global" as const;

/**
 * The procedure always ranks the Top 12 countries, so it takes no `country`
 * argument — only the category and the closing date.
 */
const filters = [
  {
    name: "dt_end",
    required: true,
  },
];

/**
 * Top three participated brands per country. `category` is fixed per slide and
 * therefore static. The handler renames `brand` and `country` so the entity,
 * applied afterwards, can resolve the brand artwork and the country flags the
 * slide renders.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  entityClassAfterHandler: true,
  handler: rankingBrandsHandler,
  datasets: [
    {
      id: POS_EXPORT_SLIDE18_COUNTRIES_TOP3_BEER_BRANDS_GLOBAL_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_RANKING_CATEGORY_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: { category: "Beer" },
      }),
    },
  ],
  filters,
};

export default config;
