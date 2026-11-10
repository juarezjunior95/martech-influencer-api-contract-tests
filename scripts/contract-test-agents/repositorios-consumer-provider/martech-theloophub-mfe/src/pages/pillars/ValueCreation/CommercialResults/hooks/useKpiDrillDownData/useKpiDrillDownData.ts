import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
  useSubFilters,
} from 'hooks';

import { COMMERCIAL_RESULTS_PAGE_NAME, KPIS_TITLE_MAP } from '../../constants';
import { UseKpiDrillDownData } from '../../types';
import { getCommercialResultsConfig } from '../../utils';
import { useBigNumberData } from '../useBigNumberData/useBigNumberData';
import { useLineBarChartData } from '../useLineBarChartData/useLineBarChartData';
import { useWaterfallData } from '../useWaterfallData/useWaterfallData';

export const useKpiDrillDownData = (): UseKpiDrillDownData => {
  const { applied, isGlobalZone } = usePageFilterApplied(
    COMMERCIAL_RESULTS_PAGE_NAME,
  );
  const { dataFilters } = usePageFilterData(COMMERCIAL_RESULTS_PAGE_NAME);
  const { updateForm, apply } = usePageFilterManagement(
    COMMERCIAL_RESULTS_PAGE_NAME,
  );
  const { activeSubFilters } = useSubFilters();

  const { formatMessage } = useIntl();

  const kpiSlug = (applied.kpis as string) || 'volume';
  const kpiLabel =
    KPIS_TITLE_MAP[kpiSlug as keyof typeof KPIS_TITLE_MAP] ?? 'Volume';
  const config = useMemo(
    () => getCommercialResultsConfig({ kpiSlug }),
    [kpiSlug],
  );

  const performanceInfo = useMemo(
    () => ({
      performanceSection: `${kpiLabel} Performance`,
      tooltip: formatMessage({
        id: 'ValueCreation.CommercialResults.performance.tooltip',
      }),
    }),
    [kpiLabel, formatMessage],
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      updateForm(key, value);
      apply();
    },
    [updateForm, apply],
  );

  const waterfallData = useWaterfallData({
    formatMessage,
    activeSubFilters,
    dataFilters,
    applied,
    isGlobalZone,
    updateForm,
    apply,
  });

  const bigNumbersData = useBigNumberData({
    formatMessage,
    periodValues: config.periodValues,
    appliedPeriods: applied.periods as string,
    onFilterChange: handleFilterChange,
  });
  const lineBarChartData = useLineBarChartData({
    formatMessage,
    applied,
  });

  return {
    applied,
    performanceInfo,
    config,
    bigNumbersData,
    waterfallData,
    lineBarChartData,
  };
};
