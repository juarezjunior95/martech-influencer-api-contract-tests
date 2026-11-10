import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const ArrowRight = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 20, color = 'currentColor', ...props }, ref) => (
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
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
);

ArrowRight.displayName = 'ArrowRight';
