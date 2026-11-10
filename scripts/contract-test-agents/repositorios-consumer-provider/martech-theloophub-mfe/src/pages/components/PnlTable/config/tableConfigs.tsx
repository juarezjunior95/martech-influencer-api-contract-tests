import { ColumnDefsConfig } from 'components';

import { addSpecialClasses, getHeaderClass } from './utils';

const baseColumnConfig = {
  minWidth: 100,
  headerClass: getHeaderClass,
  cellClass: addSpecialClasses,
};

export const createColumnConfig = (
  headerClass?: string,
  minWidth?: number,
) => ({
  ...baseColumnConfig,
  headerClass: headerClass || baseColumnConfig.headerClass,
  minWidth: minWidth || baseColumnConfig.minWidth,
  cellClass: addSpecialClasses,
});

const portfolioConfigs: ColumnDefsConfig = {
  KPI: {
    headerClass: 'ag-header-cell-kpi',
  },
  kpi_mio_khl: {
    ...baseColumnConfig,
    minWidth: 200,
  },
  'TT ABI (BEER + ADJ)': {
    headerClass: 'ag-header-cell-tt-abi',
  },
  tt_abi_ac: createColumnConfig(),
  tt_abi_og_vs_ly: createColumnConfig(),
  Megabrands: {
    headerClass: 'ag-header-cell-megabrands',
  },
  megabrands_ac: createColumnConfig(),
  megabrands_og_vs_ly: createColumnConfig(),
  Expansion: {
    headerClass: 'ag-header-cell-expansion',
  },
  expansion_ac: createColumnConfig(),
  expansion_og_vs_ly: createColumnConfig(),
  Sustain: {
    headerClass: 'ag-header-cell-sustain',
  },
  sustain_ac: createColumnConfig(),
  sustain_og_vs_ly: createColumnConfig(),
  Tail: {
    headerClass: 'ag-header-cell-tail',
  },
  tail_ac: createColumnConfig(),
  tail_og_vs_ly: createColumnConfig(),
};

const deepDiveConfigs: ColumnDefsConfig = {
  'Organic Growth': {
    headerClass: 'ag-header-cell-organic-growth',
  },
  Period: {
    headerClass: 'ag-header-cell-period',
  },
  organic_growth_vs_bu_mio: createColumnConfig(undefined, 140),
  organic_growth_vs_bu: createColumnConfig(undefined, 140),
  organic_growth_vs_ly_mio: createColumnConfig(undefined, 140),
  organic_growth_vs_ly: createColumnConfig(undefined, 140),
  py_ac: createColumnConfig(undefined, 140),
  cy_bu: createColumnConfig(undefined, 140),
  cy_ac: createColumnConfig(undefined, 140),
};

export const brandsConfigs = (isExportPage: boolean): ColumnDefsConfig => {
  return {
    KPI: {
      headerClass: 'ag-header-cell-kpi',
      pinned: 'left',
      lockPinned: true,
    },
    profit_loss: {
      ...createColumnConfig(null, 208),
      pinned: 'left',
      lockPinned: true,
      ...(isExportPage ? { maxWidth: 208 } : {}),
    },
    'TT Market': {
      headerClass: 'ag-header-cell-tt-market',
      pinned: 'left',
      lockPinned: true,
    },
    tt_market_beer_adj: {
      ...createColumnConfig(null, 110),
      pinned: 'left',
      lockPinned: true,
      ...(isExportPage ? { maxWidth: 110 } : {}),
    },
    Megabrands: {
      headerClass: 'ag-header-cell-megabrands',
    },
    Expansion: {
      headerClass: 'ag-header-cell-expansion',
    },
    Tail: {
      headerClass: 'ag-header-cell-tail',
    },
    Sustain: {
      headerClass: 'ag-header-cell-sustain',
    },
    megabrands_: createColumnConfig(null, 110),
    expansion_: createColumnConfig(null, 110),
    sustain_: createColumnConfig(null, 110),
    tail_: createColumnConfig(null, 110),
  };
};

export const tableConfigs = (isExportPage: boolean): ColumnDefsConfig => ({
  ...portfolioConfigs,
  ...deepDiveConfigs,
  ...brandsConfigs(isExportPage),
});
