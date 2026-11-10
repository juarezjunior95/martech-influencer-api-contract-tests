import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  PerformanceToolFilterDataTransformer,
  ValueCreationFilterDataTransformer,
} from 'domain/Filter/FilterDataTransformer';
import {
  FiltersState,
  LoadFiltersParams,
  LoadFiltersResponse,
} from 'models/Filters';
import { BffService } from 'services';

export const loadFilters = createAsyncThunk<
  LoadFiltersResponse,
  LoadFiltersParams,
  { state: { filters: FiltersState } }
>(
  'filters/loadFilters',
  async ({ pageName }, thunkAPI) => {
    const state = thunkAPI.getState().filters?.pages?.[pageName];

    if (state?.status === 'loaded') {
      return {
        pageName: pageName,
        cached: true,
      };
    }

    const PERFORMANCE_TOOL_DEFAULT_KPI_KEY = 'performance_tool_default_kpi';
    let defaultKpi =
      sessionStorage.getItem(PERFORMANCE_TOOL_DEFAULT_KPI_KEY) || undefined;
    if (!defaultKpi) {
      const urlKpi = new URLSearchParams(globalThis.location.search).get(
        'filter_kpis',
      );
      if (urlKpi) {
        sessionStorage.setItem(PERFORMANCE_TOOL_DEFAULT_KPI_KEY, urlKpi);
        defaultKpi = urlKpi;
      }
    }

    try {
      const bffResponse = await BffService.getInstance().getData({
        endpoint: `/presets/${pageName}`,
        params: {},
      });

      if (!bffResponse || bffResponse.hasError) {
        return thunkAPI.rejectWithValue({
          pageName: pageName,
          error: bffResponse?.message ?? 'Failed to load filters',
        });
      }

      const data = bffResponse.data.data ?? {};

      const valueCreationFilter = data?.['value_creation'];
      const performanceToolFilter = !!defaultKpi && data?.['performance_tool'];

      if (!valueCreationFilter && !performanceToolFilter) {
        return {
          pageName: pageName,
          dataFilters: data,
          rawData: data,
          defaultKpi,
        };
      }

      let transformedData = {};

      if (performanceToolFilter) {
        const appliedFilters =
          thunkAPI.getState().filters?.pages?.[pageName]?.applied;
        const apiDefaultKpi =
          data?.kpis?.default?.value || data?.kpis?.values?.[0]?.value || '';

        const selectedKpi = String(
          defaultKpi || appliedFilters?.kpis || apiDefaultKpi,
        ).toLowerCase();
        transformedData = PerformanceToolFilterDataTransformer.transform(
          data,
          selectedKpi,
          appliedFilters,
        );
      }

      if (valueCreationFilter) {
        transformedData = ValueCreationFilterDataTransformer.transform(data);
      }

      return {
        pageName: pageName,
        dataFilters: transformedData,
        rawData: data,
        defaultKpi,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load filters';
      return thunkAPI.rejectWithValue({
        pageName: pageName,
        error: errorMessage,
      });
    }
  },
  {
    condition: ({ pageName }, { getState }) => {
      const state = getState().filters?.pages?.[pageName];
      const shouldLoad =
        state?.status === undefined || state?.status === 'idle';

      return shouldLoad;
    },
  },
);
