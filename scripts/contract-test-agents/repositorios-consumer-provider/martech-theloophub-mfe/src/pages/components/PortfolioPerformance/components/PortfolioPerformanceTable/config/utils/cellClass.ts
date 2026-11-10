import { CellClassParams } from 'ag-grid-community';
import { cellClass as tableCellClass } from 'components/Table/cellClass';

export const cellClass = (params: CellClassParams) => {
  const classes = [...tableCellClass(params)];
  const field = params.colDef.field;
  const config = params.data?.[`${field}_config`];

  if (config?.variationColor === 'neutral') {
    classes.push('ag-cell-total-hundred-metric');
  }

  if (
    field === 'brands_vol_og_vs_ly' &&
    params.rowIndex === params.api.getDisplayedRowCount() - 1
  ) {
    return ['ag-hidden-cell'];
  }

  if (params.rowIndex === 1) {
    classes.push('ag-cell-first-row');
  }

  if (config?.radiusTop || config?.radiusLeft) {
    classes.push('ag-cell-first-row');
  }

  if (config?.radiusRight) {
    classes.push('ag-cell-last-row');
  }
  if (
    !config?.radiusRight &&
    !config?.radiusLeft &&
    params.rowIndex === params.api.getDisplayedRowCount() - 1
  ) {
    classes.push('ag-cell-last-row');
  }

  return classes;
};
