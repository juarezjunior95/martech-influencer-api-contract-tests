import { PresetConfig } from "@domain/entities/preset.entity";
import {
  distributionsHandler,
  DistributionsPresetConfig,
} from "@domain/config/presets/distributions/distributions.handler";

/**
 * `distributions` preset — exposes the supported distribution codes
 * as a flat selectable list.
 *
 * Endpoint: `GET /v1/presets/distributions`.
 *
 * The handler builds the payload entirely from the static
 * distribution registry; no Databricks dataset is declared and no
 * preset/query levers are consumed.
 */
const distributionsPreset: { distributions: DistributionsPresetConfig } = {
  distributions: {},
};

const config: PresetConfig<typeof distributionsPreset> = {
  version: "1.0.0",
  handler: distributionsHandler,
  preset: distributionsPreset,
};

export default config;
