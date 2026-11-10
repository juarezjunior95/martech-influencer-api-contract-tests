import { BadRequestException } from "@nestjs/common";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import {
  firstInnovationHubScopeBlock,
  getInnovationHubWaterfallOptionsByKpi,
} from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.model";
import type {
  InnovationHubWaterfallOptionsPresetConfig,
  InnovationHubWaterfallOptionsPresetValue,
} from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.types";

const PRESET_KEY = "innovation-hub-waterfall-options" as const;

class InnovationHubWaterfallOptionsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const cfg = (preset[PRESET_KEY] ??
      {}) as InnovationHubWaterfallOptionsPresetConfig;
    const kpi = this.normalizeKpi(cfg?.kpi);

    if (kpi.length === 0) {
      throw new BadRequestException('The parameter "kpi" is mandatory.');
    }

    const values = getInnovationHubWaterfallOptionsByKpi(kpi);
    const head = firstInnovationHubScopeBlock(values);

    const defaultBlock: InnovationHubWaterfallOptionsPresetValue["default"] =
      head
        ? {
            values: head.values.map((r) => ({ ...r })),
            default: { ...head.default },
          }
        : {};

    const waterfallValue: InnovationHubWaterfallOptionsPresetValue = {
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

export const innovationHubWaterfallOptionsHandler =
  new InnovationHubWaterfallOptionsPresetHandler();
