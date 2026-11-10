import { CellClassParams } from 'ag-grid-community';
import { cellClass } from 'components/Table/cellClass';

import { ChartCellRenderer, DoubleValueRenderer } from '../cellRenderer';

const customCellClass = (params: CellClassParams) => {
  const classes = cellClass(params);
  const borderBottom = params.data?.id_config?.borderBottom;
  if (borderBottom) {
    classes.push('border-bottom');
  }
  return classes;
};

export const performanceConfig = (
  someRowWasSelected: boolean,
  headerComponentParams?: Record<string, any>,
) => ({
  id: {
    minWidth: 128,
    maxWidth: 128,
    headerComponentParams: {
      merge: true,
      ...headerComponentParams,
    },
    cellClass: customCellClass,
  },
  ac: {
    minWidth: 300,
    headerClass: ['ag-column-separator'],
    cellRenderer: (params) => ChartCellRenderer(params, someRowWasSelected),
    cellClass: customCellClass,
    headerComponentParams: { ...headerComponentParams },
  },
  ly: {
    headerClass: ['ag-column-separator'],
    cellRenderer: DoubleValueRenderer,
    cellClass: customCellClass,
    headerComponentParams: { ...headerComponentParams },
  },
});
