"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCanonicalPeriodLabel = exports.sortByBarOrder = exports.resolveEpicLabelIndex = exports.mapKpiSlug = exports.normalizeKpi = exports.toNumber = exports.pickField = exports.EPIC_CONTRIBUTION_LABELS = exports.VALID_CONTRIBUTION_KPIS = void 0;
exports.VALID_CONTRIBUTION_KPIS = new Set([
    "volume",
    "nr",
    "maco",
    "maco_margin",
]);
exports.EPIC_CONTRIBUTION_LABELS = [
    "'24 FY",
    "'25 FY",
    "Expiration",
    "Baseline",
    "Y1",
    "Y2",
    "Y3",
    "Y4",
    "Y5",
    "'26 LE",
];
const KPI_SLUG_ALIASES = {
    volume: "volume",
    nr: "nr",
    "net revenue": "nr",
    "net rev": "nr",
    "net rev.": "nr",
    maco: "maco",
    "maco margin": "maco_margin",
    maco_margin: "maco_margin",
};
const LABEL_INDEX_BY_KEY = {
    "'24 fy": 0,
    "24 fy": 0,
    "fy_year-2": 0,
    "fy year-2": 0,
    "'25 fy": 1,
    "25 fy": 1,
    "fy_year-1": 1,
    "fy year-1": 1,
    expiration: 2,
    baseline: 3,
    y1: 4,
    y2: 5,
    y3: 6,
    y4: 7,
    y5: 8,
    "'26 le": 9,
    "26 le": 9,
    le_year: 9,
    "le year": 9,
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
const normalizeKpi = (value) => {
    if (value === undefined || value === null) {
        return undefined;
    }
    return String(value).trim().toLowerCase();
};
exports.normalizeKpi = normalizeKpi;
const mapKpiSlug = (value) => {
    const normalized = (0, exports.normalizeKpi)(value);
    if (!normalized) {
        return undefined;
    }
    return KPI_SLUG_ALIASES[normalized] ?? normalized;
};
exports.mapKpiSlug = mapKpiSlug;
const normalizeLabelKey = (value) => String(value ?? "")
    .trim()
    .toLowerCase();
const resolveEpicLabelIndex = (item) => {
    for (const field of [
        "period_label",
        "PERIOD_LABEL",
        "label",
        "LABEL",
        "bar_type",
        "BAR_TYPE",
    ]) {
        const value = (0, exports.pickField)(item, field);
        if (value === undefined || value === null) {
            continue;
        }
        const key = normalizeLabelKey(value);
        if (key in LABEL_INDEX_BY_KEY) {
            return LABEL_INDEX_BY_KEY[key];
        }
    }
    const barOrder = (0, exports.toNumber)((0, exports.pickField)(item, "bar_order", "BAR_ORDER"));
    if (barOrder !== undefined &&
        barOrder >= 1 &&
        barOrder <= exports.EPIC_CONTRIBUTION_LABELS.length) {
        return barOrder - 1;
    }
    return Number.MAX_SAFE_INTEGER;
};
exports.resolveEpicLabelIndex = resolveEpicLabelIndex;
const sortByBarOrder = (rows) => [...rows].sort((left, right) => (0, exports.resolveEpicLabelIndex)(left) -
    (0, exports.resolveEpicLabelIndex)(right));
exports.sortByBarOrder = sortByBarOrder;
const toCanonicalPeriodLabel = (item, index) => {
    const labelIndex = (0, exports.resolveEpicLabelIndex)(item);
    if (labelIndex >= 0 && labelIndex < exports.EPIC_CONTRIBUTION_LABELS.length) {
        return exports.EPIC_CONTRIBUTION_LABELS[labelIndex];
    }
    if (index >= 0 && index < exports.EPIC_CONTRIBUTION_LABELS.length) {
        return exports.EPIC_CONTRIBUTION_LABELS[index];
    }
    return String((0, exports.pickField)(item, "period_label", "PERIOD_LABEL", "label", "LABEL") ?? "");
};
exports.toCanonicalPeriodLabel = toCanonicalPeriodLabel;
//# sourceMappingURL=contribution-performance.utils.js.map