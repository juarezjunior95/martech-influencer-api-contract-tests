import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/** One selectable Price Segment row (`value` / `label`). */
export interface PriceSegmentTuple {
  value: string;
  label: string;
}

/** One opt-group block (`group` + `values`). */
export interface PriceSegmentsGroupBlock {
  group: string;
  values: PriceSegmentTuple[];
}

export interface PriceSegmentsPresetValue {
  enabled: boolean;
  default: Record<string, never>;
  values: PriceSegmentsGroupBlock[];
}

/** Canonical Price Segment options, in display order. */
const PRICE_SEGMENTS: PriceSegmentTuple[] = [
  { value: "core_co", label: "Core Co" },
  { value: "premium_co", label: "Premium Co" },
];

const UNGROUPED_LABEL = "Ungrouped";

class PriceSegmentsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const groups: PriceSegmentsGroupBlock[] = [
      {
        group: UNGROUPED_LABEL,
        values: PRICE_SEGMENTS.map((row) => ({ ...row })),
      },
    ];

    const priceSegmentsValue: PriceSegmentsPresetValue = {
      values: groups,
      default: {},
      enabled: true,
    };

    return { ...preset, "price-segments": priceSegmentsValue };
  }
}

export const priceSegmentsHandler = new PriceSegmentsPresetHandler();
