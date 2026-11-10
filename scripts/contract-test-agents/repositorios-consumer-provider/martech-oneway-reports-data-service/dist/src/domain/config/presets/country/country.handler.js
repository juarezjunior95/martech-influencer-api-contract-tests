"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryHandler = void 0;
const show_global_data_datasets_1 = require("../show-global-data/show-global-data.datasets");
const countries_registry_1 = require("../../../registries/countries.registry");
const country_types_1 = require("./country.types");
const effective_zones_1 = require("../common/effective-zones");
const zone_country_defaults_1 = require("../common/zone-country-defaults");
const no_validation_pages_1 = require("../common/no-validation-pages");
const country_image_utils_1 = require("../../../../common/utils/images/country-image.utils");
const GLOBAL_ZONE = "ABI";
class CountryFilterHandler {
    get name() {
        return this.constructor.name;
    }
    datasets(preset) {
        const subjects = [];
        for (const value of Object.values(preset)) {
            if ((0, country_types_1.isCountryFilterItem)(value) && value.hideGlobalForKpi) {
                subjects.push(value.hideGlobalForKpi);
            }
        }
        return (0, show_global_data_datasets_1.collectShowGlobalDataDatasetConfigs)(subjects);
    }
    handle(preset, datasets, user) {
        const result = {};
        for (const [key, value] of Object.entries(preset)) {
            if (!(0, country_types_1.isCountryFilterItem)(value)) {
                result[key] = value;
                continue;
            }
            const allowAllOptions = (0, no_validation_pages_1.pageAllowsAllOptions)(value.page);
            const { effective: rawEffective, includesGlobal: rawIncludesGlobal } = (0, effective_zones_1.computeEffectiveZones)(value.zoneScope, user, {
                skipReachabilityFilter: allowAllOptions,
            });
            const kpiBlocksGlobal = value.hideGlobalForKpi != null &&
                !(0, show_global_data_datasets_1.hasGlobalDataForSubject)(datasets, value.hideGlobalForKpi);
            const suppressGlobal = coerceBool(value.excludeGlobal) || kpiBlocksGlobal;
            const effective = suppressGlobal
                ? rawEffective.filter((id) => id !== GLOBAL_ZONE)
                : rawEffective;
            const includesGlobal = suppressGlobal ? false : rawIncludesGlobal;
            const allowedZones = new Set(effective);
            const records = this.selectCountries(value, allowedZones);
            const buckets = this.buildValuesByZone(records, allowedZones, includesGlobal);
            const trimmed = allowAllOptions
                ? buckets
                : this.applyCountryAccess(buckets, user);
            const availableCountryIds = collectCountryIds(trimmed);
            const defaults = (0, zone_country_defaults_1.computeZoneCountryDefaults)(effective, user, availableCountryIds);
            const item = {
                values: trimmed,
                default: this.buildDefault(defaults.country),
                enabled: true,
            };
            result[key] = item;
        }
        return result;
    }
    selectCountries(filter, allowedZones) {
        const all = Object.values(countries_registry_1.countriesRegistry);
        const zoneFiltered = all.filter((record) => allowedZones.has(record.zone));
        const ids = filter.scope;
        if (!ids || ids.length === 0) {
            return zoneFiltered;
        }
        const allowedIds = new Set(ids);
        return zoneFiltered.filter((record) => allowedIds.has(record.id));
    }
    buildValuesByZone(records, allowedZones, includesGlobal) {
        const sorted = [...records].sort((a, b) => a.title.localeCompare(b.title));
        const values = {};
        if (includesGlobal) {
            values[GLOBAL_ZONE] = [this.buildGlobalEntry()];
        }
        for (const record of sorted) {
            if (!allowedZones.has(record.zone)) {
                continue;
            }
            const entry = {
                value: record.id,
                label: record.title,
                zone: record.zone,
                quick_filter_label: record.quick_filter_label,
                image_url: (0, country_image_utils_1.getCountryFlag)(record.id),
            };
            if (includesGlobal) {
                values[GLOBAL_ZONE].push(entry);
            }
            const zoneBucket = values[record.zone] ?? [];
            zoneBucket.push(entry);
            values[record.zone] = zoneBucket;
        }
        return values;
    }
    buildGlobalEntry() {
        return {
            value: GLOBAL_ZONE,
            label: "All",
            zone: GLOBAL_ZONE,
            quick_filter_label: "Global",
            image_url: (0, country_image_utils_1.getCountryFlag)(GLOBAL_ZONE),
        };
    }
    applyCountryAccess(values, user) {
        if (!user ||
            user.policy.mode === "unrestricted" ||
            user.policy.mode === "all") {
            return values;
        }
        if (user.policy.mode === "deny") {
            return {};
        }
        const trimmed = {};
        for (const [zone, entries] of Object.entries(values)) {
            const filtered = entries.filter((entry) => entry.value === GLOBAL_ZONE || user.hasCountryAccess(entry.value));
            if (filtered.length > 0) {
                trimmed[zone] = filtered;
            }
        }
        return trimmed;
    }
    buildDefault(picked) {
        return {
            value: picked.value,
            label: picked.label,
            quick_filter_label: picked.quick_filter_label,
        };
    }
}
function coerceBool(value) {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }
    return false;
}
function collectCountryIds(values) {
    const ids = new Set();
    for (const entries of Object.values(values)) {
        for (const entry of entries) {
            if (entry.value !== GLOBAL_ZONE) {
                ids.add(entry.value);
            }
        }
    }
    return ids;
}
exports.countryHandler = new CountryFilterHandler();
//# sourceMappingURL=country.handler.js.map