import { ColumnDefsConfig } from 'components';

import { commonHeaderConfig } from '../constants';
import { combineCellClasses, customCohortCellClass } from '../utils';

export const cohortTableConfig: ColumnDefsConfig = {
  ...commonHeaderConfig,
  label: {
    maxWidth: 130,
    cellClass: (params) => combineCellClasses(params, customCohortCellClass),
    headerComponentParams: { merge: true },
  },
};
