"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeZoneCountryDefaults = computeZoneCountryDefaults;
const countries_registry_1 = require("../../../registries/countries.registry");
const zones_registry_1 = require("../../../registries/zones.registry");
const GLOBAL_ZONE = "ABI";
const ABI_DEFAULT = {
    zone: {
        value: GLOBAL_ZONE,
        label: "Global",
        quick_filter_label: "Global",
    },
    country: {
        value: GLOBAL_ZONE,
        label: "Global",
        quick_filter_label: "Global",
    },
};
function computeZoneCountryDefaults(effective, user, availableCountryIds) {
    if (effective.includes(GLOBAL_ZONE)) {
        return ABI_DEFAULT;
    }
    const isAvailable = (countryId) => {
        if (availableCountryIds && !availableCountryIds.has(countryId)) {
            return false;
        }
        return !user || user.hasCountryAccess(countryId);
    };
    const regional = effective.filter((id) => id !== GLOBAL_ZONE);
    if (regional.length === 0) {
        return ABI_DEFAULT;
    }
    const orderedZones = orderByRegistry(regional, zones_registry_1.zonesRegistry);
    const userCountryId = user?.country ? normalizeCountryId(user.country) : null;
    const userCountryRecord = userCountryId
        ? countries_registry_1.countriesRegistry[userCountryId]
        : undefined;
    if (userCountryRecord &&
        orderedZones.includes(userCountryRecord.zone) &&
        isAvailable(userCountryRecord.id)) {
        return {
            zone: zoneEntry(zones_registry_1.zonesRegistry[userCountryRecord.zone]),
            country: countryEntry(userCountryRecord),
        };
    }
    if (userCountryRecord && orderedZones.includes(userCountryRecord.zone)) {
        const zone = zones_registry_1.zonesRegistry[userCountryRecord.zone];
        const firstCountry = firstAvailableCountryInZone(zone.id, isAvailable);
        if (firstCountry) {
            return {
                zone: zoneEntry(zone),
                country: countryEntry(firstCountry),
            };
        }
    }
    for (const zoneId of orderedZones) {
        const zone = zones_registry_1.zonesRegistry[zoneId];
        if (!zone)
            continue;
        const firstCountry = firstAvailableCountryInZone(zoneId, isAvailable);
        if (firstCountry) {
            return {
                zone: zoneEntry(zone),
                country: countryEntry(firstCountry),
            };
        }
    }
    const firstZone = zones_registry_1.zonesRegistry[orderedZones[0]];
    return {
        zone: zoneEntry(firstZone),
        country: { value: "", label: "", quick_filter_label: "" },
    };
}
function zoneEntry(zone) {
    return {
        value: zone.id,
        label: zone.title,
        quick_filter_label: zone.quick_filter_label,
    };
}
function countryEntry(country) {
    return {
        value: country.id,
        label: country.title,
        quick_filter_label: country.quick_filter_label,
    };
}
function firstAvailableCountryInZone(zoneId, isAvailable) {
    for (const record of Object.values(countries_registry_1.countriesRegistry)) {
        if (record.zone === zoneId && isAvailable(record.id)) {
            return record;
        }
    }
    return undefined;
}
function orderByRegistry(ids, registry) {
    const order = new Map(Object.keys(registry).map((id, idx) => [id, idx]));
    return [...ids].sort((a, b) => {
        const ai = order.get(a) ?? Number.MAX_SAFE_INTEGER;
        const bi = order.get(b) ?? Number.MAX_SAFE_INTEGER;
        return ai - bi;
    });
}
function normalizeCountryId(country) {
    const upper = country.toUpperCase();
    if (countries_registry_1.countriesRegistry[upper]) {
        return upper;
    }
    for (const record of Object.values(countries_registry_1.countriesRegistry)) {
        if (record.iso2 === upper) {
            return record.id;
        }
    }
    return null;
}
//# sourceMappingURL=zone-country-defaults.js.map