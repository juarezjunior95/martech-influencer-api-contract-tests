import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const Check = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 14, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

Check.displayName = 'Check';
