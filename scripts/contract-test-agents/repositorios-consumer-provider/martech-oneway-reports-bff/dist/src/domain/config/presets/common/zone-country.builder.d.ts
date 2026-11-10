import { PresetRefConfig } from "../../../entities/preset.entity";
export type HideGlobalForKpi = "pos" | "power";
export interface BuildZoneCountryFiltersOptions {
    scope: ZoneCountryScope;
    page?: string;
    hideGlobalForKpi?: HideGlobalForKpi;
}
export interface ZoneCountryScope {
    countries?: readonly string[];
}
export declare function buildZoneCountryFilters({ scope, page, hideGlobalForKpi, }: BuildZoneCountryFiltersOptions): {
    zones: PresetRefConfig;
    country: PresetRefConfig;
};
export declare class UnknownCountryError extends Error {
    constructor(unknown: string[]);
}
