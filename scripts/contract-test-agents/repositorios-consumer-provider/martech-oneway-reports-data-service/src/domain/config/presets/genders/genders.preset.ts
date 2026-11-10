import { PresetConfig } from "@domain/entities/preset.entity";
import { genderFilterHandler } from "@domain/config/presets/cohorts/demographics-filter.handler";

/**
 * `gender` preset — static gender filter options.
 * Tuple source: `cohorts/demographic-options.model.ts` (shared with cohorts).
 *
 * Endpoint: `GET /v1/presets/gender`.
 */
const gendersPreset: { genders: Record<string, never> } = {
  genders: {},
};

const config: PresetConfig<typeof gendersPreset> = {
  version: "1.0.0",
  handler: genderFilterHandler,
  preset: gendersPreset,
};

export default config;
