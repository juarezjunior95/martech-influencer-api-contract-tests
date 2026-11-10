import {
  cohortTableConfig,
  countryTableConfig,
  zoneMaturityTableConfig,
} from 'pages/components/POSBookTable/config';

export {
  getBffGrowTheCategoryKpiId,
  buildBffGrowTheCategorySubFilters,
} from './bffFilterGrowTheCategoryFilter';

export const getPOSBookTableConfig = (selectedView?: string) => {
  switch (selectedView) {
    case 'country':
      return countryTableConfig;
    case 'maturity-zone':
      return zoneMaturityTableConfig;
    case 'cohort':
      return cohortTableConfig;
    default:
      return countryTableConfig;
  }
};
