import { PresetConfig } from "@domain/entities/preset.entity";
import {
  imageryQuestionsHandler,
  ImageryPresetConfig,
} from "@domain/config/presets/imagery-questions/imagery-questions.handler";

const imageryQuestionsPreset: { imagery_questions: ImageryPresetConfig } = {
  imagery_questions: {},
};

const config: PresetConfig<typeof imageryQuestionsPreset> = {
  version: "1.0.0",
  filters: [
    { name: "country", required: true },
    { name: "subbrand", required: true },
    { name: "dt_end", required: true },
  ],
  handler: imageryQuestionsHandler,
  preset: imageryQuestionsPreset,
};

export default config;
