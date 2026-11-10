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

export interface PcTimeFrameYearsTuple {
  value: string;
  label: string;
  full: string;
}

export interface PcTimeFrameYearsPresetValue {
  values: PcTimeFrameYearsTuple[];
  default: PcTimeFrameYearsTuple | Record<string, never>;
  enabled: boolean;
}

/**
 * Optional preset override. When set (DD-MM-YYYY), used instead of the
 * kpi-group query / static fallback (e.g. tests).
 */
export interface PcTimeFrameYearsPresetConfig {
  volumeRefreshDate?: string;
}

class PcTimeFrameYearsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Same dependency as `performance-tool`: load `kpi-group.sql` so
   * `handle()` can read the `volume` row's `time_frame`.
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
    const cfg = preset["pc-time-frame-years"] as
      | PcTimeFrameYearsPresetConfig
      | undefined;

    const override = cfg?.volumeRefreshDate;
    let volume =
      typeof override === "string" && override.length > 0 ? override : "";

    if (!volume) {
      const queried = kpiGroupHandler.handle({}, datasets);
      const fromQuery =
        typeof queried.volume === "string" && queried.volume.length > 0
          ? queried.volume
          : "";
      volume = fromQuery || kpiGroupTimeFrame.config.volume;
    }

    if (typeof volume !== "string" || volume.length === 0) {
      throw new Error(
        "pc-time-frame-years requires a non-empty volume refresh date (kpi_group row `volume` / `time_frame`, optional preset override, or kpi_group_time_frame.config.volume as DD-MM-YYYY)",
      );
    }

    return {
      ...preset,
      "pc-time-frame-years": this.buildFromVolumeRefreshDate(volume),
    };
  }

  private buildFromVolumeRefreshDate(
    volumeRefreshDate: string,
  ): PcTimeFrameYearsPresetValue {
    const { ytdYear, month } = parseVolumeDate(volumeRefreshDate);

    const hasClosedQuarterInCurrentYear = month >= 3;
    const starterYear = hasClosedQuarterInCurrentYear ? ytdYear : ytdYear - 1;

    const values: PcTimeFrameYearsTuple[] = [
      buildYearTuple(starterYear),
      buildYearTuple(starterYear - 1),
    ];

    return {
      values,
      default: { ...values[0] },
      enabled: true,
    };
  }
}

function buildYearTuple(year: number): PcTimeFrameYearsTuple {
  const yearString = String(year);
  return {
    value: yearString,
    label: yearString,
    full: "",
  };
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

export const pcTimeFrameYearsHandler = new PcTimeFrameYearsPresetHandler();
