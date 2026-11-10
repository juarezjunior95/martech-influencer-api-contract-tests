import { act } from 'react-dom/test-utils';

import { renderHook } from '@testing-library/react-hooks';

import { useSubFilterLogic } from './useSubFilterLogic';

const mockUseCurrentPage = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUseSubFilters = jest.fn();
const mockTrackGA = jest.fn();
const mockLoadSubFilterData = jest.fn();
const mockSetSubFilterValue = jest.fn();

jest.mock('hooks', () => ({
  useCurrentPage: () => mockUseCurrentPage(),
  usePageFilterApplied: () => mockUsePageFilterApplied(),
  useGoogleAnalytics: () => mockTrackGA,
}));

jest.mock('hooks/useSubFilters/useSubFilters', () => ({
  useSubFilters: () => mockUseSubFilters(),
}));

describe('useSubFilterLogic', () => {
  const defaultProps = {
    apiKey: 'test-api-key',
    stateKey: 'test-state-key',
  };

  const mockFilterData = {
    values: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    default: { value: 'option1' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCurrentPage.mockReturnValue({
      currentPage: 'test-page',
    });
    mockUsePageFilterApplied.mockReturnValue({
      applied: {},
    });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {},
      subFiltersData: {},
      disabledFields: [],
      subFiltersInUse: {},
      subFiltersLoaded: {},
      loadSubFilterData: mockLoadSubFilterData,
      setSubFilterValue: mockSetSubFilterValue,
      hiddenSubFilters: {},
      ALL_VALUE: 'ALL',
    });
  });

  describe('Initial State', () => {
    it('should return options', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.options).toHaveLength(3);
      expect(result.current.options[0]).toEqual({
        value: 'option1',
        label: 'Option 1',
        icon: undefined,
      });
    });

    it('should return currentValue', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { 'test-state-key': 'option2' },
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.currentValue).toBe('option2');
    });

    it('should return handleOnChange function', () => {
      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(typeof result.current.handleOnChange).toBe('function');
    });

    it('should return stateKey', () => {
      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.stateKey).toBe('test-state-key');
    });
  });

  describe('Options Logic', () => {
    it('should map options with icons when iconsByValue is provided', () => {
      const iconsByValue = {
        option1: 'icon1',
        option2: 'icon2',
      };

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, iconsByValue }),
      );

      expect(result.current.options[0]).toEqual({
        value: 'option1',
        label: 'Option 1',
        icon: 'icon1',
      });
      expect(result.current.options[1]).toEqual({
        value: 'option2',
        label: 'Option 2',
        icon: 'icon2',
      });
    });

    it('should handle grouped options', () => {
      const groupedData = {
        values: [
          {
            group: 'Group 1',
            values: [
              { value: 'g1-opt1', label: 'Group 1 Option 1' },
              { value: 'g1-opt2', label: 'Group 1 Option 2' },
            ],
          },
        ],
        default: { value: 'g1-opt1' },
      };

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': groupedData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.options).toEqual(groupedData.values);
    });

    it('should return empty array when no filter data', () => {
      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.options).toEqual([]);
    });

    it('should handle groupBy with filterKey', () => {
      const groupByData = {
        values: {
          country1: {
            values: [
              { value: 'brand1', label: 'Brand 1' },
              { value: 'brand2', label: 'Brand 2' },
            ],
            default: { value: 'brand1' },
          },
        },
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'country1' },
      });

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': groupByData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({
          ...defaultProps,
          groupBy: { filterKey: 'country' },
        }),
      );

      expect(result.current.options).toEqual([
        { value: 'brand1', label: 'Brand 1' },
        { value: 'brand2', label: 'Brand 2' },
      ]);
    });

    it('should handle groupBy with brands instead of values', () => {
      const groupByData = {
        values: {
          country1: {
            brands: [
              { value: 'brand1', label: 'Brand 1' },
              { value: 'brand2', label: 'Brand 2' },
            ],
          },
        },
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'country1' },
      });

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': groupByData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({
          ...defaultProps,
          groupBy: { filterKey: 'country' },
        }),
      );

      expect(result.current.options).toEqual([
        { value: 'brand1', label: 'Brand 1' },
        { value: 'brand2', label: 'Brand 2' },
      ]);
    });

    it('should return empty array when groupBy value does not match', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'nonexistent' },
      });

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': { values: {} } },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({
          ...defaultProps,
          groupBy: { filterKey: 'country' },
        }),
      );

      expect(result.current.options).toEqual([]);
    });
  });

  describe('Default Option Logic', () => {
    it('should return default value from filter data', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      renderHook(() => useSubFilterLogic(defaultProps));

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'option1',
      );
    });

    it('should use ALL_VALUE when no default is set', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: {
          'test-api-key': {
            values: [{ value: 'opt1', label: 'Option 1' }],
          },
        },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      renderHook(() => useSubFilterLogic(defaultProps));

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'ALL',
      );
    });

    it('should use custom allKey when provided', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: {
          'test-api-key': {
            values: [{ value: 'opt1', label: 'Option 1' }],
          },
        },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      renderHook(() =>
        useSubFilterLogic({ ...defaultProps, allKey: 'CUSTOM_ALL' }),
      );

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'CUSTOM_ALL',
      );
    });

    it('should handle groupBy default value', () => {
      const groupByData = {
        values: {
          country1: {
            values: [{ value: 'brand1', label: 'Brand 1' }],
            default: { value: 'brand1' },
          },
        },
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'country1' },
      });

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': groupByData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      renderHook(() =>
        useSubFilterLogic({
          ...defaultProps,
          groupBy: { filterKey: 'country' },
        }),
      );

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'brand1',
      );
    });
  });

  describe('Current Value Logic', () => {
    it('should return active subfilter value', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { 'test-state-key': 'selected-option' },
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.currentValue).toBe('selected-option');
    });

    it('should return ALL_VALUE when no active subfilter', () => {
      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.currentValue).toBe('ALL');
    });

    it('should return custom allKey when no active subfilter', () => {
      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, allKey: 'TOTAL' }),
      );

      expect(result.current.currentValue).toBe('TOTAL');
    });
  });

  describe('State Flags', () => {
    it('should set isDisabled when no options', () => {
      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.isDisabled).toBe(true);
    });

    it('should set isDisabled when field is in disabledFields', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: ['test-state-key'],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.isDisabled).toBe(true);
    });

    it('should not be disabled when options exist and not in disabledFields', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.isDisabled).toBe(false);
    });

    it('should set isInUse when filter is in use', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: { 'test-state-key': true },
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.isInUse).toBe(true);
    });

    it('should set isHidden when filter is hidden', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: { 'test-state-key': true },
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.isHidden).toBe(true);
    });

    it('should set isLoaded when filter is loaded', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: { 'test-state-key': true },
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.isLoaded).toBe(true);
    });
  });

  describe('handleOnChange', () => {
    it('should call setSubFilterValue with string value', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      act(() => {
        result.current.handleOnChange('new-value');
      });

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'new-value',
      );
    });

    it('should call setSubFilterValue with Option object', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      act(() => {
        result.current.handleOnChange({ value: 'option2', label: 'Option 2' });
      });

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'option2',
      );
    });

    it('should track GA event for groupBy filter', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, name: 'groupBy' }),
      );

      act(() => {
        result.current.handleOnChange('new-value');
      });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Select',
        event_label: 'new-value',
      });
    });

    it('should track GA event for subBreakdown filter', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, name: 'subBreakdown' }),
      );

      act(() => {
        result.current.handleOnChange('breakdown-value');
      });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Select',
        event_label: 'breakdown-value',
      });
    });

    it('should track GA event for performanceBreakdown filter', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, name: 'performanceBreakdown' }),
      );

      act(() => {
        result.current.handleOnChange('perf-value');
      });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Select',
        event_label: 'perf-value',
      });
    });

    it('should track GA event for kpis filter', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, name: 'kpis' }),
      );

      act(() => {
        result.current.handleOnChange('media_spend');
      });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Select',
        event_label: 'media_spend',
      });
    });

    it('should not track GA event for other filters', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, name: 'otherFilter' }),
      );

      act(() => {
        result.current.handleOnChange('value');
      });

      expect(mockTrackGA).not.toHaveBeenCalled();
    });

    it('should handle GA tracking error gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockTrackGA.mockImplementation(() => {
        throw new Error('GA error');
      });

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, name: 'groupBy' }),
      );

      act(() => {
        result.current.handleOnChange('value');
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to track Google Analytics event:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Value Validation Effect', () => {
    it('should reset to default when current value is not in options', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { 'test-state-key': 'invalid-value' },
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      renderHook(() => useSubFilterLogic(defaultProps));

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'option1',
      );
    });

    it('should validate value in grouped options', () => {
      const groupedData = {
        values: [
          {
            group: 'Group 1',
            values: [
              { value: 'g1-opt1', label: 'Group 1 Option 1' },
              { value: 'g1-opt2', label: 'Group 1 Option 2' },
            ],
          },
        ],
        default: { value: 'g1-opt1' },
      };

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { 'test-state-key': 'invalid' },
        subFiltersData: { 'test-api-key': groupedData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      renderHook(() => useSubFilterLogic(defaultProps));

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'test-state-key',
        'g1-opt1',
      );
    });

    it('should not reset when value is valid in grouped options', () => {
      const groupedData = {
        values: [
          {
            group: 'Group 1',
            values: [
              { value: 'g1-opt1', label: 'Group 1 Option 1' },
              { value: 'g1-opt2', label: 'Group 1 Option 2' },
            ],
          },
        ],
        default: { value: 'g1-opt1' },
      };

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { 'test-state-key': 'g1-opt2' },
        subFiltersData: { 'test-api-key': groupedData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      // Value is valid, so it should not be reset
      expect(result.current.currentValue).toBe('g1-opt2');
    });
  });

  describe('Load Data Effect', () => {
    it('should call loadSubFilterData on mount', () => {
      renderHook(() => useSubFilterLogic(defaultProps));

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'test-api-key',
        undefined,
        'test-state-key',
      );
    });

    it('should call loadSubFilterData with params', () => {
      const params = { country: 'US', zone: 'zone1' };

      renderHook(() => useSubFilterLogic({ ...defaultProps, params }));

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'test-api-key',
        params,
        'test-state-key',
      );
    });

    it('should reload data when apiKey changes', () => {
      const { rerender } = renderHook(
        ({ apiKey }) => useSubFilterLogic({ ...defaultProps, apiKey }),
        {
          initialProps: { apiKey: 'api-key-1' },
        },
      );

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'api-key-1',
        undefined,
        'test-state-key',
      );

      rerender({ apiKey: 'api-key-2' });

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'api-key-2',
        undefined,
        'test-state-key',
      );
    });

    it('should reload data when params change', () => {
      const { rerender } = renderHook(
        ({ params }) => useSubFilterLogic({ ...defaultProps, params }),
        {
          initialProps: { params: { country: 'US' } },
        },
      );

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'test-api-key',
        { country: 'US' },
        'test-state-key',
      );

      rerender({ params: { country: 'UK' } });

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'test-api-key',
        { country: 'UK' },
        'test-state-key',
      );
    });
  });

  describe('Empty Data Handling', () => {
    it('should produce empty options and fall back to ALL_VALUE when the request returns no data', () => {
      // Simulate the request resolving with no usable data: subFiltersData has
      // no entry for the apiKey (matches what useSubFilters does on null/empty
      // responses - `setSubFiltersData(null)` leaves no key for this apiKey).
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: { 'test-state-key': true },
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'test-api-key',
        undefined,
        'test-state-key',
      );

      expect(result.current.options).toEqual([]);
      expect(result.current.currentValue).toBe('ALL');
      expect(result.current.isDisabled).toBe(true);
      // No options means the validation effect should not push a default value.
      expect(mockSetSubFilterValue).not.toHaveBeenCalled();
    });
  });

  describe('Params String Memoization', () => {
    it('should memoize params string', () => {
      const params = { country: 'US', zone: 'zone1' };

      const { rerender } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, params }),
      );

      const initialCallCount = mockLoadSubFilterData.mock.calls.length;

      rerender();

      expect(mockLoadSubFilterData).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined name', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': mockFilterData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({ ...defaultProps, name: undefined }),
      );

      act(() => {
        result.current.handleOnChange('value');
      });

      expect(mockTrackGA).not.toHaveBeenCalled();
    });

    it('should handle empty params object', () => {
      renderHook(() => useSubFilterLogic({ ...defaultProps, params: {} }));

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'test-api-key',
        {},
        'test-state-key',
      );
    });

    it('should handle null groupBy value', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: null },
      });

      const groupByData = {
        values: {
          country1: {
            values: [{ value: 'brand1', label: 'Brand 1' }],
          },
        },
      };

      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: { 'test-api-key': groupByData },
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() =>
        useSubFilterLogic({
          ...defaultProps,
          groupBy: { filterKey: 'country' },
        }),
      );

      expect(result.current.options).toEqual([]);
    });

    it('should handle undefined filterData for specific apiKey', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        hiddenSubFilters: {},
        ALL_VALUE: 'ALL',
      });

      const { result } = renderHook(() => useSubFilterLogic(defaultProps));

      expect(result.current.options).toEqual([]);
      expect(result.current.currentValue).toBe('ALL');
    });
  });
});
