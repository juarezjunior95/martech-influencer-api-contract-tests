"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownCountryError = void 0;
exports.buildZoneCountryFilters = buildZoneCountryFilters;
const countries_registry_1 = require("../../../registries/countries.registry");
function buildZoneCountryFilters({ scope, page, hideGlobalForKpi, }) {
    if (scope == null) {
        throw new TypeError("buildZoneCountryFilters: `scope` is required in the options object.");
    }
    const countryScope = uniq(scope.countries ?? []);
    assertKnownCountries(countryScope);
    const zoneScope = deriveZoneScope(countryScope);
    const zoneFilters = [];
    if (zoneScope.length > 0) {
        zoneFilters.push(filter("scope", zoneScope));
    }
    if (countryScope.length > 0) {
        zoneFilters.push(filter("country_scope", countryScope));
    }
    if (page) {
        zoneFilters.push(filter("page", [page]));
    }
    if (hideGlobalForKpi !== undefined) {
        zoneFilters.push({ name: "hideGlobalForKpi", value: hideGlobalForKpi });
    }
    const zones = { filters: zoneFilters };
    const countryFilters = [];
    if (countryScope.length > 0) {
        countryFilters.push(filter("scope", countryScope));
    }
    if (zoneScope.length > 0) {
        countryFilters.push(filter("zone_scope", zoneScope));
    }
    if (page) {
        countryFilters.push(filter("page", [page]));
    }
    if (hideGlobalForKpi !== undefined) {
        countryFilters.push({
            name: "hideGlobalForKpi",
            value: hideGlobalForKpi,
        });
    }
    const country = { filters: countryFilters };
    return { zones, country };
}
class UnknownCountryError extends Error {
    constructor(unknown) {
        super(`Unknown country id(s) in scope: [${unknown.join(", ")}]. ` +
            `Expected ISO3 ids registered in countriesRegistry (or "${countries_registry_1.ABI_GLOBAL_ID}").`);
        this.name = "UnknownCountryError";
    }
}
exports.UnknownCountryError = UnknownCountryError;
function deriveZoneScope(countries) {
    const zones = new Set();
    for (const id of countries) {
        if (id === countries_registry_1.ABI_GLOBAL_ID) {
            zones.add(countries_registry_1.ABI_GLOBAL_ID);
            continue;
        }
        zones.add(countries_registry_1.countriesRegistry[id].zone);
    }
    return [...zones];
}
function assertKnownCountries(countries) {
    const unknown = countries.filter((id) => id !== countries_registry_1.ABI_GLOBAL_ID && !countries_registry_1.countriesRegistry[id]);
    if (unknown.length > 0) {
        throw new UnknownCountryError(unknown);
    }
}
function uniq(list) {
    return [...new Set(list)];
}
function filter(name, list) {
    return { name, value: list.join(",") };
}
//# sourceMappingURL=zone-country.builder.js.map