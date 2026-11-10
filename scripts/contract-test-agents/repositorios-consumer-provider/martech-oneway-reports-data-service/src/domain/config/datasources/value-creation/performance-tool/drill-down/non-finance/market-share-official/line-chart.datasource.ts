import {
  buildFilterNames,
  buildRequiredFilters,
} from "@domain/config/common/filter-config.helpers";

import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  PERFORMANCE_TOOL_BASE_FILTER_NAMES,
  PERFORMANCE_TOOL_MARKET_SHARE_EXTRA_FILTER_NAMES,
  PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_DATASET_ID,
  PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_SP_NAME,
} from "@domain/config/presets/performance-tool/performance-tool.types";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";

const filters = buildRequiredFilters(
  buildFilterNames(
    PERFORMANCE_TOOL_BASE_FILTER_NAMES,
    PERFORMANCE_TOOL_MARKET_SHARE_EXTRA_FILTER_NAMES,
  ),
);

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
