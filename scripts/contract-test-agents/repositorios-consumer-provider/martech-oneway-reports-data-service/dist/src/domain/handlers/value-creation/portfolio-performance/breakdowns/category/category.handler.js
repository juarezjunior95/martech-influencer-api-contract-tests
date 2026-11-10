"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakdownsCategoryHandler = void 0;
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const month_utils_1 = require("../../../../../../common/utils/month.utils");
const handler_base_1 = require("../../../../handler.base");
class BreakdownsCategoryHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const type = this.getValue(item, "type", "TYPE");
            const typeOrder = this.getValue(item, "type_order", "TYPE_ORDER");
            const portfolio = this.getValue(item, "portfolio", "PORTFOLIO");
            const priceTier = this.getValue(item, "price_tier", "PRICE_TIER");
            const segment = priceTier ?? portfolio;
            const dtEnd = this.getValue(item, "dt_end", "DT_END");
            const acVsLy = this.getValue(item, "ac_vs_ly", "AC_VS_LY");
            const delta = this.getValue(item, "delta", "DELTA", "og_vs_ly");
            return {
                type,
                type_order: typeOrder,
                period_type: this.getValue(item, "period_type", "PERIOD_TYPE"),
                dt_ini: this.getValue(item, "dt_ini", "DT_INI"),
                dt_end: dtEnd,
                segment,
                portfolio,
                price_tier: priceTier,
                other_column: this.getValue(item, "other_column", "OTHER_COLUMN"),
                kpi_name: type === "VOLUME ONLY" ? "volume" : type,
                ac: this.getValue(item, "ac", "AC"),
                ly: this.getValue(item, "ly", "LY"),
                ac_vs_ly: acVsLy,
                comp_ac_vs_ly_direction: (0, direction_utils_1.formatDirection)(Number(acVsLy)),
                og_vs_ly: delta,
                value: delta,
                comp_og_vs_ly_direction: (0, direction_utils_1.formatDirection)(Number(delta)),
                kpi_ac_per_hl: this.getValue(item, "kpi_ac_per_hl", "KPI_AC_PER_HL"),
                kpi_og_ly_per_hl: this.getValue(item, "kpi_og_ly_per_hl", "KPI_OG_LY_PER_HL"),
                weight: this.getValue(item, "weight", "WEIGHT"),
                index: this.getValue(item, "index_value", "INDEX_VALUE", "index", "INDEX"),
                rank: this.getValue(item, "rnk", "RNK", "rank", "RANK"),
                current_month_label: this.formatMonthLabel(dtEnd),
                ly_month_label: this.formatMonthLabel(dtEnd, true),
            };
        });
    }
    getValue(item, ...keys) {
        for (const key of keys) {
            if (item[key] !== undefined) {
                return item[key];
            }
        }
        return null;
    }
    formatMonthLabel(value, usePreviousYear = false) {
        if (!value) {
            return null;
        }
        return (0, month_utils_1.formatMonth)(String(value), {
            includeYear: true,
            yearFormat: "short",
            usePreviousYear,
        });
    }
}
exports.breakdownsCategoryHandler = new BreakdownsCategoryHandler();
//# sourceMappingURL=category.handler.js.map