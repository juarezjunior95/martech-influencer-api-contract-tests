import { PresetConfig } from "@domain/entities/preset.entity";
import { glCompetitionsHandler } from "@domain/config/presets/gl-competitions/gl-competitions.handler";
import type { GlCompetitionsPresetConfig } from "@domain/config/presets/gl-competitions/gl-competitions.types";

/**
 * `gl-competitions` preset — exposes the GL competition catalog
 * (Premier League, Super League, Megabrands / KA / BEES / DTC
 * Dashboards) as a flat list with optional cup `divisions` and a
 * cup-level `default` division.
 *
 * Endpoint: `GET /v1/presets/gl-competitions`.
 *
 * The handler builds the payload from a static registry; no Databricks
 * dataset is declared. Page-level overrides:
 *
 *   - `?gl-competitions[type]=league` — only league competitions.
 *   - `?gl-competitions[type]=cup`    — only cup competitions.
 *
 * Any other `type` value is rejected as a bad request.
 */
const glCompetitionsPreset: { "gl-competitions": GlCompetitionsPresetConfig } =
  {
    "gl-competitions": {},
  };

const config: PresetConfig<typeof glCompetitionsPreset> = {
  version: "1.0.0",
  handler: glCompetitionsHandler,
  preset: glCompetitionsPreset,
};

export default config;
