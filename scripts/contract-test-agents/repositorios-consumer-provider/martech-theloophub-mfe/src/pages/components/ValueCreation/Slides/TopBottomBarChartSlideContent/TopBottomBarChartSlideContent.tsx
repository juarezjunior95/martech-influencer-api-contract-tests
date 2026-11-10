import { memo } from 'react';

import { SectionHeader } from 'pages/components/SectionHeader';
import { BarChartSection } from 'pages/pillars/ValueCreation/VolumePages/components';
import { BarChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

import {
  StyledBarChartBaseContainer,
  StyledBarChartSectionHeaderWrapper,
  StyledBarChartSlideGrid,
} from './TopBottomBarChartSlideContent.styles';
import type { TopBottomBarChartSlideContentProps } from './types';

const BAR_CHART_COLOR_CONFIG: Record<string, string> = {
  positive: '#3CA91E',
  negative: '#D62222',
};

const getBarColors = (data: BarChartKpiData, index: number) => {
  if (Number(data?.datasets?.[0]?.data?.[index]) > 0) {
    return BAR_CHART_COLOR_CONFIG['positive'];
  }
  return BAR_CHART_COLOR_CONFIG['negative'];
};

const DEFAULT_SKELETON_PROPS = {
  width: '100%',
  height: '220px',
  length: 1,
  borderRadius: 'none' as const,
};

const TopBottomBarChartSlideContentComponent = ({
  loading = false,
  error = null,
  data,
  chartHeight = '220px',
  dataTestId,
}: TopBottomBarChartSlideContentProps) => {
  const topData = data?.topKpiData;
  const bottomData = data?.bottomKpiData;

  return (
    <StyledBarChartSlideGrid
      data-testid={
        dataTestId ? `top-brands-bar-slide-content-${dataTestId}` : undefined
      }
    >
      <StyledBarChartBaseContainer
        data-testid={
          dataTestId
            ? `top-brands-bar-slide-content-top-container-${dataTestId}`
            : undefined
        }
      >
        <StyledBarChartSectionHeaderWrapper>
          <SectionHeader
            dataTestId={
              dataTestId
                ? `${dataTestId}-top-brands-bar-slide-content-top`
                : undefined
            }
            period={topData?.period}
            legends={topData?.legend}
          />
        </StyledBarChartSectionHeaderWrapper>
        <BarChartSection
          dataTestId={
            dataTestId
              ? `${dataTestId}-top-brands-bar-slide-content-top-data`
              : undefined
          }
          loading={loading}
          error={error}
          data={topData}
          chartHeight={chartHeight}
          getBarColor={getBarColors}
          skeletonProps={DEFAULT_SKELETON_PROPS}
        />
      </StyledBarChartBaseContainer>

      <StyledBarChartBaseContainer
        data-testid={
          dataTestId
            ? `top-brands-bar-slide-content-bottom-container-${dataTestId}`
            : undefined
        }
      >
        <StyledBarChartSectionHeaderWrapper>
          <SectionHeader
            dataTestId={
              dataTestId
                ? `${dataTestId}-top-brands-bar-slide-content-bottom`
                : undefined
            }
            period={bottomData?.period}
            legends={bottomData?.legend}
          />
        </StyledBarChartSectionHeaderWrapper>
        <BarChartSection
          dataTestId={
            dataTestId
              ? `${dataTestId}-top-brands-bar-slide-content-bottom-data`
              : undefined
          }
          loading={loading}
          error={error}
          data={bottomData}
          chartHeight={chartHeight}
          getBarColor={getBarColors}
          skeletonProps={DEFAULT_SKELETON_PROPS}
        />
      </StyledBarChartBaseContainer>
    </StyledBarChartSlideGrid>
  );
};

export const TopBottomBarChartSlideContent = memo(
  TopBottomBarChartSlideContentComponent,
);
