"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMonth = formatMonth;
function getMonthAbbreviation(date) {
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return monthNames[date.getUTCMonth()];
}
function formatMonth(dtEnd, params) {
    if (!dtEnd) {
        return "";
    }
    try {
        const endDate = new Date(dtEnd);
        if (isNaN(endDate.getTime())) {
            return "";
        }
        const { includeYear = false, usePreviousYear = false, yearFormat = "full", } = params || {};
        const month = getMonthAbbreviation(endDate);
        if (!month) {
            return "";
        }
        let result;
        if (!includeYear) {
            result = month;
        }
        else {
            const year = usePreviousYear
                ? endDate.getUTCFullYear() - 1
                : endDate.getUTCFullYear();
            const yearLabel = formatYear(year, yearFormat);
            if (!yearLabel) {
                result = month;
            }
            else {
                result = `${month}'${yearLabel}`;
            }
        }
        return result;
    }
    catch {
        return "";
    }
}
function formatYear(year, format = "full") {
    if (format === "full") {
        return year.toString();
    }
    return year.toString().slice(-2);
}
//# sourceMappingURL=month.utils.js.map