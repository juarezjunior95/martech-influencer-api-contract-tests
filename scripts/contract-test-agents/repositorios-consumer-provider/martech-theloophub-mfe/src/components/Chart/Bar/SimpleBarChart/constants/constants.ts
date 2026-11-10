import { theme } from 'theme';

export const CHART_CONSTANTS = {
  DEFAULT_BAR_THICKNESS: 32,
  BORDER_RADIUS: 4,
  Y_AXIS_DIVISIONS: 5,
  MAX_Y_TICKS: 7,
  MAX_X_TICKS: 4,
  FONT_FAMILY: "'Work Sans', sans-serif",
  FONT_SIZE: 12,
  DATA_LABEL_OFFSET_DEFAULT: 2,
  DATA_LABEL_OFFSET_MISSING_DATA: 12,
} as const;

export const COLORS = {
  WHITE: `#fff`,
  BLACK: `${theme.colors.txt.default}`,
  BLACK_OPACITY: `${theme.colors.txt.secondary}`,
  GRID_LIGHT: `${theme.colors.charts.border.neutrals[20]}`,
  TRANSPARENT: 'transparent',
} as const;
