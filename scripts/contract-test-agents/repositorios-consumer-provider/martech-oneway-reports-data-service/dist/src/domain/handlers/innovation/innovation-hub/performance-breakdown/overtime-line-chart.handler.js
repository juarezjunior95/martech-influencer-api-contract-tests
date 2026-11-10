"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overtimeLineChartHandler = void 0;
const handler_base_1 = require("../../../handler.base");
const overtime_performance_utils_1 = require("./overtime-performance.utils");
class OvertimeLineChartHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset?.data?.length) {
            return [];
        }
        if ((0, overtime_performance_utils_1.hasInvalidOvertimeKpiRows)(defaultDataset.data)) {
            return [];
        }
        const mappedRows = defaultDataset.data
            .map((item) => this.mapRow(item))
            .filter((row) => row.month !== undefined);
        if (mappedRows.length === 0) {
            return [];
        }
        return mappedRows.sort((firstRow, secondRow) => Number(firstRow.month) - Number(secondRow.month));
    }
    mapRow(record) {
        const ac = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "ac", "AC"));
        const acLy = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "ac_ly", "AC_LY"));
        const bu = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "bu", "BU"));
        const le = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "le", "LE"));
        const acVsBu = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "ac_vs_bu", "AC_VS_BU"));
        const acVsLy = (0, overtime_performance_utils_1.toNumber)((0, overtime_performance_utils_1.pickField)(record, "ac_vs_ly", "AC_VS_LY"));
        return {
            kpi_name: (0, overtime_performance_utils_1.pickField)(record, "kpi_name", "KPI_NAME"),
            month: (0, overtime_performance_utils_1.normalizeMonth)((0, overtime_performance_utils_1.pickField)(record, "month", "MONTH")),
            country: (0, overtime_performance_utils_1.pickField)(record, "country_iso_code_3", "COUNTRY_ISO_CODE_3", "country", "COUNTRY"),
            ac,
            ac_ly: acLy,
            bu,
            le,
            ac_vs_bu: acVsBu,
            ac_vs_ly: acVsLy,
            comp_unit_of_measure: (0, overtime_performance_utils_1.pickField)(record, "comp_unit_of_measure", "COMP_UNIT_OF_MEASURE"),
            variation_direction_vs_bu: (0, overtime_performance_utils_1.variationDirection)(acVsBu),
            variation_direction_vs_ly: (0, overtime_performance_utils_1.variationDirection)(acVsLy),
        };
    }
}
exports.overtimeLineChartHandler = new OvertimeLineChartHandler();
//# sourceMappingURL=overtime-line-chart.handler.js.map