import { BadRequestException } from "@nestjs/common";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import {
  firstScopeBlock,
  getPerformanceToolWaterfallOptionsByKpi,
} from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.model";
import type {
  PerformanceToolWaterfallOptionsPresetConfig,
  PerformanceToolWaterfallOptionsPresetValue,
} from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.types";

const PRESET_KEY = "performance-tool-waterfall-options" as const;

class PerformanceToolWaterfallOptionsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const cfg = (preset[PRESET_KEY] ??
      {}) as PerformanceToolWaterfallOptionsPresetConfig;
    const kpi = this.normalizeKpi(cfg?.kpi);

    if (kpi.length === 0) {
      throw new BadRequestException('The parameter "kpi" is mandatory.');
    }

    const values = getPerformanceToolWaterfallOptionsByKpi(kpi);
    const head = firstScopeBlock(values);

    const defaultBlock: PerformanceToolWaterfallOptionsPresetValue["default"] =
      head
        ? {
            values: head.values.map((r) => ({ ...r })),
            default: { ...head.default },
          }
        : {};

    const waterfallValue: PerformanceToolWaterfallOptionsPresetValue = {
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

export const performanceToolWaterfallOptionsHandler =
  new PerformanceToolWaterfallOptionsPresetHandler();
