import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { getPosToolOverviewPeriods } from "@domain/config/presets/category/pos-tool/pos-tool-timeframe.model";
import { timeFrameHandler } from "@domain/config/presets/time-frame/time-frame.handler";

class PosToolOverviewPeriodsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(): DatasetConfig[] {
    return timeFrameHandler.datasets?.() ?? [];
  }

  handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse {
    const posToolOverviewPeriods = getPosToolOverviewPeriods(datasets);

    return {
      ...preset,
      "pos-tool-overview-periods": posToolOverviewPeriods,
    };
  }
}

export const posToolOverviewPeriodsHandler =
  new PosToolOverviewPeriodsPresetHandler();
