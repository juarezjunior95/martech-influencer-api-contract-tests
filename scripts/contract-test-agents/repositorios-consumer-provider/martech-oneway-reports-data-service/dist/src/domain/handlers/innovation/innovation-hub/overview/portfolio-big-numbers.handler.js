"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioBigNumbersHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../handler.base");
const normalizeGeo = (value) => {
    if (value === undefined || value === null) {
        return undefined;
    }
    const normalized = String(value);
    return normalized === "ALL" ? "ABI" : normalized;
};
const pickField = (item, ...keys) => {
    for (const key of keys) {
        if (item[key] !== undefined && item[key] !== null) {
            return item[key];
        }
    }
    return undefined;
};
const toNumber = (value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? undefined : numericValue;
};
class PortfolioBigNumbersHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset?.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const ac = toNumber(pickField(item, "value", "VALUE", "ac", "AC", "current", "CURRENT"));
            const acVsLy = toNumber(pickField(item, "vs_ly", "VS_LY", "ac_vs_ly", "AC_VS_LY"));
            const variationDirectionVsLy = pickField(item, "variationDirectionVsLy", "VARIATION_DIRECTION_VS_LY", "variation_direction_vs_ly") ?? (acVsLy !== undefined ? (0, direction_utils_1.formatDirection)(acVsLy) : undefined);
            return {
                kpi_name: pickField(item, "kpi", "KPI", "kpi_name", "KPI_NAME"),
                ac,
                ac_vs_ly: acVsLy,
                variationDirectionVsLy: variationDirectionVsLy,
                refreshMonthLabel: pickField(item, "refreshMonthLabel", "REFRESH_MONTH_LABEL", "refresh_month_label"),
                label_period: pickField(item, "label_period", "LABEL_PERIOD"),
                period_type: pickField(item, "period", "PERIOD", "period_type", "PERIOD_TYPE"),
                unit_of_measure: pickField(item, "unit_of_measure", "UNIT_OF_MEASURE"),
                comp_unit_of_measure: pickField(item, "comp_unit_of_measure", "COMP_UNIT_OF_MEASURE"),
                country: normalizeGeo(pickField(item, "country_iso_code_3", "COUNTRY_ISO_CODE_3", "country", "COUNTRY")),
                zone: normalizeGeo(pickField(item, "abi_zone", "ABI_ZONE", "zone", "ZONE")),
            };
        });
    }
}
exports.portfolioBigNumbersHandler = new PortfolioBigNumbersHandler();
//# sourceMappingURL=portfolio-big-numbers.handler.js.map