"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetEntity = void 0;
exports.ensureDataset = ensureDataset;
exports.mergeHandlerFilters = mergeHandlerFilters;
exports.trimByCountryAccess = trimByCountryAccess;
const common_1 = require("@nestjs/common");
const base_config_entity_1 = require("./common/base-config.entity");
const resolver_1 = require("../registries/resolver");
const overridesLogger = new common_1.Logger("PresetEntity.applyOverrides");
function isCountryFilterItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        Array.isArray(value.countries) &&
        typeof value.source !== "string");
}
function isPresetItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.label === "string" &&
        Array.isArray(value.options));
}
function ensureDataset(config, datasetConfig) {
    const list = config.datasets ?? [];
    if (datasetConfig.id && list.some((d) => d.id === datasetConfig.id)) {
        return;
    }
    config.datasets = [...list, datasetConfig];
}
function mergeHandlerFilters(requestFilters, handlerFilters) {
    if (handlerFilters.length === 0) {
        return requestFilters;
    }
    const provided = new Set(requestFilters.map((f) => f.name));
    const additions = handlerFilters.filter((f) => !provided.has(f.name));
    return additions.length === 0
        ? requestFilters
        : [...requestFilters, ...additions];
}
function trimByCountryAccess(map, user, options = {}) {
    if (user.policy.mode === "unrestricted" || user.policy.mode === "all") {
        return map;
    }
    if (user.policy.mode === "deny") {
        return {};
    }
    const keep = new Set(options.keepKeys ?? []);
    const out = {};
    for (const [key, value] of Object.entries(map)) {
        if (keep.has(key) || user.hasCountryAccess(key)) {
            out[key] = value;
        }
    }
    return out;
}
function snakeToCamel(name) {
    return name.replace(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}
function coerceQueryValue(value) {
    if (typeof value !== "string") {
        return value;
    }
    if (value.includes(",")) {
        return value
            .split(",")
            .map((part) => part.trim())
            .filter((part) => part.length > 0);
    }
    const lower = value.toLowerCase();
    if (lower === "true")
        return true;
    if (lower === "false")
        return false;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) {
        const n = Number(value);
        if (String(n) === value) {
            return n;
        }
    }
    return value;
}
function buildOverridesByNamespace(filters) {
    const out = new Map();
    for (const filter of filters) {
        const namespace = filter.namespace ?? "filter";
        if (namespace === "filter") {
            continue;
        }
        const camelName = snakeToCamel(filter.name);
        const value = coerceQueryValue(filter.value);
        let group = out.get(namespace);
        if (!group) {
            group = {};
            out.set(namespace, group);
        }
        group[camelName] = value;
    }
    return out;
}
function applyOverrides(preset, filters) {
    const overrides = buildOverridesByNamespace(filters);
    if (overrides.size === 0) {
        return preset;
    }
    const merged = { ...preset };
    for (const [namespace, overrideValues] of overrides) {
        const existing = merged[namespace];
        if (existing === undefined || existing === null) {
            overridesLogger.warn(`Override for unknown preset key '${namespace}' was ignored`);
            continue;
        }
        if (typeof existing !== "object" || Array.isArray(existing)) {
            overridesLogger.warn(`Override for non-object preset key '${namespace}' was ignored`);
            continue;
        }
        merged[namespace] = {
            ...existing,
            ...overrideValues,
        };
    }
    return merged;
}
function expandCountryItems(preset) {
    const expanded = {};
    const countryKeys = new Set();
    for (const [key, value] of Object.entries(preset)) {
        if (isCountryFilterItem(value)) {
            countryKeys.add(key);
            expanded[key] = {
                label: value.label,
                ...(value.shortLabel ? { shortLabel: value.shortLabel } : {}),
                ...(value.defaultValue ? { defaultValue: value.defaultValue } : {}),
                options: (0, resolver_1.resolveCountries)(value.countries).map((country) => ({
                    value: country.id,
                    label: country.title,
                    icon: country.flag_icon,
                    group: country.zone,
                    metadata: { match_names: country.match_names },
                })),
            };
            continue;
        }
        expanded[key] = value;
    }
    return { expanded, countryKeys };
}
function applyCountryPermissions(response, countryKeys, user) {
    if (!user || user.policy.mode === "unrestricted") {
        return response;
    }
    const filtered = { ...response };
    for (const key of countryKeys) {
        const item = filtered[key];
        if (!isPresetItem(item) || !item.options) {
            continue;
        }
        filtered[key] = {
            ...item,
            options: item.options.filter((option) => user.hasCountryAccess(option.value)),
        };
    }
    return filtered;
}
class PresetEntity extends base_config_entity_1.BaseConfigEntity {
    constructor(datasetRepositoryFactory, presetConfig, name) {
        super(datasetRepositoryFactory, presetConfig, name);
    }
    async fetch(filters, user) {
        const rawPreset = this.config?.preset ?? {};
        const overridden = applyOverrides(rawPreset, filters);
        const { expanded, countryKeys } = expandCountryItems(overridden);
        const handler = this.config?.handler;
        if (handler?.datasets) {
            for (const ds of handler.datasets(expanded)) {
                ensureDataset(this.config, ds);
            }
        }
        const effectiveFilters = handler?.filters
            ? mergeHandlerFilters(filters, handler.filters(expanded))
            : filters;
        const datasets = await this.loadDatasets(effectiveFilters);
        const handled = handler?.handle
            ? (handler.handle(expanded, datasets, user) ?? {})
            : expanded;
        return applyCountryPermissions(handled, countryKeys, user);
    }
}
exports.PresetEntity = PresetEntity;
//# sourceMappingURL=preset.entity.js.map