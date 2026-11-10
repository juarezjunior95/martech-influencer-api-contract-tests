import { act, renderHook } from '@testing-library/react-hooks';

import { BEES_DISTRIBUTION_OVERVIEW_PATH } from '../constants';
import { useTradeExecutionHome } from './useTradeExecutionHome';

const mockNavigate = jest.fn();
const mockUseBffData = jest.fn();
const mockUseFeatureToggle = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterManagement = jest.fn();
const mockApplyFilters = jest.fn();
const mockUpdateForm = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockUseMultiplesFeatureToggles = jest.fn();

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      tradeExecution: {
        trade_execution_home_content: 'trade_execution_home_content',
        home: {
          aiSummary: {
            total: 'trade_execution_home_ai_summary_total',
            megabrands: 'trade_execution_home_ai_summary_megabrands',
          },
        },
      },
    },
  },
}));

jest.mock('hooks', () => ({
  useBffData: (params: unknown) => mockUseBffData(params),
  useFeatureToggle: (toggle: string) => mockUseFeatureToggle(toggle),
  useMultiplesFeatureToggles: (toggles: string[]) =>
    mockUseMultiplesFeatureToggles(toggles),
  usePageFilterApplied: (pageName: string) =>
    mockUsePageFilterApplied(pageName),
  usePageFilterManagement: (pageName: string) =>
    mockUsePageFilterManagement(pageName),
}));

describe('useTradeExecutionHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFeatureToggle.mockReturnValue([true, false]);
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        trade_execution_home_ai_summary_total: true,
        trade_execution_home_ai_summary_megabrands: true,
      },
      togglesReady: true,
    });
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        zone: 'zone1',
        country: 'BR',
      },
    });
    mockUsePageFilterManagement.mockReturnValue({
      apply: mockApplyFilters,
      updateForm: mockUpdateForm,
    });
    mockUseBffData.mockReturnValue({
      data: {
        'total-distribution': { value: 1 },
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('should request the page data with the expected filters', () => {
    const { result } = renderHook(() => useTradeExecutionHome());

    expect(mockUsePageFilterApplied).toHaveBeenCalledWith(
      'trade-execution_home',
    );
    expect(mockUsePageFilterManagement).toHaveBeenCalledWith(
      'trade-execution_home',
    );
    expect(mockUseFeatureToggle).toHaveBeenCalledWith(
      'trade_execution_home_content',
    );
    expect(mockUseBffData).toHaveBeenCalledWith({
      id: 'trade-execution_home_home',
      kpiGroup: 'bees-distribution',
      subFilters: {
        zone: 'zone1',
        country: 'BR',
      },
    });
    expect(result.current.pageData.error).toBeNull();
  });

  it.each(['total', 'megabrand'])(
    'should update filters and navigate in order for %s',
    (distributionScope) => {
      const { result } = renderHook(() => useTradeExecutionHome());

      act(() => {
        result.current.handleCardClick(distributionScope);
      });

      expect(mockUpdateForm).toHaveBeenCalledWith(
        'distribution_scopes',
        distributionScope,
      );
      expect(mockApplyFilters).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        BEES_DISTRIBUTION_OVERVIEW_PATH,
      );
      expect(mockUpdateForm.mock.invocationCallOrder[0]).toBeLessThan(
        mockApplyFilters.mock.invocationCallOrder[0],
      );
      expect(mockApplyFilters.mock.invocationCallOrder[0]).toBeLessThan(
        mockNavigate.mock.invocationCallOrder[0],
      );
    },
  );

  it('should disable the home content when the feature toggle is disabled', () => {
    mockUseFeatureToggle.mockReturnValue([false, false]);

    const { result } = renderHook(() => useTradeExecutionHome());

    expect(result.current.isHomeContentEnabled).toBe(false);
  });

  it('should disable the home content while the feature toggle is loading', () => {
    mockUseFeatureToggle.mockReturnValue([true, true]);

    const { result } = renderHook(() => useTradeExecutionHome());

    expect(result.current.isHomeContentEnabled).toBe(false);
  });

  it('should expose the error returned by useBffData without breaking the hook', () => {
    const mockError = new Error('BFF request failed');

    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useTradeExecutionHome());

    expect(result.current.pageData.error).toBe(mockError);
    expect(result.current.isHomeContentEnabled).toBe(true);
  });

  it('should request the BFF data with null filters when no zone or country is applied', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        zone: null,
        country: null,
      },
    });

    renderHook(() => useTradeExecutionHome());

    expect(mockUseBffData).toHaveBeenCalledWith({
      id: 'trade-execution_home_home',
      kpiGroup: 'bees-distribution',
      subFilters: {
        zone: null,
        country: null,
      },
    });
  });

  it('should refetch BFF data with the new filters when applied filters change', () => {
    const { rerender } = renderHook(() => useTradeExecutionHome());

    expect(mockUseBffData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        subFilters: { zone: 'zone1', country: 'BR' },
      }),
    );

    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        zone: 'zone2',
        country: 'AR',
      },
    });

    rerender();

    expect(mockUseBffData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        subFilters: { zone: 'zone2', country: 'AR' },
      }),
    );
  });
});
