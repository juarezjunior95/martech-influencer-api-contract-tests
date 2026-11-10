import { PresetRefConfig } from "@domain/entities/preset.entity";

/**
 * JSONata formatter applied to the `time-frame` Data-Service payload — same path as
 * the standalone `time-frame.preset.ts` config so standalone and composite presets stay aligned.
 */
export const TIME_FRAME_FORMATTER = "presets/filter-name-normalization";

/**
 * Data-Service preset ref name for the `time-frame` preset (must match
 * `GET /v1/presets/:ref` and the object-form key in `PresetConfig.preset`).
 */
export const TIME_FRAME_PRESET_REF = "time-frame" as const;

/**
 * Builder for the `time-frame` preset ref.
 *
 * Returns `{ "time-frame": PresetRefConfig }` so composite presets can spread
 * it alongside {@link buildZoneCountryFilters} without duplicating wiring.
 * The composite ref sets `formatter: TIME_FRAME_FORMATTER` so
 * {@link ProcessPresetUseCase} runs the same JSONata as the standalone
 * preset on the `{ "time-frame": branch }` slice only.
 *
 * The time-frame preset takes no baked scope — filters are empty; callers may
 * still override via the request query string.
 */
export function buildTimeFrameFilters(): Record<
  typeof TIME_FRAME_PRESET_REF,
  PresetRefConfig
> {
  return {
    [TIME_FRAME_PRESET_REF]: {
      filters: [],
      formatter: TIME_FRAME_FORMATTER,
    },
  };
}
