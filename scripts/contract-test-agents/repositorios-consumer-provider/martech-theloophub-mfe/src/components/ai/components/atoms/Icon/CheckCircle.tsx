import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const CheckCircle = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 20, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.5" />
      <path
        d="M8 12L11 15L16 9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

CheckCircle.displayName = 'CheckCircle';
