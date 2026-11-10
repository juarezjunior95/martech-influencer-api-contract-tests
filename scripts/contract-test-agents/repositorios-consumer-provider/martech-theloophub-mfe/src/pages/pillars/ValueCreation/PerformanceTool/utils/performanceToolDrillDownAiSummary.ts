import { featureToggles } from 'config/featureToggle';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';

export type PerformanceToolDrillDownAiSummaryEntry = {
  toggleKey: string;
  summaryPageIdentifier: string;
};

const PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY_TOGGLE_KEY =
  featureToggles.pillar.valueCreation.submenus.performanceTool.aiSummary.volume;

const PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY: Record<
  string,
  PerformanceToolDrillDownAiSummaryEntry
> = {
  'brand-power': {
    toggleKey: PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY_TOGGLE_KEY,
    summaryPageIdentifier:
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_BRAND_POWER_DRILLDOWN,
  },
  cores: {
    toggleKey: PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY_TOGGLE_KEY,
    summaryPageIdentifier:
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_CORES_DRILLDOWN,
  },
  'non-finance_market-share': {
    toggleKey: PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY_TOGGLE_KEY,
    summaryPageIdentifier:
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_MARKET_SHARE_DRILLDOWN,
  },
  'net-revenue': {
    toggleKey: PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY_TOGGLE_KEY,
    summaryPageIdentifier:
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_NET_REVENUE_DRILLDOWN,
  },
  volume: {
    toggleKey: PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY_TOGGLE_KEY,
    summaryPageIdentifier:
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_VOLUME_DRILLDOWN,
  },
};

export function getPerformanceToolDrillDownAiSummary(
  kpiSlug: string,
): PerformanceToolDrillDownAiSummaryEntry | undefined {
  return PERFORMANCE_TOOL_DRILLDOWN_AI_SUMMARY[kpiSlug];
}
