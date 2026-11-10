"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeEffectiveZones = computeEffectiveZones;
const countries_registry_1 = require("../../../registries/countries.registry");
const zones_registry_1 = require("../../../registries/zones.registry");
const GLOBAL_ZONE = "ABI";
function computeEffectiveZones(zoneScope, user, options) {
    const candidate = candidateZonesFromScope(zoneScope);
    if (options?.skipReachabilityFilter) {
        return {
            effective: candidate,
            includesGlobal: candidate.includes(GLOBAL_ZONE),
        };
    }
    const reachable = reachableZonesForUser(user);
    const effective = candidate.filter((zone) => {
        if (zone === GLOBAL_ZONE) {
            return reachable.global;
        }
        return reachable.zones.has(zone);
    });
    return {
        effective,
        includesGlobal: effective.includes(GLOBAL_ZONE),
    };
}
function candidateZonesFromScope(zoneScope) {
    const allZones = Object.keys(zones_registry_1.zonesRegistry);
    if (!zoneScope || zoneScope.length === 0) {
        return allZones;
    }
    if (zoneScope.includes(GLOBAL_ZONE) && zoneScope.length === 1) {
        return allZones;
    }
    return zoneScope.filter((id) => Boolean(zones_registry_1.zonesRegistry[id]));
}
function reachableZonesForUser(user) {
    if (!user) {
        return allReachable();
    }
    switch (user.policy.mode) {
        case "unrestricted":
        case "all":
            return allReachable();
        case "deny":
            return { global: false, zones: new Set() };
        case "explicit": {
            const zones = new Set();
            for (const countryId of user.policy.iso3Set) {
                const record = countries_registry_1.countriesRegistry[countryId];
                if (record) {
                    zones.add(record.zone);
                }
            }
            return { global: false, zones };
        }
    }
}
function allReachable() {
    const zones = new Set(Object.keys(zones_registry_1.zonesRegistry));
    zones.delete(GLOBAL_ZONE);
    return { global: true, zones };
}
//# sourceMappingURL=effective-zones.js.map