"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelVsLq = labelVsLq;
exports.labelVsLy = labelVsLy;
exports.labelVsLyQuarter = labelVsLyQuarter;
exports.labelRefresh = labelRefresh;
exports.labelVsLyMonth = labelVsLyMonth;
const period_utils_1 = require("./period.utils");
const month_utils_1 = require("./month.utils");
function formatYear(year, format = "full") {
    if (format === "full") {
        return year.toString();
    }
    return year.toString().slice(-2);
}
function labelVsLq(params) {
    const { dtIni, dtEnd, yearFormat = "full" } = params;
    if (!dtIni || !dtEnd) {
        return "";
    }
    try {
        const currentDtIni = new Date(dtIni);
        const currentDtEnd = new Date(dtEnd);
        const prevPeriodDtIni = new Date(currentDtIni.getFullYear(), currentDtIni.getMonth() - 3, currentDtIni.getDate());
        const prevPeriodDtEnd = new Date(currentDtEnd.getFullYear(), currentDtEnd.getMonth() - 3, currentDtEnd.getDate());
        const prevPeriod = (0, period_utils_1.formatPeriod)(prevPeriodDtIni.toISOString(), prevPeriodDtEnd.toISOString());
        const year = prevPeriodDtEnd.getFullYear();
        const prevPeriodYear = formatYear(year, yearFormat);
        if (!prevPeriod || !prevPeriodYear) {
            return "";
        }
        return `vs ${prevPeriod}'${prevPeriodYear}`;
    }
    catch {
        return "";
    }
}
function labelVsLy(params) {
    const { dtIni, dtEnd, yearFormat = "full", periodFormatParams, suffix = "", } = params;
    if (!dtIni || !dtEnd) {
        return "";
    }
    try {
        const currentPeriod = (0, period_utils_1.formatPeriod)(dtIni, dtEnd, periodFormatParams);
        const currentDtEnd = new Date(dtEnd);
        const year = currentDtEnd.getFullYear() - 1;
        const prevYear = formatYear(year, yearFormat);
        if (!currentPeriod || !prevYear) {
            return "";
        }
        return `vs ${currentPeriod}'${prevYear}${suffix}`;
    }
    catch {
        return "";
    }
}
function labelVsLyQuarter(params) {
    const { dtEnd, yearFormat = "short", suffix = "" } = params;
    if (!dtEnd) {
        return "";
    }
    try {
        const end = new Date(dtEnd);
        if (isNaN(end.getTime())) {
            return "";
        }
        const lyEnd = new Date(end.getTime());
        lyEnd.setFullYear(lyEnd.getFullYear() - 1);
        const vsCore = (0, period_utils_1.formatPeriod)(lyEnd.toISOString(), lyEnd.toISOString(), {
            alwaysUseQuarter: true,
            includeYear: true,
            yearFormat,
        });
        if (!vsCore) {
            return "";
        }
        return `vs ${vsCore}${suffix}`;
    }
    catch {
        return "";
    }
}
function labelRefresh(params) {
    const { dtIni, dtEnd, yearFormat = "full" } = params;
    if (!dtIni || !dtEnd) {
        return "";
    }
    try {
        const currentPeriod = (0, period_utils_1.formatPeriod)(dtIni, dtEnd);
        const currentDtEnd = new Date(dtEnd);
        const year = currentDtEnd.getFullYear();
        const currentYear = formatYear(year, yearFormat);
        if (!currentPeriod || !currentYear) {
            return "";
        }
        return `${currentPeriod}'${currentYear}`;
    }
    catch {
        return "";
    }
}
function labelVsLyMonth(params) {
    const { dtEnd, yearFormat = "full", prefix = "vs ", suffix = "" } = params;
    if (!dtEnd) {
        return "";
    }
    try {
        const monthLabel = (0, month_utils_1.formatMonth)(dtEnd, {
            includeYear: true,
            usePreviousYear: true,
            yearFormat,
        });
        if (!monthLabel) {
            return "";
        }
        return `${prefix}${monthLabel}${suffix}`;
    }
    catch {
        return "";
    }
}
//# sourceMappingURL=label.utils.js.map