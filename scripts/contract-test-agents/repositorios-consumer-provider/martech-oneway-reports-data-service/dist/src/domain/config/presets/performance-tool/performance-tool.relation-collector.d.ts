export interface BoolTree {
    [key: string]: boolean | BoolTree | undefined;
}
export declare class PerformanceToolRelationCollector {
    private kpiRelations;
    private globalBrands;
    initialize(enabledKpis: readonly string[]): void;
    addZoneCountry(kpi: string, zone: string, country: string): void;
    addCountryBrand(kpi: string, country: string, brand: string, gl: string | null): void;
    addCountrySubBrand(kpi: string, country: string, subBrand: string, gl: string | null): void;
    addBrandCountrySubBrand(kpi: string, brand: string, country: string, subBrand: string, gl: string | null): void;
    addPortfolioCountryBrand(kpi: string, portfolio: string, country: string, brand: string, gl: string | null): void;
    addPortfolioCountrySubBrand(kpi: string, portfolio: string, country: string, subBrand: string, gl: string | null): void;
    addBpsCountryBrand(kpi: string, bps: string, country: string, brand: string, gl: string | null): void;
    addGlobalBrandCountry(kpi: string, brand: string, country: string): void;
    addGlobalBrandCountrySubBrand(kpi: string, gl: string, brand: string, country: string, subBrand: string): void;
    getRelationsForKpi(kpi: string): Record<string, unknown>;
    getGlobalBrands(): Record<string, boolean>;
    private add;
}
export declare function addToPath(arr: BoolTree, path: string[], value: string): void;
