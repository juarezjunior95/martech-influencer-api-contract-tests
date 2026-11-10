import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { ChartOptions } from 'chart.js';
import { CustomTooltip, NoDataYet, Skeleton } from 'components';
import { InteractiveChartConfig } from 'components/Chart/BaseChart';
import { ChartWrapper } from 'components/Chart/ChartWrapper';
import { ChartHeader } from 'components/ChartHeader';
import {
  useBffData,
  useCurrentPage,
  useGoogleAnalytics,
  usePageFilterApplied,
  useSubFilters,
} from 'hooks';
import { StyledTooltip } from 'shared/Styles';

import { volumeBreakdownOptions } from '../../configs';
import { InnovationPerformanceData } from '../../types';
import { InnovationPerfomanceWaterfall } from '../InnovationPerformanceWaterfall/InnovationPerfomanceWaterfall';
import { StyledWaterfallContainer } from '../InnovationPerformanceWaterfall/InnovationPerfomanceWaterfall.styles';
import {
  StyledBreakdownHeader,
  StyledBreakdownHeading,
  StyledBreakdownSection,
  StyledInnovationPerformanceChartHeaderSpacing,
  StyledInnovationPerformanceContainer,
} from './InnovationPerformance.styles';

interface InnovationPerfomanceProps {
  performanceData?: {
    volume?: InnovationPerformanceData;
    nr?: InnovationPerformanceData;
    maco?: InnovationPerformanceData;
  };
  breakdownData?: {
    volume?: InnovationPerformanceData;
    nr?: InnovationPerformanceData;
    maco?: InnovationPerformanceData;
  };
  loading?: boolean;
  dataTestId?: string;
}

type ClickedInfo = { value: string; label: string } | null;

interface KpiDataContainer {
  volume?: InnovationPerformanceData;
  nr?: InnovationPerformanceData;
  maco?: InnovationPerformanceData;
}

const getDataByKpi = (
  data: KpiDataContainer | undefined,
  kpiType: string | number,
): InnovationPerformanceData | undefined => {
  if (!data) return undefined;

  const key = String(kpiType);
  if (key === 'nr') return data.nr;
  if (key === 'maco') return data.maco;
  return data.volume;
};

const getBreakdownDataFromResponse = (
  responseData: Record<string, unknown> | undefined,
  kpiType: string | number,
): InnovationPerformanceData | undefined => {
  if (!responseData) return undefined;

  const key = String(kpiType);
  if (key === 'nr')
    return responseData['breakdown-nr'] as InnovationPerformanceData;
  if (key === 'maco')
    return responseData['breakdown-maco'] as InnovationPerformanceData;
  return responseData['breakdown-volume'] as InnovationPerformanceData;
};

