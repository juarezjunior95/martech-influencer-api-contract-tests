import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { ExploreFurther } from 'components';
import { featureToggles } from 'config/featureToggle';
import {
  useBffData,
  useFeatureToggle,
  useMediaQuery,
  usePageFilterApplied,
  useSubFilters,
} from 'hooks';
import { AISummary } from 'pages/components/AISummary';

import { PERFORMANCE_TOOL_PAGE_NAME } from '../../../constants';
import {
  usePerformanceToolData,
  usePerformanceToolDrillDownAiSummary,
} from '../../../hooks';
import { StyledPerformanceToolContent } from '../../../PerformanceTool.styles';
import { getPerformanceToolSubFilters } from '../../../utils';
import {
  BigNumbersSection,
  DriversSection,
  PerformanceSection,
} from '../../Sections';
import { KpiDrillDownProps } from './types';

const BFF_ID_PREFIX = 'value-creation_performance-tool_drill-down';
const SKELETON_PROPS = {
  height: '112px',
  width: '336px',
  length: 3,
  borderRadius: 'medium' as const,
};

export const KpiDrillDown: React.FC<KpiDrillDownProps> = ({
  config,
  onFilterChange,
}) => {
  const {
    kpiSlug,
    kpiGroup,
    waterfallConfig,
    measure,
    driversTitle,
    periodValues,
    bigNumbersTitle = 'Overtime Performance',
    bigNumbersTooltip,
    showCompositionSection = false,
    showLineDataLabels = true,
  } = config;
  const { formatMessage } = useIntl();

  const isLargeScreen = useMediaQuery('(min-width: 1440px)');
  const { applied } = usePageFilterApplied(PERFORMANCE_TOOL_PAGE_NAME);
  const { activeSubFilters } = useSubFilters();

  const subFilters = useMemo(
    () => getPerformanceToolSubFilters(applied),
    [applied],
  );

  const bigNumbersBffData = useBffData({
    id: `${BFF_ID_PREFIX}_${kpiSlug}_overtime-performance`,
    kpiGroup,
    subFilters: {
      ...subFilters,
      timeframe: 'YTD',
      waterfall_filter: activeSubFilters?.waterfall_view_by,
      kpi: applied.kpis,
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const overtimeBffData = useBffData({
    id: `${BFF_ID_PREFIX}_${kpiSlug}_overtime-trends`,
    kpiGroup,
    subFilters: {
      ...subFilters,
      timeframe: applied.periods,
      waterfall_filter: activeSubFilters?.waterfall_view_by,
      period_type: applied.periods,
      kpi: applied.kpis,
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const waterfallBffData = useBffData({
    id: `${BFF_ID_PREFIX}_${kpiSlug}_contribution`,
    kpiGroup,
    subFilters: {
      ...subFilters,
      timeframe: applied.periods,
      waterfall_filter: activeSubFilters?.waterfall_view_by,
      period_type: applied.periods,
      kpi: applied.kpis,
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const compositionBffData = useBffData({
    id: `${BFF_ID_PREFIX}_${kpiSlug}_composition`,
    kpiGroup,
    subFilters: {
      ...subFilters,
      timeframe: applied.periods,
      waterfall_filter: activeSubFilters?.waterfall_view_by,
      period_type: applied.periods,
      kpi: applied.kpis,
    },
    skipMainFilters: false,
    skipRequest: !showCompositionSection,
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

  const compositionData = usePerformanceToolData(
    ['composition'],
    compositionBffData,
  );

  const waterfallVariant = useMemo(
    () => (isLargeScreen ? 'large' : 'small'),
    [isLargeScreen],
  );

  const selectedBigNumberIndex = useMemo(() => {
    const index = periodValues.indexOf(applied.periods as string);
    return Math.max(index, 0);
  }, [applied.periods, periodValues]);

  const handleBigNumbersSelect = useCallback(
    (index: number) => {
      if (bigNumbersData['overtime-performance']?.[index]) {
        onFilterChange('periods', periodValues[index]);
      }
    },
    [onFilterChange, bigNumbersData, periodValues],
  );

  const showDrivers = useMemo(() => {
    return !!applied.sub_brands && applied.sub_brands !== 'All';
  }, [applied]);

  const { aiSummaryEntry, aiSummaryFilters, isAiSummaryEnabled } =
    usePerformanceToolDrillDownAiSummary(kpiSlug, applied);

  const [commercialResultsEnabled, commercialResultsLoading] = useFeatureToggle(
    featureToggles.pillar.valueCreation.submenus.commercialResults.id,
  );

  const showExploreFurther = useMemo(
    () =>
      kpiSlug === 'volume' &&
      commercialResultsEnabled &&
      !commercialResultsLoading,
    [kpiSlug, commercialResultsEnabled, commercialResultsLoading],
  );
  const exploreFurtherCards = useMemo(() => {
    return ['commercialResults', 'driversDecomposition'].map((card) => {
      return {
        title: formatMessage({
          id: `ValueCreation.PerformanceTool.exploreFurther.${card}.title`,
        }),
        description: formatMessage({
          id: `ValueCreation.PerformanceTool.exploreFurther.${card}.description`,
        }),
        linkLabel: formatMessage({
          id: `ValueCreation.PerformanceTool.exploreFurther.${card}.linkLabel`,
        }),
        linkHref: formatMessage({
          id: `ValueCreation.PerformanceTool.exploreFurther.${card}.linkHref`,
        }),
        abbreviation: formatMessage({
          id: `ValueCreation.PerformanceTool.exploreFurther.${card}.abbreviation`,
        }),
        enabled:
          card === 'commercialResults' ? commercialResultsEnabled : false,
      };
    });
  }, [commercialResultsEnabled, formatMessage]);

  return (
    <StyledPerformanceToolContent>
      {isAiSummaryEnabled && aiSummaryEntry && (
        <AISummary
          pageName={PERFORMANCE_TOOL_PAGE_NAME}
          kpiGroup={kpiGroup}
          summaryPageIdentifier={aiSummaryEntry.summaryPageIdentifier}
          subFilters={aiSummaryFilters}
          dataTestId={`performance-tool-drilldown-ai-summary-${kpiSlug}`}
        />
      )}

      <BigNumbersSection
        title={bigNumbersTitle}
        tooltip={bigNumbersTooltip}
        data={bigNumbersData['overtime-performance']}
        defaultSelected={selectedBigNumberIndex}
        onSelect={handleBigNumbersSelect}
        loading={bigNumbersBffData.loading}
        error={bigNumbersBffData.error}
        skeletonProps={SKELETON_PROPS}
      />

      <PerformanceSection
        measure={measure}
        lineBarChartsData={overtimeData['overtime-trends']}
        waterfallData={waterfallData['contribution']}
        waterfallRequest={waterfallBffData}
        lineBarChartsRequest={overtimeBffData}
        waterfallVariant={waterfallVariant}
        showDrivers={showDrivers}
        waterfallConfig={waterfallConfig}
        compositionData={compositionData['composition']}
        compositionBffData={
          showCompositionSection ? compositionBffData : undefined
        }
        showCompositionSection={showCompositionSection}
        showLineDataLabels={showLineDataLabels}
      />

      {showExploreFurther && (
        <ExploreFurther
          filterPageName={PERFORMANCE_TOOL_PAGE_NAME}
          cards={exploreFurtherCards}
          dataTestId={PERFORMANCE_TOOL_PAGE_NAME}
        />
      )}

      {showDrivers && <DriversSection title={driversTitle} />}
    </StyledPerformanceToolContent>
  );
};
