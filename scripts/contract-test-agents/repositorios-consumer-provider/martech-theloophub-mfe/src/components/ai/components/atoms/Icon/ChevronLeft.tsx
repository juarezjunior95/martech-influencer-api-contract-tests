import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const ChevronLeft = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 16, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
);

ChevronLeft.displayName = 'ChevronLeft';
