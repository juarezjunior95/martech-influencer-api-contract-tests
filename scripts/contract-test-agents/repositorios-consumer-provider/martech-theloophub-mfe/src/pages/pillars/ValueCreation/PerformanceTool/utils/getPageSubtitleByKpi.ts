const DEFAULT_SUBTITLE_ID = 'ValueCreation.PerformanceTool.defaultSubtitle';

const KPI_SUBTITLE_IDS: Record<string, string> = {
  volume: 'ValueCreation.PerformanceTool.volume.subtitle',
  power: 'ValueCreation.PerformanceTool.power.subtitle',
  net_revenue: 'ValueCreation.PerformanceTool.net_revenue.subtitle',
  market_share: 'ValueCreation.PerformanceTool.market_share.subtitle',
  cores: 'ValueCreation.PerformanceTool.cores.subtitle',
};

export function getPageSubtitleByKpi(kpi?: string): string {
  if (!kpi) return DEFAULT_SUBTITLE_ID;
  return KPI_SUBTITLE_IDS[kpi] ?? DEFAULT_SUBTITLE_ID;
}
