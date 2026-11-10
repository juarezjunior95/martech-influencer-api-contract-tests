import { theme } from 'theme';

const HORIZONTAL_BAR_THICKNESS = 48;
const BAR_GAP_PX = 2;
const CHART_LAYOUT_PADDING_Y = 4;
const BAR_CATEGORY_PERCENTAGE =
  HORIZONTAL_BAR_THICKNESS / (HORIZONTAL_BAR_THICKNESS + BAR_GAP_PX);
const CHART_ROW_HEIGHT_PX =
  2 * (HORIZONTAL_BAR_THICKNESS + BAR_GAP_PX) + 2 * CHART_LAYOUT_PADDING_Y;
const DEFAULT_MIN_BAR_LENGTH = 0;
const MIN_SEGMENT_PERCENT = 5;

const COLOR_MAP = {
  up: theme.colors.charts.txt.status.increase,
  down: theme.colors.charts.txt.status.decrease,
  '': theme.colors.txt.default,
};

const DEFAULT_BORDER_RADIUS = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0,
};

const CHART_CONFIG = {
  acBorderWidth: 2,
  acBorderColor: '#FEFBF1',
  acHoverBorderColor: '#FFFFFF',
  buBorderWidth: 2,
  buBorderColor: '#EBEBEB',
  buHoverBorderColor: '#FFFFFF',
  datalabelBorderRadius: 16,
  datalabelBorderWidth: 0.5,
  horizontalTotalLabelReservedWidth: 48,
} as const;

export {
  BAR_CATEGORY_PERCENTAGE,
  CHART_CONFIG,
  CHART_LAYOUT_PADDING_Y,
  CHART_ROW_HEIGHT_PX,
  COLOR_MAP,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_MIN_BAR_LENGTH,
  MIN_SEGMENT_PERCENT,
};
