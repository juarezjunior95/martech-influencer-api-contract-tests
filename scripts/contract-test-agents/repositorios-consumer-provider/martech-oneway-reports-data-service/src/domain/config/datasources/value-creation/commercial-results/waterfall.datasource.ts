import {
  buildFilterNames,
  buildRequiredFilters,
} from "@domain/config/common/filter-config.helpers";
import {
  COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
  COMMERCIAL_RESULTS_VOLUME_WATERFALL_DATASET_ID,
  COMMERCIAL_RESULTS_VOLUME_WATERFALL_SP_NAME,
  COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES,
} from "@domain/config/presets/commercial-results/commercial-results.types";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createCommercialResultsProcedureFetchDataConfig } from "./commercial-results.datasource-config";

const filters = buildRequiredFilters(
  buildFilterNames(
    COMMERCIAL_RESULTS_COMMON_FILTER_NAMES.filter((name) => name !== "zone"),
    COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES,
  ),
);

const config: DatasourceConfig = {
  datasets: [
    {
      id: COMMERCIAL_RESULTS_VOLUME_WATERFALL_DATASET_ID,
      config: createCommercialResultsProcedureFetchDataConfig({
        functionName: COMMERCIAL_RESULTS_VOLUME_WATERFALL_SP_NAME,
        filterNames: filters.map((filter) => filter.name),
      }),
    },
  ],
  entityClass: KpiEntity,
  filters,
};

export default config;
