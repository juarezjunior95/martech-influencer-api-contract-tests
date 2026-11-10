import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_SLIDE10_MANUFACTURER_SP_NAME } from "../../country/components/slide10-manufacturer-bar.datasource";

export const POS_EXPORT_SLIDE09_MANUFACTURER_BAR_FULL_GLOBAL_DATASET_ID =
  "slide09-manufacturer-bar-full-global" as const;

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
 * Same procedure as the country deck. The Top 12 aggregate is not a separate
 * query — it is what the procedure returns for `country = "ABI"`, so the value
 * simply arrives from the request filter.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE09_MANUFACTURER_BAR_FULL_GLOBAL_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_SLIDE10_MANUFACTURER_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
