import { ColumnDefsConfig } from 'components';

import { commonHeaderConfig } from '../constants/headerConfigs';

export const competitorTableConfig: ColumnDefsConfig = {
  ...commonHeaderConfig,
  questions: {
    ...commonHeaderConfig.questions,
    minWidth: 440,
  },
};
