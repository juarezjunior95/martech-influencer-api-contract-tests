import { theme } from 'theme';

/** Layout and dimensions */
export const CHART_HEIGHT = '350px';
export const EMPTY_STATE_HEIGHT = '340px';
export const Y_AXIS_WIDTH = 45;
export const LAYOUT_PADDING_TOP = 40;
export const LAYOUT_PADDING_RIGHT = 0;
export const BAR_THICKNESS = 32;

/** Border colors (theme) */
export const BORDER_TOP_COLOR = theme.colors.charts.border.neutrals[30];
export const BORDER_COLOR = theme.colors.charts.border.neutrals[40];

/** DatalabelWithVariation plugin */
export const DATALABEL_SEPARATOR = { yAxis: '|', xAxis: '-' } as const;
export const DATALABEL_FONT = "normal 12px 'Work Sans', sans-serif";
export const DATALABEL_FONT_BOLD = "bold 12px 'Work Sans', sans-serif";
export const DATALABEL_BACKGROUND = '#FFF';
export const DATALABEL_TEXT_BASELINE = 'middle' as CanvasTextBaseline;
export const DATALABEL_POSITION = 'inside' as const;
export const DATALABEL_VARIATION_TEXT_BASELINE = 'top' as CanvasTextBaseline;
export const LABEL_COLOR_DEFAULT = theme.colors.txt.default;
export const LABEL_COLOR_WHITE = '#FFFFFF';
export const COLOR_VARIATION_UP = theme.colors.charts.txt.status.increase;
export const COLOR_VARIATION_DOWN = theme.colors.charts.txt.status.decrease;

/** Scales (theme and layout) */
export const TICKS_COLOR = theme.colors.txt.secondary;
export const GRID_COLOR = theme.colors.charts.bg.neutrals[20];
export const X_AXIS_TICK_WIDTH = 0;
export const X_AXIS_TICKS_PADDING = 12;
export const X_AXIS_MAX_TICKS_LIMIT = 4;
export const Y_AXIS_MAX_TICKS_LIMIT = 7;
export const Y_AXIS_GRID_TICK_WIDTH = 1;
export const Y_AXIS_GRID_LINE_WIDTH = 1;

/** Y-axis domain */
export const Y_AXIS_ZERO = 0;

/** Value formatting */
export const VALUE_FORMAT_MIN_DECIMALS = 0;
export const VALUE_FORMAT_MAX_DECIMALS = 2;

/** VariationCaption */
export const VARIATION_CAPTION_PADDING_LEFT = 42;
export const VARIATION_CAPTION_PADDING_RIGHT = 0;
export const VARIATION_CAPTION_COLUMN_GAP = 0;
export const VARIATION_CAPTION_ROW_GAP = 0;
