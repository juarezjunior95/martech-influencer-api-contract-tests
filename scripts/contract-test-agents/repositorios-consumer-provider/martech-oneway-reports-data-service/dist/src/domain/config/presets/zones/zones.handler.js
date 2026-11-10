"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zonesHandler = void 0;
const show_global_data_datasets_1 = require("../show-global-data/show-global-data.datasets");
const zones_registry_1 = require("../../../registries/zones.registry");
const zones_types_1 = require("./zones.types");
const countries_registry_1 = require("../../../registries/countries.registry");
const effective_zones_1 = require("../common/effective-zones");
const zone_country_defaults_1 = require("../common/zone-country-defaults");
const no_validation_pages_1 = require("../common/no-validation-pages");
const country_image_utils_1 = require("../../../../common/utils/images/country-image.utils");
const GLOBAL_ZONE = "ABI";
class ZonesFilterHandler {
    get name() {
        return this.constructor.name;
    }
    datasets(preset) {
        const subjects = [];
        for (const value of Object.values(preset)) {
            if ((0, zones_types_1.isZonesFilterItem)(value) && value.hideGlobalForKpi) {
                subjects.push(value.hideGlobalForKpi);
            }
        }
        return (0, show_global_data_datasets_1.collectShowGlobalDataDatasetConfigs)(subjects);
    }
    handle(preset, datasets, user) {
        const result = {};
        for (const [key, value] of Object.entries(preset)) {
            if (!(0, zones_types_1.isZonesFilterItem)(value)) {
                result[key] = value;
                continue;
            }
            const allowAllOptions = (0, no_validation_pages_1.pageAllowsAllOptions)(value.page);
            const { effective: rawEffective } = (0, effective_zones_1.computeEffectiveZones)(value.scope, user, { skipReachabilityFilter: allowAllOptions });
            const kpiBlocksGlobal = value.hideGlobalForKpi != null &&
                !(0, show_global_data_datasets_1.hasGlobalDataForSubject)(datasets, value.hideGlobalForKpi);
            const suppressGlobal = coerceBool(value.excludeGlobal) || kpiBlocksGlobal;
            const effective = applyExcludeGlobal(rawEffective, suppressGlobal);
            const availableCountryIds = resolveAvailableCountryIds(value.countryScope, user, allowAllOptions);
            const defaults = (0, zone_country_defaults_1.computeZoneCountryDefaults)(effective, user, availableCountryIds);
            const item = {
                values: this.buildValues(effective),
                default: zoneDefaultWithImageUrl(defaults.zone),
                enabled: true,
            };
            result[key] = item;
        }
        return result;
    }
    buildValues(zoneIds) {
        const records = zoneIds
            .map((id) => zones_registry_1.zonesRegistry[id])
            .filter((record) => Boolean(record));
        const global = records.filter((r) => r.id === GLOBAL_ZONE);
        const regional = records
            .filter((r) => r.id !== GLOBAL_ZONE)
            .sort((a, b) => a.title.localeCompare(b.title));
        return [...global, ...regional].map((record) => ({
            value: record.id,
            label: record.title,
            quick_filter_label: record.quick_filter_label,
            image_url: (0, country_image_utils_1.getCountryFlag)(record.id),
        }));
    }
}
function applyExcludeGlobal(effective, suppressGlobal) {
    if (!coerceBool(suppressGlobal)) {
        return effective;
    }
    return effective.filter((id) => id !== GLOBAL_ZONE);
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
function resolveAvailableCountryIds(countryScope, user, skipPolicyTrim = false) {
    const fromScope = countryScope && countryScope.length > 0
        ? countryScope.filter((id) => id !== GLOBAL_ZONE && Boolean(countries_registry_1.countriesRegistry[id]))
        : Object.keys(countries_registry_1.countriesRegistry).filter((id) => id !== GLOBAL_ZONE);
    if (skipPolicyTrim || !user) {
        return new Set(fromScope);
    }
    const policy = user.policy;
    switch (policy.mode) {
        case "unrestricted":
        case "all":
            return new Set(fromScope);
        case "deny":
            return new Set();
        case "explicit":
            return new Set(fromScope.filter((id) => policy.iso3Set.has(id)));
    }
}
function zoneDefaultWithImageUrl(zone) {
    return {
        ...zone,
        image_url: (0, country_image_utils_1.getCountryFlag)(zone.value),
    };
}
exports.zonesHandler = new ZonesFilterHandler();
//# sourceMappingURL=zones.handler.js.map