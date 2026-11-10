"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCountryMapCommand = void 0;
class GetCountryMapCommand {
    constructor() {
        this.name = "getCountryMap";
    }
    execute() {
        return { ...GetCountryMapCommand.COUNTRY_MAP };
    }
}
exports.GetCountryMapCommand = GetCountryMapCommand;
GetCountryMapCommand.COUNTRY_MAP = {
    ARG: "Argentina",
    AUT: "Austria",
    BEL: "Belgium",
    BOL: "Bolivia",
    BRA: "Brazil",
    BWA: "Botswana",
    CAN: "Canada",
    CHE: "Switzerland",
    CHL: "Chile",
    CHN: "China",
    COL: "Colombia",
    DEU: "Germany",
    DNK: "Denmark",
    DOM: "Dominican Republic",
    ECU: "Ecuador",
    ESP: "Spain",
    FRA: "France",
    GBR: "United Kingdom",
    GHA: "Ghana",
    GTM: "Guatemala",
    HND: "Honduras",
    IND: "India",
    IRL: "Ireland",
    ITA: "Italy",
    JPN: "Japan",
    KOR: "South Korea",
    LSO: "Lesotho",
    LUX: "Luxembourg",
    MEX: "Mexico",
    MOZ: "Mozambique",
    NAM: "Namibia",
    NGA: "Nigeria",
    NLD: "Netherlands",
    NOR: "Norway",
    PAN: "Panama",
    PER: "Peru",
    PRT: "Portugal",
    PRY: "Paraguay",
    SLV: "El Salvador",
    SWE: "Sweden",
    SWZ: "Eswatini",
    TZA: "Tanzania",
    UGA: "Uganda",
    URY: "Uruguay",
    USA: "United States",
    VNM: "Vietnam",
    ZAF: "South Africa",
    ZMB: "Zambia",
    OTHER: "Others",
};
//# sourceMappingURL=GetCountryMapCommand.js.map