import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import type { KpiGroup } from 'domain/Kpi';
import { useBffData } from 'hooks';
import { FilterValue } from 'models/Filters';

import { AI_SUMMARY_ID } from '../../constants';
import { AlertType, SummaryBffResponse } from '../../types';
import { generateEmptySummary } from '../../utils';
import { useAISummaryFilters } from '../useAISummaryFilter/useAISummaryFilters';

interface UseAISummaryDataParams {
  pageName: string;
  kpiGroup?: KpiGroup;
  subFilters?: Record<string, FilterValue>;
  summaryPageIdentifier: string;
  shouldUseFilters?: boolean;
}

export const useAISummaryData = ({
  pageName,
  kpiGroup,
  subFilters = null,
  summaryPageIdentifier,
  shouldUseFilters = true,
}: UseAISummaryDataParams) => {
  const { formatMessage } = useIntl();

  const { filters, hasAppliedFilters, validSubFilters } = useAISummaryFilters({
    pageName,
    summaryPageIdentifier,
    subFilters,
  });

  const { data, loading } = useBffData({
    id: AI_SUMMARY_ID,
    kpiGroup,
    skipMainFilters: true,
    subFilters: filters,
    skipRequest:
      (!hasAppliedFilters && shouldUseFilters) ||
      !summaryPageIdentifier ||
      !validSubFilters,
  });

  const summary = useMemo<SummaryBffResponse>(() => {
    const response = data?.['ai-summary'] as SummaryBffResponse;
    if ((response?.resume || response?.seeMore) && !response?.empty) {
      return response;
    }

    return generateEmptySummary(
      formatMessage({ id: 'AISummary.MainPages.empty' }),
    );
  }, [data, formatMessage]);

  const alertType: AlertType = summary.empty ? 'neutral' : 'AI';

  const dataResponse = useMemo(
    () => ({ summary, loading, alertType }),
    [summary, loading, alertType],
  );

  return dataResponse;
};
