import { act } from 'react-dom/test-utils';

import { renderHook } from '@testing-library/react-hooks';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { Option } from 'models/Filters';

import { useQuickFilter } from './useQuickFilter';

const mockTrackGA = jest.fn();
const mockHandleClear = jest.fn();
const mockOnValueChange = jest.fn();
const mockGetCurrentValue = jest.fn();
const mockUpdateForm = jest.fn();
const mockApply = jest.fn();

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => mockTrackGA),
  usePageFilterData: jest.fn(() => ({
    appliedDataFilters: {
      testField: {
        values: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      },
    },
    defaults: {
      testField: 'option1',
      country: 'Brazil',
    },
  })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: mockUpdateForm,
    apply: mockApply,
  })),
}));

jest.mock('../useQuickFilterReset', () => ({
  useQuickFilterReset: jest.fn(() => ({
    handleClear: mockHandleClear,
  })),
}));

jest.mock('domain/Filter/FilterDataAccessor');

const mockOptions: Option[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('useQuickFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: jest.fn(() => mockOptions),
    });

    mockGetCurrentValue.mockImplementation((key: string) => {
      if (key === 'testField') return 'option1';
      if (key === 'country') return 'Brazil';
      return null;
    });
  });

  const defaultConfig = {
    fieldKey: 'testField',
    pageName: 'test-page',
    gaCategory: 'Test Select',
    filterContext: {},
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  };

  it('should return options from FilterDataAccessor', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    expect(result.current.options).toEqual(mockOptions);
    expect(FilterDataAccessor.getInstance().getOptions).toHaveBeenCalledWith(
      'testField',
      expect.any(Object),
      {},
    );
  });

  it('should return current value from getCurrentValue', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    expect(result.current.currentValue).toBe('option1');
    expect(mockGetCurrentValue).toHaveBeenCalledWith('testField');
  });

  it('should not show clear icon when value equals default', () => {
    mockGetCurrentValue.mockReturnValue('option1'); // same as default

    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    expect(result.current.showClearIcon).toBe(false);
  });

  it('should show clear icon when value differs from default', () => {
    mockGetCurrentValue.mockReturnValue('option2'); // different from default

    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    expect(result.current.showClearIcon).toBe(true);
  });

  it('should call Google Analytics on value change', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    const testOption: Option = { value: 'option2', label: 'Option 2' };

    act(() => {
      result.current.handleValueChange(testOption);
    });

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Test Select',
      event_action: 'Select',
      event_label: 'option2',
    });
  });

  it('should call onValueChange callback on value change', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    const testOption: Option = { value: 'option3', label: 'Option 3' };

    act(() => {
      result.current.handleValueChange(testOption);
    });

    expect(mockOnValueChange).toHaveBeenCalledWith('testField', testOption);
  });

  it('should not call callbacks when option value is empty', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    const emptyOption: Option = { value: '', label: 'Empty' };

    act(() => {
      result.current.handleValueChange(emptyOption);
    });

    expect(mockTrackGA).not.toHaveBeenCalled();
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('should not call callbacks when option value is null', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    const nullOption: Option = { value: null as any, label: 'Null' };

    act(() => {
      result.current.handleValueChange(nullOption);
    });

    expect(mockTrackGA).not.toHaveBeenCalled();
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('should pass filterContext to FilterDataAccessor', () => {
    const configWithContext = {
      ...defaultConfig,
      filterContext: { country: 'Argentina', zone: 'SAZ' },
    };

    renderHook(() => useQuickFilter(configWithContext));

    expect(FilterDataAccessor.getInstance().getOptions).toHaveBeenCalledWith(
      'testField',
      expect.any(Object),
      { country: 'Argentina', zone: 'SAZ' },
    );
  });

  it('should update options when filterContext changes', () => {
    const { rerender } = renderHook(
      ({ filterContext }) =>
        useQuickFilter({ ...defaultConfig, filterContext }),
      { initialProps: { filterContext: { country: 'Brazil' } } },
    );

    expect(FilterDataAccessor.getInstance().getOptions).toHaveBeenCalledWith(
      'testField',
      expect.any(Object),
      { country: 'Brazil' },
    );

    // Change filterContext
    rerender({ filterContext: { country: 'Argentina' } });

    expect(FilterDataAccessor.getInstance().getOptions).toHaveBeenCalledWith(
      'testField',
      expect.any(Object),
      { country: 'Argentina' },
    );
  });

  it('should return handleClear from useQuickFilterReset', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    expect(result.current.handleClear).toBe(mockHandleClear);
  });

  it('should return defaults and dataFilters', () => {
    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    expect(result.current.defaults).toEqual({
      testField: 'option1',
      country: 'Brazil',
    });
    expect(result.current.dataFilters).toEqual({
      testField: {
        values: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      },
    });
  });

  it('should handle empty options array', () => {
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: jest.fn(() => []),
    });

    const { result } = renderHook(() => useQuickFilter(defaultConfig));

    expect(result.current.options).toEqual([]);
  });

  it('should use the same options reference when dependencies do not change', () => {
    const { result, rerender } = renderHook(() =>
      useQuickFilter(defaultConfig),
    );
    const firstOptionsReference = result.current.options;

    rerender();

    expect(result.current.options).toBe(firstOptionsReference);
  });
});
