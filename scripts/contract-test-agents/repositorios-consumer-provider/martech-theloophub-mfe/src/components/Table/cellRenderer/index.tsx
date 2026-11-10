import type { ReactNode } from 'react';

import { ColDef, GroupCellRendererParams } from 'ag-grid-community';
import { formatNumber } from 'utils/format';
import { isImage, isNumber } from 'utils/regex';
import { sanitizeDataTestId } from 'utils/sanitizeDataTestId';

import { ImgRenderer } from '../components';
import { TableCellType } from '../types';
import {
  BrandsRenderer,
  ChartRenderer,
  GanttChartRenderer,
  TagRenderer,
  TooltipRenderer,
  UnitMeasureRenderer,
} from './components';
import { ChartLengendRenderer } from './components/ChartLegendRenderer';
import { SubtitleRenderer } from './components/SubtitleRenderer';

function resolveCellDataTestId(
  field: string | undefined,
  colId: string | undefined | null,
  config: TableCellType | undefined,
): string {
  const sanitizedField = field ? sanitizeDataTestId(field) : 'unknown';
  const sanitizedColId = colId ? sanitizeDataTestId(colId) : '';
  const defaultDataTestId = sanitizedColId
    ? `${sanitizedField}-${sanitizedColId}`
    : sanitizedField;

  return config?.dataTestId ? config.dataTestId : defaultDataTestId;
}

type BuildRenderedCellValueArgs = {
  // Cell values from AG Grid are intentionally untyped (numbers, strings, nested objects).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  config: TableCellType | undefined;
  colDef: ColDef;
  posKpi?: string;
  columnMaxValue: number | undefined;
  cellDataTestId: string;
  hasTooltip: boolean;
  formatValueFn?: (value: number) => string;
};

function buildRenderedCellValue({
  value,
  config,
  colDef,
  posKpi,
  columnMaxValue,
  cellDataTestId,
  hasTooltip,
  formatValueFn,
}: BuildRenderedCellValueArgs): ReactNode {
  let finalValue: ReactNode = value ?? '';

  if (isNumber.test(value) && typeof value === 'number') {
    finalValue = formatNumber(value);
  }

  if (config?.chartData) {
    const headerParams = colDef.headerComponentParams;
    const headerGroupParams = (
      colDef as ColDef & {
        headerGroupComponentParams?: { chartBackground?: string };
      }
    ).headerGroupComponentParams;

    const chartBackground =
      headerParams?.chartBackground || headerGroupParams?.chartBackground;
    finalValue = (
      <ChartRenderer
        config={config}
        posKpi={posKpi}
        columnMaxValue={columnMaxValue}
        dataTestId={cellDataTestId}
        chartBackground={chartBackground}
        formatValueFn={formatValueFn}
      />
    );
  }

  if (config?.brands) {
    finalValue = (
      <BrandsRenderer brands={config.brands} dataTestId={cellDataTestId} />
    );
  }

  if (isImage.test(value)) {
    finalValue = (
      <ImgRenderer
        src={value}
        name={config.imgName}
        dataTestId={cellDataTestId}
      />
    );
  }

  if (config?.unitMeasure && finalValue !== '') {
    finalValue = (
      <UnitMeasureRenderer
        value={finalValue}
        unitMeasure={config.unitMeasure}
      />
    );
  }

  if (config?.subtitle) {
    finalValue = (
      <SubtitleRenderer value={finalValue} subtitle={config.subtitle} />
    );
  }

  if (config?.chartLegend) {
    finalValue = (
      <ChartLengendRenderer
        title={config.chartLegend.title}
        legend={config.chartLegend.values}
        dataTestId={cellDataTestId}
      />
    );
  }

  if (config?.ganttData) {
    finalValue = (
      <GanttChartRenderer
        ganttData={config.ganttData}
        dataTestId={cellDataTestId}
      />
    );
  }

  if (config?.tag?.value) {
    finalValue = (
      <TagRenderer tagData={config.tag} dataTestId={cellDataTestId} />
    );
  }

  if (hasTooltip) {
    finalValue = <TooltipRenderer value={finalValue} />;
  }

  if (config?.prefix) {
    finalValue = (
      <>
        {config.prefix}
        {finalValue}
      </>
    );
  }

  return finalValue;
}

export const cellRenderer = (params: GroupCellRendererParams): JSX.Element => {
  const field = params.colDef.field;
  const rawValue = params.value;
  const value =
    rawValue == null ||
    (typeof rawValue === 'number' && !Number.isFinite(rawValue)) ||
    rawValue === 'NaN'
      ? ''
      : rawValue;
  const config = params.data[field + '_config'] as TableCellType;
  const posKpi = params.context?.posKpi;
  const columnMaxValues = params.context?.columnMaxValues;
  const columnMaxValue = field ? columnMaxValues?.[field] : undefined;
  const formatValueFn = params.context?.formatValueFn;
  const hasTooltip = !!params.colDef?.tooltipValueGetter?.(
    // AG Grid tooltip getter typing does not match GroupCellRendererParams.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params as unknown as any,
  );

  const colId = params.column?.getColId();
  const cellDataTestId = resolveCellDataTestId(field, colId, config);

  const finalValue = buildRenderedCellValue({
    value,
    config,
    colDef: params.colDef,
    posKpi: posKpi as string | undefined,
    columnMaxValue,
    cellDataTestId,
    hasTooltip,
    formatValueFn,
  });

  return (
    <div className="ag-cell-content" data-testid={`cell-${cellDataTestId}`}>
      {finalValue}
    </div>
  );
};
