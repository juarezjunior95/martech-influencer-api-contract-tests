import { ColumnDefsConfig } from 'components';

import { BrandsTooltip } from '../../BrandsTooltip';
import { cellClass, portfolioCellClass, tooltipValueGetter } from './utils';

export const tableConfig: ColumnDefsConfig = {
  portfolio: {
    cellClass: portfolioCellClass,
    tooltipValueGetter,
    headerClass: 'ag-header-cell-portfolio',
    width: 180,
  },
  volume_growth_contr: {
    cellClass,
  },
  volume_weight: {
    cellClass,
  },
  volume_vs_ly: {
    cellClass,
  },
  net_revenue_vs_ly: {
    cellClass,
    headerClass: 'ag-header-cell-span-vs-ly',
  },
  cores_vs_ly: {
    cellClass,
    headerClass: 'ag-header-cell-hide',
  },
  brand_power_vs_ly: {
    cellClass,
    headerClass: 'ag-header-cell-hide',
  },
  sm_of_maco: {
    cellClass,
  },
  sm_weight: {
    cellClass,
  },
  brands_vol_og_vs_ly: {
    cellClass,
  },
  Brands: {
    headerGroupComponentParams: {
      tooltip: true,
    },
    headerTooltip: BrandsTooltip({}) as unknown as string,
  },
  brands_vol_og_vs_ytd: {
    cellClass,
  },
};
