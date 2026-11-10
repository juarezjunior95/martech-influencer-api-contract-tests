import { CellClassParams } from 'ag-grid-community';

export const portfolioCellClass = (params: CellClassParams) => {
  const classes = ['ag-cell-portfolio'];
  const value = params.node.data[params.colDef.field]?.toLowerCase();
  const config = params.data?.portfolio_config;

  if (config?.radiusTop) {
    classes.push('ag-cell-first-row');
  }

  switch (value) {
    case 'megabrands':
      classes.push('ag-cell-megabrands');
      break;
    case 'expansion':
      classes.push('ag-cell-expansion');
      break;
    case 'sustain':
      classes.push('ag-cell-sustain');
      break;
    case 'tail':
      classes.push('ag-cell-tail');
      break;
    case 'total':
      classes.push('ag-cell-total');
      break;
  }

  return classes;
};
