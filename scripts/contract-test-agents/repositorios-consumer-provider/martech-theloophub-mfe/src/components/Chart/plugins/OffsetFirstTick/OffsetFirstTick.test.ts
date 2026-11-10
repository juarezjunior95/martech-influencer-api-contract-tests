import { Chart } from 'chart.js';

import { OffsetFirstTick, OffsetFirstTickProps } from './OffsetFirstTick';

const PLUGIN_OPTIONS: OffsetFirstTickProps = {
  display: true,
  fontWeight: 'normal',
};

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  overrides: {
    display?: boolean;
    fontWeight?: string;
    indexAxis?: string;
    hasYScale?: boolean;
    hasXScale?: boolean;
    hasTicks?: boolean;
    firstTickValue?: number;
    firstTickLabel?: string;
    firstY?: number;
    ticksColor?: unknown;
    gridTickColor?: unknown;
  } = {},
): Chart<'bar'> => {
  const {
    display = true,
    fontWeight = 'normal',
    indexAxis = 'x',
    hasYScale = true,
    hasXScale = true,
    hasTicks = true,
    firstTickValue = 0,
    firstTickLabel = '0',
    firstY = 300,
    ticksColor = undefined,
    gridTickColor = undefined,
  } = overrides;

  return {
    ctx,
    config: {
      options: {
        indexAxis,
        plugins: {
          offsetFirstTick: { display, fontWeight },
        },
        scales: {
          y: {
            ticks: { color: ticksColor },
            grid: { tickColor: gridTickColor },
          },
        },
      },
    },
    scales: {
      ...(hasYScale && {
        y: {
          top: 0,
          bottom: 600,
          ticks: hasTicks
            ? [{ value: firstTickValue, label: firstTickLabel }]
            : [],
          getPixelForValue: jest.fn(() => firstY),
        },
      }),
      ...(hasXScale && {
        x: {
          left: 50,
        },
      }),
    },
  } as unknown as Chart<'bar'>;
};

