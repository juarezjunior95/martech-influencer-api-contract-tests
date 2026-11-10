import { renderHook } from '@testing-library/react-hooks';
import { UseBffDataResponse } from 'hooks';

import { useStableBffResponse } from './index';

const buildResponse = (
  overrides: Partial<UseBffDataResponse> = {},
): UseBffDataResponse =>
  ({
    data: null,
    loading: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  }) as UseBffDataResponse;

describe('useStableBffResponse', () => {
  it('returns an object with data, loading, error and refetch', () => {
    const response = buildResponse({
      data: { info: 'bar' } as Record<string, unknown>,
      loading: true,
      error: new Error('error'),
    });

    const { result } = renderHook(() => useStableBffResponse(response));

    expect(result.current).toEqual({
      data: response.data,
      loading: response.loading,
      error: response.error,
      refetch: response.refetch,
    });
  });
});
