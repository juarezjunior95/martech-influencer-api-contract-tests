import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  collectShowGlobalDataDatasetConfigs,
  hasGlobalDataForSubject,
} from "@domain/config/presets/show-global-data/show-global-data.datasets";
import {
  SHOW_GLOBAL_DATA_SUBJECTS,
  ShowGlobalDataKpiEntry,
  ShowGlobalDataPresetValue,
} from "@domain/config/presets/show-global-data/show-global-data.types";

const PRESET_KEY = "show_global_data" as const;

class ShowGlobalDataPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Two Databricks calls: fixed `subject` `pos` and `power` (no query filters).
   */
  datasets(): DatasetConfig[] {
    return collectShowGlobalDataDatasetConfigs(SHOW_GLOBAL_DATA_SUBJECTS);
  }

  handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse {
    const values: ShowGlobalDataKpiEntry[] = SHOW_GLOBAL_DATA_SUBJECTS.map(
      (kpi) => ({
        kpi,
        hasGlobalData: hasGlobalDataForSubject(datasets, kpi),
      }),
    );

    const value: ShowGlobalDataPresetValue = {
      values,
    };

    return { ...preset, [PRESET_KEY]: value };
  }
}

export const showGlobalDataHandler = new ShowGlobalDataPresetHandler();
