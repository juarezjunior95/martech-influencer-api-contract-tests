"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommercialResultsWaterfallOptionsByKpi = getCommercialResultsWaterfallOptionsByKpi;
exports.firstScopeBlock = firstScopeBlock;
const t = (label, value) => ({
    label,
    value,
});
const block = (values, defaultTuple) => ({ values, default: defaultTuple });
const BASE_OPTIONS = [
    t("Region", "region"),
    t("Channel", "channel"),
    t("Brand", "brand"),
    t("Pack Type", "pack_type"),
];
const DEFAULT_OPTION = t("Region", "region");
const SCOPE_OPTIONS_BASE = {
    global: block(BASE_OPTIONS, DEFAULT_OPTION),
    brand: block([...BASE_OPTIONS, t("Sub-Brand", "sub_brand")], DEFAULT_OPTION),
    sub_brand: block([...BASE_OPTIONS, t("Sub-Brand", "sub_brand"), t("SKU", "sku")], DEFAULT_OPTION),
};
const KPI_VOLUME = "volume";
const KPI_NET_REVENUE = "nr";
const OPTIONS_BY_KPI = {
    [KPI_VOLUME]: SCOPE_OPTIONS_BASE,
    [KPI_NET_REVENUE]: SCOPE_OPTIONS_BASE,
};
function cloneScopeMap(source) {
    const out = {};
    for (const [scope, entry] of Object.entries(source)) {
        out[scope] = {
            values: entry.values.map((row) => ({ ...row })),
            default: { ...entry.default },
        };
    }
    return out;
}
function getCommercialResultsWaterfallOptionsByKpi(kpi) {
    const key = kpi.trim().toLowerCase();
    const table = OPTIONS_BY_KPI[key];
    if (!table) {
        return {};
    }
    return cloneScopeMap(table);
}
function firstScopeBlock(map) {
    const firstKey = Object.keys(map)[0];
    if (firstKey === undefined) {
        return undefined;
    }
    const entry = map[firstKey];
    if (!entry) {
        return undefined;
    }
    return {
        values: entry.values.map((row) => ({ ...row })),
        default: { ...entry.default },
    };
}
//# sourceMappingURL=commercial-results-waterfall-options.model.js.map