"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasInvalidOvertimeKpiRows = exports.variationDirection = exports.normalizeKpiName = exports.normalizeMonth = exports.toNumber = exports.pickField = exports.VALID_OVERTIME_KPIS = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
exports.VALID_OVERTIME_KPIS = new Set([
    "volume",
    "nr",
    "maco",
    "maco_margin",
]);
const OVERTIME_KPI_ALIASES = {
    volume: "volume",
    nr: "nr",
    "net revenue": "nr",
    maco: "maco",
    maco_margin: "maco_margin",
    "maco margin": "maco_margin",
};
const MONTH_NAME_TO_NUMBER = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
};
const pickField = (item, ...keys) => {
    for (const key of keys) {
        if (item[key] !== undefined && item[key] !== null) {
            return item[key];
        }
        const upperKey = key.toUpperCase();
        if (item[upperKey] !== undefined && item[upperKey] !== null) {
            return item[upperKey];
        }
    }
    return undefined;
};
exports.pickField = pickField;
const toNumber = (value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? undefined : numericValue;
};
exports.toNumber = toNumber;
const normalizeMonth = (value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const numericValue = Number(value);
    if (!Number.isNaN(numericValue) && numericValue >= 1 && numericValue <= 12) {
        return Math.floor(numericValue);
    }
    const monthKey = String(value).trim().toLowerCase().slice(0, 3);
    return MONTH_NAME_TO_NUMBER[monthKey];
};
exports.normalizeMonth = normalizeMonth;
const normalizeKpiName = (value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const normalized = String(value)
        .trim()
        .toLowerCase()
        .replace(/^innovation_/, "")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ");
    return OVERTIME_KPI_ALIASES[normalized];
};
exports.normalizeKpiName = normalizeKpiName;
const variationDirection = (value) => {
    if (value === undefined) {
        return undefined;
    }
    return (0, direction_utils_1.formatDirection)(value);
};
exports.variationDirection = variationDirection;
const hasInvalidOvertimeKpiRows = (rows) => {
    return rows.some((row) => {
        const rawKpiName = (0, exports.pickField)(row, "kpi_name", "KPI_NAME");
        if (rawKpiName === undefined || rawKpiName === null || rawKpiName === "") {
            return false;
        }
        return (0, exports.normalizeKpiName)(rawKpiName) === undefined;
    });
};
exports.hasInvalidOvertimeKpiRows = hasInvalidOvertimeKpiRows;
//# sourceMappingURL=overtime-performance.utils.js.map