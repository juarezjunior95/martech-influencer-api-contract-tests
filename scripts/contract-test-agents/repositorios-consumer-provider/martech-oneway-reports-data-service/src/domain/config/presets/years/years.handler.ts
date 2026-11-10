import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import kpiGroupTimeFrame from "@domain/config/config-groups/kpi-group-time-frame.config";
import { kpiGroupHandler } from "@domain/config/presets/kpi-group/kpi-group.handler";
import {
  KPI_GROUP_DATASET_ID,
  KPI_GROUP_DATASET_QUERY,
} from "@domain/config/presets/kpi-group/kpi-group.types";

const FULL_YEAR_PREFIX = "FY'";
const FULL_YEAR_LABEL = "Full Year (FY)";

export interface YearTuple {
  value: string;
  label: string;
  full: string;
}

export interface YearPresetValue {
  enabled: boolean;
  default: YearTuple | Record<string, never>;
  values: YearTuple[];
}

export interface YearsPresetConfig {
  noDefault?: boolean;
  startYear?: number;
  endYear?: number;
}

function asYear(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const n = Number(value);
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return fallback;
}

class YearsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

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
    const yearsConfig = (preset.years ?? {}) as YearsPresetConfig;
    const { start, end } = this.resolveRange(yearsConfig, datasets);
    const values = this.buildYears(start, end);

    const noDefault = yearsConfig.noDefault === true;
    const defaultTuple: YearPresetValue["default"] =
      noDefault || values.length === 0 ? {} : { ...values[0] };

    const yearsValue: YearPresetValue = {
      values,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, years: yearsValue };
  }

  /**
   * Bounds from kpi-group rows `category_health_full_years_start` /
   * `category_health_full_years_end` (same keys as static config), with
   * optional `preset.years.startYear` / `endYear` overrides. Legacy Drupal
   * labels invert chronological sense; we normalize so `buildYears` always
   * receives chronological `start <= end`.
   */
  private resolveRange(
    config: YearsPresetConfig,
    datasets?: Dataset[],
  ): { start: number; end: number } {
    const c = kpiGroupTimeFrame.config;
    const queried = kpiGroupHandler.handle({}, datasets);

    const startYear =
      config.startYear !== undefined
        ? config.startYear
        : asYear(
            queried.category_health_full_years_start,
            c.category_health_full_years_start,
          );

    const endYear =
      config.endYear !== undefined
        ? config.endYear
        : asYear(
            queried.category_health_full_years_end,
            c.category_health_full_years_end,
          );

    return startYear <= endYear
      ? { start: startYear, end: endYear }
      : { start: endYear, end: startYear };
  }

  private buildYears(start: number, end: number): YearTuple[] {
    const years: YearTuple[] = [];
    for (let year = end; year >= start; year--) {
      const shortYear = String(year).slice(-2);
      years.push({
        value: String(year),
        label: `${FULL_YEAR_PREFIX}${shortYear}`,
        full: FULL_YEAR_LABEL,
      });
    }
    return years;
  }
}

export const yearsHandler = new YearsPresetHandler();
