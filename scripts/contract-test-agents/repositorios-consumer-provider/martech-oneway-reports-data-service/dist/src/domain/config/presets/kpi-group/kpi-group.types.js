"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPI_GROUP_NUMERIC_KEYS = exports.KPI_GROUP_DATASET_QUERY = exports.KPI_GROUP_DATASET_ID = void 0;
exports.isKpiGroupFilterItem = isKpiGroupFilterItem;
exports.KPI_GROUP_DATASET_ID = "kpi-group-time-frame";
exports.KPI_GROUP_DATASET_QUERY = "presets/kpi-group/kpi-group";
exports.KPI_GROUP_NUMERIC_KEYS = new Set([
    "category_health_full_years_start",
    "category_health_full_years_end",
]);
function isKpiGroupFilterItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.type === "kpi-group");
}
//# sourceMappingURL=kpi-group.types.js.map