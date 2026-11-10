import { FilterForm } from 'models/Filters';

export interface WaterfallConfig {
  kpiName: string;

  viewByToGrouping: Record<string, string>;

  groupingToViewBy: Record<string, Record<string, string>>;

  isViewByDisabled: (
    contextKey: string,
    activeSubFilters?: Record<string, unknown>,
    applied?: FilterForm,
  ) => boolean;

  getDisabledIndexes: (labels?: string[]) => number[];

  handleBarClick: (params: BarClickParams) => void;

  shouldSyncSubFilters?: (contextKey: string) => boolean;

  getContextKey: (applied: FilterForm, isGlobalZone: boolean) => string;

  getViewByForForcedSync?: (applied: FilterForm) => string | null;
}

export type ViewByDisabledCondition = (params: {
  contextKey: string;
  activeSubFilters?: Record<string, unknown>;
  applied?: FilterForm;
}) => boolean;

export interface WaterfallConfigOverrides {
  additionalAllowedContexts?: string[];

  additionalGroupingToViewBy?: Record<string, Record<string, string>>;

  getContextKeyOverride?: (
    applied: FilterForm,
    isGlobalZone: boolean,
  ) => string | null;

  isViewByDisabled?: ViewByDisabledCondition;
}

export interface BarClickParams {
  index: number;
  labels?: string[];
  activeSubFilters: Record<string, unknown>;
  dataFilters: unknown;
  applied: FilterForm;
  updateForm: (key: string, value: string) => void;
  apply: () => void;
}
