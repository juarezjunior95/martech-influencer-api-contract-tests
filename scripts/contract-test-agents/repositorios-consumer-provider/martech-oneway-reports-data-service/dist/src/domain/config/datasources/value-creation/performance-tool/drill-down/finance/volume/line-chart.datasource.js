"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../../entities/kpi.entity");
const filter_config_helpers_1 = require("../../../../../../common/filter-config.helpers");
const performance_tool_types_1 = require("../../../../../../presets/performance-tool/performance-tool.types");
const filters = (0, filter_config_helpers_1.buildRequiredFilters)((0, filter_config_helpers_1.buildFilterNames)(performance_tool_types_1.PERFORMANCE_TOOL_FINANCE_FILTER_NAMES));
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: performance_tool_types_1.PERFORMANCE_TOOL_VOLUME_LINE_CHART_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: performance_tool_types_1.PERFORMANCE_TOOL_VOLUME_LINE_CHART_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=line-chart.datasource.js.map