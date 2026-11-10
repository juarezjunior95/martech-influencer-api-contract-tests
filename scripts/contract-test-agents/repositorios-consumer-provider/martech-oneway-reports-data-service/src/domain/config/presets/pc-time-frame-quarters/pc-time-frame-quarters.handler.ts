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

export interface PcTimeFrameTuple {
  value: string;
  label: string;
  full: string;
}

export interface PcTimeFramePresetValue {
  values: PcTimeFrameTuple[];
  default: PcTimeFrameTuple | Record<string, never>;
  enabled: boolean;
}

/**
 * Optional preset override (DD-MM-YYYY). When omitted, uses kpi-group
 * `volume` / `time_frame`, then static `kpi_group_time_frame.config.volume`.
 */
export interface PcTimeFramePresetConfig {
  volumeRefreshDate?: string;
}

class PcTimeFramePresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Load `kpi-group.sql` so `handle()` can read the `volume` row's
   * `time_frame` (same pattern as `pc-time-frame-years`).
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
    const cfg = preset["pc-time-frame-quarters"] as
      | PcTimeFramePresetConfig
      | undefined;

    const volume = this.resolveVolumeRefreshDate(cfg, datasets);
    if (!isNonEmptyString(volume)) {
      throw new Error(
        "pc-time-frame-quarters requires a non-empty volume refresh date (kpi_group row `volume` / `time_frame`, optional preset override, or kpi_group_time_frame.config.volume as DD-MM-YYYY)",
      );
    }

    return {
      ...preset,
      "pc-time-frame-quarters": this.buildFromVolumeRefreshDate(volume),
    };
  }

  /**
   * Preset override → kpi-group `volume` row → static config fallback.
   */
  private resolveVolumeRefreshDate(
    cfg: PcTimeFramePresetConfig | undefined,
    datasets?: Dataset[],
  ): string {
    const override = cfg?.volumeRefreshDate;
    if (isNonEmptyString(override)) {
      return override;
    }

    const queried = kpiGroupHandler.handle({}, datasets);
    if (isNonEmptyString(queried.volume)) {
      return queried.volume;
    }

    return kpiGroupTimeFrame.config.volume;
  }

  private buildFromVolumeRefreshDate(
    volumeRefreshDate: string,
  ): PcTimeFramePresetValue {
    const { ytdYear, month } = parseVolumeDate(volumeRefreshDate);
    const ytdQuarter = monthToQuarter(month);

    const hasClosedQuarterInCurrentYear = month >= 3;
    const starterYear = hasClosedQuarterInCurrentYear ? ytdYear : ytdYear - 1;
    const starterTopQuarter = hasClosedQuarterInCurrentYear ? ytdQuarter : 4;

    const values: PcTimeFrameTuple[] = [
      ...buildYearQuarters(starterYear, starterTopQuarter),
      ...buildYearQuarters(starterYear - 1, 4),
    ];

    return {
      values,
      default: values.length > 0 ? { ...values[0] } : {},
      enabled: true,
    };
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/**
 * Mirrors `ParticipationCohortTimeFrameQuarters::getYearQuarters` —
 * lists `[Q1..topQuarter]` then `array_reverse`s, which is the same
 * as iterating `topQuarter..Q1` in descending order.
 */
function buildYearQuarters(
  year: number,
  topQuarter: number,
): PcTimeFrameTuple[] {
  const tuples: PcTimeFrameTuple[] = [];
  for (let quarter = topQuarter; quarter >= 1; quarter--) {
    tuples.push({
      value: `${year}_Q${quarter}`,
      label: `${year} - Q${quarter}`,
      full: "",
    });
  }
  return tuples;
}

/**
 * Maps a calendar month (1-12) to its quarter index (1-4), matching
 * the PHP `ceil(month / 3)` expression.
 */
function monthToQuarter(month: number): number {
  return Math.max(1, Math.floor(month / 3));
}

/**
 * Parses `DD-MM-YYYY` and ensures the triple is a real calendar day (UTC).
 * Rejects wrong segment count, non-numeric parts, and impossible dates (e.g. 31-02).
 */
function parseVolumeDate(raw: string): {
  ytdYear: number;
  month: number;
} {
  const parts = raw.split("-");
  if (parts.length !== 3) {
    throw new Error(`Expected DD-MM-YYYY volume date, got: ${raw}`);
  }
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const ytdYear = Number(parts[2]);
  if (![day, month, ytdYear].every(Number.isFinite)) {
    throw new Error(`Invalid volume date: ${raw}`);
  }

  const utcMs = Date.UTC(ytdYear, month - 1, day);
  const cal = new Date(utcMs);
  if (
    cal.getUTCFullYear() !== ytdYear ||
    cal.getUTCMonth() !== month - 1 ||
    cal.getUTCDate() !== day
  ) {
    throw new Error(`Invalid volume date: ${raw}`);
  }

  return { ytdYear, month };
}

export const pcTimeFrameHandler = new PcTimeFramePresetHandler();
