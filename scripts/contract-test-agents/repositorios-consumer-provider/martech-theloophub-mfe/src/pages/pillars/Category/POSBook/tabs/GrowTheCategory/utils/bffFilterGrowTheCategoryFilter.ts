import { KPIS_BFF } from '../../../enums';
import { VIEW_TYPES } from '../constants';

export const getBffGrowTheCategoryKpiId = (selectedView: string): string => {
  switch (selectedView) {
    case VIEW_TYPES.MATURITY_ZONE:
      return KPIS_BFF.GROW_THE_CATEGORY.participationByZoneAndMaturity.id;
    case VIEW_TYPES.COHORT:
      return KPIS_BFF.GROW_THE_CATEGORY.participationByCohort.id;
    case VIEW_TYPES.COUNTRY:
    default:
      return KPIS_BFF.GROW_THE_CATEGORY.participationByCountry.id;
  }
};

export const buildBffGrowTheCategorySubFilters = ({
  cohort,
  pos_kpi,
}: {
  cohort: string | null;
  pos_kpi: string;
}) => ({
  cohort: cohort || null,
  pos_kpi,
});
