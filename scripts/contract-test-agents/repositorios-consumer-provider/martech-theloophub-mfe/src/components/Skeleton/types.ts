export type SkeletonVariant = 'body' | 'image';

export type SkeletonBorderRadius =
  'small' | 'medium' | 'large' | 'x-large' | 'x-small' | 'none';

export type SkeletonGap = 'small' | 'medium' | 'large';

export interface SkeletonProps {
  width: string;
  height: string;
  length: number;
  variant?: SkeletonVariant;
  borderRadius?: SkeletonBorderRadius;
  gap?: SkeletonGap;
  hasContainer?: boolean;
  dataTestId?: string;
}
