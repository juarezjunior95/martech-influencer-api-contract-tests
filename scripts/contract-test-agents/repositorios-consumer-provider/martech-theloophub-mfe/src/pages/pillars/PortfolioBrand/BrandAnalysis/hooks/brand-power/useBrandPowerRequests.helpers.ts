import { FilterValue } from 'models/Filters';

import { YearQuarter } from '../../types';
import {
  formatDateFilter,
  getQuarterDateRange,
  getQuarterYearFromValue,
  getYearFromFilterValue,
} from '../brandAnalysisRequestUtils';

const getSelectedPcTimeFrame = (
  activeSubFilters: Record<string, FilterValue>,
  quarterYearSelected: YearQuarter,
): FilterValue =>
  quarterYearSelected === 'year'
    ? activeSubFilters?.pc_time_frame_years
    : activeSubFilters?.pc_time_frame_quarters;

export const hasSelectedFilterValue = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue !== '' && normalizedValue !== 'all';
  }

  return value !== null && value !== undefined;
};

export const getOccasionBffSubFilters = (
  activeSubFilters: Record<string, FilterValue>,
  quarterYearSelected: YearQuarter,
  fallbackTimeFrame?: FilterValue,
): Record<string, string> => {
  const selectedPcTimeFrame = getSelectedPcTimeFrame(
    activeSubFilters,
    quarterYearSelected,
  );

  if (!selectedPcTimeFrame) return {};

  const fallbackYear = getYearFromFilterValue(fallbackTimeFrame);

  if (quarterYearSelected === 'year') {
    const year = getYearFromFilterValue(selectedPcTimeFrame) ?? fallbackYear;
    if (!year) return {};

    return {
      dt_ini: formatDateFilter(year, 1),
      dt_end: formatDateFilter(year, 12),
    };
  }

  const { quarter, year } = getQuarterYearFromValue(
    String(selectedPcTimeFrame),
  );
  const resolvedYear = year ?? fallbackYear;

  if (!quarter || !resolvedYear) return {};
  return getQuarterDateRange(resolvedYear, quarter);
};

export const getImagerySubFilters = (
  activeSubFilters: Record<string, FilterValue>,
  subFiltersLoaded: Record<string, boolean>,
): Record<string, FilterValue> | null => {
  if (!subFiltersLoaded?.imagery_questions) return null;
  if (!activeSubFilters?.imagery_questions) return null;

  return {
    imagery_question: activeSubFilters.imagery_questions,
  };
};
