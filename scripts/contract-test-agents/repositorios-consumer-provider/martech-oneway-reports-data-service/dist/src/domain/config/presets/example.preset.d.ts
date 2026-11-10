import { PresetConfig } from "@domain/entities/preset.entity";
declare const examplePreset: {
    examples: {
        name: string;
        version: string;
        health: string;
    }[];
};
declare const config: PresetConfig<typeof examplePreset>;
export default config;
