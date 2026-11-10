import { PresetConfig } from "@domain/entities/preset.entity";
import { ImageryPresetConfig } from "@domain/config/presets/imagery-questions/imagery-questions.handler";
declare const imageryQuestionsPreset: {
    imagery_questions: ImageryPresetConfig;
};
declare const config: PresetConfig<typeof imageryQuestionsPreset>;
export default config;
