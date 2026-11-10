import { CellClassParams, GroupCellRendererParams } from 'ag-grid-community';
import { RankingTag } from 'components';

import { GrowthLeagueTag } from '../../GrowthLeagueTag';
import { ImgWithLabel } from '../../ImgWithLabel';

const cellClass = (params: CellClassParams, className: string) => {
  const classes = [className];
  if (params.rowIndex === params.api.getDisplayedRowCount() - 1) {
    classes.push('ag-cell-last-of-group');
  }
  return classes;
};

const rankingCellRenderer = (params: GroupCellRendererParams) => {
  const value = params.value;
  return <RankingTag position={value} type="ranking" />;
};

const countryCellRenderer = (params: GroupCellRendererParams) => {
  const value = params.value;
  const config = params.data[params.colDef.field + '_config'] || {};
  return <ImgWithLabel value={value} img={config.img} variant="country" />;
};

const brandCellRenderer = (params: GroupCellRendererParams) => {
  const { value, colDef, data } = params;
  const config = data[`${colDef.field}_config`] || {};

  return (
    <ImgWithLabel
      value={value}
      img={config.img}
      variant="brand"
      colDef={colDef}
    />
  );
};

const tagCellRenderer = (params: GroupCellRendererParams) => {
  const value = params.value;
  const config = params.data[params.colDef.field + '_config'] || {};

  return <GrowthLeagueTag value={value} unitMeasure={config.unitMeasure} />;
};

const getBaseConfig = (isBrandView: boolean) => {
  return {
    rank: {
      minWidth: 70,
      cellClass: (params: CellClassParams) => cellClass(params, 'ag-cell-rank'),
      cellRenderer: rankingCellRenderer,
    },
    country: {
      headerClass: 'ag-header-cell-country',
      minWidth: 232,
      cellClass: (params: CellClassParams) =>
        cellClass(
          params,
          isBrandView ? 'ag-cell-country-no-border' : 'ag-cell-country',
        ),
      cellRenderer: countryCellRenderer,
    },
    ...(isBrandView && {
      brand: {
        headerClass: 'ag-header-cell-brand',
        minWidth: 200,
        cellClass: (params: CellClassParams) =>
          cellClass(params, isBrandView ? 'ag-cell-brand' : ''),
        cellRenderer: brandCellRenderer,
      },
    }),
  };
};

export const tableConfig = (allFields: string[], isBrandView?: boolean) => {
  return {
    ...allFields.reduce((acc, col) => {
      acc[col] = {
        cellRenderer: tagCellRenderer,
      };
      return acc;
    }, {}),
    ...getBaseConfig(isBrandView),
  };
};
