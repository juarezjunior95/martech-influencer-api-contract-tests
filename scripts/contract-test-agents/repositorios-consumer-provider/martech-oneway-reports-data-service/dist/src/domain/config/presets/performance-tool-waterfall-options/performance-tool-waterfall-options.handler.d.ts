import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
declare class PerformanceToolWaterfallOptionsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private normalizeKpi;
}
export declare const performanceToolWaterfallOptionsHandler: PerformanceToolWaterfallOptionsPresetHandler;
export {};
