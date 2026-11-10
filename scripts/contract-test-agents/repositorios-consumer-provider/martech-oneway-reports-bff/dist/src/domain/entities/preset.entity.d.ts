import { CacheConfig } from "./view.entity";
export interface PresetConfig {
    version: string;
    cache?: CacheConfig;
    preset: string | string[] | Record<string, PresetRefConfig>;
    formatter?: string;
}
export interface PresetRefConfig {
    filters?: FixedPresetFilter[];
    formatter?: string;
}
export type FixedPresetFilter = Omit<PresetFilter, "namespace">;
export interface PresetFilter {
    namespace?: string;
    name: string;
    value: string | number | boolean;
}
export interface PresetProps {
    name: string;
    config: PresetConfig;
    filters?: PresetFilter[];
}
export type PresetData = Record<string, unknown>;
export interface ProcessedPresetResult {
    name: string;
    data: PresetData;
}
export declare class Preset {
    private readonly name;
    private readonly config;
    private readonly filters;
    private constructor();
    static create(props: PresetProps): Preset;
    getName(): string;
    getPresetRefs(): string[];
    getFiltersFor(ref: string): PresetFilter[];
    getFormatter(): string | undefined;
    getRefFormatter(ref: string): string | undefined;
    getFilters(): PresetFilter[];
    getSortedFilters(): PresetFilter[];
    getCacheConfig(): CacheConfig;
    private validateConfig;
}
