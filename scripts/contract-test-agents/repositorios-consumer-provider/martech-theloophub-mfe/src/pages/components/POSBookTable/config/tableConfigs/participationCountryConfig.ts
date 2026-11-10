import { ColumnDefsConfig } from 'components';

import { commonHeaderConfig } from '../constants';
import { combineCellClasses, customCohortCellClass } from '../utils';

export const countryParticipationTableConfig: ColumnDefsConfig = {
  ...commonHeaderConfig,
  label: {
    maxWidth: 144,
    cellClass: (params) => combineCellClasses(params, customCohortCellClass),
    headerComponentParams: { merge: true },
  },
  beer: {
    headerClass: ['ag-header-bg-secondary-black', 'ag-header-pos-book'],
  },
};
