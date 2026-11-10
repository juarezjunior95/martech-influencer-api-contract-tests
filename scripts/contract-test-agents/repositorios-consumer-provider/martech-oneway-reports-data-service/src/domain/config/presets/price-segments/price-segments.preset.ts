import { PresetConfig } from "@domain/entities/preset.entity";
import { priceSegmentsHandler } from "@domain/config/presets/price-segments/price-segments.handler";

/**
 * `price-segments` preset — Price Segment options (`Core Co`,
 * `Premium Co`) emitted as a single `Ungrouped` opt-group block.
 * Default is empty by design.
 *
 * Endpoint: `GET /v1/presets/price-segments`.
 *
 * The handler builds the payload from a static registry; no Databricks
 * dataset is declared.
 */
const priceSegmentsPreset: { "price-segments": Record<string, never> } = {
  "price-segments": {},
};

const config: PresetConfig<typeof priceSegmentsPreset> = {
  version: "1.0.0",
  handler: priceSegmentsHandler,
  preset: priceSegmentsPreset,
};

export default config;
