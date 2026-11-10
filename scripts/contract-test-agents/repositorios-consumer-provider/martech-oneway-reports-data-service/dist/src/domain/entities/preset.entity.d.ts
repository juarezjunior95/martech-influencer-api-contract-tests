import { BaseConfig, BaseConfigEntity, DatasetConfig, Filter } from "@domain/entities/common/base-config.entity";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
export interface PresetItemOption {
    value: string;
    label?: string;
    icon?: string;
    group?: string;
    metadata?: Record<string, unknown>;
}
export interface PresetItem {
    label: string;
    shortLabel?: string;
    defaultValue?: string;
    options?: PresetItemOption[];
}
export interface CountryFilterItem {
    label: string;
    countries: string[];
    shortLabel?: string;
    defaultValue?: string;
}
export type PresetValue = PresetItem | CountryFilterItem | object | string | number | boolean;
export interface PresetDefinition {
    [key: string]: PresetValue;
}
export interface PresetConfig<TPreset extends PresetDefinition = PresetDefinition> extends BaseConfig {
    preset?: TPreset;
    handler?: IPresetHandler<PresetResponse>;
}
export interface PresetResponse {
    [key: string]: PresetValue;
}
export declare function ensureDataset(config: {
    datasets?: DatasetConfig[];
}, datasetConfig: DatasetConfig): void;
export declare function mergeHandlerFilters(requestFilters: Filter[], handlerFilters: Filter[]): Filter[];
export declare function trimByCountryAccess<T>(map: Record<string, T>, user: UserEntity, options?: {
    keepKeys?: string[];
}): Record<string, T>;
export declare class PresetEntity extends BaseConfigEntity<PresetConfig, PresetResponse> {
    constructor(datasetRepositoryFactory: DatasetRepositoryFactory, presetConfig: PresetConfig, name: string);
    fetch(filters: Filter[], user?: UserEntity): Promise<PresetResponse>;
}
