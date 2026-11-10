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

/** Mirrors `TimeFrame::getInitialAndEndPeriod` + default block in Drupal `TimeFrame.php` for volume mode. */
const MIN_PRIOR_YTD_YEAR = 2023;

export interface TimeFrameBounds {
  ini: string;
  end: string;
}

export interface TimeFramePresetValue {
  values: TimeFrameBounds;
  default: TimeFrameBounds;
  enabled: boolean;
}

/**
 * Optional override (DD-MM-YYYY). When omitted, uses kpi-group `volume` /
 * `time_frame`, then static `kpi_group_time_frame.config.volume`.
 */
export interface TimeFramePresetConfig {
  volumeRefreshDate?: string;
}

class TimeFramePresetHandler implements IPresetHandler<PresetResponse> {
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
    const cfg = preset["time-frame"] as TimeFramePresetConfig | undefined;

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
        "time-frame requires a non-empty volume refresh date (kpi_group row `volume` / `time_frame`, optional preset override, or kpi_group_time_frame.config.volume as DD-MM-YYYY)",
      );
    }

    return {
      ...preset,
      "time-frame": this.buildFromVolumeRefreshDate(volume),
    };
  }

  private buildFromVolumeRefreshDate(
    volumeRefreshDate: string,
  ): TimeFramePresetValue {
    const { ytdYear, monthPadded } = parseVolumeDate(volumeRefreshDate);

    const minYtd = Math.max(ytdYear - 1, MIN_PRIOR_YTD_YEAR);

    const values: TimeFrameBounds = {
      ini: dateToYMDFormat(minYtd, "01"),
      end: dateToYMDFormat(ytdYear, monthPadded),
    };

    const defaultBounds: TimeFrameBounds = {
      ini: dateToYMDFormat(ytdYear, "01"),
      end: dateToYMDFormat(ytdYear, monthPadded),
    };

    return {
      values,
      default: defaultBounds,
      enabled: true,
    };
  }
}

/**
 * Parses `DD-MM-YYYY` and ensures the triple is a real calendar day (UTC).
 * Rejects wrong segment count, non-numeric parts, and impossible dates (e.g. 31-02).
 */
function parseVolumeDate(raw: string): {
  ytdYear: number;
  monthPadded: string;
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

  return {
    ytdYear,
    monthPadded: String(month).padStart(2, "0"),
  };
}

function dateToYMDFormat(year: number, month: string): string {
  const mm = month.padStart(2, "0");
  return `${year}-${mm}-01`;
}

export const timeFrameHandler = new TimeFramePresetHandler();
