import { CellClassParams } from 'ag-grid-community';

export const cellGroupClass = (params: CellClassParams): string[] => {
  const field = params.colDef.field;
  const config = params.data?.[`${field}_config`];

  const classes = new Set<string>();

  if (config?.isFirstOfGroup) {
    classes.add('ag-cell-first-of-group');
  }

  if (config?.isLastOfGroup) {
    classes.add('ag-cell-last-of-group');
  }

  return Array.from(classes);
};
