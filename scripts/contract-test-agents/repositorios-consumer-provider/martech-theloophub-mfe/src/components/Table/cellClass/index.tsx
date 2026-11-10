import { CellClassParams } from 'ag-grid-community';

import { cellGroupClass } from './cellGroupClass';
import { highlightCellClass } from './highlightCellClass';
import { mergeCellClass } from './mergeCellClass';

export const cellClass = (params: CellClassParams): string[] => {
  return [
    ...mergeCellClass(params),
    ...cellGroupClass(params),
    ...highlightCellClass(params),
  ];
};
