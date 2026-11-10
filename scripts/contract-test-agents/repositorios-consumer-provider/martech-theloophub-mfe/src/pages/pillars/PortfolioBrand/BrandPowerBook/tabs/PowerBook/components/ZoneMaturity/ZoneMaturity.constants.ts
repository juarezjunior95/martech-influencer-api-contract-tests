import { SkeletonProps } from './ZoneMaturity.types';

export const TABLE_FIXED_HEIGHT = '369px';
export const SKELETON_LEFT_WIDTH = '464px';
export const SKELETON_RIGHT_WIDTH = '754px';
export const DEFAULT_BU_LABEL = 'BU';

export const LEFT_SKELETON_PROPS: SkeletonProps = {
  length: 1,
  width: SKELETON_LEFT_WIDTH,
  height: TABLE_FIXED_HEIGHT,
  borderRadius: 'none',
};

export const RIGHT_SKELETON_PROPS: SkeletonProps = {
  length: 1,
  width: SKELETON_RIGHT_WIDTH,
  height: TABLE_FIXED_HEIGHT,
  borderRadius: 'none',
};
