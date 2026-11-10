"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overtimeBarChartHandler = void 0;
const handler_base_1 = require("../../../handler.base");
const overtime_performance_utils_1 = require("./overtime-performance.utils");
class OvertimeBarChartHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset?.data?.length) {
            return [];
        }
        if ((0, overtime_performance_utils_1.hasInvalidOvertimeKpiRows)(defaultDataset.data)) {
            return [];
        }
        const mappedRows = defaultDataset.data
            .map((item) => this.mapRow(item))
            .filter((row) => row.bar_order !== undefined);
        if (mappedRows.length === 0) {
            return [];
        }
        return mappedRows.sort((firstRow, secondRow) => Number(firstRow.bar_order) - Number(secondRow.bar_order));
    }
    mapRow(record) {
        const metricValue = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "metric_value", "METRIC_VALUE"));
        const vsBu = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "vs_bu", "VS_BU"));
        const vsLy = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "vs_ly", "VS_LY"));
        return {
            kpi_name: (0, overtime_performance_utils_1.pickField)(record, "kpi_name", "KPI_NAME"),
            bar_order: (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "bar_order", "BAR_ORDER")),
            period_label: (0, overtime_performance_utils_1.pickField)(record, "period_label", "PERIOD_LABEL"),
            country: (0, overtime_performance_utils_1.pickField)(record, "country_iso_code_3", "COUNTRY_ISO_CODE_3", "country", "COUNTRY"),
            metric_value: metricValue,
            vs_bu: vsBu,
            vs_ly: vsLy,
            comp_unit_of_measure: (0, overtime_performance_utils_1.pickField)(record, "comp_unit_of_measure", "COMP_UNIT_OF_MEASURE"),
            variation_direction_vs_bu: (0, overtime_performance_utils_1.variationDirection)(vsBu),
            variation_direction_vs_ly: (0, overtime_performance_utils_1.variationDirection)(vsLy),
        };
    }
}
exports.overtimeBarChartHandler = new OvertimeBarChartHandler();
//# sourceMappingURL=overtime-bar-chart.handler.js.map