import { RESPONSIVE_BREAKPOINTS } from '../configs/responsiveSizes';
import { StackedAreaSize } from '../types';

export function resolveFixedSize(containerWidth: number): StackedAreaSize {
  if (containerWidth >= RESPONSIVE_BREAKPOINTS.responsive) return 'responsive';
  if (containerWidth >= RESPONSIVE_BREAKPOINTS.large) return 'large';
  if (containerWidth >= RESPONSIVE_BREAKPOINTS.medium) return 'medium';
  return 'small';
}
