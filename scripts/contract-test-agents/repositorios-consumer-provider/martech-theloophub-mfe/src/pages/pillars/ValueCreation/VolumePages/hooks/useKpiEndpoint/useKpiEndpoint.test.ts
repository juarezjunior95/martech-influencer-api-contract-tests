import { renderHook } from '@testing-library/react-hooks';

import {
  DEFAULT_BEER_ADJ_ENDPOINTS,
  DEFAULT_ENDPOINTS,
} from '../../config/api';
import { KPI_CONFIGS } from '../../config/kpiConfigs';
import { useKpiEndpoint } from './useKpiEndpoint';

const mockUseFeatureToggle = jest.fn();

jest.mock('hooks', () => ({
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
}));

const config = KPI_CONFIGS.volume;

describe('useKpiEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns default endpoints when product scope toggle is disabled', () => {
    mockUseFeatureToggle.mockReturnValue([false, false]);

    const { result } = renderHook(() =>
      useKpiEndpoint(config, { product_scope: 'Beer + Adjacencies' }),
    );

    expect(result.current).toBe(DEFAULT_ENDPOINTS);
  });

  it('returns beer and adjacencies endpoints when product scope toggle is enabled', () => {
    mockUseFeatureToggle.mockReturnValue([true, false]);

    const { result } = renderHook(() =>
      useKpiEndpoint(config, { product_scope: 'Beer + Adjacencies' }),
    );

    expect(result.current).toBe(DEFAULT_BEER_ADJ_ENDPOINTS);
  });

  it('returns default endpoints when product scope is not beer and adjacencies', () => {
    mockUseFeatureToggle.mockReturnValue([true, false]);

    const { result } = renderHook(() =>
      useKpiEndpoint(config, { product_scope: 'Beer' }),
    );

    expect(result.current).toBe(DEFAULT_ENDPOINTS);
  });
});
