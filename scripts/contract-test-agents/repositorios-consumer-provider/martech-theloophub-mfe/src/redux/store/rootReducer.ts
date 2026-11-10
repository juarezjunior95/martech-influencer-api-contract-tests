import { insightsCopilotApi } from '../api/insightsCopilot';
import { filterSlice } from '../slices/filters';
import { subFiltersSlice } from '../slices/subFilters';

export const rootReducer = {
  subFilters: subFiltersSlice.reducer,
  filters: filterSlice.reducer,
  [insightsCopilotApi.reducerPath]: insightsCopilotApi.reducer,
};
