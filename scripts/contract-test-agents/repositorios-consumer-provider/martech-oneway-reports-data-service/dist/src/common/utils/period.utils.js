"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPeriod = formatPeriod;
exports.appendYearIfRequested = appendYearIfRequested;
exports.areDatesInSameQuarter = areDatesInSameQuarter;
exports.normalizePeriodFilterValue = normalizePeriodFilterValue;
function formatPeriod(dateIni, dateEnd, params) {
    try {
        const startDate = new Date(dateIni);
        const endDate = new Date(dateEnd);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return "";
        }
        const { alwaysUseQuarter = false, useCumulativeQuarter = false, includeYear = false, yearFormat = "short", } = params || {};
        if (alwaysUseQuarter) {
            const base = getQuarterFromDate(endDate);
            return appendYearIfRequested(base, endDate, { includeYear, yearFormat });
        }
        if (useCumulativeQuarter) {
            const base = getCumulativeQuarterLabel(endDate);
            return appendYearIfRequested(base, endDate, { includeYear, yearFormat });
        }
        const quarter = getQuarterFromDate(endDate);
        const intervalMonths = getMonthDifference(startDate, endDate);
        const base = intervalMonths >= 3 ? "FY" : quarter;
        return appendYearIfRequested(base, endDate, { includeYear, yearFormat });
    }
    catch {
        return "";
    }
}
function getQuarterFromDate(date) {
    const month = date.getMonth() + 1;
    if (month <= 3)
        return "Q1";
    if (month <= 6)
        return "Q2";
    if (month <= 9)
        return "Q3";
    return "Q4";
}
function getQuarterFromUTCDate(date) {
    const month = date.getUTCMonth() + 1;
    if (month <= 3)
        return "Q1";
    if (month <= 6)
        return "Q2";
    if (month <= 9)
        return "Q3";
    return "Q4";
}
function getCumulativeQuarterLabel(date) {
    const quarter = getQuarterFromDate(date);
    const cumulativeMap = {
        Q1: "Q1",
        Q2: "H1",
        Q3: "YTD",
        Q4: "FY",
    };
    return cumulativeMap[quarter] || "FY";
}
function getMonthDifference(startDate, endDate) {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    return yearDiff * 12 + monthDiff;
}
function appendYearIfRequested(base, endDate, options) {
    const { includeYear = false, yearFormat = "short" } = options || {};
    return includeYear ? includeYearInResult(endDate, yearFormat, base) : base;
}
function includeYearInResult(endDate, yearFormat = "short", result) {
    const year = endDate.getFullYear();
    const yearLabel = formatYear(year, yearFormat);
    return `${result}'${yearLabel}`;
}
function formatYear(year, format = "full") {
    if (format === "full") {
        return year.toString();
    }
    return year.toString().slice(-2);
}
function areDatesInSameQuarter(date1, date2) {
    if (!date1 || !date2) {
        return false;
    }
    try {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
            return false;
        }
        if (d1.getUTCFullYear() !== d2.getUTCFullYear()) {
            return false;
        }
        const quarter1 = getQuarterFromUTCDate(d1);
        const quarter2 = getQuarterFromUTCDate(d2);
        return quarter1 === quarter2;
    }
    catch {
        return false;
    }
}
function normalizePeriodFilterValue(value) {
    const normalized = String(value).trim();
    if (normalized === "Month") {
        return "MTD";
    }
    return normalized;
}
//# sourceMappingURL=period.utils.js.map