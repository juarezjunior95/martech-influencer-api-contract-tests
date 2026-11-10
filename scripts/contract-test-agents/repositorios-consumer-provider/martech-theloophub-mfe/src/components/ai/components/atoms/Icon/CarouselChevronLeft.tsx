import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const CarouselChevronLeft = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 16, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M9.16039 4.8225L8.33789 4L4.83789 7.5L8.33789 11L9.16039 10.1775L6.48872 7.5L9.16039 4.8225Z"
        fill={color}
      />
    </svg>
  ),
);

CarouselChevronLeft.displayName = 'CarouselChevronLeft';
