"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAliasToCanonicalMap = buildAliasToCanonicalMap;
exports.buildCanonicalToAliasesMap = buildCanonicalToAliasesMap;
exports.loadImageAliasMapsFromJson = loadImageAliasMapsFromJson;
const brand_aliases_json_1 = __importDefault(require("../../common/resources/brand-aliases.json"));
const country_aliases_json_1 = __importDefault(require("../../common/resources/country-aliases.json"));
function buildAliasToCanonicalMap(json) {
    return new Map(Object.entries(json));
}
function buildCanonicalToAliasesMap(json) {
    const buckets = new Map();
    for (const [aliasKey, canonical] of Object.entries(json)) {
        let set = buckets.get(canonical);
        if (!set) {
            set = new Set();
            buckets.set(canonical, set);
        }
        set.add(aliasKey);
    }
    const out = new Map();
    for (const [canonical, set] of buckets) {
        out.set(canonical, [...set].sort((a, b) => a.localeCompare(b)));
    }
    return out;
}
function loadImageAliasMapsFromJson() {
    const brand = brand_aliases_json_1.default;
    const country = country_aliases_json_1.default;
    return {
        brandAliasToCanonical: buildAliasToCanonicalMap(brand),
        brandCanonicalToAliases: buildCanonicalToAliasesMap(brand),
        countryAliasToCanonical: buildAliasToCanonicalMap(country),
        countryCanonicalToAliases: buildCanonicalToAliasesMap(country),
    };
}
//# sourceMappingURL=aliases.loader.js.map