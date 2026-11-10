"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countries = exports.countriesRegistry = exports.ABI_GLOBAL_ID = void 0;
exports.ABI_GLOBAL_ID = "ABI";
const rawEntries = [
    { id: "MOZ", zone: "AFR" },
    { id: "NGA", zone: "AFR" },
    { id: "ZAF", zone: "AFR" },
    { id: "TZA", zone: "AFR" },
    { id: "UGA", zone: "AFR" },
    { id: "ZMB", zone: "AFR" },
    { id: "CHN", zone: "APAC" },
    { id: "IND", zone: "APAC" },
    { id: "JPN", zone: "APAC" },
    { id: "KOR", zone: "APAC" },
    { id: "VNM", zone: "APAC" },
    { id: "BEL", zone: "EUR" },
    { id: "FRA", zone: "EUR" },
    { id: "DEU", zone: "EUR" },
    { id: "ITA", zone: "EUR" },
    { id: "NLD", zone: "EUR" },
    { id: "GBR", zone: "EUR" },
    { id: "COL", zone: "MAZ" },
    { id: "DOM", zone: "MAZ" },
    { id: "ECU", zone: "MAZ" },
    { id: "SLV", zone: "MAZ" },
    { id: "GTM", zone: "MAZ" },
    { id: "HND", zone: "MAZ" },
    { id: "MEX", zone: "MAZ" },
    { id: "PAN", zone: "MAZ" },
    { id: "PER", zone: "MAZ" },
    { id: "CAN", zone: "NAZ" },
    { id: "USA", zone: "NAZ" },
    { id: "ARG", zone: "SAZ" },
    { id: "BOL", zone: "SAZ" },
    { id: "BRA", zone: "SAZ" },
    { id: "CHL", zone: "SAZ" },
    { id: "PRY", zone: "SAZ" },
    { id: "URY", zone: "SAZ" },
];
exports.countriesRegistry = rawEntries.reduce((acc, entry) => {
    acc[entry.id] = entry;
    return acc;
}, {});
exports.countries = exports.countriesRegistry;
//# sourceMappingURL=countries.registry.js.map