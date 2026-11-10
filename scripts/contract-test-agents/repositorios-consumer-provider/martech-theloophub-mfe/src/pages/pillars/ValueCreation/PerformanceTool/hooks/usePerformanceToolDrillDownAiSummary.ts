import { useMemo } from 'react';

import { useFeatureToggle } from 'hooks';
import type { FilterForm, FilterValue } from 'models/Filters';

import {
  getAiSummaryFilters,
  getPerformanceToolDrillDownAiSummary,
  type PerformanceToolDrillDownAiSummaryEntry,
} from '../utils';

interface UsePerformanceToolDrillDownAiSummaryResult {
  aiSummaryEntry?: PerformanceToolDrillDownAiSummaryEntry;
  aiSummaryFilters: Record<string, FilterValue>;
  isAiSummaryEnabled: boolean;
}

export function usePerformanceToolDrillDownAiSummary(
  kpiSlug: string,
  applied: FilterForm,
): UsePerformanceToolDrillDownAiSummaryResult {
  const aiSummaryEntry = useMemo(
    () => getPerformanceToolDrillDownAiSummary(kpiSlug),
    [kpiSlug],
  );

  const [aiSummaryEnabled, aiSummaryLoading] = useFeatureToggle(
    aiSummaryEntry?.toggleKey ?? '',
  );

  const isAiSummaryEnabled = useMemo(
    () => !!aiSummaryEntry && !!aiSummaryEnabled && !aiSummaryLoading,
    [aiSummaryEntry, aiSummaryEnabled, aiSummaryLoading],
  );

  const aiSummaryFilters = useMemo(
    (): Record<string, FilterValue> => getAiSummaryFilters(applied, kpiSlug),
    [applied, kpiSlug],
  );

  return {
    aiSummaryEntry,
    aiSummaryFilters,
    isAiSummaryEnabled,
  };
}
