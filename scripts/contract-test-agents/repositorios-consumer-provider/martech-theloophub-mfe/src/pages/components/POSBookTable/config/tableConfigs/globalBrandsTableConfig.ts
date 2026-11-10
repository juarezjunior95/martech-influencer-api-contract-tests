import { ColumnDefsConfig } from 'components';

import { globalBrandsHeaderConfig } from '../constants';
import { combineCellClasses, customCountryCellClass } from '../utils';

export const globalBrandsTableConfig: ColumnDefsConfig = {
  ...globalBrandsHeaderConfig,
  label: {
    maxWidth: 64,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
    headerComponentParams: { merge: true },
  },
  country: {
    maxWidth: 54,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
  },
};
