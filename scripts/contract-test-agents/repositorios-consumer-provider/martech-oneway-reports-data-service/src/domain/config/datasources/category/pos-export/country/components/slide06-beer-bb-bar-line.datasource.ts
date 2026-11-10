import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_LINE_CHART_SP_NAME } from "./slide03-alcohol-bar-line.datasource";

export const POS_EXPORT_SLIDE06_BEER_BB_BAR_LINE_DATASET_ID =
  "slide06-beer-bb-bar-line" as const;

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
 * The procedure is shared by every bar+line slide and scoped by `category`,
 * which is fixed per slide and therefore sent as a static param rather than a
 * filter.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE06_BEER_BB_BAR_LINE_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_LINE_CHART_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: { category: "Beer + Beyond Beer" },
      }),
    },
  ],
  filters,
};

export default config;
