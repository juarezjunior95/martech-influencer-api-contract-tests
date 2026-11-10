import { ColumnDefsConfig } from 'components';

import { cellClass, portfolioCellClass, tooltipValueGetter } from './utils';

export const tableConfig: ColumnDefsConfig = {
  portfolio: {
    cellClass: portfolioCellClass,
    tooltipValueGetter,
    headerClass: 'ag-header-cell-portfolio',
    width: 180,
  },
  month_growth_contr: {
    cellClass,
  },
  month_weight: {
    cellClass,
  },
  month_vs_ly: {
    cellClass,
  },
  l3m_growth_contr: {
    cellClass,
  },
  l3m_weight: {
    cellClass,
  },
  l3m_vs_ly: {
    cellClass,
  },
  ytd_growth_contr: {
    cellClass,
  },
  ytd_weight: {
    cellClass,
  },
  ytd_vs_ly: {
    cellClass,
  },
};
