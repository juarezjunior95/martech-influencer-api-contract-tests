import { CellClassParams } from 'ag-grid-community';

export const mergeCellClass = (params: CellClassParams): string[] => {
  const merge = params.colDef.headerComponentParams?.merge;
  const field = params.colDef.field;
  const config = params.data?.[`${field}_config`];

  const classes = new Set<string>();

  if (merge) {
    let beforeSameValue = false;

    params.api.forEachNode((node) => {
      if (
        node.rowIndex < params.node.rowIndex &&
        node.data[field] === params.data[field]
      ) {
        beforeSameValue = true;
        classes.add('ag-cell-hide');
      }

      if (
        node.rowIndex > params.node.rowIndex &&
        node.data[field] === params.data[field] &&
        !beforeSameValue
      ) {
        classes.add('ag-cell-first-merge');
      }
    });
  }

  if (config?.rowType) {
    classes.add(`ag-row-cell-${config?.rowType}`);
  }

  return Array.from(classes);
};
