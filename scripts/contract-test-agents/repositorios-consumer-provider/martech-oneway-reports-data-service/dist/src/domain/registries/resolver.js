"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WILDCARD = void 0;
exports.resolveCountries = resolveCountries;
exports.resolveCountryByIso2 = resolveCountryByIso2;
exports.resolveCountriesByZone = resolveCountriesByZone;
const countries_registry_1 = require("./countries.registry");
exports.WILDCARD = "*";
const iso2ToRecord = new Map(Object.values(countries_registry_1.countriesRegistry).map((r) => [r.iso2, r]));
function resolveCountries(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
        return [];
    }
    const effectiveIds = ids.includes(exports.WILDCARD)
        ? Object.keys(countries_registry_1.countriesRegistry)
        : ids;
    return effectiveIds
        .map((id) => countries_registry_1.countriesRegistry[id])
        .filter((record) => Boolean(record));
}
function resolveCountryByIso2(iso2) {
    if (!iso2) {
        return undefined;
    }
    return iso2ToRecord.get(iso2.toUpperCase());
}
function resolveCountriesByZone(zoneId) {
    if (!zoneId) {
        return [];
    }
    return Object.values(countries_registry_1.countriesRegistry).filter((record) => record.zone === zoneId);
}
//# sourceMappingURL=resolver.js.map