import { PresetConfig } from "@domain/entities/preset.entity";
import { ageGroupsFilterHandler } from "@domain/config/presets/cohorts/demographics-filter.handler";

/**
 * `age-groups` preset — static age-band filter options.
 * Tuple source: `cohorts/demographic-options.model.ts` (shared with cohorts).
 *
 * Endpoint: `GET /v1/presets/age-groups`.
 */
const ageGroupsPreset: { "age-groups": Record<string, never> } = {
  "age-groups": {},
};

const config: PresetConfig<typeof ageGroupsPreset> = {
  version: "1.0.0",
  handler: ageGroupsFilterHandler,
  preset: ageGroupsPreset,
};

export default config;
