import { PresetConfig } from "@domain/entities/preset.entity";
import { incomeGroupsFilterHandler } from "@domain/config/presets/cohorts/demographics-filter.handler";

/**
 * `income-groups` preset — static income-tier filter options.
 * Tuple source: `cohorts/demographic-options.model.ts` (shared with cohorts).
 *
 * Endpoint: `GET /v1/presets/income-groups`.
 */
const incomeGroupsPreset: { "income-groups": Record<string, never> } = {
  "income-groups": {},
};

const config: PresetConfig<typeof incomeGroupsPreset> = {
  version: "1.0.0",
  handler: incomeGroupsFilterHandler,
  preset: incomeGroupsPreset,
};

export default config;
