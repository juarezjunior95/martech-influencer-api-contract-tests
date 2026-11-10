import { memo, ReactNode, useMemo } from 'react';

import { DataStateHandler } from 'components';
import { TableDataType } from 'components/Table/types';
import { SectionHeader } from 'pages/components/SectionHeader';
import { ExportTable } from 'pages/pillars/ValueCreation/VolumePages/components/ExportTable';
import { BigNumbersSection } from 'pages/pillars/ValueCreation/VolumePages/components/Sections/BigNumbersSection';
import { LineChartSection } from 'pages/pillars/ValueCreation/VolumePages/components/Sections/LineChartSection';
import { GLOBAL_VOLUME_LINE_CHART_COLOR_CONFIG } from 'pages/pillars/ValueCreation/VolumePages/constants/lineChartConfig';

import {
  StyledBigNumberContainer,
  StyledLineChartContainer,
  StyledSliderGrid,
  StyledTables,
} from './SlideContent.styles';
import { SlideContentProps, SlideTableId } from './types';

const shouldRenderTable = (table: TableDataType | undefined) => {
  if (!table) return false;
  if (table?.empty === true) return false;
  if (table?.rows?.length > 0) return true;
  return false;
};

const DEFAULT_TABLE_ORDER: SlideTableId[] = [
  'priorities',
  'portfolio',
  'markets',
];

const getRowHeight = (
  data: TableDataType,
  tableHeight: number,
  headerHeight: number,
  fallbackRows = 4,
) => {
  const rowCount = data?.rows?.flat()?.length || fallbackRows;
  if (rowCount === 0) return 0;
  return Math.floor((tableHeight - headerHeight) / rowCount);
};

