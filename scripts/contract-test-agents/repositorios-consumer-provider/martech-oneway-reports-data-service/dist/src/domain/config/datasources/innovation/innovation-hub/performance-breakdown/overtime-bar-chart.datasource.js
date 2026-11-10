"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_SP_NAME = exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const overtime_bar_chart_handler_1 = require("../../../../../handlers/innovation/innovation-hub/performance-breakdown/overtime-bar-chart.handler");
exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_DATASET_ID = "overtime-bar-chart";
exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_SP_NAME = "4_innovation_innovation-performance_performance-&-breakdown_overtime-performance-bar-chart";
const filters = [
    { name: "kpi", required: true },
    { name: "country", required: true },
    { name: "dt_end", required: true },
];
const config = {
    version: "1.0.0",
    datasets: [
        {
            id: exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_BAR_CHART_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: overtime_bar_chart_handler_1.overtimeBarChartHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=overtime-bar-chart.datasource.js.map