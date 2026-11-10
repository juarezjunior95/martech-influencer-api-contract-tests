import {
  CellClassParams,
  CellStyle,
  ColSpanParams,
  ColumnResizedEvent,
  RowHeightParams,
  RowSpanParams,
} from 'ag-grid-community';
import { getVariationColor } from 'utils/getColor';

import { ROW_HEIGHT_EMPTY } from '../constants';

export const getRowHeight = (
  params: RowHeightParams,
  rowHeight: number,
  callbackRowHeight: (params: RowHeightParams) => number,
): number => {
  if (params.data.isEmpty) return ROW_HEIGHT_EMPTY;
  if (callbackRowHeight) return callbackRowHeight(params);
  return rowHeight;
};

export const getRowClass = (params: any) => {
  if (params.data?.isEmpty) return 'ag-row-empty';
  return '';
};

export const rowSpan = (params: RowSpanParams): number => {
  const merge = params.colDef.headerComponentParams?.merge;
  if (merge === undefined || !merge) {
    return 1;
  }

  let span = 0;
  params.api.forEachNode((node) => {
    if (node.data[params.colDef.field] === params.data[params.colDef.field]) {
      span++;
    }
  });

  return span;
};

export const cellStyle = (params: CellClassParams) => {
  const styles: CellStyle = {};
  const config = params.node.data[params.colDef.field + '_config'];

  if (config?.variationColor) {
    styles.color = getVariationColor(config.variationColor);
    return styles;
  }

  const colorKey = config?.variationDirection || config?.trend;
  if (colorKey) {
    styles.color = getVariationColor(colorKey);
  }

  return styles;
};

export const colSpan = (params: ColSpanParams): number => {
  const config = params.data[params.colDef.field + '_config'];
  const merge = config?.colSpan;
  if (merge === undefined || !merge) return 1;
  return merge;
};

export const tooltipValueGetter = (params: any): string => {
  const config = params.data[params.colDef.field + '_config'];
  const tooltip = config?.tooltip;
  if (tooltip === undefined || !tooltip) return '';
  return tooltip;
};

export const onColumnResized = (
  event: ColumnResizedEvent<any, any>,
  containerRef: React.RefObject<any>,
) => {
  const cells: NodeListOf<HTMLElement> = containerRef.current.querySelectorAll(
    '.ag-header-cell, .ag-header-group-cell, .ag-cell',
  );

  cells.forEach((cell: HTMLElement) => {
    const inlineWidth: string | null = cell.style.width;
    if (inlineWidth) {
      cell.style.setProperty('--width', inlineWidth);
    }

    const inlineLeft: string | null = cell.style.left;
    if (inlineLeft) {
      cell.style.setProperty('--left', inlineLeft);
    }
  });
};
