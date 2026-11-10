import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const Copied = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 18, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.75 13.4996C6.3375 13.4996 5.98437 13.3528 5.69062 13.059C5.39687 12.7653 5.25 12.4121 5.25 11.9996V2.99963C5.25 2.58713 5.39687 2.23401 5.69062 1.94026C5.98437 1.64651 6.3375 1.49963 6.75 1.49963H13.5C13.9125 1.49963 14.2656 1.64651 14.5594 1.94026C14.8531 2.23401 15 2.58713 15 2.99963V11.9996C15 12.4121 14.8531 12.7653 14.5594 13.059C14.2656 13.3528 13.9125 13.4996 13.5 13.4996H6.75ZM6.75 11.9996H13.5V2.99963H6.75V11.9996ZM3.75 16.4996C3.3375 16.4996 2.98438 16.3528 2.69062 16.059C2.39688 15.7653 2.25 15.4121 2.25 14.9996V4.49963H3.75V14.9996H12V16.4996H3.75Z"
        fill={color}
      />
      <path
        d="M9 9.75L7.75 8.5L8.35 7.9L9 8.55L11.65 5.9L12.25 6.5L9 9.75Z"
        fill={color}
      />
    </svg>
  ),
);

Copied.displayName = 'Copied';
