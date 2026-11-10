import { act, renderHook } from '@testing-library/react-hooks';

import { ComparisonFilterItem } from '../types';
import { useComparisonSubFilter } from './useComparisonSubFilter';

const mockUsePageFilterApplied = jest.fn();

jest.mock('hooks', () => ({
  ...jest.requireActual('hooks'),
  usePageFilterApplied: (pageName: string) =>
    mockUsePageFilterApplied(pageName),
}));

const mockCountryItems: ComparisonFilterItem[] = [
  { value: 'CHN', label: 'CHN' },
  { value: 'KOR', label: 'KOR' },
  { value: 'BRA', label: 'BRA' },
  { value: 'ARG', label: 'ARG' },
];

const mockBrandItems: ComparisonFilterItem[] = [
  { value: 'Corona', label: 'Corona' },
  { value: 'Quilmes', label: 'Quilmes' },
  { value: 'Brahma', label: 'Brahma' },
];

const allCountryValues = ['CHN', 'KOR', 'BRA', 'ARG'];
const allBrandValues = ['Corona', 'Quilmes', 'Brahma'];

const expectedCountryOptions = [
  {
    group: '',
    values: [
      { value: 'CHN', label: 'CHN' },
      { value: 'KOR', label: 'KOR' },
      { value: 'BRA', label: 'BRA' },
      { value: 'ARG', label: 'ARG' },
    ],
  },
];