const SlideContentComponent = ({
  loading,
  error,
  data,
  tableOrder = DEFAULT_TABLE_ORDER,
  prioritiesTableHeaderHeight = 45,
  portfolioTableHeaderHeight = 45,
  tableHeight = 238,
  lineChartHeight = 400,
  marketsTableHeaderHeight = 45,
  adaptiveLayout = false,
  dataTestId,
}: SlideContentProps) => {
  const {
    bigNumbersKpiData,
    lineChartKpiData,
    portfolioTableKpiData,
    prioritiesTableKpiData,
    marketsTableKpiData,
  } = data || {};

  const prioritiesRowHeight = useMemo(
    () =>
      getRowHeight(
        prioritiesTableKpiData,
        tableHeight,
        prioritiesTableHeaderHeight,
      ),
    [prioritiesTableKpiData, tableHeight, prioritiesTableHeaderHeight],
  );

  const portfolioRowHeight = useMemo(
    () =>
      getRowHeight(
        portfolioTableKpiData,
        tableHeight,
        portfolioTableHeaderHeight,
      ),
    [portfolioTableKpiData, tableHeight, portfolioTableHeaderHeight],
  );

  const marketsRowHeight = useMemo(
    () =>
      getRowHeight(marketsTableKpiData, tableHeight, marketsTableHeaderHeight),
    [marketsTableKpiData, tableHeight, marketsTableHeaderHeight],
  );

  const comparisonLineHeight = useMemo(() => {
    if (!lineChartKpiData?.comparisonLine?.data) return 0;

    return lineChartKpiData?.comparisonLine?.data?.length * 42 + 44;
  }, [lineChartKpiData]);

  const showPortfolioTable = shouldRenderTable(portfolioTableKpiData);
  const showPrioritiesTable = shouldRenderTable(prioritiesTableKpiData);
  const showMarketsTable = shouldRenderTable(marketsTableKpiData);

  const tableBandHeight = tableHeight - 15;

  const hasAnyTable =
    showPortfolioTable || showPrioritiesTable || showMarketsTable;
  const collapseTablesIntoChart = adaptiveLayout && !hasAnyTable;
  const lineChartRowPx = collapseTablesIntoChart
    ? lineChartHeight + tableBandHeight
    : lineChartHeight;
  const tablesBlockHeight = collapseTablesIntoChart ? 0 : tableBandHeight;

  const tableMap = useMemo<Record<SlideTableId, ReactNode>>(() => {
    return {
      priorities: showPrioritiesTable ? (
        <DataStateHandler
          key="priorities"
          dataTestId={
            dataTestId ? `${dataTestId}-slide-content-priorities` : undefined
          }
          loading={loading}
          error={error}
          empty={prioritiesTableKpiData?.rows?.length === 0}
          skeletonProps={{
            height: `${tableHeight}px`,
            width: '100%',
            length: 1,
            borderRadius: 'medium',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <ExportTable
              tableHeight={tableHeight}
              dataTestId={
                dataTestId
                  ? `${dataTestId}-slide-content-export-priorities`
                  : undefined
              }
              data={prioritiesTableKpiData || { header: [], rows: [] }}
              headerHeight={prioritiesTableHeaderHeight}
              rowHeight={prioritiesRowHeight}
            />
          </div>
        </DataStateHandler>
      ) : null,

      portfolio: showPortfolioTable ? (
        <DataStateHandler
          key="portfolio"
          dataTestId={
            dataTestId ? `${dataTestId}-slide-content-portfolio` : undefined
          }
          loading={loading}
          error={error}
          empty={portfolioTableKpiData?.rows?.length === 0}
          skeletonProps={{
            height: `${tableHeight}px`,
            width: '100%',
            length: 1,
            borderRadius: 'medium',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <ExportTable
              tableHeight={tableHeight}
              dataTestId={
                dataTestId
                  ? `${dataTestId}-slide-content-export-portfolio`
                  : undefined
              }
              data={portfolioTableKpiData || { header: [], rows: [] }}
              headerHeight={portfolioTableHeaderHeight}
              rowHeight={portfolioRowHeight}
            />
          </div>
        </DataStateHandler>
      ) : null,

      markets: showMarketsTable ? (
        <DataStateHandler
          key="markets"
          dataTestId={
            dataTestId ? `${dataTestId}-slide-content-markets` : undefined
          }
          loading={loading}
          error={error}
          empty={marketsTableKpiData?.rows?.length === 0}
          skeletonProps={{
            height: `${tableHeight}px`,
            width: '100%',
            length: 1,
            borderRadius: 'medium',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <ExportTable
              tableHeight={tableHeight}
              dataTestId={
                dataTestId
                  ? `${dataTestId}-slide-content-export-markets`
                  : undefined
              }
              data={marketsTableKpiData}
              headerHeight={marketsTableHeaderHeight}
              rowHeight={marketsRowHeight}
            />
          </div>
        </DataStateHandler>
      ) : null,
    };
  }, [
    showPrioritiesTable,
    showPortfolioTable,
    showMarketsTable,
    loading,
    error,
    prioritiesTableKpiData,
    portfolioTableKpiData,
    marketsTableKpiData,
    tableHeight,
    dataTestId,
    prioritiesTableHeaderHeight,
    portfolioTableHeaderHeight,
    marketsTableHeaderHeight,
    prioritiesRowHeight,
    portfolioRowHeight,
    marketsRowHeight,
  ]);

  return (
    <StyledSliderGrid
      style={{
        gridTemplateRows: `152px ${lineChartRowPx}px ${tablesBlockHeight}px`,
      }}
      data-testid={dataTestId ? `slide-content-${dataTestId}` : undefined}
    >
      <StyledBigNumberContainer
        data-testid={
          dataTestId ? `big-number-and-line-chart-${dataTestId}` : undefined
        }
      >
        <BigNumbersSection
          dataTestId={dataTestId ? `${dataTestId}-slide-content` : undefined}
          loading={loading}
          error={error}
          data={bigNumbersKpiData}
        />
      </StyledBigNumberContainer>

      <StyledLineChartContainer>
        <LineChartSection
          dataTestId={dataTestId ? `${dataTestId}-slide-content` : undefined}
          loading={loading}
          error={error}
          data={lineChartKpiData}
          chartHeight={`${lineChartRowPx - comparisonLineHeight}px`}
          sectionHeader={
            <SectionHeader
              period={lineChartKpiData?.period}
              legends={lineChartKpiData?.legend}
              legendColorConfig={GLOBAL_VOLUME_LINE_CHART_COLOR_CONFIG}
            />
          }
          skeletonProps={{
            height: `${lineChartRowPx}px`,
            width: '100%',
            length: 1,
            borderRadius: 'none',
          }}
        />
      </StyledLineChartContainer>

      <StyledTables
        data-testid={
          dataTestId ? `slide-content-tables-${dataTestId}` : undefined
        }
      >
        {tableOrder.map((tableId) => tableMap[tableId])}
      </StyledTables>
    </StyledSliderGrid>
  );
};

export const SlideContent = memo(SlideContentComponent);
