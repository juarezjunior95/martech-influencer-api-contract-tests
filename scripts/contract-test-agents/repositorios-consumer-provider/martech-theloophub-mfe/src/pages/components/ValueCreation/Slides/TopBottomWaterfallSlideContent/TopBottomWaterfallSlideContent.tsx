import { memo } from 'react';

import { SectionHeader } from 'pages/components/SectionHeader';
import { WaterfallChartSection } from 'pages/pillars/ValueCreation/VolumePages/components/Sections/WaterfallChartSection';
import { BASE_LINE_COLORS } from 'pages/pillars/ValueCreation/VolumePages/constants/baseLineColors';

import {
  StyledGlobalSliderGrid,
  StyledWaterfallBaseContainer,
} from './TopBottomWaterfallSlideContent.styles';
import type { TopBottomWaterfallSlideContentProps } from './types';

const TopBottomWaterfallSlideContentComponent = ({
  loading,
  error,
  data,
  chartHeight = '178px',
  dataTestId,
}: TopBottomWaterfallSlideContentProps) => {
  const topData = data?.topKpiData ?? data?.topBrandsKpiData;
  const bottomData = data?.bottomKpiData ?? data?.bottomBrandsKpiData;

  return (
    <StyledGlobalSliderGrid
      data-testid={
        dataTestId ? `top-brands-slide-content-${dataTestId}` : undefined
      }
    >
      <StyledWaterfallBaseContainer
        data-testid={
          dataTestId
            ? `top-brands-slide-content-base-container-${dataTestId}`
            : undefined
        }
      >
        <WaterfallChartSection
          dataTestId={
            dataTestId
              ? `${dataTestId}-top-brands-slide-content-top-brands-data`
              : undefined
          }
          loading={loading}
          error={error}
          data={topData}
          chartHeight={chartHeight}
          skeletonProps={{
            height: '390px',
            width: '100%',
            length: 1,
            borderRadius: 'medium',
          }}
          sectionHeader={
            <SectionHeader
              dataTestId={
                dataTestId
                  ? `${dataTestId}-top-brands-slide-content-top-brands`
                  : undefined
              }
              period={topData?.period}
              legends={topData?.legend}
              legendColorConfig={BASE_LINE_COLORS}
            />
          }
        />
      </StyledWaterfallBaseContainer>
      <StyledWaterfallBaseContainer
        data-testid={
          dataTestId
            ? `${dataTestId}-top-brands-slide-content-base-container`
            : undefined
        }
      >
        <WaterfallChartSection
          dataTestId={
            dataTestId
              ? `${dataTestId}-top-brands-slide-content-bottom-brands-data`
              : undefined
          }
          loading={loading}
          error={error}
          data={bottomData}
          chartHeight={chartHeight}
          skeletonProps={{
            height: '390px',
            width: '100%',
            length: 1,
            borderRadius: 'medium',
          }}
          sectionHeader={
            <SectionHeader
              dataTestId={
                dataTestId
                  ? `${dataTestId}-top-brands-slide-content-bottom-brands`
                  : undefined
              }
              period={bottomData?.period}
              legends={bottomData?.legend}
              legendColorConfig={BASE_LINE_COLORS}
            />
          }
        />
      </StyledWaterfallBaseContainer>
    </StyledGlobalSliderGrid>
  );
};

export const TopBottomWaterfallSlideContent = memo(
  TopBottomWaterfallSlideContentComponent,
);
