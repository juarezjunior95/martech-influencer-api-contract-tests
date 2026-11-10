import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface PortfolioTuple {
    value: string;
    label: string;
    full: string;
}
export interface PortfolioPresetValue {
    enabled: boolean;
    default: PortfolioTuple | Record<string, never>;
    values: PortfolioTuple[];
}
export interface PortfolioPresetConfig {
    includeAll?: boolean;
    ignoreNab?: boolean;
    noDefault?: boolean;
}
declare class PortfolioPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private buildValues;
    private toBool;
}
export declare const portfolioHandler: PortfolioPresetHandler;
export {};
