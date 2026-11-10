"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPerformanceToolUserPermissions = buildPerformanceToolUserPermissions;
const scopes_1 = require("../../../entities/scopes");
const countries_registry_1 = require("../../../registries/countries.registry");
function buildPerformanceToolUserPermissions(user) {
    if (!user ||
        user.policy.mode === "unrestricted" ||
        user.policy.mode === "all") {
        return {};
    }
    if (user.policy.mode === "deny") {
        return { NONE: ["NONE"] };
    }
    const map = {};
    for (const iso3 of user.policy.iso3Set) {
        const rec = countries_registry_1.countriesRegistry[iso3];
        if (!rec) {
            continue;
        }
        if (!map[rec.zone]) {
            map[rec.zone] = [];
        }
        map[rec.zone].push(iso3);
    }
    if (user.scopes.includes(scopes_1.VIEWER_SCOPES.ZONE.EUR)) {
        if (!map.EUR) {
            map.EUR = [];
        }
        if (!map.EUR.includes("EUR")) {
            map.EUR.push("EUR");
        }
        if (!map.EUR.includes("ABI")) {
            map.EUR.push("ABI");
        }
    }
    if (Object.keys(map).length === 0) {
        return { NONE: ["NONE"] };
    }
    return map;
}
//# sourceMappingURL=performance-tool.user-permissions.js.map