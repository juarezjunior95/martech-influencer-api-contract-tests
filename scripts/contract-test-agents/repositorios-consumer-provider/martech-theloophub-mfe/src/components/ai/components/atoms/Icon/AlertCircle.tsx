import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const AlertCircle = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M12.75 12.5V8C12.75 7.58579 12.4142 7.25 12 7.25C11.5858 7.25 11.25 7.58579 11.25 8V12.5C11.25 12.9142 11.5858 13.25 12 13.25C12.4142 13.25 12.75 12.9142 12.75 12.5Z"
        fill={color}
      />
      <path
        d="M12.75 15.875V15.835C12.7497 15.421 12.4141 15.085 12 15.085C11.5859 15.085 11.2503 15.421 11.25 15.835V15.875C11.25 16.2892 11.5858 16.625 12 16.625C12.4142 16.625 12.75 16.2892 12.75 15.875Z"
        fill={color}
      />
      <path
        d="M3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12C20.25 7.44365 16.5563 3.75 12 3.75C7.44365 3.75 3.75 7.44365 3.75 12ZM2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12Z"
        fill={color}
      />
    </svg>
  ),
);

AlertCircle.displayName = 'AlertCircle';
