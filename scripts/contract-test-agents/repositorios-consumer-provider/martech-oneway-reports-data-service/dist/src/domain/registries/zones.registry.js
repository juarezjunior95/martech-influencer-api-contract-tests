"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zonesRegistry = void 0;
const scopes_1 = require("../entities/scopes");
const rawEntries = [
    { id: "ABI", title: "Global", scope: null, quick_filter_label: "Global" },
    {
        id: "AFR",
        title: "AFR",
        scope: scopes_1.VIEWER_SCOPES.ZONE.AFR,
        quick_filter_label: "AFR",
    },
    {
        id: "APAC",
        title: "APAC",
        scope: scopes_1.VIEWER_SCOPES.ZONE.APAC,
        quick_filter_label: "APAC",
    },
    {
        id: "EUR",
        title: "EUR",
        scope: scopes_1.VIEWER_SCOPES.ZONE.EUR,
        quick_filter_label: "EUR",
    },
    {
        id: "MAZ",
        title: "MAZ",
        scope: scopes_1.VIEWER_SCOPES.ZONE.MAZ,
        quick_filter_label: "MAZ",
    },
    {
        id: "NAZ",
        title: "NAZ",
        scope: scopes_1.VIEWER_SCOPES.ZONE.NAZ,
        quick_filter_label: "NAZ",
    },
    {
        id: "SAZ",
        title: "SAZ",
        scope: scopes_1.VIEWER_SCOPES.ZONE.SAZ,
        quick_filter_label: "SAZ",
    },
];
exports.zonesRegistry = rawEntries.reduce((acc, entry) => {
    acc[entry.id] = entry;
    return acc;
}, {});
//# sourceMappingURL=zones.registry.js.map