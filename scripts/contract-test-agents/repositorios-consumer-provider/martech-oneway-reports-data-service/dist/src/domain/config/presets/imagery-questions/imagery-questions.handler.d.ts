import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
export declare const IMAGERY_DATASET_ID = "imagery";
export declare const IMAGERY_DATASET_FUNCTION_NAME = "3_portfolio_brand_brand-power-drivers_imageries_imagery-attributes";
export interface ImageryTuple {
    value: string;
    label: string;
}
export interface ImageryPresetValue {
    values: ImageryTuple[];
    default: ImageryTuple | Record<string, never>;
    enabled: boolean;
}
export type ImageryPresetConfig = Record<string, never>;
declare class ImageryPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
    private extractTuples;
}
export declare const imageryQuestionsHandler: ImageryPresetHandler;
export {};
