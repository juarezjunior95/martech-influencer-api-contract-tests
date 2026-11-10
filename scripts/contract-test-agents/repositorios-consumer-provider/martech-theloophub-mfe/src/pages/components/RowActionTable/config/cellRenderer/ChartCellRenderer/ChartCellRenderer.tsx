import { GroupCellRendererParams } from 'ag-grid-community';
import { BarY } from 'components/Chart';
import { TableCellType } from 'components/Table/types';

const getColumnMaxValue = (api: any, field: string): number => {
  let maxValue = 0;

  api.forEachNode((node: any) => {
    if (node.data) {
      const config = node.data[field + '_config'] as TableCellType;
      if (config?.chartData?.data && Array.isArray(config.chartData.data)) {
        const cellMax = Math.max(...(config.chartData.data as number[]));
        maxValue = Math.max(maxValue, cellMax);
      }
    }
  });
  return maxValue;
};

const calculateOptimalScale = (maxValue: number): number => {
  if (maxValue <= 0) {
    return 0;
  }
  return Math.ceil(maxValue * 1.01);
};

export const ChartCellRenderer = (
  params: GroupCellRendererParams,
  someRowWasSelected: boolean,
  chartHeight = 24,
  externalScale?: number,
  dataTestId?: string,
): JSX.Element => {
  const field = params.colDef.field;
  const config = params.data[field + '_config'] as TableCellType;
  const id = params.data.id;
  const selectedRows = params.api.getSelectedRows();
  const isRowSelected = selectedRows.some((row) => row.id === id);
  const headerComponentParams = params.colDef.headerComponentParams;
  const headerGroupComponentParams = (params.colDef as any)
    .headerGroupComponentParams;

  const chartBackground =
    headerComponentParams?.chartBackground ||
    headerGroupComponentParams?.chartBackground;

  let finalValue: any = params.value;

  if (config?.chartData?.data) {
    let backgroundColor =
      !someRowWasSelected || isRowSelected
        ? config.chartData?.backgroundColor
        : config.chartData?.secondaryBackgroundColor;

    if (chartBackground) {
      backgroundColor = chartBackground;
    }

    const chartData = config.chartData.data as number[];
    const columnMaxValue =
      externalScale ?? getColumnMaxValue(params.api, field);
    const optimalScale = calculateOptimalScale(columnMaxValue);

    finalValue = (
      <BarY
        dataTestId={
          dataTestId ? `${dataTestId}-chart-cell-renderer` : undefined
        }
        chartData={{
          data: chartData,
          backgroundColor: backgroundColor,
          label: chartData.map((_, index) => index.toString()),
          barThickness: chartHeight,
        }}
        scale={optimalScale}
      />
    );
  }
  return (
    <div
      data-testid={dataTestId ? `chart-cell-renderer-${dataTestId}` : undefined}
      className="ag-cell-content"
    >
      {finalValue}
    </div>
  );
};
