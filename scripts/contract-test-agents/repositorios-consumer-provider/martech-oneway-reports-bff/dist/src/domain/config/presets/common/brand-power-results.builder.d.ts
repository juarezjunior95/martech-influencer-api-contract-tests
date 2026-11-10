import { PresetRefConfig } from "../../../entities/preset.entity";
export declare const GLOBAL_BRANDS_PRESET_REF: "global-brands";
export declare const BRAND_POWER_BOOK_SCOPES_PRESET_REF: "brand-power-book-scopes";
export declare const BRAND_POWER_RESULTS_PRESET_REF: "brand-power-results";
type BrandPowerResultsPresetRefs = typeof GLOBAL_BRANDS_PRESET_REF | typeof BRAND_POWER_BOOK_SCOPES_PRESET_REF | typeof BRAND_POWER_RESULTS_PRESET_REF;
export declare function buildBrandPowerResultsFilters(): Record<BrandPowerResultsPresetRefs, PresetRefConfig>;
export {};
