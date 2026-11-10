import { useCallback, useMemo } from 'react';

import { useMediaQuery, usePageFilterApplied, useSubFilters } from 'hooks';
import { useBffData } from 'hooks/useBffData';
import { AISummary } from 'pages/components/AISummary';

import { powerWaterfallConfig } from '../../../config';
import { PERFORMANCE_TOOL_PAGE_NAME } from '../../../constants';
import {
  usePerformanceToolData,
  usePerformanceToolDrillDownAiSummary,
} from '../../../hooks';
import { StyledPerformanceToolContent } from '../../../PerformanceTool.styles';
import {
  BigNumbersSection,
  DriversSection,
  PerformanceSection,
} from '../../Sections';

interface PowerProps {
  onFilterChange: (key: string, value: string) => void;
}

const PERIOD_VALUES = ['YTD', 'QTD'] as const;

export const Power: React.FC<PowerProps> = ({ onFilterChange }: PowerProps) => {
  const isLargeScreen = useMediaQuery('(min-width: 1440px)');
  const { applied } = usePageFilterApplied(PERFORMANCE_TOOL_PAGE_NAME);
  const { activeSubFilters } = useSubFilters();
  const { aiSummaryEntry, aiSummaryFilters, isAiSummaryEnabled } =
    usePerformanceToolDrillDownAiSummary('brand-power', applied);

  const bigNumbersBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_brand-power_overtime-performance',
    kpiGroup: 'power',
    subFilters: {
      page_filter: applied.portfolios ?? 'All',
      timeframe: 'YTD',
      kpi: applied.kpis,
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const overtimeBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_brand-power_overtime-trends',
    kpiGroup: 'power',
    subFilters: {
      page_filter: applied.portfolios ?? 'All',
      timeframe: applied.periods,
      kpi: applied.kpis,
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const waterfallBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_brand-power_contribution',
    kpiGroup: 'power',
    subFilters: {
      page_filter: applied.portfolios ?? 'All',
      timeframe: applied.periods,
      waterfall_filter: activeSubFilters?.waterfall_view_by,
      kpi: applied.kpis,
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const bigNumbersData = usePerformanceToolData(
    ['overtime-performance'],
    bigNumbersBffData,
  );

  const overtimeData = usePerformanceToolData(
    ['overtime-trends'],
    overtimeBffData,
  );

  const waterfallData = usePerformanceToolData(
    ['contribution'],
    waterfallBffData,
  );

  const waterfallVariant = useMemo(
    () => (isLargeScreen ? 'large' : 'small'),
    [isLargeScreen],
  );

  const selectedBigNumberIndex = useMemo(() => {
    const index = PERIOD_VALUES.indexOf(
      applied.periods as (typeof PERIOD_VALUES)[number],
    );
    return Math.max(index, 0);
  }, [applied.periods]);

  const handleBigNumbersSelect = useCallback(
    (index: number) => {
      const selectedBigNumber = bigNumbersData['overtime-performance']?.[index];

      if (selectedBigNumber) {
        onFilterChange('periods', PERIOD_VALUES[index]);
      }
    },
    [onFilterChange, bigNumbersData],
  );

  const showDrivers = useMemo(() => {
    return !!applied.brands && applied.brands !== 'All';
  }, [applied]);

  return (
    <StyledPerformanceToolContent>
      {isAiSummaryEnabled && aiSummaryEntry && (
        <AISummary
          pageName={PERFORMANCE_TOOL_PAGE_NAME}
          kpiGroup="power"
          summaryPageIdentifier={aiSummaryEntry.summaryPageIdentifier}
          subFilters={aiSummaryFilters}
          dataTestId="performance-tool-drilldown-ai-summary-brand-power"
        />
      )}

      <BigNumbersSection
        title="Overtime Performance"
        data={bigNumbersData['overtime-performance']}
        defaultSelected={selectedBigNumberIndex}
        onSelect={handleBigNumbersSelect}
        loading={bigNumbersBffData.loading}
        error={bigNumbersBffData.error}
      />
      <PerformanceSection
        measure="[ % ]"
        lineBarChartsData={overtimeData['overtime-trends']}
        waterfallData={waterfallData['contribution']}
        waterfallRequest={waterfallBffData}
        lineBarChartsRequest={overtimeBffData}
        waterfallVariant={waterfallVariant}
        showDrivers={showDrivers}
        waterfallConfig={powerWaterfallConfig}
      />

      {showDrivers && <DriversSection title="Brand Power Drivers" />}
    </StyledPerformanceToolContent>
  );
};
