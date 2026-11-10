import { TableCellType } from './data';

export interface RenderCellOptions {
  testId?: string;
  colIndex?: number;
  rowIndex?: number;
  rowData?: Record<string, TableCellType>;
  groupIndex?: number;
  parentColor?: string;
}

/** @deprecated Use {@link RenderCellOptions} */
export type RenderCellArgs = RenderCellOptions;
