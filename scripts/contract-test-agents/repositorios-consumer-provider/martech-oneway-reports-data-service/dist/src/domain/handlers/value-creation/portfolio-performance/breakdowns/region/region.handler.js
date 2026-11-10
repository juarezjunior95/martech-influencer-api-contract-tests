"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionHandler = void 0;
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const month_utils_1 = require("../../../../../../common/utils/month.utils");
const handler_base_1 = require("../../../../handler.base");
class RegionHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const type = this.getValue(item, "type", "TYPE");
            const typeOrder = this.getValue(item, "type_order", "TYPE_ORDER");
            const region = this.getValue(item, "region", "REGION");
            const countryName = this.getValue(item, "country_name", "COUNTRY_NAME");
            const dtEnd = this.getValue(item, "dt_end", "DT_END");
            const acVsLy = this.getValue(item, "ac_vs_ly", "AC_VS_LY");
            const delta = this.getValue(item, "delta", "DELTA", "og_vs_ly");
            return {
                type,
                type_order: typeOrder,
                period_type: this.getValue(item, "period_type", "PERIOD_TYPE"),
                dt_ini: this.getValue(item, "dt_ini", "DT_INI"),
                dt_end: dtEnd,
                region,
                country: region,
                country_name: countryName,
                kpi_name: type === "VOLUME ONLY" ? "volume" : type,
                ac: this.getValue(item, "ac", "AC"),
                ly: this.getValue(item, "ly", "LY"),
                ac_vs_ly: acVsLy,
                comp_ac_vs_ly_direction: this.getDirection(item, acVsLy, "variationDirectionVsLy"),
                og_vs_ly: delta,
                value: delta,
                comp_og_vs_ly_direction: this.getDirection(item, delta, "variationDirectionDelta"),
                kpi_ac_per_hl: this.getValue(item, "kpi_ac_per_hl", "KPI_AC_PER_HL"),
                kpi_og_ly_per_hl: this.getValue(item, "kpi_og_ly_per_hl", "KPI_OG_LY_PER_HL"),
                weight: this.getValue(item, "weight", "WEIGHT"),
                index: this.getValue(item, "index_value", "INDEX_VALUE", "index", "INDEX"),
                rank: this.getValue(item, "rnk", "RNK", "rank", "RANK"),
                current_month_label: this.getValue(item, "refreshMonthLabel") ??
                    this.formatMonthLabel(dtEnd),
                ly_month_label: this.getValue(item, "lyMonthLabel") ??
                    this.formatMonthLabel(dtEnd, true),
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
    getDirection(item, value, computedKey) {
        const computedDirection = this.getValue(item, computedKey);
        if (computedDirection !== null) {
            return computedDirection;
        }
        return (0, direction_utils_1.formatDirection)(Number(value));
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
exports.regionHandler = new RegionHandler();
//# sourceMappingURL=region.handler.js.map