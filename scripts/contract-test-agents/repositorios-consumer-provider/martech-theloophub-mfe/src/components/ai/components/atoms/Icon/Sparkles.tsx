import { forwardRef } from 'react';

import type { IconProps } from './Icon.types';

export const Sparkles = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 39, color = 'none', ...props }, ref) => (
    <svg ref={ref} width={size} height={size} viewBox="0 0 39 39" {...props}>
      <g filter="url(#a)">
        <path
          fill="#40A9EF"
          d="M23.575 31.434c-1.492-.675-1.586-2.758-.162-3.563l2.015-1.139c.363-.205.653-.52.829-.898l.991-2.14c.681-1.468 2.735-1.56 3.546-.157l1.182 2.043c.21.361.527.648.907.82l2.11.957c1.492.675 1.587 2.757.163 3.563l-2.015 1.139c-.364.205-.654.52-.83.898l-.991 2.14c-.68 1.468-2.735 1.56-3.546.157l-1.182-2.043a2.003 2.003 0 0 0-.907-.821l-2.11-.956Z"
        />
      </g>
      <g filter="url(#b)">
        <path
          fill="#40A9EF"
          d="M3.589 18.29c-1.477-.737-1.477-2.843 0-3.58l7.066-3.524a2 2 0 0 0 .875-.854l3.702-6.993c.752-1.419 2.784-1.419 3.536 0l3.702 6.993a2 2 0 0 0 .875.854l7.066 3.524c1.477.737 1.477 2.843 0 3.58l-7.066 3.524a2 2 0 0 0-.875.854l-3.702 6.993c-.752 1.419-2.784 1.419-3.536 0l-3.702-6.993a2 2 0 0 0-.875-.854L3.59 18.29Z"
        />
      </g>
      <defs>
        <filter
          id="a"
          width={16.272}
          height={16.217}
          x={22.398}
          y={22.537}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx={2.5} dy={2.5} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.48 0" />
          <feBlend
            in2="shape"
            mode="lighten"
            result="effect1_innerShadow_5361_1576"
          />
        </filter>
        <filter
          id="b"
          width={31.537}
          height={30.95}
          x={2.482}
          y={2.275}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx={2.5} dy={2.5} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.48 0" />
          <feBlend
            in2="shape"
            mode="lighten"
            result="effect1_innerShadow_5361_1576"
          />
        </filter>
      </defs>
    </svg>
  ),
);

Sparkles.displayName = 'Sparkles';
