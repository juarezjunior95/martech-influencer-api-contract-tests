import { syncUrlFiltersToRedux } from './syncUrlFiltersToRedux';

const mockResetAndApplyDefaults = jest.fn((payload) => ({
  type: 'filters/resetAndApplyDefaults',
  payload,
}));
const mockApplyFilters = jest.fn(() => ({ type: 'filters/applyFilters' }));

jest.mock('redux/slices/filters', () => ({
  resetAndApplyDefaults: (payload: any) => mockResetAndApplyDefaults(payload),
  applyFilters: () => mockApplyFilters(),
}));

describe('syncUrlFiltersToRedux', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
  });

  const expectDispatchedSyncForm = (form: Record<string, any>) => {
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'filters/resetAndApplyDefaults',
      payload: {
        form: expect.objectContaining(form),
      },
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      type: 'filters/applyFilters',
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  };

  it('should return false when URL filters match Redux state', () => {
    const applied = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should return true and dispatch resetAndApplyDefaults when zone differs', () => {
    const applied = {
      zone: 'EMEA',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(true);
    expectDispatchedSyncForm({
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    });
  });

  it('should return true and dispatch merged form when multiple filters differ', () => {
    const applied = {
      zone: 'EMEA',
      country: 'DEU',
      years: '2024',
      segments: 'Beyond Beer',
    };
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(true);
    expectDispatchedSyncForm({
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    });
  });

  it('should set country to null when URL filter is empty but Redux has a value', () => {
    const applied = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };
    const urlFilters = {
      zone: 'LATAM',
      country: null,
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(true);
    expectDispatchedSyncForm({
      zone: 'LATAM',
      country: null,
      years: '2025',
      segments: 'Beer',
    });
  });

  it('should not dispatch when both URL and Redux are empty/null', () => {
    const applied = {
      zone: 'LATAM',
      country: null,
      years: '2025',
      segments: 'Beer',
    };
    const urlFilters = {
      zone: 'LATAM',
      country: null,
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should handle undefined applied gracefully', () => {
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, undefined, urlFilters);

    expect(result).toBe(true);
    expectDispatchedSyncForm({
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    });
  });

  it('should handle empty applied object', () => {
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, {}, urlFilters);

    expect(result).toBe(true);
    expectDispatchedSyncForm({
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    });
  });

  it('should handle all null URL filters with empty Redux state', () => {
    const applied = {};
    const urlFilters = {
      zone: null,
      country: null,
      years: null,
      segments: null,
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should call applyFilters only once even when multiple filters need sync', () => {
    const applied = {};
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(mockApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('should dispatch resetAndApplyDefaults before applyFilters', () => {
    const applied = { zone: 'EMEA' };
    const urlFilters = {
      zone: 'LATAM',
      country: null,
      years: null,
      segments: null,
    };

    syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    const resetCall = mockDispatch.mock.invocationCallOrder[0];
    const applyCall = mockDispatch.mock.invocationCallOrder[1];
    expect(resetCall).toBeLessThan(applyCall);
  });

  it('should compare Redux values as strings', () => {
    const applied = {
      zone: 'LATAM',
      country: 'BRA',
      years: 2025,
      segments: 'Beer',
    };
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should preserve other applied keys in the merged form', () => {
    const applied = {
      zone: 'EMEA',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
      kpis: 'volume',
      brands: 'Stella',
    };
    const urlFilters = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
    };

    syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expectDispatchedSyncForm({
      kpis: 'volume',
      brands: 'Stella',
      zone: 'LATAM',
    });
  });

  it('should clear every tracked filter missing from the URL and preserve unrelated keys', () => {
    const applied = {
      zone: 'LATAM',
      country: 'BRA',
      years: '2025',
      segments: 'Beer',
      kpis: 'volume',
      brands: 'Stella',
    };
    const urlFilters = {
      zone: null,
      country: null,
      years: null,
      segments: null,
    };

    const result = syncUrlFiltersToRedux(mockDispatch, applied, urlFilters);

    expect(result).toBe(true);
    expectDispatchedSyncForm({
      zone: null,
      country: null,
      years: null,
      segments: null,
      kpis: 'volume',
      brands: 'Stella',
    });
  });
});
