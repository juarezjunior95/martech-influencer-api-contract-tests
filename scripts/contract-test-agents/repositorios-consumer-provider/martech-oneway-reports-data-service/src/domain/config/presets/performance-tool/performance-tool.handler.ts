import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
import {
  createDeltalakeFetchDataConfig,
  createDeltalakeProcedureFetchDataConfig,
} from "@domain/factories/dataset-repository.factory";
import kpiGroupTimeFrame, {
  KpiGroupTimeFrameConfig,
} from "@domain/config/config-groups/kpi-group-time-frame.config";
import { kpiGroupHandler } from "@domain/config/presets/kpi-group/kpi-group.handler";
import {
  KPI_GROUP_DATASET_ID,
  KPI_GROUP_DATASET_QUERY,
} from "@domain/config/presets/kpi-group/kpi-group.types";
import { buildPerformanceToolMockData } from "@domain/config/presets/performance-tool/performance-tool.mock-data";
import { buildPerformanceToolFilterPayload } from "@domain/config/presets/performance-tool/performance-tool.filter-builder";
import { KPIS_ENABLED } from "@domain/config/presets/performance-tool/performance-tool.constants";
import { buildPerformanceToolUserPermissions } from "@domain/config/presets/performance-tool/performance-tool.user-permissions";
import type { PerformanceToolFilterRawRow } from "@domain/config/presets/performance-tool/performance-tool.types";
import {
  PERFORMANCE_TOOL_DATASET_ID,
  PERFORMANCE_TOOL_FILTER_SP_NAME,
} from "@domain/config/presets/performance-tool/performance-tool.types";

/**
 * Keys consumed by `buildPerformanceToolFilterPayload` as KPI refresh
 * dates. The shape must stay `Record<string, string>` — numeric kpi-group
 * entries (e.g. `category_health_full_years_*`) belong to a different
 * surface and are intentionally excluded.
 *
 * @TODO Need to separate in another file
 */
const REFRESH_MAP_KEYS = [
  "volume",
  "finance",
  "market_share",
  "market_share_official_total",
  "media",
  "power",
  "p4w",
  "pos",
  "growth_league",
  "innovation",
  "portfolio-health",
  "bees-distribution",
  "pillar-rennovation",
  "category-health",
] as const satisfies readonly (keyof KpiGroupTimeFrameConfig)[];

type RefreshKey = (typeof REFRESH_MAP_KEYS)[number];

function staticRefreshMap(): Record<RefreshKey, string> {
  const c = kpiGroupTimeFrame.config;
  return {
    volume: c.volume,
    finance: c.finance,
    market_share: c.market_share,
    market_share_official_total: c.market_share_official_total,
    media: c.media,
    power: c.power,
    p4w: c.p4w,
    pos: c.pos,
    growth_league: c.growth_league,
    innovation: c.innovation,
    "portfolio-health": c["portfolio-health"],
    "bees-distribution": c["bees-distribution"],
    "pillar-rennovation": c["pillar-rennovation"],
    "category-health": c["category-health"],
  };
}

/**
 * Build the KPI refresh-date map from the kpi-group Databricks dataset
 * by delegating to `kpiGroupHandler` — the single source of truth for
 * decoding `{ kpi_name, time_frame }` rows. Falls back to the static
 * config for any key the query did not provide (or when the dataset is
 * missing entirely), keeping the handler robust during rollouts and in
 * tests that omit the dataset.
 */
function toRefreshMap(datasets?: Dataset[]): Record<string, string> {
  const queried = kpiGroupHandler.handle({}, datasets);
  const fallback = staticRefreshMap();
  const out: Record<string, string> = { ...fallback };

  for (const key of REFRESH_MAP_KEYS) {
    const value = queried[key];
    if (typeof value === "string" && value.length > 0) {
      out[key] = value;
    }
  }

  return out;
}

class PerformanceToolPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(): DatasetConfig[] {
    return [
      {
        id: PERFORMANCE_TOOL_DATASET_ID,
        config: createDeltalakeProcedureFetchDataConfig({
          functionName: PERFORMANCE_TOOL_FILTER_SP_NAME,
          parameters: [],
        }),
      },
      {
        id: KPI_GROUP_DATASET_ID,
        config: createDeltalakeFetchDataConfig({
          query: KPI_GROUP_DATASET_QUERY,
        }),
      },
    ];
  }

  handle(
    preset: PresetDefinition,
    datasets?: Dataset[],
    user?: UserEntity,
  ): PresetResponse {
    const userPermissions = buildPerformanceToolUserPermissions(user);
    const kpiRefreshDates = toRefreshMap(datasets);
    const rows = this.extractRows(datasets);
    const rawData: PerformanceToolFilterRawRow[] = [
      ...rows,
      ...buildPerformanceToolMockData(),
    ];

    const filterData = buildPerformanceToolFilterPayload(
      rawData,
      KPIS_ENABLED,
      kpiRefreshDates,
      userPermissions,
    );

    return {
      "performance-tool": {
        ...preset,
        ...filterData,
      },
    };
  }

  private extractRows(datasets?: Dataset[]): PerformanceToolFilterRawRow[] {
    const dataset = datasets?.find((d) => d.id === PERFORMANCE_TOOL_DATASET_ID);
    if (!dataset?.data?.length) {
      return [];
    }

    const out: PerformanceToolFilterRawRow[] = [];
    for (const raw of dataset.data) {
      if (!raw || typeof raw !== "object") {
        continue;
      }
      out.push(raw as unknown as PerformanceToolFilterRawRow);
    }
    return out;
  }
}

export const performanceToolHandler = new PerformanceToolPresetHandler();
