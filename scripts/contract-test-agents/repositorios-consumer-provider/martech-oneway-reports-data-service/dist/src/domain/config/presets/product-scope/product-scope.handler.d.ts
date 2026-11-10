import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface ProductScopeTuple {
    value: string;
    label: string;
    full: string;
}
export interface ProductScopePresetValue {
    enabled: boolean;
    default: ProductScopeTuple;
    values: ProductScopeTuple[];
}
export type ProductScopePresetConfig = Record<string, never>;
declare class ProductScopePresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const productScopeHandler: ProductScopePresetHandler;
export {};
