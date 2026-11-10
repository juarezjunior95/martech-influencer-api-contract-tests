/**
 * Port of Drupal `PerformanceToolMockData::generateMockData`.
 */
import {
  COL_BRAND,
  COL_COUNTRY_ISO,
  COL_COUNTRY_NAME,
  COL_GLOBAL_BRAND,
  COL_GROWTH_LEVER,
  COL_KPI_NAME,
  COL_PERIOD,
  COL_PRICE_TIER,
  COL_REGION,
  COL_SEGMENT,
  COL_SUBBRAND,
  COL_ZONE,
  ZONE_EUR,
  ZONE_GLOBAL,
} from "@domain/config/presets/performance-tool/performance-tool.constants";
import type { PerformanceToolFilterRawRow } from "@domain/config/presets/performance-tool/performance-tool.types";

const MOCK_BRANDS = [
  "Corona",
  "Michelob Ultra",
  "Budweiser",
  "Stella Artois",
] as const;
const MOCK_GROWTHLEVERS = ["Lead Premium"] as const;
const MOCK_GEO = [ZONE_GLOBAL, ZONE_EUR] as const;

export function buildPerformanceToolMockData(): PerformanceToolFilterRawRow[] {
  return [
    ...generateVolumeMock(),
    ...generatePowerMock(),
    ...generateMarketShareMock(),
    ...generateMarketShareOfficialMock(),
  ];
}

function generateVolumeMock(): PerformanceToolFilterRawRow[] {
  const mock: PerformanceToolFilterRawRow[] = [];
  for (const geo of MOCK_GEO) {
    for (const brand of MOCK_BRANDS) {
      for (const growthLever of MOCK_GROWTHLEVERS) {
        mock.push(createRow("VOLUME", geo, brand, growthLever));
      }
    }
  }
  return mock;
}

function generatePowerMock(): PerformanceToolFilterRawRow[] {
  return [createRow("POWER", ZONE_GLOBAL)];
}

function generateMarketShareMock(): PerformanceToolFilterRawRow[] {
  const mock: PerformanceToolFilterRawRow[] = [];
  for (const geo of MOCK_GEO) {
    mock.push(createRow("MARKET_SHARE", geo));
  }
  return mock;
}

function generateMarketShareOfficialMock(): PerformanceToolFilterRawRow[] {
  const mock: PerformanceToolFilterRawRow[] = [];
  for (const geo of MOCK_GEO) {
    mock.push(createRow("MARKET_SHARE_OFFICIAL", geo));
  }
  return mock;
}

function createRow(
  kpi: string,
  geo: string,
  brand = "",
  growthLever = "",
): PerformanceToolFilterRawRow {
  return {
    [COL_KPI_NAME]: kpi,
    [COL_ZONE]: geo,
    [COL_COUNTRY_ISO]: geo,
    [COL_COUNTRY_NAME]: "All",
    [COL_BRAND]: brand,
    [COL_SEGMENT]: "",
    [COL_PERIOD]: "ALL",
    [COL_SUBBRAND]: "",
    [COL_GROWTH_LEVER]: growthLever,
    [COL_GLOBAL_BRAND]: "",
    [COL_PRICE_TIER]: "",
    [COL_REGION]: "",
  };
}
