"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioPerformanceHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const month_utils_1 = require("../../../../../common/utils/month.utils");
const period_utils_1 = require("../../../../../common/utils/period.utils");
const handler_base_1 = require("../../../handler.base");
const METRIC_FIELDS = [
    "volume_growth_contr",
    "volume_weight",
    "volume_ac_vs_ly",
    "nr_ac_vs_ly",
    "cores_ac_vs_ly",
    "brand_power_pp",
    "sm_of_maco_ac",
    "sm_weight",
    "volume_ac",
    "sm_of_maco_ac_vs_ly",
    "market_share",
];
function getField(item, key) {
    const lowercaseKey = key.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(item, key)) {
        return item[key];
    }
    return item[lowercaseKey];
}
function getDirection(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
        return "";
    }
    return (0, direction_utils_1.formatDirection)(numericValue);
}
function getMonthRefresh(dtEnd) {
    return (0, month_utils_1.formatMonth)(dtEnd, {
        includeYear: true,
        yearFormat: "short",
    });
}
function getPeriodRefresh(dtEnd) {
    return (0, period_utils_1.formatPeriod)(dtEnd, dtEnd, {
        alwaysUseQuarter: true,
        includeYear: true,
        yearFormat: "short",
    });
}
class PortfolioPerformanceHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const dtEndVolume = getField(item, "DT_END_VOLUME");
            const dtEndOthers = getField(item, "DT_END_OTHERS");
            const dtEndPower = getField(item, "DT_END_POWER") || dtEndOthers;
            const result = {
                segment: getField(item, "SEGMENT"),
                dt_end_volume: dtEndVolume,
                dt_end_others: dtEndOthers,
                dt_end_power: dtEndPower,
                volume_period_refresh: getPeriodRefresh(dtEndVolume),
                volume_month_refresh: getMonthRefresh(dtEndVolume),
                others_period_refresh: getPeriodRefresh(dtEndOthers),
                others_month_refresh: getMonthRefresh(dtEndOthers),
                power_period_refresh: getPeriodRefresh(dtEndPower),
            };
            METRIC_FIELDS.forEach((field) => {
                const fieldKey = field.toUpperCase();
                const value = getField(item, fieldKey);
                result[field] = value;
                result[`comp_${field}_direction`] = getDirection(value);
            });
            return result;
        });
    }
}
exports.portfolioPerformanceHandler = new PortfolioPerformanceHandler();
//# sourceMappingURL=portfolio-performance.handler.js.map