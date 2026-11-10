import { ColumnDefsConfig } from 'components';

import { commonHeaderConfig } from '../constants';
import { combineCellClasses, customCountryCellClass } from '../utils';

export const countryTableConfig: ColumnDefsConfig = {
  ...commonHeaderConfig,
  label: {
    maxWidth: 54,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
    headerComponentParams: { merge: true },
  },
  country: {
    maxWidth: 54,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
  },
};
