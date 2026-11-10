import { CellClassParams } from 'ag-grid-community';
import { ColumnDefsConfig } from 'components';
import { cellClass } from 'components/Table/cellClass';

import { FirstColumnCellRenderer } from './cellRenderer';

export const TOTAL_VALUE = 'Total';

const portfolioClasses = {
  Megabrands: 'ag-cell-megabrands',
  Expansion: 'ag-cell-expansion',
  Sustain: 'ag-cell-sustain',
  Tail: 'ag-cell-tail',
};

const cellClassExportTable = (
  params: CellClassParams,
  additionalClasses?: string[],
) => {
  const prioritiesConfig =
    params.data?.priorities_config || params.data?.growth_levers_config;
  const portfolioValue = params.data?.portfolio;
  const prioritiesValue = params.data?.priorities;

  const classes = [...(additionalClasses || [])];

  if (portfolioValue === TOTAL_VALUE || prioritiesValue === TOTAL_VALUE) {
    classes.push('total');
  }

  if (prioritiesConfig?.aggregated) {
    classes.push('aggregated');
  }

  if (prioritiesConfig?.isBeyondBeer) {
    classes.push('beyond-beer');
  }

  if (portfolioClasses[params.value]) {
    classes.push(portfolioClasses[params.value]);
  }

  return [...cellClass(params), ...classes];
};

export const tableConfigs: ColumnDefsConfig = {
  portfolio: {
    minWidth: 248,
    cellClass: (params) => cellClassExportTable(params, []),
    cellRenderer: (params) => FirstColumnCellRenderer(params),
  },
  priorities: {
    minWidth: 248,
    cellClass: (params) => cellClassExportTable(params, []),
    cellRenderer: (params) => FirstColumnCellRenderer(params),
  },
  growth_levers: {
    minWidth: 248,
    cellClass: (params) => cellClassExportTable(params, []),
    cellRenderer: (params) => FirstColumnCellRenderer(params),
  },
  brands: {
    minWidth: 248,
    cellClass: (params) => cellClassExportTable(params, []),
    cellRenderer: (params) => FirstColumnCellRenderer(params),
  },
  markets: {
    minWidth: 248,
    cellClass: (params) => cellClassExportTable(params, []),
    cellRenderer: (params) => FirstColumnCellRenderer(params),
  },
  mtd: {
    cellClass: cellClassExportTable,
  },
  l3m: {
    cellClass: cellClassExportTable,
  },
  ytd: {
    cellClass: cellClassExportTable,
  },
};
