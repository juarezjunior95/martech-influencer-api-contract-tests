import { KPIS_BFF } from '../../../enums';
import { VIEW_TYPES } from '../constants';

export const getBffManufactureKpiId = (isGlobalZone: boolean): string => {
  return isGlobalZone
    ? KPIS_BFF.LEAD_THE_CATEGORY.manufactureParticipationGlobal.id
    : KPIS_BFF.LEAD_THE_CATEGORY.manufactureParticipationCountry.id;
};

export const buildBffManufactureSubFilters = ({
  price_segment,
}: {
  price_segment: string | null;
}) => ({
  price_segment: price_segment || null,
});

export const getBffBrandParticipationKpiId = (
  selectedView: string,
  isGlobalZone: boolean,
): string => {
  switch (selectedView) {
    case VIEW_TYPES.GLOBAL_BRANDS:
      return KPIS_BFF.LEAD_THE_CATEGORY.brandParticipationGlobalBrands.id;
    case VIEW_TYPES.RANKINGS:
      return isGlobalZone
        ? KPIS_BFF.LEAD_THE_CATEGORY.brandRankingGlobal.id
        : KPIS_BFF.LEAD_THE_CATEGORY.brandRankingCountry.id;
    case VIEW_TYPES.PORTFOLIO:
    default:
      return isGlobalZone
        ? KPIS_BFF.LEAD_THE_CATEGORY.brandParticipationPortfolioGlobal.id
        : KPIS_BFF.LEAD_THE_CATEGORY.brandParticipationPortfolioCountry.id;
  }
};

export const buildBffBrandParticipationSubFilters = ({
  cohort,
  price_segment,
}: {
  cohort: string | null;
  price_segment: string | null;
}) => ({
  cohort: cohort || null,
  price_segment: price_segment || null,
});
