"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceToolRelationCollector = void 0;
exports.addToPath = addToPath;
const performance_tool_constants_1 = require("./performance-tool.constants");
function isBoolTree(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function createBaseKpiRelations() {
    return {
        zone_countries: {},
        country_brands: {},
        country_subbrands: {},
        brand_country_subbrands: {},
        portfolio_country_brands: {},
        portfolio_country_subbrands: {},
        bps_country_brands: {},
        global_brand_countries: {},
    };
}
function createGrowthLeverRelations() {
    return {
        country_brands: {},
        country_subbrands: {},
        brand_country_subbrands: {},
        portfolio_country_brands: {},
        portfolio_country_subbrands: {},
        bps_country_brands: {},
        global_brand_country_subbrands: {},
    };
}
class PerformanceToolRelationCollector {
    constructor() {
        this.kpiRelations = {};
        this.globalBrands = {};
    }
    initialize(enabledKpis) {
        this.kpiRelations = {};
        this.globalBrands = {};
        const growthLeverKpis = new Set([performance_tool_constants_1.VOLUME_KPI, performance_tool_constants_1.MARKET_SHARE_OFFICIAL_KPI]);
        let growthLevers = {
            [performance_tool_constants_1.VOLUME_KPI]: [],
            [performance_tool_constants_1.MARKET_SHARE_OFFICIAL_KPI]: [],
        };
        for (const kpi of enabledKpis) {
            if (growthLeverKpis.has(kpi)) {
                growthLevers[kpi] =
                    performance_tool_constants_1.KPIS_MAPPING[kpi]?.growth_levers_classification ?? [];
            }
        }
        for (const kpi of enabledKpis) {
            this.kpiRelations[kpi] = createBaseKpiRelations();
            if (growthLeverKpis.has(kpi)) {
                const gl = {};
                for (const g of growthLevers[kpi]) {
                    gl[g] = createGrowthLeverRelations();
                }
                this.kpiRelations[kpi].gl = gl;
            }
        }
    }
    addZoneCountry(kpi, zone, country) {
        this.add(kpi, "zone_countries", [zone], country);
    }
    addCountryBrand(kpi, country, brand, gl) {
        if (!brand)
            return;
        this.add(kpi, "country_brands", [country], brand, gl);
    }
    addCountrySubBrand(kpi, country, subBrand, gl) {
        if (!subBrand)
            return;
        this.add(kpi, "country_subbrands", [country], subBrand, gl);
    }
    addBrandCountrySubBrand(kpi, brand, country, subBrand, gl) {
        if (!brand || !subBrand)
            return;
        this.add(kpi, "brand_country_subbrands", [brand, country], subBrand, gl);
    }
    addPortfolioCountryBrand(kpi, portfolio, country, brand, gl) {
        if (!portfolio || !brand)
            return;
        this.add(kpi, "portfolio_country_brands", [portfolio, country], brand, gl);
    }
    addPortfolioCountrySubBrand(kpi, portfolio, country, subBrand, gl) {
        if (!portfolio || !subBrand)
            return;
        this.add(kpi, "portfolio_country_subbrands", [portfolio, country], subBrand, gl);
    }
    addBpsCountryBrand(kpi, bps, country, brand, gl) {
        if (!bps || !brand)
            return;
        this.add(kpi, "bps_country_brands", [bps, country], brand, gl);
    }
    addGlobalBrandCountry(kpi, brand, country) {
        if (!brand)
            return;
        this.globalBrands[brand] = true;
        this.add(kpi, "global_brand_countries", [brand], country);
    }
    addGlobalBrandCountrySubBrand(kpi, gl, brand, country, subBrand) {
        if (!brand || !subBrand)
            return;
        const rel = this.kpiRelations[kpi];
        const glBucket = rel?.gl;
        if (!glBucket?.[gl])
            return;
        const target = glBucket[gl];
        if (!target.global_brand_country_subbrands) {
            target.global_brand_country_subbrands = {};
        }
        addToPath(target.global_brand_country_subbrands, [brand, country], subBrand);
    }
    getRelationsForKpi(kpi) {
        return this.kpiRelations[kpi] ?? {};
    }
    getGlobalBrands() {
        return this.globalBrands;
    }
    add(kpi, relation, path, value, gl = null) {
        const rel = this.kpiRelations[kpi];
        if (!rel)
            return;
        const base = rel[relation];
        addToPath(base, path, value);
        if (gl !== null) {
            const glRoot = rel.gl;
            const glRel = glRoot?.[gl];
            if (glRel?.[relation]) {
                addToPath(glRel[relation], path, value);
            }
        }
    }
}
exports.PerformanceToolRelationCollector = PerformanceToolRelationCollector;
function addToPath(arr, path, value) {
    let ref = arr;
    for (const key of path) {
        const next = ref[key];
        if (!isBoolTree(next)) {
            ref[key] = {};
        }
        ref = ref[key];
    }
    ref[value] = true;
}
//# sourceMappingURL=performance-tool.relation-collector.js.map