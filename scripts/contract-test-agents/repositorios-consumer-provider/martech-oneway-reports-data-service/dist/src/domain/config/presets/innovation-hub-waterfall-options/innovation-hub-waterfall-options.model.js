"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInnovationHubWaterfallOptionsByKpi = getInnovationHubWaterfallOptionsByKpi;
exports.firstInnovationHubScopeBlock = firstInnovationHubScopeBlock;
const t = (label, value) => ({
    label,
    value,
});
const block = (values, defaultTuple) => ({ values, default: defaultTuple });
const OPTIONS_INNOVATION_HUB = {
    global: block([t("Brand", "brand"), t("Country", "country")], t("Country", "country")),
    country: block([t("Brand", "brand")], t("Brand", "brand")),
    brand: block([t("SKU", "sku")], t("SKU", "sku")),
};
const KPI_VOLUME = "volume";
const KPI_NR = "nr";
const KPI_MACO = "maco";
const KPI_MACO_MARGIN = "maco_margin";
const OPTIONS_BY_KPI = {
    [KPI_VOLUME]: OPTIONS_INNOVATION_HUB,
    [KPI_NR]: OPTIONS_INNOVATION_HUB,
    [KPI_MACO]: OPTIONS_INNOVATION_HUB,
    [KPI_MACO_MARGIN]: OPTIONS_INNOVATION_HUB,
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
function getInnovationHubWaterfallOptionsByKpi(kpi) {
    const key = kpi.trim().toLowerCase();
    const table = OPTIONS_BY_KPI[key];
    if (!table) {
        return {};
    }
    return cloneScopeMap(table);
}
function firstInnovationHubScopeBlock(map) {
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
//# sourceMappingURL=innovation-hub-waterfall-options.model.js.map