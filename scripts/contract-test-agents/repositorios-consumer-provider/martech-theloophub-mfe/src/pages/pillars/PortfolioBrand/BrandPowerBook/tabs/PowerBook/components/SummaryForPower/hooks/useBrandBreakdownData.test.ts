import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';

import { useBrandBreakdownData } from './useBrandBreakdownData';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;

const mockBreakdownData = {
  header: [{ field: 'brand', headerName: 'Brand' }],
  rows: [{ id: '1', brand: 'Brand 1', value: 150 }],
};

const mockBreakdownCompData = {
  header: [{ field: 'brand', headerName: 'Brand' }],
  rows: [
    { id: '1', brand: 'Brand 1', value: 150 },
    { id: '2', brand: 'Competitor', isCompetitor: true, value: 50 },
  ],
};

const mockBffData = {
  summaryPowerBreakdown: mockBreakdownData,
  summaryPowerBreakdownComp: mockBreakdownCompData,
};

const defaultArgs = {
  subScopeFilter: 'All Global Brands',
  selectedPerformance: 'Test Performance',
};

const renderUseBrandBreakdownData = (overrides = {}) =>
  renderHook(() => useBrandBreakdownData({ ...defaultArgs, ...overrides }));

const setBffResponse = (
  partial: Partial<{ loading: boolean; error: Error | null; data: unknown }>,
) =>
  mockUseBffData.mockReturnValue({
    loading: false,
    error: null,
    data: null,
    ...partial,
  });

describe('useBrandBreakdownData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setBffResponse({});
  });

  it('returns BFF data for breakdown and breakdown comp', () => {
    setBffResponse({ data: mockBffData });

    const { result } = renderUseBrandBreakdownData();

    expect(result.current.data.summaryPowerBreakdown).toEqual(
      mockBreakdownData,
    );
    expect(result.current.data.summaryPowerBreakdownComp).toEqual(
      mockBreakdownCompData,
    );
  });

  it('forwards loading and error states from BFF', () => {
    const error = new Error('BFF error');

    setBffResponse({ loading: true });
    expect(renderUseBrandBreakdownData().result.current.loading).toBe(true);

    setBffResponse({ error });
    expect(renderUseBrandBreakdownData().result.current.error).toBe(error);
  });

  it.each([
    {
      label: 'with custom selectedPerformance',
      args: {
        subScopeFilter: 'Heineken',
        selectedPerformance: 'TT ABI Segment',
      },
      expectedFilters: {
        page_filter: 'Heineken',
        breakdown_filter: 'TT ABI Segment',
      },
    },
    {
      label: 'with empty selectedPerformance',
      args: { subScopeFilter: 'All Global Brands', selectedPerformance: '' },
      expectedFilters: {
        page_filter: 'All Global Brands',
        breakdown_filter: '',
      },
    },
  ])('passes filters to useBffData $label', ({ args, expectedFilters }) => {
    setBffResponse({ data: mockBffData });

    renderUseBrandBreakdownData(args);

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({ subFilters: expectedFilters }),
    );
  });

  it('returns undefined when BFF data is empty', () => {
    setBffResponse({ data: {} });

    const { result } = renderUseBrandBreakdownData();

    expect(result.current.data.summaryPowerBreakdown).toBeUndefined();
    expect(result.current.data.summaryPowerBreakdownComp).toBeUndefined();
  });
});
