import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * Single distribution row emitted in `values` and `default`.
 *
 * `value` is the canonical short code; `label` is the user-facing
 * string; `full` is reserved for a longer description and may be
 * empty.
 */
export interface DistributionTuple {
  value: string;
  label: string;
  full: string;
}

export interface DistributionPresetValue {
  enabled: boolean;
  default: DistributionTuple | Record<string, never>;
  values: DistributionTuple[];
}

/**
 * Author-facing config for the `distributions` preset.
 *
 * The handler emits a fixed payload — there are no scope, default or
 * permission levers. The interface is kept so the preset file can
 * remain typed and future toggles can be added without breaking
 * callers.
 */
export type DistributionsPresetConfig = Record<string, never>;

/**
 * Canonical, fixed distribution registry. Order here is the
 * emission order in the response and the first entry is the
 * implicit default.
 */
const ALL_DISTRIBUTIONS: DistributionTuple[] = [
  { value: "total", label: "Total", full: "" },
  { value: "megabrand", label: "Megabrands", full: "" },
];

/**
 * Distributions preset handler.
 *
 * Emits a fully static payload — no Databricks dataset is declared
 * and no preset/query lever is consumed. The first row of
 * {@link ALL_DISTRIBUTIONS} is always returned as the default.
 */
class DistributionsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values = ALL_DISTRIBUTIONS.map((tuple) => ({ ...tuple }));

    const distributionsValue: DistributionPresetValue = {
      values,
      default: { ...values[0] },
      enabled: true,
    };

    return { ...preset, distributions: distributionsValue };
  }
}

export const distributionsHandler = new DistributionsPresetHandler();
