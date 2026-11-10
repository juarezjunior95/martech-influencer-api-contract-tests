import { FilterDataStructure, FilterPage } from 'models/Filters';

export const createInitialFilterPage = (): FilterPage => ({
  status: 'idle',
  dataFilters: {},
  defaults: {},
  defaultKpi: null,
  rawData: {} as FilterDataStructure,
  applied: {},
  form: {},
  lastUpdated: 0,
  isHidden: false,
});
