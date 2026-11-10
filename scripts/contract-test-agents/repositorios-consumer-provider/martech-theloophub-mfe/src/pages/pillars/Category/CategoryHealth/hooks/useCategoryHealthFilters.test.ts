import { act, renderHook } from '@testing-library/react-hooks';

import { FILTER_CONFIGS, OVERVIEW_BASE_URL } from '../constants';
import { useCategoryHealthFilters } from './useCategoryHealthFilters';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUpdateFormValue = jest.fn((payload) => ({
  type: 'filters/updateFormValue',
  payload,
}));
const mockApplyFilters = jest.fn(() => ({ type: 'filters/applyFilters' }));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let mockLastDataRefreshKpisFormated: Record<string, string> | undefined;

jest.mock('contexts', () => ({
  useLastDataRefresh: () => ({
    lastDataRefreshKpisFormated: mockLastDataRefreshKpisFormated,
  }),
}));

let mockApplied: any = {};
let mockIsGlobalZone = false;
let mockDataFilters: any = {};
let mockDefaults: any = {};
let mockIsLoaded = false;
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();
const mockUsePageFilterStatus = jest.fn();

jest.mock('hooks', () => ({
  usePageFilterApplied: (pageName: string) =>
    mockUsePageFilterApplied(pageName),
  usePageFilterData: (pageName: string) => mockUsePageFilterData(pageName),
  usePageFilterStatus: (pageName: string) => mockUsePageFilterStatus(pageName),
}));

jest.mock('redux/slices/filters', () => ({
  updateFormValue: (payload: any) => mockUpdateFormValue(payload),
  applyFilters: () => mockApplyFilters(),
}));

function renderHookComponent() {
  return renderHook(() => useCategoryHealthFilters()).result.current;
}

describe('useCategoryHealthFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockApplied = {
      zone: 'LATAM',
      country: 'BRA',
      full_year: '2025',
      product_type: 'Beer',
    };
    mockIsGlobalZone = false;
    mockDataFilters = { zones: [{ value: 'LATAM' }] };
    mockDefaults = { zone: 'LATAM', full_year: '2025', product_type: 'Beer' };
    mockIsLoaded = true;
    mockLastDataRefreshKpisFormated = { 'category-health': 'Feb - 2025' };
    mockUsePageFilterApplied.mockImplementation(() => ({
      applied: mockApplied,
      isGlobalZone: mockIsGlobalZone,
    }));
    mockUsePageFilterData.mockImplementation(() => ({
      dataFilters: mockDataFilters,
      defaults: mockDefaults,
    }));
    mockUsePageFilterStatus.mockImplementation(() => ({
      isLoaded: mockIsLoaded,
    }));
  });

  describe('returned values', () => {
    it('should return applied from usePageFilterApplied', () => {
      const result = renderHookComponent();
      expect(result.applied).toBe(mockApplied);
    });

    it('should return isGlobalZone from usePageFilterApplied', () => {
      mockIsGlobalZone = true;
      const result = renderHookComponent();
      expect(result.isGlobalZone).toBe(true);
    });

    it('should return dataFilters from usePageFilterData', () => {
      const result = renderHookComponent();
      expect(result.dataFilters).toBe(mockDataFilters);
    });

    it('should return defaults from usePageFilterData', () => {
      const result = renderHookComponent();
      expect(result.defaults).toBe(mockDefaults);
    });

    it('should return isLoaded from usePageFilterStatus', () => {
      const result = renderHookComponent();
      expect(result.isLoaded).toBe(true);
    });

    it('should return isLoaded as false when filters are not loaded', () => {
      mockIsLoaded = false;
      const result = renderHookComponent();
      expect(result.isLoaded).toBe(false);
    });

    it('should return dispatch function', () => {
      const result = renderHookComponent();
      expect(result.dispatch).toBe(mockDispatch);
    });

    it('should request page filter data using the Category Health page name', () => {
      renderHookComponent();

      expect(mockUsePageFilterApplied).toHaveBeenCalledWith(
        FILTER_CONFIGS.pageName,
      );
      expect(mockUsePageFilterData).toHaveBeenCalledWith(
        FILTER_CONFIGS.pageName,
      );
      expect(mockUsePageFilterStatus).toHaveBeenCalledWith(
        FILTER_CONFIGS.pageName,
      );
    });
  });

  describe('refreshDateLabel', () => {
    it('should return category-health key from lastDataRefreshKpisFormated', () => {
      const result = renderHookComponent();
      expect(result.refreshDateLabel).toBe('Feb - 2025');
    });

    it('should return undefined when lastDataRefreshKpisFormated is undefined', () => {
      mockLastDataRefreshKpisFormated = undefined;
      const result = renderHookComponent();
      expect(result.refreshDateLabel).toBeUndefined();
    });

    it('should return undefined when category-health key is missing', () => {
      mockLastDataRefreshKpisFormated = { other: 'Jan - 2025' };
      const result = renderHookComponent();
      expect(result.refreshDateLabel).toBeUndefined();
    });
  });

  describe('handleClearAllAndNavigateOverview', () => {
    it('should reset global filters, apply them, and navigate to overview', () => {
      const result = renderHookComponent();

      act(() => {
        result.handleClearAllAndNavigateOverview();
      });

      expect(mockUpdateFormValue).toHaveBeenNthCalledWith(1, {
        key: 'zone',
        value: 'ABI',
      });
      expect(mockUpdateFormValue).toHaveBeenNthCalledWith(2, {
        key: 'country',
        value: 'ABI',
      });
      expect(mockApplyFilters).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'filters/updateFormValue',
        payload: { key: 'zone', value: 'ABI' },
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        type: 'filters/updateFormValue',
        payload: { key: 'country', value: 'ABI' },
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        type: 'filters/applyFilters',
      });
      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith(OVERVIEW_BASE_URL);
    });
  });
});
