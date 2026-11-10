/**
 * Domain layer exports
 * Business logic and domain models
 */

// FilterRegistry exports
export {
  FilterRegistry,
  getFilterRegistry,
  initializeFilterRegistry,
  registerFilter,
  registerFilters,
} from './FilterRegistry';

export type {
  FilterConfig,
  FilterDefaultCalculator,
  FilterDependentDefaultCascadingCalculator,
  FilterValueValidator,
  FilterCollisionResolver,
} from './FilterRegistry';

export { FilterDataAccessor } from './FilterDataAccessor';

export {
  PerformanceToolFilterDataTransformer,
  ValueCreationFilterDataTransformer,
  BaseFilterDataTransformer,
  type FlatFilterField,
  type FilterOption,
  type ValueCreationData,
} from './FilterDataTransformer';

export { QuickFilterEngine } from './QuickFilterEngine';