describe('OffsetFirstTick plugin', () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCtx = createMockCtx();
  });

  test('should have the correct plugin id', () => {
    expect(OffsetFirstTick.id).toBe('offsetFirstTick');
  });

  test('should be disabled and use normal font weight by default', () => {
    expect(OffsetFirstTick.defaults).toEqual({
      display: false,
      fontWeight: 'normal',
    });
  });

  describe('beforeUpdate', () => {
    test('should not patch colors when plugin is disabled', () => {
      const chart = createMockChart(mockCtx, { display: false });
      const originalColor = chart.config.options.scales.y.ticks.color;

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      expect(chart.config.options.scales.y.ticks.color).toBe(originalColor);
    });

    test('should not patch colors when indexAxis is y', () => {
      const chart = createMockChart(mockCtx, { indexAxis: 'y' });
      const originalColor = chart.config.options.scales.y.ticks.color;

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      expect(chart.config.options.scales.y.ticks.color).toBe(originalColor);
    });

    test('should not patch colors when y scale config is missing', () => {
      const chart = createMockChart(mockCtx);
      chart.config.options.scales = {};

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      expect(chart.config.options.scales.y).toBeUndefined();
    });

    test('should hide the first tick label by returning transparent for index 0', () => {
      const chart = createMockChart(mockCtx);

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      const colorFn = chart.config.options.scales.y.ticks.color as (ctx: {
        index: number;
      }) => string;
      expect(colorFn({ index: 0 })).toBe('transparent');
    });

    test('should delegate tick color to the original function for indexes other than 0', () => {
      const originalColor = jest.fn(() => '#ff0000');
      const chart = createMockChart(mockCtx, { ticksColor: originalColor });

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      const colorFn = chart.config.options.scales.y.ticks.color as (ctx: {
        index: number;
      }) => string;
      const result = colorFn({ index: 1 });

      expect(originalColor).toHaveBeenCalled();
      expect(result).toBe('#ff0000');
    });

    test('should use the original string tick color for indexes other than 0', () => {
      const chart = createMockChart(mockCtx, { ticksColor: '#aabbcc' });

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      const colorFn = chart.config.options.scales.y.ticks.color as (ctx: {
        index: number;
      }) => string;
      expect(colorFn({ index: 1 })).toBe('#aabbcc');
    });

    test('should hide the first grid tick mark by returning transparent for index 0', () => {
      const chart = createMockChart(mockCtx);

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      const tickColorFn = chart.config.options.scales.y.grid
        .tickColor as (ctx: { index: number }) => string;
      expect(tickColorFn({ index: 0 })).toBe('transparent');
    });

    test('should delegate grid tick color to the original function for indexes other than 0', () => {
      const originalTickColor = jest.fn(() => '#123456');
      const chart = createMockChart(mockCtx, {
        gridTickColor: originalTickColor,
      });

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);

      const tickColorFn = chart.config.options.scales.y.grid
        .tickColor as (ctx: { index: number }) => string;
      const result = tickColorFn({ index: 2 });

      expect(originalTickColor).toHaveBeenCalled();
      expect(result).toBe('#123456');
    });

    test('should not re-patch the chart on subsequent update cycles', () => {
      const chart = createMockChart(mockCtx);

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);
      const colorAfterFirst = chart.config.options.scales.y.ticks.color;

      OffsetFirstTick.beforeUpdate?.(chart, undefined, PLUGIN_OPTIONS);
      const colorAfterSecond = chart.config.options.scales.y.ticks.color;

      expect(colorAfterFirst).toBe(colorAfterSecond);
    });
  });

  describe('afterDraw', () => {
    test('should draw the first tick label offset above its original position', () => {
      const chart = createMockChart(mockCtx, {
        firstTickValue: 0,
        firstTickLabel: '0',
        firstY: 300,
      });

      OffsetFirstTick.afterDraw?.(chart, undefined, PLUGIN_OPTIONS);

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.fillText).toHaveBeenCalledWith('0', 40, 290);
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    test('should not draw the tick label when plugin is disabled', () => {
      const chart = createMockChart(mockCtx, { display: false });

      OffsetFirstTick.afterDraw?.(chart, undefined, PLUGIN_OPTIONS);

      expect(mockCtx.fillText).not.toHaveBeenCalled();
    });

    test('should not draw the tick label when y axis is not available', () => {
      const chart = createMockChart(mockCtx, { hasYScale: false });

      OffsetFirstTick.afterDraw?.(chart, undefined, PLUGIN_OPTIONS);

      expect(mockCtx.fillText).not.toHaveBeenCalled();
    });

    test('should not draw the tick label when x axis is not available', () => {
      const chart = createMockChart(mockCtx, { hasXScale: false });

      OffsetFirstTick.afterDraw?.(chart, undefined, PLUGIN_OPTIONS);

      expect(mockCtx.fillText).not.toHaveBeenCalled();
    });

    test('should not draw the tick label when ticks array is empty', () => {
      const chart = createMockChart(mockCtx, { hasTicks: false });

      OffsetFirstTick.afterDraw?.(chart, undefined, PLUGIN_OPTIONS);

      expect(mockCtx.fillText).not.toHaveBeenCalled();
    });

    test('should not draw the tick label when its position falls outside the chart area', () => {
      const chart = createMockChart(mockCtx, { firstY: 700 });

      OffsetFirstTick.afterDraw?.(chart, undefined, PLUGIN_OPTIONS);

      expect(mockCtx.fillText).not.toHaveBeenCalled();
    });

    test('should apply the configured fontWeight when drawing the tick label', () => {
      const chart = createMockChart(mockCtx, {
        fontWeight: 'bold',
        firstY: 300,
      });

      OffsetFirstTick.afterDraw?.(chart, undefined, PLUGIN_OPTIONS);

      expect(mockCtx.font).toBe("bold 12px 'Work Sans', sans-serif");
    });
  });
});
