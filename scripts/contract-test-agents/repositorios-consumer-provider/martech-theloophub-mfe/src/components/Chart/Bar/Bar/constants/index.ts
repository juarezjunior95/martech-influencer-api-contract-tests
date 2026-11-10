import { LabelColors } from '../types';

export const XSMALL_FONT = {
  size: 10,
  family: "'Work Sans', sans-serif",
} as const;

export const DEFAULT_FONT = {
  size: 10,
  family: "'Work Sans', sans-serif",
} as const;

export const BORDER_RADIUS = 4;
export const SMALL_BAR_THRESHOLD = 24;

export const STRIPED_PATTERN_CONFIG = {
  type: 'striped' as const,
  params: {
    color: 'white',
    angle: 45,
    thickness: 3,
    spacing: 12,
  },
};

export const LABEL_COLORS: LabelColors = {
  internal: '#141414',
  external: '#141414',
};
