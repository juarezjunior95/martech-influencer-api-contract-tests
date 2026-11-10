import React, { useMemo } from 'react';

import {
  Bar,
  BrandAvatarList,
  ComparisonLine,
  DataStateHandler,
  Skeleton,
} from 'components';
import { DataLabelContext } from 'components/Chart/Bar/Bar/types';
import { calculateMin, getChartSuggestedMinMax } from 'components/Chart/utils';
import { BarChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';
import { StyledSectionHeaderContainer } from 'pages/pillars/ValueCreation/VolumePages/VolumePages.styles';

import { getBaseLineColors } from '../../../constants/baseLineColors';

interface BarChartSectionProps {
  loading: boolean;
  error: Error | null;
  data: BarChartKpiData;
  skeletonProps: React.ComponentProps<typeof Skeleton>;
  chartHeight: string;
  sectionHeader?: React.ReactNode;
  drawZeroLine?: React.ComponentProps<typeof Bar>['drawZeroLine'];
  centerZeroLine?: boolean;
  datalabelsPosition?: React.ComponentProps<typeof Bar>['datalabelsPosition'];
  showLabels?: React.ComponentProps<typeof Bar>['showLabels'];
  alwaysShowDataLabels?: React.ComponentProps<
    typeof Bar
  >['alwaysShowDataLabels'];
  labelColors?: React.ComponentProps<typeof Bar>['labelColors'];
  labelBackgroundColor?: React.ComponentProps<
    typeof Bar
  >['labelBackgroundColor'];
  size?: React.ComponentProps<typeof Bar>['size'];
  getBarColor?: (data: BarChartKpiData, index: number) => string;
  dataTestId?: string;
}

export const BarChartSection: React.FC<BarChartSectionProps> = ({
  loading,
  error,
  data,
  skeletonProps,
  chartHeight,
  sectionHeader = null,
  drawZeroLine = true,
  centerZeroLine = false,
  datalabelsPosition = 'external',
  showLabels = false,
  alwaysShowDataLabels = false,
  labelColors = { internal: 'white', external: '#141414' },
  labelBackgroundColor,
  getBarColor,
  size = 'medium',
  dataTestId,
}) => {
  const baseChartColors = getBaseLineColors(data?.baseChartColors);
  const resolvedLabelBackgroundColor = useMemo(() => {
    if (!labelBackgroundColor || typeof labelBackgroundColor === 'function') {
      return labelBackgroundColor;
    }

    const color = labelBackgroundColor;
    return (context: DataLabelContext) => {
      return data?.stripedIndexes?.includes(context.dataIndex) ? color : null;
    };
  }, [labelBackgroundColor, data?.stripedIndexes]);

  const barDatasets = useMemo(() => {
    if (!getBarColor || !data?.datasets) return data?.datasets;

    return data.datasets.map((dataset) => {
      const originalBg = dataset.backgroundColor;
      if (!Array.isArray(originalBg)) return dataset;

      return {
        ...dataset,
        backgroundColor: originalBg.map(
          (_, i) => getBarColor(data, i) || originalBg[i],
        ),
      };
    });
  }, [data?.datasets, data?.labels, data?.stripedIndexes, getBarColor]);

  const { min, max } = useMemo(
    () => (data ? getChartSuggestedMinMax(data, 0.45) : { min: 0, max: 0 }),
    [data],
  );
  const range = Math.abs(max) + Math.abs(min);
  const padding = range * 0.1;

  const maxAbs = centerZeroLine ? Math.max(Math.abs(max), Math.abs(min)) : null;
  const adjustedMin = centerZeroLine ? -maxAbs - padding : min;
  const adjustedMax = centerZeroLine ? maxAbs + padding : max + padding;

  return (
    <DataStateHandler
      dataTestId={dataTestId ? `${dataTestId}-bar-chart-section` : undefined}
      loading={loading}
      error={(error || !barDatasets) && !data?.empty}
      empty={data?.empty}
      skeletonProps={skeletonProps}
    >
      {sectionHeader && (
        <StyledSectionHeaderContainer
          data-testid={
            dataTestId ? `bar-chart-section-header-${dataTestId}` : undefined
          }
        >
          {sectionHeader}
        </StyledSectionHeaderContainer>
      )}

      {!!data && (
        <>
          <div style={{ height: chartHeight }}>
            <Bar
              dataTestId={
                dataTestId ? `${dataTestId}-bar-chart-section` : undefined
              }
              datasets={barDatasets}
              labels={data?.labels}
              formattedData={data?.formattedData}
              baseChartColors={baseChartColors}
              datalabelsPosition={datalabelsPosition}
              labelColors={labelColors}
              labelBackgroundColor={resolvedLabelBackgroundColor}
              highlightLabels={data?.highlightLabels}
              stripedIndexes={data?.stripedIndexes}
              roundedArrow={data?.roundedArrow}
              connector={data?.connector}
              axisType="none"
              showLabels={showLabels}
              alwaysShowDataLabels={alwaysShowDataLabels}
              showGrid={false}
              drawZeroLine={drawZeroLine}
              size={size}
              options={{
                layout: {
                  padding: {
                    top: data?.roundedArrow || data?.connector ? 80 : 10,
                  },
                },
                scales: {
                  y: {
                    max: adjustedMax,
                    min: centerZeroLine
                      ? adjustedMin
                      : calculateMin(min, padding),
                  },
                },
              }}
            />
          </div>
          {data?.brandsAvatar?.data && (
            <BrandAvatarList
              dataTestId={
                dataTestId ? `${dataTestId}-bar-chart-section` : undefined
              }
              data={data?.brandsAvatar.data}
              length={data?.labels?.length}
              borderConfig={{ marginLeft: 16, marginRight: 16 }}
              gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
            />
          )}
          <div style={{ marginTop: 16 }}>
            <ComparisonLine
              dataTestId={
                dataTestId ? `${dataTestId}-line-bar-chart-section` : undefined
              }
              data={data?.comparisonLine?.data}
              gridColumnsLength={data?.labels?.length}
              borderConfig={{ marginLeft: 16, marginRight: 16 }}
              gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
            />
          </div>
        </>
      )}
    </DataStateHandler>
  );
};
