import { PresetConfig } from "@domain/entities/preset.entity";
import { cohortsHandler } from "./cohorts.handler";

/**
 * `cohorts` preset — grouped demographic dimensions.
 * Tuple registries live in `demographic-options.model.ts`; the gender,
 * age-groups, and income-groups presets reuse that module. Cohort groups
 * omit the aggregate `All` row in their nested `values`.
 *
 * Endpoint: `GET /v1/presets/cohorts`.
 */
const cohortsPreset: { cohorts: Record<string, never> } = {
  cohorts: {},
};

const config: PresetConfig<typeof cohortsPreset> = {
  version: "1.0.0",
  handler: cohortsHandler,
  preset: cohortsPreset,
};

export default config;
