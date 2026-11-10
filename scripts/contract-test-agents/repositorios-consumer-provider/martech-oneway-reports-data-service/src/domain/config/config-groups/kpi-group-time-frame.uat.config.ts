import { ConfigGroup } from "@domain/config/config-groups/config-group.types";

import { KpiGroupTimeFrameConfig } from "./kpi-group-time-frame.config";

const kpiGroupTimeFrameUat: ConfigGroup<KpiGroupTimeFrameConfig> = {
  name: "kpi_group_time_frame",
  config: {
    volume: "01-04-2026",
    sku_pnl: "01-06-2026",
    finance: "01-03-2026",
    market_share: "01-02-2026",
    market_share_official_total: "01-07-2026",
    media: "01-03-2026",
    power: "01-03-2026",
    p4w: "01-03-2026",
    pos: "01-03-2026",
    growth_league: "01-03-2026",
    innovation: "01-03-2026",
    "portfolio-health": "01-12-2025",
    "bees-distribution": "01-02-2026",
    "pillar-rennovation": "01-03-2026",
    category_health_full_years_start: 2015,
    category_health_full_years_end: 2025,
    "category-health": "01-03-2026",
  },
} as const;

export default kpiGroupTimeFrameUat;
