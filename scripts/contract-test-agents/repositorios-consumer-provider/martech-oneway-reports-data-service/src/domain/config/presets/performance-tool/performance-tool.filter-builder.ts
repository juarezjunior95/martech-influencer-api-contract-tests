import {
  COL_BRAND,
  COL_COUNTRY_ISO,
  COL_COUNTRY_NAME,
  COL_GLOBAL_BRAND,
  COL_GROWTH_LEVER,
  COL_KPI_NAME,
  COL_PRICE_TIER,
  COL_REGION,
  COL_SEGMENT,
  COL_SUBBRAND,
  COL_ZONE,
  isResidualRegion,
  POWER_KPI,
} from "@domain/config/presets/performance-tool/performance-tool.constants";
import { PerformanceToolFilterContext } from "@domain/config/presets/performance-tool/performance-tool.filter-context";
import type { PerformanceToolFilterRawRow } from "@domain/config/presets/performance-tool/performance-tool.types";

function pickString(raw: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = raw[key];
    if (typeof v === "string" && v.length > 0) {
      return v;
    }
  }
  return "";
}

/**
 * Port of Drupal `FilterBuilder::build` + `FilterContext` ingestion loop.
 */
export function buildPerformanceToolFilterPayload(
  rawData: PerformanceToolFilterRawRow[],
  enabledKpis: readonly string[],
  kpiRefreshDates: Record<string, string>,
  userPermissions: Record<string, string[]>,
): Record<string, unknown> {
  const context = new PerformanceToolFilterContext();
  context.initialize(enabledKpis, kpiRefreshDates);
  const collector = context.getCollector();

  const enabledMap = new Set(enabledKpis.map((k) => k.toLowerCase()));

  for (const row of rawData) {
    const ext = row as unknown as Record<string, unknown>;
    const kpiRaw = pickString(ext, [
      COL_KPI_NAME,
      "KPI_NAME",
      "kpi_name",
      "filter",
    ]);
    const kpi = kpiRaw.toLowerCase();
    if (!enabledMap.has(kpi)) {
      continue;
    }

    const zone = pickString(ext, [COL_ZONE, "ABI_ZONE", "abi_zone"]);
    const country = pickString(ext, [
      COL_COUNTRY_ISO,
      "COUNTRY_ISO_CODE_3",
      "country_iso_code_3",
    ]);
    if (!zone || !country) {
      continue;
    }

    const permKeys = Object.keys(userPermissions);

    // Always allow POWER_KPI for all zones and countries.
    if (permKeys.length > 0 && kpi !== POWER_KPI) {
      const zoneAllowed = userPermissions[zone];
      if (!zoneAllowed) {
        continue;
      }
      if (!new Set(zoneAllowed).has(country)) {
        continue;
      }
    }

    const countryName = pickString(ext, [
      COL_COUNTRY_NAME,
      "RAW_GEOGRAPHY",
      "raw_geography",
    ]);
    const brand = pickString(ext, [COL_BRAND, "RAW_BRAND", "raw_brand"]);
    const portfolio = pickString(ext, [COL_SEGMENT, "SEGMENT", "segment"]);
    const subBrand = pickString(ext, [COL_SUBBRAND, "SUBBRAND", "subbrand"]);
    const glRaw = pickString(ext, [
      COL_GROWTH_LEVER,
      "GROWTHLEVER",
      "growthlever",
    ]);
    const globalBrand = pickString(ext, [
      COL_GLOBAL_BRAND,
      "GLOBALBRAND",
      "globalbrand",
    ]);
    const priceTier = pickString(ext, [
      COL_PRICE_TIER,
      "PRICE_TIER",
      "price_tier",
    ]);

    const gl = glRaw !== "" ? glRaw : null;

    context.addZone(zone);
    context.addCountry(country, countryName, zone);

    const region = pickString(ext, [COL_REGION, "region"]).trim();
    if (region && !isResidualRegion(region)) {
      context.addRegion(country, region);
    }

    collector.addZoneCountry(kpi, zone, country);

    if (brand !== "") {
      collector.addCountryBrand(kpi, country, brand, gl);

      if (portfolio !== "") {
        collector.addPortfolioCountryBrand(kpi, portfolio, country, brand, gl);
      }
      if (priceTier !== "") {
        collector.addBpsCountryBrand(kpi, priceTier, country, brand, gl);
      }
      if (globalBrand !== "") {
        collector.addGlobalBrandCountry(kpi, brand, country);
      }
    }

    if (subBrand !== "") {
      collector.addCountrySubBrand(kpi, country, subBrand, gl);

      if (portfolio !== "") {
        collector.addPortfolioCountrySubBrand(
          kpi,
          portfolio,
          country,
          subBrand,
          gl,
        );
      }

      if (brand !== "") {
        collector.addBrandCountrySubBrand(kpi, brand, country, subBrand, gl);

        if (globalBrand !== "" && gl !== null) {
          collector.addGlobalBrandCountrySubBrand(
            kpi,
            gl,
            brand,
            country,
            subBrand,
          );
        }
      }
    }
  }

  return context.toArray();
}