export const InnovationPerfomance: React.FC<InnovationPerfomanceProps> = ({
  performanceData,
  breakdownData,
  loading = false,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const { applied: appliedFilters, isGlobalZone } =
    usePageFilterApplied(currentPage);
  const { activeSubFilters } = useSubFilters();
  const trackGA = useGoogleAnalytics();

  const [clickedInfo, setClickedInfo] = useState<ClickedInfo>(null);
  const breakdownSectionRef = useRef<HTMLAnchorElement>(null);

  const filteredBreakdownResponse = useBffData({
    id: 'innovation_innovation_performance-breakdown_breakdown',
    kpiGroup: 'innovation',
    subFilters: {
      country: appliedFilters.country,
      zone: appliedFilters.zone,
      filter: clickedInfo?.value,
    },
    skipRequest: !clickedInfo?.value,
  });

  const currentPerformanceData = useMemo(
    () => getDataByKpi(performanceData, activeSubFilters.kpis),
    [performanceData, activeSubFilters.kpis],
  );

  const kpiBreakdownData = useMemo(
    () => getDataByKpi(breakdownData, activeSubFilters.kpis),
    [breakdownData, activeSubFilters.kpis],
  );

  const filteredBreakdownData = useMemo(
    () =>
      getBreakdownDataFromResponse(
        filteredBreakdownResponse.data,
        activeSubFilters.kpis,
      ),
    [filteredBreakdownResponse.data, activeSubFilters.kpis],
  );

  const currentBreakdownData = useMemo(
    () => (clickedInfo?.value ? filteredBreakdownData : kpiBreakdownData),
    [clickedInfo?.value, filteredBreakdownData, kpiBreakdownData],
  );

  const volumeBreakdownTitle = useMemo(() => {
    if (activeSubFilters.kpis === 'maco')
      return formatMessage({
        id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.macoBreakdown.title',
      });

    if (activeSubFilters.kpis === 'nr')
      return formatMessage({
        id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.nrBreakdown.title',
      });

    return formatMessage({
      id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.volumeBreakdown.title',
    });
  }, [formatMessage, activeSubFilters]);

  const breakdownScopeLabel = useMemo(
    () => (isGlobalZone ? 'Country' : 'Brand'),
    [isGlobalZone],
  );

  const breakdownSelectionLabel = useMemo(
    () => clickedInfo?.label ?? 'Total Innovation',
    [clickedInfo?.label],
  );

  const hasPerformanceData = useMemo(
    () => currentPerformanceData && !currentPerformanceData.empty,
    [currentPerformanceData],
  );

  const hasBreakdownData = useMemo(
    () => currentBreakdownData && !currentBreakdownData.empty,
    [currentBreakdownData],
  );

  const isLoadingBreakdown =
    loading || (!!clickedInfo?.value && filteredBreakdownResponse.loading);

  const getClickedInfoFromIndex = useCallback(
    (index: number | null): ClickedInfo => {
      if (index === null || !currentPerformanceData?.clickableIndexes) {
        return null;
      }

      const clickableItem = currentPerformanceData.clickableIndexes.find(
        (item) => item.index === index,
      );

      if (!clickableItem) {
        return null;
      }

      const label = currentPerformanceData.labels[index] || '';
      return { value: clickableItem.value, label };
    },
    [currentPerformanceData],
  );

  const handleBarSelect = useCallback(
    (index: number | null) => {
      const newClickedInfo = getClickedInfoFromIndex(index);
      setClickedInfo(newClickedInfo);

      if (index !== null && newClickedInfo !== null) {
        trackGA({
          event_category: 'Filter',
          event_action: 'drilldown',
          event_label: newClickedInfo.label,
        });
      }
    },
    [getClickedInfoFromIndex],
  );

  const performanceChartOptions = useMemo(
    (): ChartOptions<'bar'> => ({
      plugins: {
        datalabels: {
          display: true,
          color: '#141414',
          font: {
            size: 12,
            family: 'Barlow',
          },
        },
      },
      layout: {
        padding: {
          top: 80,
        },
      },
    }),
    [],
  );

  const performanceInteractiveConfig = useMemo(():
    InteractiveChartConfig | undefined => {
    if (!currentPerformanceData?.clickableIndexes) {
      return undefined;
    }

    const clickableIndexes = currentPerformanceData.clickableIndexes.map(
      (item) => item.index,
    );

    return {
      onBarSelect: handleBarSelect,
      fillHeight: true,
      clickability: {
        clickableIndexes,
      },
    };
  }, [currentPerformanceData, handleBarSelect]);

  useEffect(() => {
    setClickedInfo(null);
  }, [appliedFilters]);

  useEffect(() => {
    if (clickedInfo && !isLoadingBreakdown && breakdownSectionRef.current) {
      setTimeout(() => {
        breakdownSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [clickedInfo, isLoadingBreakdown]);

  const renderPerformanceChart = useCallback(() => {
    if (loading) {
      return (
        <Skeleton
          height="390px"
          width="100%"
          length={1}
          borderRadius="none"
          dataTestId={
            dataTestId ? `skeleton-${dataTestId}-performance` : undefined
          }
        />
      );
    }

    if (!hasPerformanceData) {
      return (
        <StyledWaterfallContainer
          data-testid={
            dataTestId
              ? `${dataTestId}-no-data-performance-container`
              : undefined
          }
        >
          <NoDataYet
            dataTestId={
              dataTestId ? `${dataTestId}-no-data-performance` : undefined
            }
          />
        </StyledWaterfallContainer>
      );
    }

    return (
      <InnovationPerfomanceWaterfall
        dataTestId={
          dataTestId ? `${dataTestId}-waterfall-performance` : undefined
        }
        data={currentPerformanceData}
        options={performanceChartOptions}
        interactiveConfig={performanceInteractiveConfig}
      />
    );
  }, [
    loading,
    hasPerformanceData,
    currentPerformanceData,
    performanceChartOptions,
    performanceInteractiveConfig,
    dataTestId,
  ]);

  const renderBreakdownChart = useCallback(() => {
    if (isLoadingBreakdown) {
      return (
        <Skeleton
          height="500px"
          width="100%"
          length={1}
          borderRadius="none"
          dataTestId={
            dataTestId ? `skeleton-${dataTestId}-breakdown` : undefined
          }
        />
      );
    }

    if (!hasBreakdownData) {
      return (
        <StyledWaterfallContainer
          data-testid={
            dataTestId ? `${dataTestId}-no-data-breakdown-container` : undefined
          }
        >
          <NoDataYet
            dataTestId={
              dataTestId ? `${dataTestId}-no-data-breakdown` : undefined
            }
          />
        </StyledWaterfallContainer>
      );
    }

    return (
      <InnovationPerfomanceWaterfall
        dataTestId={
          dataTestId ? `${dataTestId}-waterfall-breakdown` : undefined
        }
        data={currentBreakdownData}
        options={volumeBreakdownOptions}
        plugins={[]}
      />
    );
  }, [isLoadingBreakdown, hasBreakdownData, currentBreakdownData, dataTestId]);

  return (
    <ChartWrapper
      data-testid={dataTestId ? `${dataTestId}-chart-wrapper` : undefined}
      header={
        <StyledInnovationPerformanceChartHeaderSpacing
          data-testid={
            dataTestId ? `${dataTestId}-chart-header-spacing` : undefined
          }
        >
          <ChartHeader
            title={formatMessage({
              id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.title',
            })}
            description={formatMessage({
              id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.subtitle',
            })}
            config={{
              inline: 'horizontal',
              type: 'large',
              alignment: 'left',
            }}
            dataTestId={dataTestId ? `${dataTestId}-chart-header` : undefined}
          />
        </StyledInnovationPerformanceChartHeaderSpacing>
      }
    >
      <StyledInnovationPerformanceContainer
        data-testid={dataTestId ? `${dataTestId}-container` : undefined}
      >
        <StyledBreakdownSection
          data-testid={
            dataTestId ? `${dataTestId}-performance-section` : undefined
          }
        >
          {renderPerformanceChart()}
        </StyledBreakdownSection>

        <StyledBreakdownSection
          data-testid={
            dataTestId ? `${dataTestId}-breakdown-section` : undefined
          }
          ref={breakdownSectionRef}
        >
          <StyledBreakdownHeader
            data-testid={
              dataTestId ? `${dataTestId}-breakdown-header` : undefined
            }
          >
            <StyledBreakdownHeading
              data-testid={
                dataTestId ? `${dataTestId}-breakdown-heading` : undefined
              }
              size="H5"
            >
              {volumeBreakdownTitle} {breakdownScopeLabel} -{' '}
              {breakdownSelectionLabel}
            </StyledBreakdownHeading>
            {clickedInfo && (
              <CustomTooltip
                content={
                  <StyledTooltip
                    size="small"
                    data-testid={
                      dataTestId
                        ? `${dataTestId}-breakdown-tooltip-content`
                        : undefined
                    }
                  >
                    {formatMessage({
                      id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.returnToTotalHint',
                    })}
                  </StyledTooltip>
                }
                dataTestId={
                  dataTestId ? `${dataTestId}-breakdown-tooltip` : undefined
                }
              >
                <Icon icon={Info} size="medium" />
              </CustomTooltip>
            )}
          </StyledBreakdownHeader>

          {renderBreakdownChart()}
        </StyledBreakdownSection>
      </StyledInnovationPerformanceContainer>
    </ChartWrapper>
  );
};
