import { CellClassParams } from 'ag-grid-community';

export const highlightCellClass = (params: CellClassParams): string[] => {
  const highlightedItems = params.context?.highlightedItems;
  const classes: string[] = [];
  const field = params.colDef.field;

  if (!highlightedItems || highlightedItems.length === 0) {
    return classes;
  }

  if (field === 'label') {
    classes.push('ag-item-highlighted');
    return classes;
  }

  const itemProperty = params.context?.highlightItemProperty || 'audience';
  const itemValue = params.data?.[itemProperty];

  if (itemValue && highlightedItems.includes(itemValue)) {
    classes.push('ag-item-highlighted');
  }

  return classes;
};
