import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const ArrowUp = forwardRef<SVGSVGElement, IconProps>(
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
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
);

ArrowUp.displayName = 'ArrowUp';
