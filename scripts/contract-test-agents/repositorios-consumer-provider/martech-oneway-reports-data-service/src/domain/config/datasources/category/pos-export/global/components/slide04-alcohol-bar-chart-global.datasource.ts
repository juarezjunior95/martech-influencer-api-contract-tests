import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_BAR_CHART_SP_NAME } from "../../country/components/slide03-alcohol-bar-chart.datasource";

export const POS_EXPORT_SLIDE04_ALCOHOL_BAR_CHART_GLOBAL_DATASET_ID =
  "slide04-alcohol-bar-chart-global" as const;

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
 * Bars companion of `slide04-alcohol-bar-line-global`, for `country = "ABI"`.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE04_ALCOHOL_BAR_CHART_GLOBAL_DATASET_ID,
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
