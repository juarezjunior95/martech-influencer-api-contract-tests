import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const ChevronRight = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 16, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M8.41809 12.4737C8.17778 12.1791 8.19524 11.7444 8.46984 11.4698L13.4698 6.46978L13.5265 6.41803C13.8211 6.17772 14.2558 6.19518 14.5304 6.46978C14.805 6.74439 14.8225 7.17911 14.5821 7.47369L14.5304 7.53033L10.0607 12.0001L14.5304 16.4698C14.8233 16.7627 14.8233 17.2374 14.5304 17.5303C14.2375 17.8232 13.7627 17.8232 13.4698 17.5303L8.46984 12.5303L8.41809 12.4737Z"
        fill={color}
      />
    </svg>
  ),
);

ChevronRight.displayName = 'ChevronRight';
