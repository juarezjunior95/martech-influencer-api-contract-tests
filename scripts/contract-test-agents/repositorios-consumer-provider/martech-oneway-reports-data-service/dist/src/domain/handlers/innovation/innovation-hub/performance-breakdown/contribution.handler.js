"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contributionHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../handler.base");
const contribution_performance_utils_1 = require("./contribution-performance.utils");
class ContributionHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset?.data?.length) {
            return [];
        }
        const sortedRows = (0, contribution_performance_utils_1.sortByBarOrder)(defaultDataset.data);
        const firstKpi = (0, contribution_performance_utils_1.mapKpiSlug)((0, contribution_performance_utils_1.pickField)(sortedRows[0], "kpi", "kpi_name", "KPI_NAME"));
        if (!firstKpi || !contribution_performance_utils_1.VALID_CONTRIBUTION_KPIS.has(firstKpi)) {
            return [];
        }
        return sortedRows.map((item, index) => {
            const record = item;
            const periodLabel = (0, contribution_performance_utils_1.toCanonicalPeriodLabel)(record, index);
            const contribution = (0, contribution_performance_utils_1.toNumber)((0, contribution_performance_utils_1.pickField)(record, "contribution", "CONTRIBUTION", "contribution_pct", "CONTRIBUTION_PCT"));
            const contributionDirection = contribution !== undefined
                ? (0, direction_utils_1.formatDirection)(contribution, { positiveZero: true })
                : undefined;
            return {
                bar_order: (0, contribution_performance_utils_1.toNumber)((0, contribution_performance_utils_1.pickField)(record, "bar_order", "BAR_ORDER")),
                period_label: periodLabel,
                bar_type: (0, contribution_performance_utils_1.pickField)(record, "bar_type", "BAR_TYPE", "label", "LABEL"),
                metric_value: (0, contribution_performance_utils_1.toNumber)((0, contribution_performance_utils_1.pickField)(record, "metric_value", "METRIC_VALUE", "value", "VALUE")),
                contribution,
                contribution_direction: contributionDirection,
                kpi: (0, contribution_performance_utils_1.mapKpiSlug)((0, contribution_performance_utils_1.pickField)(record, "kpi", "kpi_name", "KPI_NAME")),
                country: (0, contribution_performance_utils_1.pickField)(record, "country", "COUNTRY", "country_iso_code_3", "COUNTRY_ISO_CODE_3"),
                dt_end: (0, contribution_performance_utils_1.pickField)(record, "dt_end", "DT_END"),
                unit_of_measure: (0, contribution_performance_utils_1.pickField)(record, "unit_of_measure", "UNIT_OF_MEASURE"),
                comp_unit_of_measure: (0, contribution_performance_utils_1.pickField)(record, "comp_unit_of_measure", "COMP_UNIT_OF_MEASURE"),
            };
        });
    }
}
exports.contributionHandler = new ContributionHandler();
//# sourceMappingURL=contribution.handler.js.map