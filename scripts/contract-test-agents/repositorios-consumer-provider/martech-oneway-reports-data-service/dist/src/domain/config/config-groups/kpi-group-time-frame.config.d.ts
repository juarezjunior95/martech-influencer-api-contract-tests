import { ConfigGroup } from "@domain/config/config-groups/config-group.types";
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
declare const kpiGroupTimeFrame: ConfigGroup<KpiGroupTimeFrameConfig>;
export default kpiGroupTimeFrame;
