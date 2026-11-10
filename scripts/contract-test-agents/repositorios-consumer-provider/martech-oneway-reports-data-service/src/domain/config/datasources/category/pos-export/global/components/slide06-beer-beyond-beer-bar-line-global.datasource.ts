import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_LINE_CHART_SP_NAME } from "../../country/components/slide03-alcohol-bar-line.datasource";

export const POS_EXPORT_SLIDE06_BEER_BB_BAR_LINE_GLOBAL_DATASET_ID =
  "slide06-beer-beyond-beer-bar-line-global" as const;

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
 * The procedure is shared by every bar+line slide. This Beer + Beyond Beer
 * view fixes the category as a static parameter, so request filters cannot
 * override them.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE06_BEER_BB_BAR_LINE_GLOBAL_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_LINE_CHART_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: {
          category: "Beer + Beyond Beer",
        },
      }),
    },
  ],
  filters,
};

export default config;
