import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import {
  buildFilterNames,
  buildRequiredFilters,
} from "@domain/config/common/filter-config.helpers";
import {
  PERFORMANCE_TOOL_FINANCE_FILTER_NAMES,
  PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID,
  PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME,
  PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES,
} from "@domain/config/presets/performance-tool/performance-tool.types";
import { waterfallHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/finance/net-revenue/waterfall.handler";

const filters = buildRequiredFilters(
  buildFilterNames(
    PERFORMANCE_TOOL_FINANCE_FILTER_NAMES,
    PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES,
  ),
);

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  datasets: [
    {
      id: PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  handler: waterfallHandler,
  filters,
};

export default config;