describe('useComparisonSubFilter', () => {
  beforeEach(() => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { country: 'ABI' },
      isGlobalZone: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('options derivation', () => {
    it('returns empty array when filterData is undefined', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: undefined }),
      );

      expect(result.current.options).toEqual([]);
    });

    it('returns empty array when filterData is an empty array', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: [] }),
      );

      expect(result.current.options).toEqual([]);
    });

    it('maps ComparisonFilterItem[] to a single FilterOption group with group:""', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      expect(result.current.options).toEqual(expectedCountryOptions);
    });

    it('group is always "" so no group heading is rendered', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      expect(result.current.options[0].group).toBe('');
    });

    it('updates options when filterData changes (country → brand)', () => {
      const { result, rerender } = renderHook(
        ({ filterData }: { filterData: ComparisonFilterItem[] | undefined }) =>
          useComparisonSubFilter({ filterData }),
        { initialProps: { filterData: undefined } },
      );

      expect(result.current.options).toEqual([]);

      rerender({ filterData: mockCountryItems });

      expect(result.current.options).toEqual(expectedCountryOptions);
    });
  });

  describe('default selection (all selected on first load)', () => {
    it('pre-selects all values when filterData arrives for the first time', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      expect(result.current.selectedValues).toEqual(allCountryValues);
    });

    it('starts with empty selectedValues when filterData is undefined', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: undefined }),
      );

      expect(result.current.selectedValues).toEqual([]);
    });

    it('pre-selects all when filterData transitions from undefined to data', () => {
      const { result, rerender } = renderHook(
        ({ filterData }: { filterData: ComparisonFilterItem[] | undefined }) =>
          useComparisonSubFilter({ filterData }),
        { initialProps: { filterData: undefined } },
      );

      expect(result.current.selectedValues).toEqual([]);

      rerender({ filterData: mockCountryItems });

      expect(result.current.selectedValues).toEqual(allCountryValues);
    });

    it('does not reset when applied.country stays the same', () => {
      const { result, rerender } = renderHook(
        ({ filterData }: { filterData: ComparisonFilterItem[] | undefined }) =>
          useComparisonSubFilter({ filterData }),
        { initialProps: { filterData: mockCountryItems } },
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      rerender({ filterData: mockCountryItems });

      expect(result.current.selectedValues).toEqual(['CHN']);
    });
  });

  describe('applied.country change reset', () => {
    it('resets to all selected when applied.country changes from ABI to a specific country', () => {
      const { result, rerender } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      expect(result.current.selectedValues).toEqual(['CHN']);

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'ARG' },
        isGlobalZone: false,
      });

      rerender();

      expect(result.current.selectedValues).toEqual(allCountryValues);
    });

    it('resets to all selected when applied.country changes from a country to ABI', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'ARG' },
        isGlobalZone: false,
      });

      const { result, rerender } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockBrandItems }),
      );

      act(() => {
        result.current.handleChange(['Corona']);
      });

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'ABI' },
        isGlobalZone: true,
      });

      rerender();

      expect(result.current.selectedValues).toEqual(allBrandValues);
    });

    it('resets to all selected when filterData itself changes after country change', () => {
      const { result, rerender } = renderHook(
        ({ filterData }: { filterData: ComparisonFilterItem[] | undefined }) =>
          useComparisonSubFilter({ filterData }),
        { initialProps: { filterData: mockCountryItems } },
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'ARG' },
        isGlobalZone: false,
      });

      rerender({ filterData: mockBrandItems });

      expect(result.current.selectedValues).toEqual(allBrandValues);
    });

    it('resets when country changes while filterData is still loading (arrives on a later render)', () => {
      const { result, rerender } = renderHook(
        ({ filterData }: { filterData: ComparisonFilterItem[] | undefined }) =>
          useComparisonSubFilter({ filterData }),
        { initialProps: { filterData: mockCountryItems } },
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      // Render 1: country changes but filterData not updated yet (BFF still loading)
      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'ARG' },
        isGlobalZone: false,
      });
      rerender({ filterData: undefined });

      // userSelectionRef is cleared immediately on country change — shows [] until
      // new filterData arrives (allValues is empty while loading)
      expect(result.current.selectedValues).toEqual([]);

      // Render 2: BFF responds with new filterData for the new country
      rerender({ filterData: mockBrandItems });

      // The deferred reset fires with the new items
      expect(result.current.selectedValues).toEqual(allBrandValues);
    });

    it('remains isInitialized true after applied.country change', () => {
      const { result, rerender } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'ARG' },
        isGlobalZone: false,
      });

      rerender();

      expect(result.current.isInitialized).toBe(true);
    });
  });

  describe('isInitialized flag', () => {
    it('is false before filterData arrives', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: undefined }),
      );

      expect(result.current.isInitialized).toBe(false);
    });

    it('is true after filterData arrives and pre-selection runs', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      expect(result.current.isInitialized).toBe(true);
    });

    it('is true after filterData transitions from undefined to data', () => {
      const { result, rerender } = renderHook(
        ({ filterData }: { filterData: ComparisonFilterItem[] | undefined }) =>
          useComparisonSubFilter({ filterData }),
        { initialProps: { filterData: undefined } },
      );

      expect(result.current.isInitialized).toBe(false);

      rerender({ filterData: mockCountryItems });

      expect(result.current.isInitialized).toBe(true);
    });

    it('remains true after user clears all selections', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange([]);
      });

      expect(result.current.isInitialized).toBe(true);
      expect(result.current.selectedValues).toEqual([]);
    });
  });

  describe('isUserSelection flag', () => {
    it('is false on initial load (auto mode)', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      expect(result.current.isUserSelection).toBe(false);
    });

    it('is false when filterData is undefined', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: undefined }),
      );

      expect(result.current.isUserSelection).toBe(false);
    });

    it('becomes true after handleChange is called', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      expect(result.current.isUserSelection).toBe(true);
    });

    it('resets to false after applied.country changes', () => {
      const { result, rerender } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      expect(result.current.isUserSelection).toBe(true);

      mockUsePageFilterApplied.mockReturnValue({
        applied: { country: 'ARG' },
        isGlobalZone: false,
      });

      rerender();

      expect(result.current.isUserSelection).toBe(false);
    });
  });

  describe('allValues', () => {
    it('equals all values derived from filterData', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      expect(result.current.allValues).toEqual(allCountryValues);
    });

    it('is empty when filterData is undefined', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: undefined }),
      );

      expect(result.current.allValues).toEqual([]);
    });

    it('does not change after handleChange updates selectedValues', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      expect(result.current.allValues).toEqual(allCountryValues);
    });

    it('updates when filterData changes', () => {
      const { result, rerender } = renderHook(
        ({ filterData }: { filterData: ComparisonFilterItem[] | undefined }) =>
          useComparisonSubFilter({ filterData }),
        { initialProps: { filterData: mockCountryItems } },
      );

      rerender({ filterData: mockBrandItems });

      expect(result.current.allValues).toEqual(allBrandValues);
    });
  });

  describe('selectedValues and handleChange', () => {
    it('selectedValues contains plain string values matching filter items', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      expect(result.current.selectedValues).toEqual(
        expect.arrayContaining(allCountryValues),
      );
      result.current.selectedValues.forEach((v) => {
        expect(typeof v).toBe('string');
      });
    });

    it('handleChange updates selectedValues', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange(['CHN', 'KOR']);
      });

      expect(result.current.selectedValues).toEqual(['CHN', 'KOR']);
    });

    it('handleChange replaces previous selectedValues', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      act(() => {
        result.current.handleChange(['BRA', 'ARG']);
      });

      expect(result.current.selectedValues).toEqual(['BRA', 'ARG']);
    });

    it('handleChange with empty array clears all selections', () => {
      const { result } = renderHook(() =>
        useComparisonSubFilter({ filterData: mockCountryItems }),
      );

      act(() => {
        result.current.handleChange(['CHN']);
      });

      act(() => {
        result.current.handleChange([]);
      });

      expect(result.current.selectedValues).toEqual([]);
    });
  });
});
