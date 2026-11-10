import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import type { KpiTuple } from "@domain/config/presets/kpis/kpis.types";
import type { InnovationHubWaterfallDimensionsPresetValue } from "@domain/config/presets/innovation-hub-waterfall-dimensions/innovation-hub-waterfall-dimensions.types";

const PRESET_KEY = "innovation-hub-waterfall-dimensions" as const;

const row = (
  value: string,
  label: string,
  opts?: { isDisabled?: boolean },
): KpiTuple => ({
  value,
  label,
  full: "",
  ...(opts?.isDisabled === true ? { isDisabled: true as const } : {}),
});

class InnovationHubWaterfallDimensionsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values: KpiTuple[] = [
      row("inno_stage", "Inno Stage"),
      row("portfolio", "Portfolio", { isDisabled: true }),
      row("market", "Market", { isDisabled: true }),
      row("liquid_type", "Liquid Type", { isDisabled: true }),
      row("inno_pillar", "Inno Pillar", { isDisabled: true }),
    ];

    const firstEnabled = values.find((v) => v.isDisabled !== true);
    const defaultTuple: InnovationHubWaterfallDimensionsPresetValue["default"] =
      firstEnabled ? { ...firstEnabled } : {};

    const out: InnovationHubWaterfallDimensionsPresetValue = {
      values,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, [PRESET_KEY]: out };
  }
}

export const innovationHubWaterfallDimensionsHandler =
  new InnovationHubWaterfallDimensionsPresetHandler();
