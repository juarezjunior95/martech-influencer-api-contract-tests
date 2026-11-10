import { memo, useMemo } from 'react';

import { DataStateHandler } from 'components';
import { TableDataType } from 'components/Table/types';
import {
  BarChartSection,
  BigNumbersSection,
  LineChartSection,
  SectionHeader,
} from 'pages/pillars/ValueCreation/VolumePages/components';

import {
  VOLUME_BAR_CHART_COLOR_CONFIG,
  VOLUME_BAR_CHART_LABEL_BACKGROUND,
  VOLUME_BAR_CHART_LEGEND_STYLE,
} from '../../../constants/barChartConfig';
import { GLOBAL_VOLUME_LINE_CHART_COLOR_CONFIG } from '../../../constants/lineChartConfig';
import { BarChartKpiData } from '../../../types';
import { ExportTable } from '../../ExportTable';
import {
  StyledBarChartAndMarketsContainer,
  StyledBarChartWrapper,
  StyledBigNumbersContainer,
  StyledBrandsSlideGrid,
  StyledLineChartContainer,
  StyledMarketsTableWrapper,
} from './BrandsSlide.styles';
import { BrandsSlideProps } from './types';

const DEFAULT_SKELETON_PROPS = {
  height: '396px',
  width: '100%',
  length: 1,
  borderRadius: 'none' as const,
};

const getMarketsRowHeight = (
  data: TableDataType,
  tableHeight: number,
  headerHeight: number,
  fallbackRows = 3,
) => {
  const rowCount = data?.rows?.flat()?.length || fallbackRows;
  return Math.floor((tableHeight - headerHeight) / rowCount);
};
const getBarColor = (data: BarChartKpiData, index: number): string => {
  if (data?.stripedIndexes?.includes(index))
    return VOLUME_BAR_CHART_COLOR_CONFIG['Budget'];
  if (index === data?.labels?.length - 1)
    return VOLUME_BAR_CHART_COLOR_CONFIG['Current Year'];
  return VOLUME_BAR_CHART_COLOR_CONFIG['Previous Year'];
};
const BrandsSlideComponent = ({
  loading,
  error,
  data,
  lineChartHeight = 400,
  tableHeight = 280,
  marketsTableHeaderHeight = 45,
  dataTestId,
}: BrandsSlideProps) => {
  const {
    bigNumbersKpiData,
    lineChartKpiData,
    barChartKpiData,
    marketsTableKpiData,
  } = data || {};

  const marketsRowHeight = useMemo(
    () =>
      getMarketsRowHeight(
        marketsTableKpiData,
        tableHeight,
        marketsTableHeaderHeight,
      ),
    [marketsTableKpiData, tableHeight, marketsTableHeaderHeight],
  );

  const comparisonLineHeight = useMemo(() => {
    if (!lineChartKpiData?.comparisonLine?.data) return 0;

    return lineChartKpiData?.comparisonLine?.data?.length * 42 + 44;
  }, [lineChartKpiData]);

  return (
    <StyledBrandsSlideGrid
      style={{
        gridTemplateRows: `152px ${lineChartHeight}px ${tableHeight}px`,
      }}
      data-testid={dataTestId ? `brands-slide-${dataTestId}` : undefined}
    >
      <StyledBigNumbersContainer
        data-testid={
          dataTestId ? `brands-slide-big-numbers-${dataTestId}` : undefined
        }
      >
        <BigNumbersSection
          dataTestId={dataTestId ? `${dataTestId}-brands-slide` : undefined}
          loading={loading}
          error={error}
          data={bigNumbersKpiData}
        />
      </StyledBigNumbersContainer>

      <StyledLineChartContainer>
        <LineChartSection
          dataTestId={dataTestId ? `${dataTestId}-brands-slide` : undefined}
          loading={loading}
          error={error}
          data={lineChartKpiData}
          chartHeight={`${lineChartHeight - comparisonLineHeight}px`}
          sectionHeader={
            <SectionHeader
              period={lineChartKpiData?.period}
              legends={lineChartKpiData?.legend}
              legendColorConfig={GLOBAL_VOLUME_LINE_CHART_COLOR_CONFIG}
            />
          }
          skeletonProps={{
            ...DEFAULT_SKELETON_PROPS,
            height: `${lineChartHeight}px`,
          }}
        />
      </StyledLineChartContainer>

      <StyledBarChartAndMarketsContainer
        data-testid={
          dataTestId ? `brands-slide-bar-and-markets-${dataTestId}` : undefined
        }
      >
        <StyledBarChartWrapper>
          <BarChartSection
            dataTestId={
              dataTestId ? `${dataTestId}-brands-slide-bar-chart` : undefined
            }
            loading={loading}
            error={error}
            data={barChartKpiData}
            chartHeight={`${226 - barChartKpiData?.comparisonLine?.data?.length * 42}px`}
            drawZeroLine={false}
            showLabels
            size="xlarge"
            alwaysShowDataLabels
            datalabelsPosition="internal"
            labelColors={{ internal: '#141414', external: '#141414' }}
            getBarColor={getBarColor}
            labelBackgroundColor={VOLUME_BAR_CHART_LABEL_BACKGROUND}
            skeletonProps={{
              ...DEFAULT_SKELETON_PROPS,
              height: `${226 - barChartKpiData?.comparisonLine?.data?.length * 42}px`,
            }}
            sectionHeader={
              <SectionHeader
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-brands-slide-bar-chart-header`
                    : undefined
                }
                period={barChartKpiData?.period}
                legends={barChartKpiData?.legend}
                legendColorConfig={VOLUME_BAR_CHART_COLOR_CONFIG}
                legendShape={VOLUME_BAR_CHART_LEGEND_STYLE.shape}
                legendSize={VOLUME_BAR_CHART_LEGEND_STYLE.size}
              />
            }
          />
        </StyledBarChartWrapper>

        <StyledMarketsTableWrapper>
          <DataStateHandler
            dataTestId={
              dataTestId ? `${dataTestId}-brands-slide-markets` : undefined
            }
            loading={false}
            error={null}
            empty={marketsTableKpiData?.rows?.length === 0}
            skeletonProps={{
              height: `${tableHeight}px`,
              width: '100%',
              length: 1,
              borderRadius: 'medium',
            }}
          >
            <ExportTable
              tableHeight={tableHeight}
              dataTestId={
                dataTestId
                  ? `${dataTestId}-brands-slide-export-markets`
                  : undefined
              }
              data={marketsTableKpiData}
              headerHeight={marketsTableHeaderHeight}
              rowHeight={marketsRowHeight}
            />
          </DataStateHandler>
        </StyledMarketsTableWrapper>
      </StyledBarChartAndMarketsContainer>
    </StyledBrandsSlideGrid>
  );
};

export const BrandsSlide = memo(BrandsSlideComponent);
