import { ASSETS_BASE } from "../constants";

export type PactScenario = "full" | "empty" | "brand-images";

export type PerformanceRow = Record<string, unknown>;
export type BrandRow = Record<string, unknown>;

export interface ScenarioFixtures {
  performance: PerformanceRow[];
  brands: BrandRow[];
}

export const buildPerformanceRow = (
  overrides: Record<string, unknown> = {},
): PerformanceRow => ({
  segment: "Megabrands",
  volume_month_refresh: "Jun'26",
  others_month_refresh: "Jun'26",
  others_period_refresh: "Q2'26",
  volume_growth_contr: 49.1,
  comp_volume_growth_contr_direction: "up",
  volume_weight: 60.9,
  comp_volume_weight_direction: "up",
  volume_ac_vs_ly: 1.3,
  comp_volume_ac_vs_ly_direction: "up",
  nr_ac_vs_ly: 7.3,
  comp_nr_ac_vs_ly_direction: "up",
  cores_ac_vs_ly: 8.2,
  comp_cores_ac_vs_ly_direction: "up",
  brand_power_pp: 0.8,
  comp_brand_power_pp_direction: "up",
  sm_of_maco_ac: 13.8,
  comp_sm_of_maco_ac_direction: "up",
  sm_weight: 59,
  comp_sm_weight_direction: "up",
  ...overrides,
});

export const buildBrandRow = (
  segment: string,
  overrides: Record<string, unknown> = {},
): BrandRow => ({
  segment,
  brand: "Corona",
  brand_image: `${ASSETS_BASE}/brands/corona/square.png`,
  country_image: `${ASSETS_BASE}/countries/rounded_flags/ABI.png`,
  ac_vs_ly: 6,
  comp_ac_ly_direction: "up",
  country: "ABI",
  ...overrides,
});

/** Dataset completo: 4 segmentos + TOTAL + brands por segmento */
export const FULL_FIXTURES: ScenarioFixtures = {
  performance: [
    buildPerformanceRow({ segment: "Megabrands" }),
    buildPerformanceRow({
      segment: "Expansion",
      volume_growth_contr: 24.6,
      volume_weight: 5,
    }),
    buildPerformanceRow({
      segment: "Sustain",
      volume_growth_contr: 15.2,
      volume_weight: 8.1,
    }),
    buildPerformanceRow({
      segment: "Tail",
      volume_growth_contr: 10.1,
      volume_weight: 26,
    }),
    buildPerformanceRow({
      segment: "TOTAL",
      volume_growth_contr: 100,
      volume_weight: 100,
      volume_ac_vs_ly: 1.3,
      nr_ac_vs_ly: 7.3,
      cores_ac_vs_ly: 8.2,
      brand_power_pp: 0.8,
      sm_of_maco_ac: 13.8,
      sm_weight: 100,
    }),
  ],
  brands: [
    buildBrandRow("Megabrands"),
    buildBrandRow("Expansion", { brand: "Brahma" }),
    buildBrandRow("Sustain", { brand: "Skol" }),
    buildBrandRow("Tail", { brand: "Antarctica" }),
  ],
};

/** Apenas Megabrands — cenário de URLs de imagem válidas */
export const BRAND_IMAGES_FIXTURES: ScenarioFixtures = {
  performance: [
    buildPerformanceRow({ segment: "Megabrands" }),
    buildPerformanceRow({ segment: "TOTAL" }),
  ],
  brands: [buildBrandRow("Megabrands")],
};

export const EMPTY_FIXTURES: ScenarioFixtures = {
  performance: [],
  brands: [],
};

export const SCENARIO_FIXTURES: Record<PactScenario, ScenarioFixtures> = {
  full: FULL_FIXTURES,
  empty: EMPTY_FIXTURES,
  "brand-images": BRAND_IMAGES_FIXTURES,
};
