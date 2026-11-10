import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const CarouselChevronRight = forwardRef<SVGSVGElement, IconProps>(
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
        d="M5.66039 4L4.83789 4.8225L7.50956 7.5L4.83789 10.1775L5.66039 11L9.16039 7.5L5.66039 4Z"
        fill={color}
      />
    </svg>
  ),
);

CarouselChevronRight.displayName = 'CarouselChevronRight';
