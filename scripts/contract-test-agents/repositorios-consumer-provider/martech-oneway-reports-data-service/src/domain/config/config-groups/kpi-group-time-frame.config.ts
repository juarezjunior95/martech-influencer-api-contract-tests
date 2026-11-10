import { ConfigGroup } from "@domain/config/config-groups/config-group.types";

import kpiGroupTimeFrameProd from "./kpi-group-time-frame.prod.config";
import kpiGroupTimeFrameUat from "./kpi-group-time-frame.uat.config";

/**
 * Static port of the legacy Drupal `kpi_group_time_frame` configuration
 *
 * Add new sub-keys here as more legacy filters are ported. Sub-key names
 * keep their snake_case form verbatim for one-to-one parity with the
 * Drupal source (Drupal also reads `cat_health_start_year` etc. from the
 * group, so existing tooling and documentation stay valid).
 *
 * Naming caveat (legacy parity):
 *   - `cat_health_start_year` is the **newest** year (e.g. 2025).
 *   - `cat_health_end_year`   is the **oldest** year (e.g. 2021).
 * Drupal's "start"/"end" naming is inverted relative to chronological
 * order; the preset that consumes this file is responsible for mapping
 * legacy keys onto the chronological `startYear` / `endYear` bounds the
 * handler expects.
 *
 * Per-environment values live in dedicated files:
 *   - `kpi-group-time-frame.uat.config.ts`  (NODE_ENV === "uat")
 *   - `kpi-group-time-frame.prod.config.ts` (default — used in production
 *     and any other NODE_ENV value)
 */
export interface KpiGroupTimeFrameConfig {
  volume: string;
  sku_pnl: string;
  sku_pnl_nr?: string;
  finance: string;
  market_share: string;
  market_share_official_total: string;
  media: string;
  power: string;
  p4w: string;
  pos: string;
  growth_league: string;
  innovation: string;
  "portfolio-health": string;
  "bees-distribution": string;
  "pillar-rennovation": string;
  category_health_full_years_start: number;
  category_health_full_years_end: number;
  "category-health": string;
}

const kpiGroupTimeFrame: ConfigGroup<KpiGroupTimeFrameConfig> =
  process.env.NODE_ENV === "uat" ? kpiGroupTimeFrameUat : kpiGroupTimeFrameProd;

export default kpiGroupTimeFrame;
