"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPerformanceToolMockData = buildPerformanceToolMockData;
const performance_tool_constants_1 = require("./performance-tool.constants");
const MOCK_BRANDS = [
    "Corona",
    "Michelob Ultra",
    "Budweiser",
    "Stella Artois",
];
const MOCK_GROWTHLEVERS = ["Lead Premium"];
const MOCK_GEO = [performance_tool_constants_1.ZONE_GLOBAL, performance_tool_constants_1.ZONE_EUR];
function buildPerformanceToolMockData() {
    return [
        ...generateVolumeMock(),
        ...generatePowerMock(),
        ...generateMarketShareMock(),
        ...generateMarketShareOfficialMock(),
    ];
}
function generateVolumeMock() {
    const mock = [];
    for (const geo of MOCK_GEO) {
        for (const brand of MOCK_BRANDS) {
            for (const growthLever of MOCK_GROWTHLEVERS) {
                mock.push(createRow("VOLUME", geo, brand, growthLever));
            }
        }
    }
    return mock;
}
function generatePowerMock() {
    return [createRow("POWER", performance_tool_constants_1.ZONE_GLOBAL)];
}
function generateMarketShareMock() {
    const mock = [];
    for (const geo of MOCK_GEO) {
        mock.push(createRow("MARKET_SHARE", geo));
    }
    return mock;
}
function generateMarketShareOfficialMock() {
    const mock = [];
    for (const geo of MOCK_GEO) {
        mock.push(createRow("MARKET_SHARE_OFFICIAL", geo));
    }
    return mock;
}
function createRow(kpi, geo, brand = "", growthLever = "") {
    return {
        [performance_tool_constants_1.COL_KPI_NAME]: kpi,
        [performance_tool_constants_1.COL_ZONE]: geo,
        [performance_tool_constants_1.COL_COUNTRY_ISO]: geo,
        [performance_tool_constants_1.COL_COUNTRY_NAME]: "All",
        [performance_tool_constants_1.COL_BRAND]: brand,
        [performance_tool_constants_1.COL_SEGMENT]: "",
        [performance_tool_constants_1.COL_PERIOD]: "ALL",
        [performance_tool_constants_1.COL_SUBBRAND]: "",
        [performance_tool_constants_1.COL_GROWTH_LEVER]: growthLever,
        [performance_tool_constants_1.COL_GLOBAL_BRAND]: "",
        [performance_tool_constants_1.COL_PRICE_TIER]: "",
        [performance_tool_constants_1.COL_REGION]: "",
    };
}
//# sourceMappingURL=performance-tool.mock-data.js.map