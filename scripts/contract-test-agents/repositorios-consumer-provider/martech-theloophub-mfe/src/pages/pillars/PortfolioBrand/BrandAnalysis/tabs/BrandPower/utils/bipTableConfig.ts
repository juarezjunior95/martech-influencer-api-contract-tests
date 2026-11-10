import {
  brandsTableConfig,
  competitorTableConfig,
} from '../components/BipTable/config';

export const getBipTableConfig = (isCompetitorSubfilter: boolean) => {
  if (isCompetitorSubfilter) {
    return competitorTableConfig;
  }

  return brandsTableConfig;
};
