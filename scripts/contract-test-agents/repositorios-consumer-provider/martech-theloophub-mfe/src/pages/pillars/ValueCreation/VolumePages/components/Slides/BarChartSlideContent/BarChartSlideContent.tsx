import { memo } from 'react';

import { SkeletonProps } from 'components';
import { SectionHeader } from 'pages/components/SectionHeader';

import {
  VOLUME_BAR_CHART_COLOR_CONFIG,
  VOLUME_BAR_CHART_LABEL_BACKGROUND,
  VOLUME_BAR_CHART_LEGEND_STYLE,
} from '../../../constants/barChartConfig';
import { BarChartSection } from '../../Sections';
import {
  StyledBarChartContainer,
  StyledBarChartSliderGrid,
  StyledBarChartWrapper,
} from './BarChartSlideContent.styles';
import { BarChartSlideContentProps } from './types';

const DEFAULT_SKELETON_PROPS: SkeletonProps = {
  height: '396px',
  width: '100%',
  length: 1,
  borderRadius: 'medium',
};

const BarChartSlideContentComponent = ({
  data,
  error,
  loading,
  chartHeight = '168px',
  centerZeroLine,
  skeletonProps = DEFAULT_SKELETON_PROPS,
  dataTestId,
}: BarChartSlideContentProps) => {
  const { barChartYtdKpiData, barChartMtdKpiData } = data || {};

  return (
    <StyledBarChartSliderGrid
      data-testid={
        dataTestId ? `bar-chart-slide-content-${dataTestId}` : undefined
      }
    >
      <StyledBarChartWrapper>
        <StyledBarChartContainer>
          <BarChartSection
            dataTestId={
              dataTestId ? `${dataTestId}-bar-chart-slide-content` : undefined
            }
            loading={loading}
            error={error}
            data={barChartMtdKpiData}
            chartHeight={chartHeight}
            centerZeroLine={centerZeroLine}
            labelBackgroundColor={VOLUME_BAR_CHART_LABEL_BACKGROUND}
            skeletonProps={skeletonProps}
            sectionHeader={
              <SectionHeader
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-bar-chart-slide-content-header`
                    : undefined
                }
                period={barChartMtdKpiData?.period}
                legends={barChartMtdKpiData?.legend}
                legendColorConfig={VOLUME_BAR_CHART_COLOR_CONFIG}
                legendShape={VOLUME_BAR_CHART_LEGEND_STYLE.shape}
                legendSize={VOLUME_BAR_CHART_LEGEND_STYLE.size}
              />
            }
          />
        </StyledBarChartContainer>

        <StyledBarChartContainer>
          <BarChartSection
            dataTestId={
              dataTestId ? `${dataTestId}-bar-chart-slide-content` : undefined
            }
            loading={loading}
            error={error}
            data={barChartYtdKpiData}
            chartHeight={chartHeight}
            centerZeroLine={centerZeroLine}
            labelBackgroundColor={VOLUME_BAR_CHART_LABEL_BACKGROUND}
            skeletonProps={skeletonProps}
            sectionHeader={
              <SectionHeader
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-bar-chart-slide-content-header`
                    : undefined
                }
                period={barChartYtdKpiData?.period}
                legends={barChartYtdKpiData?.legend}
                legendColorConfig={VOLUME_BAR_CHART_COLOR_CONFIG}
                legendShape={VOLUME_BAR_CHART_LEGEND_STYLE.shape}
                legendSize={VOLUME_BAR_CHART_LEGEND_STYLE.size}
              />
            }
          />
        </StyledBarChartContainer>
      </StyledBarChartWrapper>
    </StyledBarChartSliderGrid>
  );
};

export const BarChartSlideContent = memo(BarChartSlideContentComponent);
