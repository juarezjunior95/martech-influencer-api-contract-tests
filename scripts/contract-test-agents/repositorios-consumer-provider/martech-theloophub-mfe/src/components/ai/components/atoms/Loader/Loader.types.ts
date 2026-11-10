import type { HTMLAttributes } from 'react';

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg';
export type LoaderVariant = 'dots' | 'spinner';

export interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;
}
