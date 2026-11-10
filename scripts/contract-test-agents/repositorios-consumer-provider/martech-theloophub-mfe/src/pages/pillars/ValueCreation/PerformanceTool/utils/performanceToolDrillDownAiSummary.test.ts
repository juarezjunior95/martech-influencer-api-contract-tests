import { featureToggles } from 'config/featureToggle';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';

import { getPerformanceToolDrillDownAiSummary } from './performanceToolDrillDownAiSummary';

describe('getPerformanceToolDrillDownAiSummary', () => {
  const sharedToggleKey =
    featureToggles.pillar.valueCreation.submenus.performanceTool.aiSummary
      .volume;

  it.each([
    [
      'brand-power',
      sharedToggleKey,
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_BRAND_POWER_DRILLDOWN,
    ],
    [
      'cores',
      sharedToggleKey,
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_CORES_DRILLDOWN,
    ],
    [
      'non-finance_market-share',
      sharedToggleKey,
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_MARKET_SHARE_DRILLDOWN,
    ],
    [
      'net-revenue',
      sharedToggleKey,
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_NET_REVENUE_DRILLDOWN,
    ],
    [
      'volume',
      sharedToggleKey,
      AI_SUMMARY_PAGE_IDENTIFIERS.PERFORMANCE_TOOL_VOLUME_DRILLDOWN,
    ],
  ])(
    'returns the AI summary config for %s',
    (kpiSlug, toggleKey, summaryPageIdentifier) => {
      expect(getPerformanceToolDrillDownAiSummary(kpiSlug)).toEqual({
        toggleKey,
        summaryPageIdentifier,
      });
    },
  );

  it('returns undefined for unsupported KPI slugs', () => {
    expect(getPerformanceToolDrillDownAiSummary('unknown-kpi')).toBeUndefined();
  });
});
