"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCommercialGeoDefault = resolveCommercialGeoDefault;
const winston_context_format_1 = require("../../../../common/utils/winston-context.format");
const countries_registry_1 = require("../../../registries/countries.registry");
const resolver_1 = require("../../../registries/resolver");
const zones_registry_1 = require("../../../registries/zones.registry");
const commercial_results_constants_1 = require("./commercial-results.constants");
function orderZonesByAffinity(userZone, candidates) {
    const group = commercial_results_constants_1.ZONE_AFFINITY_GROUPS.find((zones) => zones.includes(userZone)) ?? [];
    const near = group.filter((zone) => zone !== userZone && candidates.includes(zone));
    const rest = candidates.filter((zone) => zone !== userZone && !near.includes(zone));
    return [...near, ...rest];
}
function resolveUserCountryRecord(user) {
    const claimed = user?.country ?? winston_context_format_1.requestContextStorage.getStore()?.country;
    if (!claimed)
        return undefined;
    const upper = claimed.toUpperCase();
    return countries_registry_1.countriesRegistry[upper] ?? (0, resolver_1.resolveCountryByIso2)(upper);
}
function toZoneCountryDefaults(zoneId, country) {
    const zone = zones_registry_1.zonesRegistry[zoneId];
    if (!zone)
        return null;
    return {
        zone: {
            value: zone.id,
            label: zone.title,
            quick_filter_label: zone.quick_filter_label,
        },
        country: {
            value: country.id,
            label: country.title,
            quick_filter_label: country.quick_filter_label,
        },
    };
}
function resolveCommercialGeoDefault(user, regionalEffective, availableCountryIds) {
    const record = resolveUserCountryRecord(user);
    if (!record)
        return null;
    const isAvailable = (countryId) => availableCountryIds.has(countryId) &&
        (!user || user.hasCountryAccess(countryId));
    const firstInZone = (zoneId) => (0, resolver_1.resolveCountriesByZone)(zoneId).find((candidate) => isAvailable(candidate.id));
    if (regionalEffective.includes(record.zone)) {
        if (isAvailable(record.id)) {
            return toZoneCountryDefaults(record.zone, record);
        }
        const sameZone = firstInZone(record.zone);
        if (sameZone)
            return toZoneCountryDefaults(record.zone, sameZone);
    }
    for (const zoneId of orderZonesByAffinity(record.zone, regionalEffective)) {
        const country = firstInZone(zoneId);
        if (country)
            return toZoneCountryDefaults(zoneId, country);
    }
    return null;
}
//# sourceMappingURL=commercial-results.geo-defaults.js.map