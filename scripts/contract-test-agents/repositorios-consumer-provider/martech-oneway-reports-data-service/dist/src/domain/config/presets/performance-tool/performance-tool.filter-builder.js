"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPerformanceToolFilterPayload = buildPerformanceToolFilterPayload;
const performance_tool_constants_1 = require("./performance-tool.constants");
const performance_tool_filter_context_1 = require("./performance-tool.filter-context");
function pickString(raw, keys) {
    for (const key of keys) {
        const v = raw[key];
        if (typeof v === "string" && v.length > 0) {
            return v;
        }
    }
    return "";
}
function buildPerformanceToolFilterPayload(rawData, enabledKpis, kpiRefreshDates, userPermissions) {
    const context = new performance_tool_filter_context_1.PerformanceToolFilterContext();
    context.initialize(enabledKpis, kpiRefreshDates);
    const collector = context.getCollector();
    const enabledMap = new Set(enabledKpis.map((k) => k.toLowerCase()));
    for (const row of rawData) {
        const ext = row;
        const kpiRaw = pickString(ext, [
            performance_tool_constants_1.COL_KPI_NAME,
            "KPI_NAME",
            "kpi_name",
            "filter",
        ]);
        const kpi = kpiRaw.toLowerCase();
        if (!enabledMap.has(kpi)) {
            continue;
        }
        const zone = pickString(ext, [performance_tool_constants_1.COL_ZONE, "ABI_ZONE", "abi_zone"]);
        const country = pickString(ext, [
            performance_tool_constants_1.COL_COUNTRY_ISO,
            "COUNTRY_ISO_CODE_3",
            "country_iso_code_3",
        ]);
        if (!zone || !country) {
            continue;
        }
        const permKeys = Object.keys(userPermissions);
        if (permKeys.length > 0 && kpi !== performance_tool_constants_1.POWER_KPI) {
            const zoneAllowed = userPermissions[zone];
            if (!zoneAllowed) {
                continue;
            }
            if (!new Set(zoneAllowed).has(country)) {
                continue;
            }
        }
        const countryName = pickString(ext, [
            performance_tool_constants_1.COL_COUNTRY_NAME,
            "RAW_GEOGRAPHY",
            "raw_geography",
        ]);
        const brand = pickString(ext, [performance_tool_constants_1.COL_BRAND, "RAW_BRAND", "raw_brand"]);
        const portfolio = pickString(ext, [performance_tool_constants_1.COL_SEGMENT, "SEGMENT", "segment"]);
        const subBrand = pickString(ext, [performance_tool_constants_1.COL_SUBBRAND, "SUBBRAND", "subbrand"]);
        const glRaw = pickString(ext, [
            performance_tool_constants_1.COL_GROWTH_LEVER,
            "GROWTHLEVER",
            "growthlever",
        ]);
        const globalBrand = pickString(ext, [
            performance_tool_constants_1.COL_GLOBAL_BRAND,
            "GLOBALBRAND",
            "globalbrand",
        ]);
        const priceTier = pickString(ext, [
            performance_tool_constants_1.COL_PRICE_TIER,
            "PRICE_TIER",
            "price_tier",
        ]);
        const gl = glRaw !== "" ? glRaw : null;
        context.addZone(zone);
        context.addCountry(country, countryName, zone);
        const region = pickString(ext, [performance_tool_constants_1.COL_REGION, "region"]).trim();
        if (region && !(0, performance_tool_constants_1.isResidualRegion)(region)) {
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
                collector.addPortfolioCountrySubBrand(kpi, portfolio, country, subBrand, gl);
            }
            if (brand !== "") {
                collector.addBrandCountrySubBrand(kpi, brand, country, subBrand, gl);
                if (globalBrand !== "" && gl !== null) {
                    collector.addGlobalBrandCountrySubBrand(kpi, gl, brand, country, subBrand);
                }
            }
        }
    }
    return context.toArray();
}
//# sourceMappingURL=performance-tool.filter-builder.js.map