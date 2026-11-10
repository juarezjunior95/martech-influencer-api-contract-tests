import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';

import { useZoneMaturityDetails } from './useZoneMaturityDetails';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;

const mockDetailsTableData = {
  header: [{ field: 'detail', headerName: 'Detail' }],
  rows: [{ id: '1', detail: 'Detail 1', value: 100 }],
};

const mockBffData = { performanceDetails: mockDetailsTableData };

const defaultArgs = {
  subScopeFilter: 'All Global Brands',
  selectedRow: 'EUR',
};

const renderUseZoneMaturityDetails = (overrides = {}) =>
  renderHook(() => useZoneMaturityDetails({ ...defaultArgs, ...overrides }));

const setBffResponse = (
  partial: Partial<{ loading: boolean; error: Error | null; data: unknown }>,
) =>
  mockUseBffData.mockReturnValue({
    loading: false,
    error: null,
    data: null,
    ...partial,
  });

describe('useZoneMaturityDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setBffResponse({});
  });

  it('returns BFF data for performance details', () => {
    setBffResponse({ data: mockBffData });

    const { result } = renderUseZoneMaturityDetails();

    expect(result.current.data.performanceDetails).toEqual(
      mockDetailsTableData,
    );
  });

  it('propagates loading and error from BFF', () => {
    const error = new Error('BFF error');

    setBffResponse({ loading: true });
    expect(renderUseZoneMaturityDetails().result.current.loading).toBe(true);

    setBffResponse({ error });
    expect(renderUseZoneMaturityDetails().result.current.error).toBe(error);
  });

  it('passes subScopeFilter and selectedRow as filters', () => {
    setBffResponse({ data: mockBffData });

    renderUseZoneMaturityDetails({
      subScopeFilter: 'Heineken',
      selectedRow: 'NAZ',
    });

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        subFilters: { page_filter: 'Heineken', zone_maturity: 'NAZ' },
      }),
    );
  });

  it('skips the BFF request when selectedRow is empty', () => {
    setBffResponse({});

    renderUseZoneMaturityDetails({ selectedRow: '' });

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({ skipRequest: true }),
    );
  });

  it('returns undefined when BFF data is empty', () => {
    setBffResponse({ data: {} });

    const { result } = renderUseZoneMaturityDetails();

    expect(result.current.data.performanceDetails).toBeUndefined();
  });
});
