import { useMemo } from 'react';

import { UseBffDataResponse } from 'hooks';

export const useStableBffResponse = <T extends Record<string, unknown>>(
  response: UseBffDataResponse,
): UseBffDataResponse =>
  useMemo(
    () => ({
      data: response.data,
      loading: response.loading,
      error: response.error,
      refetch: response.refetch,
    }),
    [response.data, response.loading, response.error, response.refetch],
  );
