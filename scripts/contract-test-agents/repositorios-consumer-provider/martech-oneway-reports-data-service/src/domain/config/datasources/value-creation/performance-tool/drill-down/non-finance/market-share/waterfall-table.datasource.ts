import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  buildFilterNames,
  buildRequiredFilters,
} from "@domain/config/common/filter-config.helpers";
import {
  PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_DATASET_ID,
  PERFORMANCE_TOOL_MARKET_SHARE_BIG_NUMBERS_FILTER_NAMES,
  PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES,
  PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_SP_NAME,
} from "@domain/config/presets/performance-tool/performance-tool.types";
import { marketShareWaterfallTableHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall-table.handler";

const filters = buildRequiredFilters(
  buildFilterNames(
    PERFORMANCE_TOOL_MARKET_SHARE_BIG_NUMBERS_FILTER_NAMES,
    PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES,
  ),
);

const config: DatasourceConfig = {
  version: "1.0.0",
  entityClass: KpiEntity,
  entityClassAfterHandler: true,
  handler: marketShareWaterfallTableHandler,
  datasets: [
    {
      id: PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_DATASET_ID,
      config: createDeltalakeProcedureFetchDataConfig({
        functionName: PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_SP_NAME,
        parameters: filters.map((filter) => filter.name),
      }),
    },
  ],
  filters,
};

export default config;
