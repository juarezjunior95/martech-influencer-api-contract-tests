import {
  Dataset,
  DatasetConfig,
  DataItem,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
  PresetValue,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { KpiGroupTimeFrameConfig } from "@domain/config/config-groups/kpi-group-time-frame.config";
import {
  KPI_GROUP_DATASET_ID,
  KPI_GROUP_DATASET_QUERY,
  KPI_GROUP_NUMERIC_KEYS,
  KpiGroupPresetValue,
  KpiGroupResponseMap,
  isKpiGroupFilterItem,
} from "@domain/config/presets/kpi-group/kpi-group.types";

class KpiGroupHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Declare the kpi-group Databricks dataset. `PresetEntity` merges
   * this into `config.datasets` (idempotent by id) so authors never
   * wire SQL by hand for the kpi-group preset.
   */
  datasets(): DatasetConfig[] {
    return [
      {
        id: KPI_GROUP_DATASET_ID,
        config: createDeltalakeFetchDataConfig({
          query: KPI_GROUP_DATASET_QUERY,
        }),
      },
    ];
  }

  handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse {
    const rows = this.extractRows(datasets);
    const queried = this.buildMap(rows);

    const result: PresetResponse = {};

    for (const [key, value] of Object.entries(preset)) {
      if (isKpiGroupFilterItem(value)) {
        continue;
      }
      result[key] = value;
    }

    for (const [key, value] of Object.entries(queried)) {
      result[key] = value as PresetValue;
    }

    return result;
  }

  private extractRows(datasets?: Dataset[]): DataItem[] {
    const dataset = datasets?.find((d) => d.id === KPI_GROUP_DATASET_ID);
    return dataset?.data ?? [];
  }

  /**
   * Collapse `{ kpi_name, time_frame }` rows into a flat
   * `kpi_name -> time_frame` map that matches `KpiGroupTimeFrameConfig`.
   *
   * Keys listed in `KPI_GROUP_NUMERIC_KEYS` are coerced back to `number`
   * (e.g. `category_health_full_years_*`). Every other value is passed
   * through verbatim — the SQL is the source of truth for string shapes.
   */
  private buildMap(rows: DataItem[]): KpiGroupResponseMap {
    const out: KpiGroupResponseMap = {};

    for (const raw of rows) {
      const name = this.pick(raw, ["kpi_name", "KPI_NAME"]);
      const value = this.pick(raw, ["time_frame", "TIME_FRAME"]);

      if (!name || !value) {
        continue;
      }

      out[name] = this.toConfigValue(name, value);
    }

    return out;
  }

  private toConfigValue(name: string, value: string): KpiGroupPresetValue {
    if (KPI_GROUP_NUMERIC_KEYS.has(name as keyof KpiGroupTimeFrameConfig)) {
      const n = Number(value);
      return Number.isFinite(n) ? n : value;
    }

    return value;
  }

  private pick(row: DataItem, keys: string[]): string {
    for (const key of keys) {
      const v = row[key];
      if (typeof v === "string" && v.length > 0) {
        return v;
      }
    }
    return "";
  }
}

export const kpiGroupHandler = new KpiGroupHandler();
