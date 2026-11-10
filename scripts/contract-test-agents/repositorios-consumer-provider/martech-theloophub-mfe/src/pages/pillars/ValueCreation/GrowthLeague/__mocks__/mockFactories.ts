export interface MockSubFiltersReturn {
  activeSubFilters: Record<string, string | undefined>;
  subFiltersData: Record<
    string,
    {
      values?: {
        label: string;
        value: string;
        divisions?: { label: string; value: string }[];
      }[];
    }
  >;
  disabledFields: string[];
  subFiltersInUse: Record<string, boolean>;
  subFiltersLoaded: Record<string, boolean>;
  hiddenSubFilters: string[];
  loadSubFilterData: jest.Mock;
  setSubFilterValue: jest.Mock;
  setSubFilterInUse: jest.Mock;
  hideSubFilters: jest.Mock;
  toggleDisabledField: jest.Mock;
  hideFields: jest.Mock;
  ALL_VALUE: string;
  setSubFiltersData: jest.Mock;
  setSubFiltersLoaded: jest.Mock;
}

export interface MockKpiDataReturn<T = unknown> {
  kpiData: T | null;
  loading: boolean;
  error: Error | null;
}

export const createMockUseSubFiltersReturn = (
  overrides: Partial<MockSubFiltersReturn> = {},
): MockSubFiltersReturn => ({
  activeSubFilters: {},
  subFiltersData: {},
  disabledFields: [],
  subFiltersInUse: {},
  subFiltersLoaded: {},
  hiddenSubFilters: [],
  loadSubFilterData: jest.fn(),
  setSubFilterValue: jest.fn(),
  setSubFilterInUse: jest.fn(),
  hideSubFilters: jest.fn(),
  toggleDisabledField: jest.fn(),
  hideFields: jest.fn(),
  ALL_VALUE: 'All',
  setSubFiltersData: jest.fn(),
  setSubFiltersLoaded: jest.fn(),
  ...overrides,
});

export const createMockUseKpiDataReturn = <T = unknown>(
  overrides: Partial<MockKpiDataReturn<T>> = {},
): MockKpiDataReturn<T> => ({
  kpiData: null,
  loading: false,
  error: null,
  ...overrides,
});
