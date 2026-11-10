"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_config_helpers_1 = require("../../../../common/filter-config.helpers");
const commercial_results_types_1 = require("../../../../presets/commercial-results/commercial-results.types");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const commercial_results_datasource_config_1 = require("../commercial-results.datasource-config");
const filters = (0, filter_config_helpers_1.buildRequiredFilters)((0, filter_config_helpers_1.buildFilterNames)(commercial_results_types_1.COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES));
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: commercial_results_types_1.COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_DATASET_ID,
            config: (0, commercial_results_datasource_config_1.createCommercialResultsProcedureFetchDataConfig)({
                functionName: commercial_results_types_1.COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_SP_NAME,
                filterNames: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=line-chart.datasource.js.map