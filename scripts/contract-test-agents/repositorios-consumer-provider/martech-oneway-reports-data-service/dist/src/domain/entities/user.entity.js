"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const scopes_1 = require("./scopes");
const countries_registry_1 = require("../registries/countries.registry");
const resolver_1 = require("../registries/resolver");
class UserEntity {
    constructor(props, policy) {
        this.scopes = props.scopes;
        this.country = props.country;
        this.supportedCountries = props.supportedCountries;
        this.policy = policy;
    }
    static create(props) {
        const policy = computePolicy(props);
        return new UserEntity(props, policy);
    }
    getSupportedCountries() {
        if (this.policy.mode === "explicit") {
            return Array.from(this.policy.iso3Set);
        }
        return [];
    }
    hasCountryAccess(countryId) {
        switch (this.policy.mode) {
            case "unrestricted":
            case "all":
                return true;
            case "deny":
                return false;
            case "explicit":
                return this.policy.iso3Set.has(countryId);
        }
    }
}
exports.UserEntity = UserEntity;
function computePolicy(props) {
    const hasJwtPayload = (props.scopes && props.scopes.length > 0) ||
        (props.supportedCountries && props.supportedCountries.length > 0) ||
        Boolean(props.country);
    if (!hasJwtPayload) {
        return { mode: "unrestricted" };
    }
    const scopes = new Set(props.scopes ?? []);
    const jwtCountryIso3 = jwtCountryToIso3(props.country);
    const supportedIso3 = scopes.has(scopes_1.VIEWER_SCOPES.COUNTRY)
        ? supportedCountriesToIso3(props.supportedCountries)
        : new Set();
    if (scopes.has(scopes_1.VIEWER_SCOPES.COUNTRY) && jwtCountryIso3) {
        supportedIso3.add(jwtCountryIso3);
    }
    if (scopes.has(scopes_1.VIEWER_SCOPES.GLOBAL) ||
        coversEveryRegisteredCountry(supportedIso3)) {
        return { mode: "all" };
    }
    const zoneIso3 = collectZoneCountries(scopes);
    const hasCountryViewer = scopes.has(scopes_1.VIEWER_SCOPES.COUNTRY);
    if (zoneIso3.size > 0 || (hasCountryViewer && supportedIso3.size > 0)) {
        const merged = new Set(zoneIso3);
        if (hasCountryViewer) {
            for (const id of supportedIso3) {
                merged.add(id);
            }
        }
        return { mode: "explicit", iso3Set: merged };
    }
    if (hasCountryViewer) {
        return { mode: "deny" };
    }
    return { mode: "deny" };
}
function collectZoneCountries(scopes) {
    const result = new Set();
    for (const [zoneId, scope] of Object.entries(scopes_1.VIEWER_SCOPES.ZONE)) {
        if (scopes.has(scope)) {
            for (const country of (0, resolver_1.resolveCountriesByZone)(zoneId)) {
                result.add(country.id);
            }
        }
    }
    return result;
}
function coversEveryRegisteredCountry(iso3Set) {
    const registered = Object.keys(countries_registry_1.countriesRegistry);
    if (registered.length === 0) {
        return false;
    }
    return registered.every((id) => iso3Set.has(id));
}
function supportedCountriesToIso3(supported) {
    const result = new Set();
    if (!supported) {
        return result;
    }
    for (const code of supported) {
        if (!code) {
            continue;
        }
        if (code === "*") {
            for (const c of Object.values(countries_registry_1.countriesRegistry)) {
                result.add(c.id);
            }
            continue;
        }
        const record = (0, resolver_1.resolveCountryByIso2)(code);
        if (record) {
            result.add(record.id);
        }
    }
    return result;
}
function jwtCountryToIso3(country) {
    if (!country) {
        return null;
    }
    const upper = country.toUpperCase();
    if (upper.length === 3) {
        return upper;
    }
    const record = (0, resolver_1.resolveCountryByIso2)(upper);
    return record?.id ?? null;
}
//# sourceMappingURL=user.entity.js.map