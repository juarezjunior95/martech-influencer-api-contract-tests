import { ColumnDefsConfig } from 'components';

export const commonHeaderConfig: ColumnDefsConfig = {
  questions: {
    minWidth: 400,
    headerComponentParams: {
      icon: 'kpi',
    },
    headerClass: ['ag-header-background-gray-4'],
  },
  BIP: {
    headerClass: ['ag-header-background-gray-4'],
  },
  brand: {
    headerClass: ['ag-header-background-gray-4'],
  },
  comp: {
    headerClass: ['ag-header-background-gray-4'],
  },
};

export const brandHeaderConfig: ColumnDefsConfig = {
  brand: {
    headerClass: ['ag-header-background-gray-4', 'ag-header-cell-brand'],
  },
};
