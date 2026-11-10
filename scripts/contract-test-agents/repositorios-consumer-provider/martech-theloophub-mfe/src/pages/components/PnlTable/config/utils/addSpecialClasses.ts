import { CellClassParams, HeaderClassParams } from 'ag-grid-community';
import { cellClass } from 'components/Table/cellClass';

import { headers, kpis, kpisWithRefresh, subHeaders } from '../constants';
import { brandsConfigs } from '../tableConfigs';

export const addSpecialClasses = (params: CellClassParams): string[] => {
  const classes = [...cellClass(params)];

  if (params.rowIndex === 0) {
    classes.push('ag-cell-first-row');
  }

  if (params.rowIndex > 16) {
    classes.push('ag-cell-without-border');
  }

  if (
    subHeaders.includes(params.data.kpi_mio_khl) ||
    subHeaders.includes(params.data.profit_loss)
  ) {
    classes.push('ag-cell-subheader-pnl');
  }

  if (
    headers.includes(params.data.kpi_mio_khl) ||
    headers.includes(params.data.profit_loss)
  ) {
    classes.push('ag-cell-header-pnl');
  }

  if (kpis.includes(params.data.profit_loss)) {
    classes.push('ag-cell-kpi-pnl');
  }

  if (kpisWithRefresh.includes(params.data.profit_loss)) {
    classes.push('ag-cell-kpi-with-refresh');
  }

  if (params.data.hasOwnProperty('profit_loss')) {
    const column = params.column;
    const parent = column.getParent();

    if (parent) {
      const siblings = parent.getChildren();
      const isLast = siblings.at(-1) === column;

      if (isLast) {
        classes.push('ag-last-child-pnl');
      } else if (params.rowIndex > 0) {
        classes.push('ag-not-last-child-pnl');
      }
    }
  }

  return classes;
};

export const getHeaderClass = (params: HeaderClassParams): string => {
  if (
    brandsConfigs.hasOwnProperty(params.colDef['field'].split('_')[0] + '_')
  ) {
    const column = params.column;
    const parent = column.getParent();

    if (parent) {
      const siblings = parent.getChildren();
      const isLast = siblings.at(-1) === column;
      if (isLast) {
        return 'ag-last-child-pnl';
      } else {
        return 'ag-not-last-child-pnl';
      }
    }
  }

  return '';
};
