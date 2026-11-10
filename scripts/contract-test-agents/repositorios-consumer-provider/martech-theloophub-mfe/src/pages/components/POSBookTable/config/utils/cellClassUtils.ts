import { CellClassParams } from 'ag-grid-community';
import { cellClass } from 'components/Table/cellClass';

import { CellClassOptions } from '../types/types';

type DisplaySafePrimitive = string | number | boolean;

const isDisplaySafePrimitive = (
  value: unknown,
): value is DisplaySafePrimitive => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
};

const normalizeDisplaySafePrimitive = (value: unknown): string => {
  if (value == null || value === '') return '';
  if (!isDisplaySafePrimitive(value)) return '';
  return typeof value === 'string' ? value.trim() : `${value}`.trim();
};

export function getCountryCellDisplayValue(
  data: Record<string, unknown> | null | undefined,
): string {
  if (!data || typeof data !== 'object') return '';
  const raw = data.country;
  if (typeof raw === 'object' && raw !== null && 'value' in raw) {
    return normalizeDisplaySafePrimitive(raw.value);
  }
  return normalizeDisplaySafePrimitive(raw);
}

export function isFirstDataRowGlobalSummary(
  data: Record<string, unknown> | null | undefined,
): boolean {
  return getCountryCellDisplayValue(data).toLowerCase() === 'global';
}

export const createCellClasses = (
  params: CellClassParams,
  options: CellClassOptions = {},
): string[] => {
  const {
    isFirstRowSpecial,
    labelColumnClasses,
    mergeRowIndexes,
    countryColumnClasses,
  } = options;

  const classes: string[] = [];

  if (
    isFirstRowSpecial &&
    params.rowIndex === 1 &&
    isFirstDataRowGlobalSummary(params.data as Record<string, unknown>)
  ) {
    classes.push('ag-cell-first-row');
  }

  if (params.colDef.field === 'label' && labelColumnClasses) {
    classes.push(...labelColumnClasses);

    if (mergeRowIndexes?.includes(params.rowIndex)) {
      classes.push('ag-cell-merge-col');
    }
  }

  if (
    (params.colDef.field === 'country' ||
      params.colDef.field === 'maturity_zone') &&
    countryColumnClasses
  ) {
    classes.push(...countryColumnClasses);
  }

  return classes;
};

export const customCountryCellClass = (params: CellClassParams): string[] => {
  return createCellClasses(params, {
    isFirstRowSpecial: true,
    labelColumnClasses: ['ag-cell-label-col'],
    mergeRowIndexes: [3, 8],
    countryColumnClasses: ['ag-cell-country-col'],
  });
};

export const customZoneMaturityCellClass = (
  params: CellClassParams,
): string[] => {
  return createCellClasses(params, {
    isFirstRowSpecial: true,
    labelColumnClasses: ['ag-cell-label-col', 'ag-zone-cell-label-col'],
    mergeRowIndexes: [3, 7],
    countryColumnClasses: ['ag-cell-country-col'],
  });
};

export const customCohortCellClass = (params: CellClassParams): string[] => {
  return createCellClasses(params, {
    labelColumnClasses: ['ag-cohort-cell-label-col'],
  });
};

export const combineCellClasses = (
  params: CellClassParams,
  customClassFn: (params: CellClassParams) => string[],
): string[] => {
  return [...cellClass(params), ...customClassFn(params)];
};
