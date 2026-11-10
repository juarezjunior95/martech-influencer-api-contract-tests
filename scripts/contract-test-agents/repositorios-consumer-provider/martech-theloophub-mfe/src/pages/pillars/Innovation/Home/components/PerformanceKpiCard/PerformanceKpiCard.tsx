import type { KeyboardEvent } from 'react';

import {
  BigNumber,
  ChartHeader,
  NoDataYet,
  Skeleton,
  SparkLine,
} from 'components';
import { useMediaQuery } from 'hooks';
import type { BigNumberSparkLineCardData } from 'pages/components';

import {
  INNOVATION_HOME_CHART_HEADER_ALIGN_START_CLASS,
  StyledInnovationChartHeaderAlignStart,
} from '../innovationHomeChartHeaderAlignStart.styles';
import {
  StyledPerformanceKpiBigNumberShell,
  StyledPerformanceKpiCardBody,
  StyledPerformanceKpiCardRoot,
  StyledPerformanceKpiSparklineSlot,
} from './PerformanceKpiCard.styles';

const PERFORMANCE_KPI_BIG_NUMBER_CLASS =
  'innovation-performance-kpi-big-number';

const PERFORMANCE_KPI_CHART_HEADER_TEST_ID =
  'innovation-performance-kpi-chart-header';

const CHART_COLOR_BY_TREND = {
  positive: '#007800',
  negative: '#B91C1C',
} as const;

const DEFAULT_CHART_COLOR = '#5C5C5C';

const DESKTOP_LARGE_MEDIA_QUERY = '(min-width: 1440px)';

const CHART_HEADER_CONFIG = {
  inline: 'horizontal' as const,
  type: 'large' as const,
};

const getChartColorFromTrend = (
  trend: 'positive' | 'negative' | undefined,
): string => (trend ? CHART_COLOR_BY_TREND[trend] : DEFAULT_CHART_COLOR);

export interface PerformanceKpiCardProps {
  containerTitle: string;
  dataTestId?: string;
  loading?: boolean;
  error?: Error | null;
  data?: BigNumberSparkLineCardData | null;
  onClick?: () => void;
}

export const PerformanceKpiCard = ({
  containerTitle,
  dataTestId,
  loading,
  error,
  data,
  onClick,
}: PerformanceKpiCardProps) => {
  const isDesktopLarge = useMediaQuery(DESKTOP_LARGE_MEDIA_QUERY);
  const bigNumberSize = isDesktopLarge ? 'large' : 'medium';
  const isEmpty = !data || data.bigNumberData.length === 0;
  const item = data?.bigNumberData[0];
  const trend = item?.bigNumber?.trend;
  const chartColor = getChartColorFromTrend(trend);

  const bigNumberDataTestId = dataTestId
    ? `${dataTestId}-bignumber`
    : 'performance-kpi';
  const skeletonDataTestId = dataTestId ? `${dataTestId}-skeleton` : undefined;
  const sparklineDataTestId = dataTestId
    ? `${dataTestId}-sparkline`
    : undefined;

  const shellProps = {
    'data-testid': 'big-number-sparkline-card' as const,
    'data-title': containerTitle,
    'data-variant': 'innovationHandOff' as const,
  };

  const chartHeader = (title?: string, measure?: string, period?: string) => (
    <StyledInnovationChartHeaderAlignStart
      className={INNOVATION_HOME_CHART_HEADER_ALIGN_START_CLASS}
    >
      <ChartHeader
        title={title ?? ''}
        measure={measure}
        period={period}
        config={CHART_HEADER_CONFIG}
        dataTestId={PERFORMANCE_KPI_CHART_HEADER_TEST_ID}
      />
    </StyledInnovationChartHeaderAlignStart>
  );

  const handleShellKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) {
      return;
    }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      onClick();
    }
  };

  if (loading) {
    return (
      <StyledPerformanceKpiCardRoot {...shellProps}>
        <Skeleton
          dataTestId={skeletonDataTestId}
          length={1}
          width="100%"
          height="340px"
        />
      </StyledPerformanceKpiCardRoot>
    );
  }

  if (error) {
    return (
      <StyledPerformanceKpiCardRoot {...shellProps}>
        <StyledPerformanceKpiCardBody>
          <NoDataYet />
        </StyledPerformanceKpiCardBody>
      </StyledPerformanceKpiCardRoot>
    );
  }

  if (isEmpty || !item) {
    return (
      <StyledPerformanceKpiCardRoot {...shellProps}>
        <StyledPerformanceKpiCardBody>
          <StyledPerformanceKpiBigNumberShell emptyKpi={true}>
            <BigNumber
              asCard={false}
              size={bigNumberSize}
              spacing="loose"
              alignment="left"
              className={PERFORMANCE_KPI_BIG_NUMBER_CLASS}
              dataTestId={bigNumberDataTestId}
              header={chartHeader(
                data?.chartTitle,
                data?.measure,
                data?.chartPeriod,
              )}
              data={[]}
              emptyStateMessage="No data available"
              emptyStateConfig={{
                imageSize: {
                  width: '100px',
                  height: '100px',
                },
              }}
            />
          </StyledPerformanceKpiBigNumberShell>
        </StyledPerformanceKpiCardBody>
      </StyledPerformanceKpiCardRoot>
    );
  }

  const hasSparkline =
    Array.isArray(data.chartLineData) && data.chartLineData.length > 0;

  return (
    <StyledPerformanceKpiCardRoot {...shellProps}>
      <StyledPerformanceKpiCardBody>
        <StyledPerformanceKpiBigNumberShell
          interactive={!!onClick}
          onClick={onClick}
          onKeyDown={handleShellKeyDown}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
        >
          <BigNumber
            asCard={false}
            size={bigNumberSize}
            spacing="loose"
            alignment="left"
            className={PERFORMANCE_KPI_BIG_NUMBER_CLASS}
            dataTestId={bigNumberDataTestId}
            header={chartHeader(
              data.chartTitle,
              data.measure,
              data.chartPeriod,
            )}
            data={data.bigNumberData}
          />
          {hasSparkline ? (
            <StyledPerformanceKpiSparklineSlot>
              <SparkLine
                dataTestId={sparklineDataTestId}
                labels={data.chartLineData.map((_, i) => `${i}`)}
                datasets={[
                  { label: 'spark line dataset', data: data.chartLineData },
                ]}
                color={chartColor}
              />
            </StyledPerformanceKpiSparklineSlot>
          ) : null}
        </StyledPerformanceKpiBigNumberShell>
      </StyledPerformanceKpiCardBody>
    </StyledPerformanceKpiCardRoot>
  );
};
