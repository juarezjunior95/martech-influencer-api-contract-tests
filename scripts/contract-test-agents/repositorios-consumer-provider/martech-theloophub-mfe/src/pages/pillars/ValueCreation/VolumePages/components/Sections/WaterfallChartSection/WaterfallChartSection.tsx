import React from 'react';

import {
  BrandAvatarList,
  ComparisonLine,
  DataStateHandler,
  NoDataYet,
  Skeleton,
  Waterfall,
} from 'components';
import {
  WATERFALL_CHART_COLORS,
  WATERFALL_TREND_COLORS,
} from 'pages/pillars/ValueCreation/VolumePages/constants/waterfallChartConfig';
import { WaterfallChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';
import { StyledSectionHeaderContainer } from 'pages/pillars/ValueCreation/VolumePages/VolumePages.styles';

import { getBaseLineColors } from '../../../constants/baseLineColors';

interface WaterfallChartSectionProps {
  loading: boolean;
  error: Error | null;
  data: WaterfallChartKpiData;
  skeletonProps: React.ComponentProps<typeof Skeleton>;
  chartHeight: string;
  sectionHeader: React.ReactNode;
  dataTestId?: string;
}

const waterfallOptions = {
  layout: {
    padding: { left: 0, right: 0 },
  },
  datasets: {
    bar: {
      categoryPercentage: 0.85,
      barPercentage: 0.92,
    },
  },
  plugins: {
    display: false,
    connectBars: {},
  },
};

export const WaterfallChartSection: React.FC<WaterfallChartSectionProps> = ({
  loading,
  error,
  data,
  skeletonProps,
  chartHeight,
  sectionHeader,
  dataTestId,
}) => {
  const baseChartColors = getBaseLineColors(data?.baseChartColors);

  if (data?.empty) {
    return (
      <div
        style={{
          height: '390px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data-testid={
          dataTestId
            ? `${dataTestId}-waterfall-chart-section-empty-state-wrapper`
            : undefined
        }
      >
        <NoDataYet />
      </div>
    );
  }
  return (
    <DataStateHandler
      loading={loading}
      dataTestId={
        dataTestId ? `${dataTestId}-waterfall-chart-section` : undefined
      }
      error={error}
      empty={data?.empty}
      skeletonProps={skeletonProps}
    >
      {!!data && (
        <>
          <StyledSectionHeaderContainer
            data-testid={
              dataTestId
                ? `waterfall-chart-section-header-${dataTestId}`
                : undefined
            }
          >
            {sectionHeader}
          </StyledSectionHeaderContainer>
          <div
            style={{
              height: chartHeight,
              borderBottom: '1px solid #EBEBEB',
              margin: '0 24px',
            }}
          >
            <Waterfall
              dataTestId={
                dataTestId ? `${dataTestId}-waterfall-chart-section` : undefined
              }
              values={data?.values}
              labels={data?.labels}
              showLabels={false}
              formattedData={data?.formattedData}
              baseChartColors={baseChartColors}
              colors={WATERFALL_CHART_COLORS}
              size="responsive"
              options={waterfallOptions}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <BrandAvatarList
              dataTestId={
                dataTestId ? `${dataTestId}-waterfall-chart-section` : undefined
              }
              data={data?.brandsAvatar?.data}
              length={data?.labels?.length}
              borderConfig={{ marginLeft: 24, marginRight: 24 }}
              gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
            />
          </div>

          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <ComparisonLine
              dataTestId={
                dataTestId ? `${dataTestId}-waterfall-chart-section` : undefined
              }
              data={data?.comparisonLine?.data || []}
              gridColumnsLength={data?.labels?.length}
              borderConfig={{ marginLeft: 16, marginRight: 16 }}
              gridConfig={{ paddingLeft: 4, paddingRight: 8 }}
              trendColors={WATERFALL_TREND_COLORS}
            />
          </div>
        </>
      )}
    </DataStateHandler>
  );
};
