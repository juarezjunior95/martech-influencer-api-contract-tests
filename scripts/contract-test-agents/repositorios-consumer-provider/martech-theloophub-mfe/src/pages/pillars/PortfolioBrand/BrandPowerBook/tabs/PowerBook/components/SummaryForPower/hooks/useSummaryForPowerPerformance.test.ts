import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';

import { useSummaryForPowerPerformance } from './useSummaryForPowerPerformance';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;

const mockSegmentTableData = {
  header: [{ field: 'name', headerName: 'Name' }],
  rows: [{ id: '1', name: 'Segment 1', value: 100 }],
};

const mockPortfolioTableData = {
  header: [{ field: 'name', headerName: 'Name' }],
  rows: [{ id: '1', name: 'Portfolio 1', value: 200 }],
};

const mockBffData = {
  summaryPowerBySegmentPerformance: mockSegmentTableData,
  summaryPowerByPortfolioPerformance: mockPortfolioTableData,
};

const defaultArgs = { subScopeFilter: 'All Global Brands' };

const renderUseSummaryForPowerPerformance = (overrides = {}) =>
  renderHook(() =>
    useSummaryForPowerPerformance({ ...defaultArgs, ...overrides }),
  );

const setBffResponse = (
  partial: Partial<{ loading: boolean; error: Error | null; data: unknown }>,
) =>
  mockUseBffData.mockReturnValue({
    loading: false,
    error: null,
    data: null,
    ...partial,
  });

describe('useSummaryForPowerPerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setBffResponse({});
  });

  it('returns BFF data for segment and portfolio buckets', () => {
    setBffResponse({ data: mockBffData });

    const { result } = renderUseSummaryForPowerPerformance();

    expect(
      result.current.segment.data.summaryPowerBySegmentPerformance,
    ).toEqual(mockSegmentTableData);
    expect(
      result.current.portfolio.data.summaryPowerByPortfolioPerformance,
    ).toEqual(mockPortfolioTableData);
  });

  it('propagates loading and error to both buckets', () => {
    const error = new Error('BFF error');

    setBffResponse({ loading: true });
    const { result: loadingResult } = renderUseSummaryForPowerPerformance();
    expect(loadingResult.current.segment.loading).toBe(true);
    expect(loadingResult.current.portfolio.loading).toBe(true);

    setBffResponse({ error });
    const { result: errorResult } = renderUseSummaryForPowerPerformance();
    expect(errorResult.current.segment.error).toBe(error);
    expect(errorResult.current.portfolio.error).toBe(error);
  });

  it('passes subScopeFilter to useBffData as page_filter', () => {
    setBffResponse({ data: mockBffData });

    renderUseSummaryForPowerPerformance({ subScopeFilter: 'Heineken' });

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({ subFilters: { page_filter: 'Heineken' } }),
    );
  });

  it('returns undefined when BFF data is empty', () => {
    setBffResponse({ data: {} });

    const { result } = renderUseSummaryForPowerPerformance();

    expect(
      result.current.segment.data.summaryPowerBySegmentPerformance,
    ).toBeUndefined();
    expect(
      result.current.portfolio.data.summaryPowerByPortfolioPerformance,
    ).toBeUndefined();
  });
});
