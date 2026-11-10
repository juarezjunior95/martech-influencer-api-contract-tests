import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

export const POS_EXPORT_SLIDE10_MANUFACTURER_DATASET_ID =
  "slide10-manufacturer-bar" as const;

export const POS_EXPORT_SLIDE10_MANUFACTURER_SP_NAME =
  "1_category_pos-results-export_manufacturer" as const;

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

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE10_MANUFACTURER_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_SLIDE10_MANUFACTURER_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
