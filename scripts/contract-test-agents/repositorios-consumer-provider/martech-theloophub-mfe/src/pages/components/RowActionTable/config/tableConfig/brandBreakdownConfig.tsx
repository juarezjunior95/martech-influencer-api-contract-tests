import { CellClassParams } from 'ag-grid-community';
import { cellClass } from 'components/Table/cellClass';

import { ChartCellRenderer, DoubleValueRenderer } from '../cellRenderer';

export const COMPETITOR_HEADER = 'Competitor Brands';

const brandBreakdownCellClass = (params: CellClassParams) => {
  const classes = [...cellClass(params)];
  if (params.data.id === COMPETITOR_HEADER) {
    classes.push('ag-cell-competitor-header');
  }
  return classes;
};

function chartCol(
  minWidth: number,
  field: string,
  someRowWasSelected: boolean,
  chartHeight = 24,
) {
  return {
    minWidth,
    headerClass: ['ag-column-separator'],
    cellRenderer: (params: any) =>
      ChartCellRenderer(params, someRowWasSelected, chartHeight),
    cellClass: (params: CellClassParams) => [
      ...brandBreakdownCellClass(params),
    ],
    field,
  };
}

function doubleCol(field: string) {
  return {
    headerClass: ['ag-column-separator'],
    cellRenderer: DoubleValueRenderer,
    cellClass: (params: CellClassParams) => [
      ...brandBreakdownCellClass(params),
    ],
    field,
  };
}

export const brandBreakdownConfig = (someRowWasSelected: boolean) => ({
  id: {
    minWidth: 168,
    maxWidth: 168,
    headerComponentParams: { merge: true },
    cellClass: (params: CellClassParams) => [
      ...cellClass(params),
      ...brandBreakdownCellClass(params),
    ],
  },

  brand_power_ac: chartCol(180, 'brand_power_ac', someRowWasSelected),
  brand_power_ly: doubleCol('brand_power_ly'),
  meaning_ac: chartCol(180, 'meaning_ac', someRowWasSelected),
  meaning_ly: doubleCol('meaning_ly'),
  difference_ac: chartCol(180, 'difference_ac', someRowWasSelected),
  difference_ly: doubleCol('difference_ly'),
  salience_ac: chartCol(180, 'salience_ac', someRowWasSelected),
  salience_ly: doubleCol('salience_ly'),
});

export const brandBreakdownExportConfig = (
  someRowWasSelected: boolean,
  headerComponentParams?: Record<string, any>,
) => ({
  id: {
    minWidth: 188,
    maxWidth: 188,
    headerComponentParams: { merge: true, ...headerComponentParams },
    cellClass: (params: CellClassParams) => [
      ...cellClass(params),
      ...brandBreakdownCellClass(params),
      'align-right',
    ],
  },
  page_type: {
    minWidth: 100,
    maxWidth: 100,
    headerComponentParams: { merge: true, ...headerComponentParams },
  },
  brand_power_ac: {
    ...chartCol(120, 'brand_power_ac', someRowWasSelected, 18),
    headerComponentParams: { ...headerComponentParams },
  },
  brand_power_ly: {
    ...doubleCol('brand_power_ly'),
    headerComponentParams: { ...headerComponentParams },
  },
  meaning_ac: {
    ...chartCol(120, 'meaning_ac', someRowWasSelected, 18),
    headerComponentParams: { ...headerComponentParams },
  },
  meaning_ly: {
    ...doubleCol('meaning_ly'),
    headerComponentParams: { ...headerComponentParams },
  },
  difference_ac: {
    ...chartCol(120, 'difference_ac', someRowWasSelected, 18),
    headerComponentParams: { ...headerComponentParams },
  },
  difference_ly: {
    ...doubleCol('difference_ly'),
    headerComponentParams: { ...headerComponentParams },
  },
  salience_ac: {
    ...chartCol(120, 'salience_ac', someRowWasSelected, 18),
    headerComponentParams: { ...headerComponentParams },
  },
  salience_ly: {
    ...doubleCol('salience_ly'),
    headerComponentParams: { ...headerComponentParams },
  },
});

export const brandBreakdownConfigEmptyState = () => ({
  brand_power: {
    minWidth: 250,
    maxWidth: 250,
    headerClass: ['ag-brand-breakdown-empty-state'],
  },
  meaning: {
    minWidth: 250,
    maxWidth: 250,
    headerClass: ['ag-brand-breakdown-empty-state'],
  },
  difference: {
    minWidth: 250,
    maxWidth: 250,
    headerClass: ['ag-brand-breakdown-empty-state'],
  },
  salience: {
    minWidth: 250,
    maxWidth: 250,
    headerClass: ['ag-brand-breakdown-empty-state'],
  },
});
