import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
declare class GlCompetitionsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private formatCompetition;
    private resolveDefault;
}
export declare const glCompetitionsHandler: GlCompetitionsPresetHandler;
export {};
