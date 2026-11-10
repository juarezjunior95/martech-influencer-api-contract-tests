import { Chart } from 'chart.js';

import { MissingDataBarPlugin } from './MissingDataBarPlugin';

jest.mock('theme', () => ({
  theme: {
    colors: {
      charts: {
        border: {
          neutrals: { '20': '#E0E0E0' },
        },
      },
    },
  },
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    fillStyle: '',
  }) as unknown as CanvasRenderingContext2D;

const defaultXScale = () => ({
  getPixelForValue: jest.fn((v: number) => v * 10),
});
const defaultYScale = () => ({
  getPixelForValue: jest.fn((v: number) => 300 - v * 10),
});

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  pluginOpts?: { naIndexes?: number[]; color?: string },
  scaleOverrides?: {
    omitX?: boolean;
    omitY?: boolean;
    x?: unknown;
    y?: unknown;
  },
): Chart<'bar'> => {
  const scales: Record<string, unknown> = {};
  if (!scaleOverrides?.omitX) scales.x = scaleOverrides?.x ?? defaultXScale();
  if (!scaleOverrides?.omitY) scales.y = scaleOverrides?.y ?? defaultYScale();

  return {
    ctx,
    options: {
      plugins: {
        missingDataBar: pluginOpts,
      },
    },
    scales,
  } as unknown as Chart<'bar'>;
};

const invoke = (chart: Chart<'bar'>) =>
  MissingDataBarPlugin.afterDatasetsDraw?.(chart, {}, {}, false);

describe('MissingDataBarPlugin', () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  test('should have the correct plugin id', () => {
    expect(MissingDataBarPlugin.id).toBe('missingDataBar');
  });

  describe('early returns', () => {
    test('should not draw when pluginOpts is undefined', () => {
      const chart = createMockChart(mockCtx, undefined);

      invoke(chart);

      expect(mockCtx.beginPath).not.toHaveBeenCalled();
    });

    test('should not draw when naIndexes is an empty array', () => {
      const chart = createMockChart(mockCtx, { naIndexes: [] });

      invoke(chart);

      expect(mockCtx.beginPath).not.toHaveBeenCalled();
    });

    test('should not draw when xScale is missing', () => {
      const chart = createMockChart(
        mockCtx,
        { naIndexes: [0] },
        { omitX: true },
      );

      invoke(chart);

      expect(mockCtx.beginPath).not.toHaveBeenCalled();
    });

    test('should not draw when yScale is missing', () => {
      const chart = createMockChart(
        mockCtx,
        { naIndexes: [0] },
        { omitY: true },
      );

      invoke(chart);

      expect(mockCtx.beginPath).not.toHaveBeenCalled();
    });
  });

  describe('drawing behavior', () => {
    test('should draw one placeholder bar per N/A index', () => {
      const chart = createMockChart(mockCtx, { naIndexes: [0, 2] });

      invoke(chart);

      expect(mockCtx.beginPath).toHaveBeenCalledTimes(2);
      expect(mockCtx.fill).toHaveBeenCalledTimes(2);
    });

    test('should draw a single placeholder bar when one N/A index is provided', () => {
      const chart = createMockChart(mockCtx, { naIndexes: [1] });

      invoke(chart);

      expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
      expect(mockCtx.fill).toHaveBeenCalledTimes(1);
    });

    test('should save and restore canvas context around drawing', () => {
      const chart = createMockChart(mockCtx, { naIndexes: [0] });

      invoke(chart);

      expect(mockCtx.save).toHaveBeenCalledTimes(1);
      expect(mockCtx.restore).toHaveBeenCalledTimes(1);
    });

    test('should use the custom color when provided in plugin options', () => {
      const chart = createMockChart(mockCtx, {
        naIndexes: [0],
        color: '#FF0000',
      });

      invoke(chart);

      expect((mockCtx as any).fillStyle).toBe('#FF0000');
    });

    test('should use the default theme color when no color is provided', () => {
      const chart = createMockChart(mockCtx, { naIndexes: [0] });

      invoke(chart);

      expect((mockCtx as any).fillStyle).toBe('#E0E0E0');
    });

    test('should draw the rounded-rectangle path with correct canvas calls', () => {
      const xGetPixel = jest.fn(() => 100);
      const yGetPixel = jest.fn(() => 300);
      const chart = createMockChart(
        mockCtx,
        { naIndexes: [0] },
        {
          x: { getPixelForValue: xGetPixel },
          y: { getPixelForValue: yGetPixel },
        },
      );

      invoke(chart);

      // bar is 48px wide, centered at x=100 → left=76, right=124
      // bar is 6px tall, anchored at baseline y=300 → top=294
      expect(mockCtx.moveTo).toHaveBeenCalledWith(80, 294);
      expect(mockCtx.lineTo).toHaveBeenCalledWith(120, 294);
      expect(mockCtx.quadraticCurveTo).toHaveBeenNthCalledWith(
        1,
        124,
        294,
        124,
        298,
      );
      expect(mockCtx.quadraticCurveTo).toHaveBeenNthCalledWith(
        2,
        76,
        294,
        80,
        294,
      );
      expect(mockCtx.closePath).toHaveBeenCalledTimes(1);
    });
  });
});
