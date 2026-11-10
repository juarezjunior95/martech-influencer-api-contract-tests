import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME } from "./slide07-beer-bb-table.datasource";

export const POS_EXPORT_SLIDE09_ABI_TABLE_DATASET_ID =
  "slide09-abi-table" as const;

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
 * Same procedure as slide 07; `viewtype=manufacturer` narrows it to the ABI
 * share of Beer + Beyond Beer. It is a static param on purpose: the request
 * already carries a `viewtype` filter (country/global) used by other pages,
 * and a dynamic parameter would be overwritten by it.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE09_ABI_TABLE_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME,
        parameters: filters.map((filter) => filter.name),
        staticParams: { viewtype: "manufacturer" },
      }),
    },
  ],
  filters,
};

export default config;
