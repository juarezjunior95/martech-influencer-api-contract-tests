import { CellStyle } from 'ag-grid-community';
import { ColumnDefsConfig } from 'components';
import { createColumnConfig } from 'pages/components/PnlTable/config/tableConfigs';

export const getVariationColor = (trend: string) => {
  if (trend === 'up' || trend === 'positive') return '#2d8813';
  if (trend === 'down' || trend === 'negative') return '#d33636';

  return trend;
};

export const cellStyle = (params) => {
  const styles: CellStyle = {};
  const config = params.node.data[params.colDef.field + '_config'];
  const colorKey = config?.variationDirection || config?.trend;
  if (colorKey) {
    styles.color = getVariationColor(colorKey);
  }

  return styles;
};

export const PNL_BRANDS_VOLUME_PAGES_EXPORT_TABLE_CONFIG: ColumnDefsConfig = {
  KPI: {
    headerClass: 'ag-header-cell-kpi',
    pinned: 'left',
    lockPinned: true,
    cellStyle,
  },
  profit_loss: {
    ...createColumnConfig(null, 208),
    pinned: 'left',
    lockPinned: true,
    maxWidth: 208,
    cellStyle,
  },
  'TT Market': {
    headerClass: [
      'ag-header-cell-tt-market',
      'ag-header-cell-tt-market-volume-pages',
    ],
    pinned: 'left',
    lockPinned: true,
    cellStyle,
  },
  tt_market_beer_adj: {
    ...createColumnConfig(null, 110),
    pinned: 'left',
    lockPinned: true,
    maxWidth: 110,
    cellStyle,
    headerGroupComponentParams: {
      chartBackground: ['#B5B4AF', '#EBB400'],
    },
  },
  Megabrands: {
    headerClass: [
      'ag-header-cell-megabrands',
      'ag-header-cell-megabrands-volume-pages',
    ],
    cellStyle,
  },
  Expansion: {
    headerClass: [
      'ag-header-cell-expansion',
      'ag-header-cell-expansion-volume-pages',
    ],
    cellStyle,
  },
  Tail: {
    headerClass: ['ag-header-cell-tail', 'ag-header-cell-tail-volume-pages'],
    cellStyle,
  },
  Sustain: {
    headerClass: [
      'ag-header-cell-sustain',
      'ag-header-cell-sustain-volume-pages',
    ],
    cellStyle,
  },
  megabrands_: {
    ...createColumnConfig(null, 110),
    headerGroupComponentParams: {
      chartBackground: ['#B5B4AF', '#EBB400'],
    },
    cellStyle,
  },
  expansion_: {
    ...createColumnConfig(null, 110),
    headerGroupComponentParams: {
      chartBackground: ['#B5B4AF', '#EBB400'],
    },
    cellStyle,
  },
  sustain_: {
    ...createColumnConfig(null, 110),
    headerGroupComponentParams: {
      chartBackground: ['#B5B4AF', '#EBB400'],
    },
    cellStyle,
  },
  tail_: {
    ...createColumnConfig(null, 110),
    headerGroupComponentParams: {
      chartBackground: ['#B5B4AF', '#EBB400'],
    },
    cellStyle,
  },
};
