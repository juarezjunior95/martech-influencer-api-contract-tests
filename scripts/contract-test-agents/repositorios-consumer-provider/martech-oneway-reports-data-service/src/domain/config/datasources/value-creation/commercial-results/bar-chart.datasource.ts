import {
  buildFilterNames,
  buildRequiredFilters,
} from "@domain/config/common/filter-config.helpers";
import {
  COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
  COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID,
  COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME,
} from "@domain/config/presets/commercial-results/commercial-results.types";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createCommercialResultsProcedureFetchDataConfig } from "./commercial-results.datasource-config";

const filters = buildRequiredFilters(
  buildFilterNames(COMMERCIAL_RESULTS_COMMON_FILTER_NAMES),
);

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID,
      config: createCommercialResultsProcedureFetchDataConfig({
        functionName: COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME,
        filterNames: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
