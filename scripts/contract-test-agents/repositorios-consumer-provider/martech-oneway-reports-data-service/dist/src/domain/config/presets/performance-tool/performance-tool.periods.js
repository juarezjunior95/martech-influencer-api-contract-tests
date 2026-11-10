"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRefreshDateUtc = parseRefreshDateUtc;
exports.buildTimePeriodConfig = buildTimePeriodConfig;
exports.getMonthlyTimeframes = getMonthlyTimeframes;
exports.getQuarterlyTimeframes = getQuarterlyTimeframes;
exports.buildPeriodOptionsForKpi = buildPeriodOptionsForKpi;
const performance_tool_constants_1 = require("./performance-tool.constants");
const TIME_PERIOD_OPTIONS = [
    { value: "YTD", label: "Year to Date" },
    { value: "HALF", label: "Half" },
    { value: "QTR", label: "Quarter" },
    { value: "R3M", label: "Rolling 3 Months" },
    { value: "MTH", label: "Month" },
    { value: "FY", label: "Full Year" },
];
function parseRefreshDateUtc(refresh) {
    const ddMmYyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(refresh);
    if (ddMmYyyy) {
        const day = Number(ddMmYyyy[1]);
        const month = Number(ddMmYyyy[2]);
        const year = Number(ddMmYyyy[3]);
        const utcMs = Date.UTC(year, month - 1, day);
        const cal = new Date(utcMs);
        if (cal.getUTCFullYear() !== year ||
            cal.getUTCMonth() !== month - 1 ||
            cal.getUTCDate() !== day) {
            return null;
        }
        return cal;
    }
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(refresh);
    if (iso) {
        const year = Number(iso[1]);
        const month = Number(iso[2]);
        const day = Number(iso[3]);
        const utcMs = Date.UTC(year, month - 1, day);
        return new Date(utcMs);
    }
    return null;
}
function buildTimePeriodConfig(refresh) {
    if (!refresh)
        return null;
    const parsed = parseRefreshDateUtc(refresh);
    if (!parsed)
        return null;
    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
    const maxDtEnd = `${year}-${month}-01`;
    const values = TIME_PERIOD_OPTIONS.map((option) => ({ ...option }));
    return {
        values,
        default: { ...values[0] },
        max_dt_end: maxDtEnd,
        default_dt_end: maxDtEnd,
    };
}
function getMonthlyTimeframes(dateEnd) {
    const months = [
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
    const formattedDateEnd = `${months[dateEnd.getUTCMonth()]}'${String(dateEnd.getUTCFullYear()).slice(2)}`;
    return [
        {
            value: "YTD",
            label: `YTD ${formattedDateEnd}`,
            full: "Year To Date (YTD)",
        },
        {
            value: "L3M",
            label: `L3M ${formattedDateEnd}`,
            full: "Last 3 Months (L3M)",
        },
        {
            value: "MTD",
            label: formattedDateEnd,
            full: "Month To Date (MTD)",
        },
    ];
}
function getQuarterlyTimeframes(dateEnd) {
    const month = dateEnd.getUTCMonth() + 1;
    let quarter;
    if (month >= 1 && month <= 3)
        quarter = 1;
    else if (month >= 4 && month <= 6)
        quarter = 2;
    else if (month >= 7 && month <= 9)
        quarter = 3;
    else
        quarter = 4;
    const yy = String(dateEnd.getUTCFullYear()).slice(2);
    const formattedDateEnd = `Q${quarter}'${yy}`;
    return [
        {
            value: "YTD",
            label: `YTD ${formattedDateEnd}`,
            full: "Year To Date (YTD)",
        },
        {
            value: "QTD",
            label: `LQ ${formattedDateEnd}`,
            full: "Last Quarter (LQ)",
        },
    ];
}
function buildPeriodOptionsForKpi(kpi, kpiGroup, periodTypes, kpiRefreshDates) {
    const group = kpiGroup ?? kpi;
    const refreshRaw = kpiRefreshDates[group] ?? new Date().toISOString().slice(0, 10);
    const parsed = parseRefreshDateUtc(refreshRaw);
    const dateEnd = parsed ?? new Date(refreshRaw);
    const types = periodTypes ?? ["monthly"];
    const isQuarterly = types.includes(performance_tool_constants_1.QUARTERLY);
    const options = isQuarterly
        ? getQuarterlyTimeframes(dateEnd)
        : getMonthlyTimeframes(dateEnd);
    return {
        values: options,
        default: options.length ? options[0] : null,
    };
}
//# sourceMappingURL=performance-tool.periods.js.map