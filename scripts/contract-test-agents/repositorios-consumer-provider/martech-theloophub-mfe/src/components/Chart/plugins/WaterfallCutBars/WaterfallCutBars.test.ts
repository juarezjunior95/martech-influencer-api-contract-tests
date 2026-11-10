import { Chart, Plugin } from 'chart.js';

import {
  getVerticalWaterfallCutY,
  getWaterfallCutEdgeKind,
  WaterfallCutBars,
} from './WaterfallCutBars';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    setTransform: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChartMeta = (type: string, data: any[] = []) => ({
  type,
  controller: {} as any,
  order: 0,
  label: '',
  index: 0,
  data,
  dataset: {} as any,
  hidden: false,
  stack: 0,
  xAxisID: '',
  yAxisID: '',
  _stacked: false,
  _parsed: [],
  _sorted: false,
  visible: true,
  indexAxis: 'x' as const,
  iAxisID: '',
  vAxisID: '',
});

const createMockChart = (ctx: CanvasRenderingContext2D): Chart<'bar'> =>
  ({
    ctx,
    config: {
      options: {
        plugins: {
          waterfallCutBars: {
            display: true,
            indexes: {
              first: 0,
              last: 3,
              retained: 2,
            },
            direction: 'diagonal',
          },
        },
      },
    },
    data: {
      datasets: [
        {
          data: [
            [0, 10],
            [10, 20],
            [20, 30],
            [30, 40],
          ],
        },
      ],
    },
    getDatasetMeta: jest.fn(() => createMockChartMeta('bar')),
    scales: {
      x: {
        getPixelForValue: jest.fn((value) => value * 10),
      },
      y: {
        getPixelForValue: jest.fn((value) => value * 10),
      },
    },
  }) as unknown as Chart<'bar'>;

describe('getWaterfallCutEdgeKind', () => {
  it('retained / zero-anchored positive [0, v] cuts at max-value end', () => {
    expect(getWaterfallCutEdgeKind(0, 80)).toBe('max-value');
  });

  it('retained / zero-anchored negative [v, 0] cuts at min-value end', () => {
    expect(getWaterfallCutEdgeKind(-50, 0)).toBe('min-value');
  });

  it('trimmed positive total still cuts at min-value (low) end', () => {
    expect(getWaterfallCutEdgeKind(65, 100)).toBe('min-value');
  });

  it('trimmed negative total still cuts at max-value (toward zero) end', () => {
    expect(getWaterfallCutEdgeKind(-100, -65)).toBe('max-value');
  });
});

describe('getVerticalWaterfallCutY', () => {
  it('maps max-value edge to top pixel + inset', () => {
    expect(getVerticalWaterfallCutY([0, 100], 10, 200)).toBe(15);
  });

  it('maps min-value edge to bottom pixel - inset', () => {
    expect(getVerticalWaterfallCutY([-40, 0], 10, 200)).toBe(195);
  });
});

describe('WaterfallCutBars Plugin', () => {
  let plugin: Plugin<'bar'>;
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart<'bar'>;

  beforeEach(() => {
    mockCtx = createMockCtx();
    mockChart = createMockChart(mockCtx);
    jest.clearAllMocks();
    plugin = WaterfallCutBars;
  });

  it('should not draw when display is false', () => {
    mockChart.config.options.plugins.waterfallCutBars.display = false;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.translate).not.toHaveBeenCalled();
    expect(mockCtx.rotate).not.toHaveBeenCalled();
    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.strokeRect).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should not draw when options are not provided', () => {
    delete mockChart.config.options.plugins.waterfallCutBars;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.translate).not.toHaveBeenCalled();
    expect(mockCtx.rotate).not.toHaveBeenCalled();
    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.strokeRect).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should handle missing bar data gracefully', () => {
    mockChart.getDatasetMeta = jest.fn(() =>
      createMockChartMeta('line'),
    ) as any;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.translate).not.toHaveBeenCalled();
    expect(mockCtx.rotate).not.toHaveBeenCalled();
    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.strokeRect).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should not draw when data is empty', () => {
    mockChart.getDatasetMeta = jest.fn(() =>
      createMockChartMeta('bar', []),
    ) as any;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.translate).not.toHaveBeenCalled();
    expect(mockCtx.rotate).not.toHaveBeenCalled();
    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.strokeRect).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should not draw when indexes are not provided', () => {
    mockChart.config.options.plugins.waterfallCutBars.indexes = {
      first: 0,
      last: 0,
    };

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.translate).not.toHaveBeenCalled();
    expect(mockCtx.rotate).not.toHaveBeenCalled();
    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.strokeRect).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should not draw when meta type is not bar', () => {
    mockChart.getDatasetMeta = jest.fn(() =>
      createMockChartMeta('line'),
    ) as any;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
  });
});
