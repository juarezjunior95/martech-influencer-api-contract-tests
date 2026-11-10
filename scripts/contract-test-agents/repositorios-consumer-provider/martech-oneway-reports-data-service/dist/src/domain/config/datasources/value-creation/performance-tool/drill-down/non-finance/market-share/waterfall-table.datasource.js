"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../../entities/kpi.entity");
const filter_config_helpers_1 = require("../../../../../../common/filter-config.helpers");
const performance_tool_types_1 = require("../../../../../../presets/performance-tool/performance-tool.types");
const waterfall_table_handler_1 = require("../../../../../../../handlers/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall-table.handler");
const filters = (0, filter_config_helpers_1.buildRequiredFilters)((0, filter_config_helpers_1.buildFilterNames)(performance_tool_types_1.PERFORMANCE_TOOL_MARKET_SHARE_BIG_NUMBERS_FILTER_NAMES, performance_tool_types_1.PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES));
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    entityClassAfterHandler: true,
    handler: waterfall_table_handler_1.marketShareWaterfallTableHandler,
    datasets: [
        {
            id: performance_tool_types_1.PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: performance_tool_types_1.PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=waterfall-table.datasource.js.map