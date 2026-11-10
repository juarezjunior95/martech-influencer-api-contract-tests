import { forwardRef } from 'react';

import {
  Dot,
  DotsWrapper,
  SpinnerCircle,
  SpinnerText,
  SpinnerWrapper,
} from './Loader.styles';
import type { LoaderProps } from './Loader.types';

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>(
  ({ size = 'sm', variant = 'dots', className, ...props }, ref) => {
    if (variant === 'spinner') {
      return (
        <SpinnerWrapper
          ref={ref}
          className={className}
          aria-label="Loading"
          {...props}
        >
          <SpinnerCircle $size={size} />
          <SpinnerText>Loading...</SpinnerText>
        </SpinnerWrapper>
      );
    }

    return (
      <DotsWrapper
        ref={ref}
        $size={size}
        className={className}
        aria-label="Loading"
        {...props}
      >
        <Dot $size={size} />
        <Dot $size={size} />
        <Dot $size={size} />
      </DotsWrapper>
    );
  },
);

Loader.displayName = 'Loader';
