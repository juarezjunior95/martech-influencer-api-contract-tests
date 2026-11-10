import { BadRequestException } from "@nestjs/common";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import {
  firstScopeBlock,
  getCommercialResultsWaterfallOptionsByKpi,
} from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.model";
import type {
  CommercialResultsWaterfallOptionsPresetConfig,
  CommercialResultsWaterfallOptionsPresetValue,
} from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.types";

const PRESET_KEY = "commercial-results-waterfall-options" as const;

class CommercialResultsWaterfallOptionsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const cfg = (preset[PRESET_KEY] ??
      {}) as CommercialResultsWaterfallOptionsPresetConfig;
    const kpi = this.normalizeKpi(cfg?.kpi);

    if (kpi.length === 0) {
      throw new BadRequestException('The parameter "kpi" is mandatory.');
    }

    const values = getCommercialResultsWaterfallOptionsByKpi(kpi);
    const head = firstScopeBlock(values);

    const defaultBlock: CommercialResultsWaterfallOptionsPresetValue["default"] =
      head
        ? {
            values: head.values.map((r) => ({ ...r })),
            default: { ...head.default },
          }
        : {};

    const waterfallValue: CommercialResultsWaterfallOptionsPresetValue = {
      values,
      default: defaultBlock,
      enabled: true,
    };

    return { ...preset, [PRESET_KEY]: waterfallValue };
  }

  private normalizeKpi(raw: unknown): string {
    if (typeof raw !== "string") {
      return "";
    }
    return raw.trim().toLowerCase();
  }
}

export const commercialResultsWaterfallOptionsHandler =
  new CommercialResultsWaterfallOptionsPresetHandler();
