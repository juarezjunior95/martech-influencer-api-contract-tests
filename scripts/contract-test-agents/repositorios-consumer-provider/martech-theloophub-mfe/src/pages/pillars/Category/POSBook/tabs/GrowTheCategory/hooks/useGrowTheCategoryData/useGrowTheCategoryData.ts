import { useMemo } from 'react';

import { useBffData, useSubFilters } from 'hooks';

import { COHORTS_KEY, DEFAULT_POS_KPI, POS_KPI_KEY } from '../../constants';
import { BffGrowTheCategoryData, ParticipationViewType } from '../../types';
import {
  buildBffGrowTheCategorySubFilters,
  getBffGrowTheCategoryKpiId,
} from '../../utils';

export const useGrowTheCategoryData = (selectedView: ParticipationViewType) => {
  const { activeSubFilters } = useSubFilters();

  const posKpi = useMemo(
    () => (activeSubFilters?.[POS_KPI_KEY] || DEFAULT_POS_KPI) as string,
    [activeSubFilters],
  );

  const filterCohort = useMemo(
    () => (activeSubFilters?.[COHORTS_KEY] as string) || '',
    [activeSubFilters],
  );

  const bffSubFilters = useMemo(
    () =>
      buildBffGrowTheCategorySubFilters({
        cohort: filterCohort || null,
        pos_kpi: posKpi,
      }),
    [filterCohort, posKpi],
  );

  const bffKpiId = useMemo(
    () => getBffGrowTheCategoryKpiId(selectedView),
    [selectedView],
  );

  const bffData = useBffData({
    id: bffKpiId,
    kpiGroup: 'pos',
    subFilters: bffSubFilters,
  });

  const participationData = useMemo(() => {
    if (bffData.loading || !bffData.data) return null;
    return bffData.data['country'] as BffGrowTheCategoryData['participation'];
  }, [bffData.data, bffData.loading]);

  return {
    participationData,
    loading: bffData.loading,
    error: bffData.error,
  };
};
