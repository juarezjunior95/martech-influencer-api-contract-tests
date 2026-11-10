import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_SP_NAME } from "../../country/components/slide12-growth-levers-cards.datasource";

export const POS_EXPORT_SLIDE11_GROWTH_LEVERS_GLOBAL_DATASET_ID =
  "slide11-abi-growth-levers-cards-global" as const;

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
 * Same procedure as the country deck's slide 12. The global aggregate is what
 * it returns for `country = "ABI"`, so the value arrives from the request
 * filter — no separate global query is needed.
 */
const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: POS_EXPORT_SLIDE11_GROWTH_LEVERS_GLOBAL_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
