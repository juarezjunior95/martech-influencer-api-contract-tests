import { useMemo } from 'react';

import { useBffData } from 'hooks';
import { FilterValue } from 'models/Filters';

import { getBffComponentData } from '../brandAnalysisRequestUtils';

interface UseBrandPowerBffRequestParams {
  viewId: string;
  componentId: string;
  shouldLoad: boolean;
  bffSubFilters?: Record<string, FilterValue> | Record<string, string> | null;
}

interface UseBrandPowerBffRequestResponse<TResult> {
  data: TResult;
  loading: boolean;
  error: Error | null;
}

const unwrapKpiData = (data: unknown): unknown => {
  const record = data as Record<string, unknown> | undefined;
  return record?.kpiData ?? data;
};

export const useBrandPowerUnifiedRequest = <TResult = Record<string, unknown>>({
  viewId,
  componentId,
  shouldLoad,
  bffSubFilters,
}: UseBrandPowerBffRequestParams): UseBrandPowerBffRequestResponse<TResult> => {
  const bffResult = useBffData({
    id: viewId,
    kpiGroup: 'power',
    subFilters: bffSubFilters,
    skipRequest: !shouldLoad,
  });

  const result = useMemo(
    () => ({
      data: unwrapKpiData(
        getBffComponentData(bffResult.data, componentId),
      ) as TResult,
      loading: bffResult.loading,
      error: bffResult.error,
    }),
    [bffResult.data, bffResult.loading, bffResult.error, componentId],
  );

  return result;
};
