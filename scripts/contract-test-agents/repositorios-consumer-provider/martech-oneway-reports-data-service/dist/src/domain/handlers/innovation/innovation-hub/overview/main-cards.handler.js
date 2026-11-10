"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainCardsHandler = void 0;
const handler_base_1 = require("../../../handler.base");
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const KNOWN_COMPARATORS = new Set(["ac", "vs bu", "vs ly", "country", "zone"]);
const pickField = (item, keys) => {
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
const normalizeComparators = (value) => {
    const normalized = String(value ?? "").trim();
    const lower = normalized.toLowerCase();
    if (KNOWN_COMPARATORS.has(lower)) {
        return lower;
    }
    return normalized.toUpperCase();
};
const buildBarLabels = (dtEnd) => {
    if (!dtEnd) {
        return [];
    }
    const date = new Date(String(dtEnd));
    if (isNaN(date.getTime())) {
        return [];
    }
    const year = date.getUTCFullYear();
    const shortYear = String(year).slice(-2);
    const previousYear = String(year - 1).slice(-2);
    const twoYearsPrior = String(year - 2).slice(-2);
    return [
        `'${twoYearsPrior}`,
        `'${previousYear}`,
        `'${shortYear} BU`,
        `'${shortYear} LE`,
    ];
};
const variationDirection = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
        return undefined;
    }
    return (0, direction_utils_1.formatDirection)(numericValue);
};
class MainCardsHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset?.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const record = item;
            const dtEnd = pickField(record, ["dt_end", "DT_END"]);
            const barLabels = buildBarLabels(dtEnd);
            const last2 = pickField(record, ["last_2", "LAST_2"]);
            const last1 = pickField(record, ["last_1", "LAST_1"]);
            const periodBu = pickField(record, ["bu", "BU"]);
            const periodLe = pickField(record, ["le", "LE"]);
            const current = pickField(record, ["current", "CURRENT"]);
            return {
                kpi_name: pickField(record, ["kpi_name", "KPI_NAME"]),
                comparators: normalizeComparators(pickField(record, ["comparators", "COMPARATORS"])),
                dt_ini: pickField(record, ["dt_ini", "DT_INI"]),
                dt_end: dtEnd,
                period_type: pickField(record, [
                    "period_type",
                    "PERIOD_TYPE",
                ]),
                label_period: pickField(record, [
                    "label_period",
                    "LABEL_PERIOD",
                ]),
                unit_of_measure: pickField(record, [
                    "unit_of_measure",
                    "UNIT_OF_MEASURE",
                ]),
                last_2: last2,
                last_1: last1,
                bu: periodBu,
                le: periodLe,
                current: current,
                bar_labels: barLabels.length > 0 ? barLabels : undefined,
                variationDirectionLast2: variationDirection(last2),
                variationDirectionLast1: variationDirection(last1),
                variationDirectionBu: variationDirection(periodBu),
                variationDirectionLe: variationDirection(periodLe),
                variationDirectionCurrent: variationDirection(current),
            };
        });
    }
}
exports.mainCardsHandler = new MainCardsHandler();
//# sourceMappingURL=main-cards.handler.js.map