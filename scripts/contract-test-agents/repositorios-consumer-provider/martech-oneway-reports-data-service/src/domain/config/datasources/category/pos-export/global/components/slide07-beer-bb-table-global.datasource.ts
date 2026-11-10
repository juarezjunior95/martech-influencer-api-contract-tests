import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME } from "../../country/components/slide07-beer-bb-table.datasource";

export const POS_EXPORT_SLIDE07_BEER_BB_TABLE_GLOBAL_DATASET_ID =
  "slide07-beer-bb-table-global" as const;

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
 * Same procedure as the country deck. The global aggregate is not a separate
 * query — it is what the procedure returns for `country = "ABI"`, so the value
 * simply arrives from the request filter.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE07_BEER_BB_TABLE_GLOBAL_DATASET_ID,
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
