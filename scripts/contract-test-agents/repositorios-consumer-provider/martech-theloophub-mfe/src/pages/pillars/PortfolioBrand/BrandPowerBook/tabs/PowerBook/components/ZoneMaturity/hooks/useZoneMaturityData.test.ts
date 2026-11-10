import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';

import { useZoneMaturityData } from './useZoneMaturityData';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;

const mockZoneTableData = {
  header: [{ field: 'zone', headerName: 'Zone' }],
  rows: [{ id: '1', zone: 'EUR', value: 100 }],
};

const mockMaturityTableData = {
  header: [{ field: 'maturity', headerName: 'Maturity' }],
  rows: [{ id: '1', maturity: 'Mature', value: 200 }],
};

const mockLegend = [
  { label: 'Zone 1', color: '#EDDAB1' },
  { label: 'Zone 2', color: '#D1A33C' },
];

const mockBffData = {
  zonePowerPerformance: { table: mockZoneTableData, legend: mockLegend },
  maturityPowerPerformance: {
    table: mockMaturityTableData,
    legend: mockLegend,
  },
};

const defaultArgs = { subScopeFilter: 'All Global Brands' };

const renderUseZoneMaturityData = (overrides = {}) =>
  renderHook(() => useZoneMaturityData({ ...defaultArgs, ...overrides }));

const setBffResponse = (
  partial: Partial<{ loading: boolean; error: Error | null; data: unknown }>,
) =>
  mockUseBffData.mockReturnValue({
    loading: false,
    error: null,
    data: null,
    ...partial,
  });

describe('useZoneMaturityData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setBffResponse({});
  });

  it('returns BFF data for zone and maturity buckets', () => {
    setBffResponse({ data: mockBffData });

    const { result } = renderUseZoneMaturityData();

    expect(result.current.zone.data.table).toEqual(mockZoneTableData);
    expect(result.current.zone.data.legend).toEqual(mockLegend);
    expect(result.current.maturity.data.table).toEqual(mockMaturityTableData);
    expect(result.current.maturity.data.legend).toEqual(mockLegend);
  });

  it('propagates loading and error to both buckets', () => {
    const error = new Error('BFF error');

    setBffResponse({ loading: true });
    const { result: loadingResult } = renderUseZoneMaturityData();
    expect(loadingResult.current.zone.loading).toBe(true);
    expect(loadingResult.current.maturity.loading).toBe(true);

    setBffResponse({ error });
    const { result: errorResult } = renderUseZoneMaturityData();
    expect(errorResult.current.zone.error).toBe(error);
    expect(errorResult.current.maturity.error).toBe(error);
  });

  it('passes subScopeFilter to useBffData as page_filter', () => {
    setBffResponse({ data: mockBffData });

    renderUseZoneMaturityData({ subScopeFilter: 'Heineken' });

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({ subFilters: { page_filter: 'Heineken' } }),
    );
  });

  it('returns undefined when BFF data is empty', () => {
    setBffResponse({ data: {} });

    const { result } = renderUseZoneMaturityData();

    expect(result.current.zone.data.table).toBeUndefined();
    expect(result.current.zone.data.legend).toBeUndefined();
    expect(result.current.maturity.data.table).toBeUndefined();
    expect(result.current.maturity.data.legend).toBeUndefined();
  });
});
