import {
  KPIS_MAPPING,
  MARKET_SHARE_OFFICIAL_KPI,
  VOLUME_KPI,
} from "@domain/config/presets/performance-tool/performance-tool.constants";

export interface BoolTree {
  [key: string]: boolean | BoolTree | undefined;
}

function isBoolTree(v: unknown): v is BoolTree {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Fresh nested trees per KPI — shallow `{ ...obj }` would share `country_brands` etc. */
function createBaseKpiRelations(): Record<string, unknown> {
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

function createGrowthLeverRelations(): Record<string, unknown> {
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

/**
 * Port of Drupal `PerformanceToolRelationCollector`.
 */
export class PerformanceToolRelationCollector {
  private kpiRelations: Record<string, unknown> = {};

  private globalBrands: Record<string, boolean> = {};

  initialize(enabledKpis: readonly string[]): void {
    this.kpiRelations = {};
    this.globalBrands = {};
    const growthLeverKpis = new Set([VOLUME_KPI, MARKET_SHARE_OFFICIAL_KPI]);

    let growthLevers: Record<string, string[]> = {
      [VOLUME_KPI]: [],
      [MARKET_SHARE_OFFICIAL_KPI]: [],
    };
    for (const kpi of enabledKpis) {
      if (growthLeverKpis.has(kpi)) {
        growthLevers[kpi] =
          (KPIS_MAPPING[kpi]?.growth_levers_classification as string[]) ?? [];
      }
    }

    for (const kpi of enabledKpis) {
      this.kpiRelations[kpi] = createBaseKpiRelations();
      if (growthLeverKpis.has(kpi)) {
        const gl: Record<string, unknown> = {};
        for (const g of growthLevers[kpi]) {
          gl[g] = createGrowthLeverRelations();
        }
        (this.kpiRelations[kpi] as Record<string, unknown>).gl = gl;
      }
    }
  }

  addZoneCountry(kpi: string, zone: string, country: string): void {
    this.add(kpi, "zone_countries", [zone], country);
  }

  addCountryBrand(
    kpi: string,
    country: string,
    brand: string,
    gl: string | null,
  ): void {
    if (!brand) return;
    this.add(kpi, "country_brands", [country], brand, gl);
  }

  addCountrySubBrand(
    kpi: string,
    country: string,
    subBrand: string,
    gl: string | null,
  ): void {
    if (!subBrand) return;
    this.add(kpi, "country_subbrands", [country], subBrand, gl);
  }

  addBrandCountrySubBrand(
    kpi: string,
    brand: string,
    country: string,
    subBrand: string,
    gl: string | null,
  ): void {
    if (!brand || !subBrand) return;
    this.add(kpi, "brand_country_subbrands", [brand, country], subBrand, gl);
  }

  addPortfolioCountryBrand(
    kpi: string,
    portfolio: string,
    country: string,
    brand: string,
    gl: string | null,
  ): void {
    if (!portfolio || !brand) return;
    this.add(kpi, "portfolio_country_brands", [portfolio, country], brand, gl);
  }

  addPortfolioCountrySubBrand(
    kpi: string,
    portfolio: string,
    country: string,
    subBrand: string,
    gl: string | null,
  ): void {
    if (!portfolio || !subBrand) return;
    this.add(
      kpi,
      "portfolio_country_subbrands",
      [portfolio, country],
      subBrand,
      gl,
    );
  }

  addBpsCountryBrand(
    kpi: string,
    bps: string,
    country: string,
    brand: string,
    gl: string | null,
  ): void {
    if (!bps || !brand) return;
    this.add(kpi, "bps_country_brands", [bps, country], brand, gl);
  }

  addGlobalBrandCountry(kpi: string, brand: string, country: string): void {
    if (!brand) return;
    this.globalBrands[brand] = true;
    this.add(kpi, "global_brand_countries", [brand], country);
  }

  addGlobalBrandCountrySubBrand(
    kpi: string,
    gl: string,
    brand: string,
    country: string,
    subBrand: string,
  ): void {
    if (!brand || !subBrand) return;
    const rel = this.kpiRelations[kpi] as Record<string, unknown> | undefined;
    const glBucket = rel?.gl as Record<string, unknown> | undefined;
    if (!glBucket?.[gl]) return;
    const target = glBucket[gl] as Record<string, unknown>;
    if (!target.global_brand_country_subbrands) {
      target.global_brand_country_subbrands = {};
    }
    addToPath(
      target.global_brand_country_subbrands as BoolTree,
      [brand, country],
      subBrand,
    );
  }

  getRelationsForKpi(kpi: string): Record<string, unknown> {
    return (this.kpiRelations[kpi] as Record<string, unknown>) ?? {};
  }

  getGlobalBrands(): Record<string, boolean> {
    return this.globalBrands;
  }

  private add(
    kpi: string,
    relation: string,
    path: string[],
    value: string,
    gl: string | null = null,
  ): void {
    const rel = this.kpiRelations[kpi] as Record<string, unknown> | undefined;
    if (!rel) return;

    const base = rel[relation] as BoolTree;
    addToPath(base, path, value);

    if (gl !== null) {
      const glRoot = rel.gl as Record<string, unknown> | undefined;
      const glRel = glRoot?.[gl] as Record<string, unknown> | undefined;
      if (glRel?.[relation]) {
        addToPath(glRel[relation] as BoolTree, path, value);
      }
    }
  }
}

export function addToPath(arr: BoolTree, path: string[], value: string): void {
  let ref: BoolTree = arr;
  for (const key of path) {
    const next = ref[key];
    if (!isBoolTree(next)) {
      ref[key] = {};
    }
    ref = ref[key] as BoolTree;
  }
  ref[value] = true;
}
