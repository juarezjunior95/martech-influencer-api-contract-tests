import { PresetConfig } from "@domain/entities/preset.entity";
import {
  segmentsHandler,
  SegmentsPresetConfig,
} from "@domain/config/presets/segments/segments.handler";

/**
 * `segments` preset — exposes the supported segment codes as a flat
 * selectable list keyed by scope.
 *
 * Endpoint: `GET /v1/presets/segments`.
 *
 * The handler builds the payload entirely from the static segment
 * registries; no Databricks dataset is declared. Page-level overrides
 * are wired through the entity's generic `?ns[name]=value` pipeline:
 *
 *   - `?segments[scope]=category_health`    emit category-health rows.
 *   - `?segments[scope]=brand_power_book`   emit brand-power-book rows.
 *   - `?segments[scope]=audience_targeting` emit audience-targeting rows.
 *   - `?segments[noDefault]=true`           collapse `default` to `{}`.
 *   - `?segments[includeAll]=true`          prepend the synthetic `All`.
 *
 * Page-level fixed filters (BFF object form) work the same way.
 */
const segmentsPreset: { segments: SegmentsPresetConfig } = {
  segments: {},
};

const config: PresetConfig<typeof segmentsPreset> = {
  version: "1.0.0",
  handler: segmentsHandler,
  preset: segmentsPreset,
};

export default config;
