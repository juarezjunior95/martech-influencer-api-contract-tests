import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

export const POS_EXPORT_SLIDE03_ALCOHOL_BAR_CHART_DATASET_ID =
  "slide03-alcohol-bar-chart" as const;

export const POS_EXPORT_BAR_CHART_SP_NAME =
  "1_category_pos-results-export_bar-chart" as const;

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
 * Companion of `slide03-alcohol-bar-line`: the line comes from the quarterly
 * series, the bars from this procedure, which closes each fiscal year and adds
 * the year-to-date bar. `category` is fixed per slide and therefore static.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE03_ALCOHOL_BAR_CHART_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_BAR_CHART_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: { category: "Alcohol" },
      }),
    },
  ],
  filters,
};

export default config;
