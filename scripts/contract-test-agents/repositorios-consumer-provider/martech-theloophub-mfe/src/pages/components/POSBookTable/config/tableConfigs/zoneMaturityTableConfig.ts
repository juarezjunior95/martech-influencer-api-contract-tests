import { ColumnDefsConfig } from 'components';

import { commonHeaderConfig } from '../constants';
import { combineCellClasses, customZoneMaturityCellClass } from '../utils';

export const zoneMaturityTableConfig: ColumnDefsConfig = {
  ...commonHeaderConfig,
  label: {
    maxWidth: 54,
    cellClass: (params) =>
      combineCellClasses(params, customZoneMaturityCellClass),
    headerComponentParams: { merge: true },
  },
  maturity_zone: {
    maxWidth: 54,
    cellClass: (params) =>
      combineCellClasses(params, customZoneMaturityCellClass),
  },
};
