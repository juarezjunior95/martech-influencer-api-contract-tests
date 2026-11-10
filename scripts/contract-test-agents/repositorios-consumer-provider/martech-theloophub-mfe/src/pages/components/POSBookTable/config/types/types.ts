import { CellClassParams } from 'ag-grid-community';

export interface CellClassOptions {
  isFirstRowSpecial?: boolean;
  labelColumnClasses?: string[];
  mergeRowIndexes?: number[];
  countryColumnClasses?: string[];
}

export type CellClassFunction = (params: CellClassParams) => string[];
