export { default as FilterRegistry } from './FilterRegistry';
export {
  initializeFilterRegistry,
  registerFilter,
  registerFilters,
} from './registry';

export type {
  FilterConfig,
  FilterDefaultCalculator,
  FilterDependentDefaultCascadingCalculator,
  FilterValueValidator,
  FilterCollisionResolver,
} from './types';

import FilterRegistry from './FilterRegistry';
import { initializeFilterRegistry } from './registry';

export const getFilterRegistry = () => FilterRegistry.getInstance();

// Auto-initialize on module load
initializeFilterRegistry();
