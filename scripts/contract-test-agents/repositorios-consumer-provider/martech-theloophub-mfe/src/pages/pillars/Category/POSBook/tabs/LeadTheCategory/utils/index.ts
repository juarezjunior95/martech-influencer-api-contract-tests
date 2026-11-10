import {
  countryParticipationTableConfig,
  globalParticipationTableConfig,
} from 'pages/components/POSBookTable/config';

export {
  getBffManufactureKpiId,
  buildBffManufactureSubFilters,
  getBffBrandParticipationKpiId,
  buildBffBrandParticipationSubFilters,
} from './bffLeadTheCategoryFilter';

export { getBrandRankingLegendCaption } from './getBrandRankingLegendCaption';

export const getParticipationTableConfig = (isActiveGlobalZone: boolean) => {
  if (isActiveGlobalZone) {
    return globalParticipationTableConfig;
  }

  return countryParticipationTableConfig;
};
