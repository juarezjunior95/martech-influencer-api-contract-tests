import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterValue, Option } from 'models/Filters';

export const STORAGE_KEY = 'subFilters';

const ALL_VALUE = 'All';

export type SubFilters = {
  [subFilterKey: FilterValue]: {
    default?: Option;
    values?: any[];
    enabled: boolean;
  };
};

export type SubFiltersInUse = {
  [subFilterKey: string]: boolean;
};

export type SubFiltersLoaded = {
  [subFilterKey: string]: boolean;
};

export type HiddenSubfilters = {
  [subFilterKey: string]: any;
};

export interface SubFiltersState {
  activeSubFilters: Record<string, FilterValue>;
  subFiltersData: SubFilters;
  disabledFields: string[];
  subFiltersInUse: SubFiltersInUse;
  subFiltersLoaded: SubFiltersLoaded;
  hiddenSubFilters: HiddenSubfilters;
}

const initialState: SubFiltersState = {
  activeSubFilters: {},
  subFiltersData: {},
  disabledFields: [],
  subFiltersInUse: {},
  subFiltersLoaded: {},
  hiddenSubFilters: {},
};

export const subFiltersSlice = createSlice({
  name: 'subFilters',
  initialState,
  reducers: {
    setSubFilterValue: (
      state,
      action: PayloadAction<{ key: string; value: string }>,
    ) => {
      const { key, value } = action.payload;
      state.activeSubFilters[key] = value;
    },
    setSubFiltersData: (state, action: PayloadAction<SubFilters>) => {
      state.subFiltersData = {
        ...state.subFiltersData,
        ...action.payload,
      };
    },
    toggleDisabledField: (state, action: PayloadAction<string>) => {
      const fieldKey = action.payload;
      if (state.disabledFields.includes(fieldKey)) {
        state.disabledFields = state.disabledFields.filter(
          (key) => key !== fieldKey,
        );
      } else {
        state.disabledFields.push(fieldKey);
      }
    },
    toggleSubFiltersInUse: (
      state,
      action: PayloadAction<{ keys: string[]; state: boolean }>,
    ) => {
      const { keys, state: isInUse } = action.payload;
      keys.forEach((key) => {
        state.subFiltersInUse[key] = isInUse;
      });
    },

    hideSubFilters: (
      state,
      action: PayloadAction<{ keys: string[]; state: boolean }>,
    ) => {
      const { keys, state: isInUse } = action.payload;
      keys.forEach((key) => {
        state.hiddenSubFilters[key] = isInUse;
      });
    },
    setSubFiltersLoaded: (
      state,
      action: PayloadAction<{ keys: string[]; state: boolean }>,
    ) => {
      const { keys, state: isLoaded } = action.payload;
      state.subFiltersLoaded = {
        ...state.subFiltersLoaded,
        ...keys.reduce((acc, key) => {
          acc[key] = isLoaded;
          return acc;
        }, {}),
      };
    },
    setDefaultValues: (state, action: PayloadAction<SubFilters>) => {
      const subFiltersData = action.payload;
      Object.entries(subFiltersData).forEach(([subFilterKey, subFilter]) => {
        if (!state.activeSubFilters[subFilterKey]) {
          state.activeSubFilters[subFilterKey] =
            subFilter?.default?.value || ALL_VALUE;
        }
      });
    },
  },
});

export const {
  setSubFilterValue,
  setSubFiltersData,
  toggleDisabledField,
  toggleSubFiltersInUse,
  setSubFiltersLoaded,
  setDefaultValues,
  hideSubFilters,
} = subFiltersSlice.actions;

export default subFiltersSlice.reducer;
