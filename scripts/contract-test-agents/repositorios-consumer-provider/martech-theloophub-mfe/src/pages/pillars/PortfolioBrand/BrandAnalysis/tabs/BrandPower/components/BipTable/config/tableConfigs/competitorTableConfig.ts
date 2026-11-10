import { ColumnDefsConfig } from 'components';

import {
  brandHeaderConfig,
  commonHeaderConfig,
} from '../constants/headerConfigs';

export const brandsTableConfig: ColumnDefsConfig = {
  ...commonHeaderConfig,
  brand: {
    ...brandHeaderConfig.brand,
  },
};
