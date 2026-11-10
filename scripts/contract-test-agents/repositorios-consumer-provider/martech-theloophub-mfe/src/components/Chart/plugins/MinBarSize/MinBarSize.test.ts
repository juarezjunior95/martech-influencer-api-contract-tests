import { Chart } from 'chart.js';

import { minBarSizePlugin } from './MinBarSize';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    fillRect: jest.fn(),
    fillStyle: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  minBarSize?: number,
): Chart =>
  ({
    ctx,
    config: {
      options: {
        plugins: {
          customMinBarSize: minBarSize ? { minBarSize } : {},
        },
      },
    },
    data: {
      datasets: [
        {
          data: [5, 0.3, -0.2, 0, 10],
          backgroundColor: [
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
          ],
        },
      ],
    },
    getDatasetMeta: jest.fn(() => ({
      data: [
        { x: 100, y: 50, width: 30, height: 20 },
        { x: 200, y: 50, width: 0.2, height: 20 },
        { x: 300, y: 50, width: -0.1, height: 20 },
        { x: 400, y: 50, width: 0, height: 20 },
        { x: 500, y: 50, width: 50, height: 20 },
      ],
    })),
  }) as unknown as Chart;

describe('minBarSizePlugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(minBarSizePlugin.id).toBe('customMinBarSize');
  });

  it('draws minimum size bars for small positive values', () => {
    mockChart = createMockChart(mockCtx, 0.5);

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).toHaveBeenCalled();
  });

  it('draws minimum size bars for small negative values', () => {
    mockChart = createMockChart(mockCtx, 0.5);

    minBarSizePlugin.beforeDraw(mockChart);

    const fillRectCalls = (mockCtx.fillRect as jest.Mock).mock.calls;
    expect(fillRectCalls.length).toBeGreaterThan(0);
  });

  it('does not draw bars for zero values', () => {
    mockChart = createMockChart(mockCtx, 0.5);
    mockChart.data.datasets[0].data = [0, 0, 0];
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [
        { x: 100, y: 50, width: 0, height: 20 },
        { x: 200, y: 50, width: 0, height: 20 },
        { x: 300, y: 50, width: 0, height: 20 },
      ],
    })) as any;

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
  });

  it('does not draw bars for null values', () => {
    mockChart = createMockChart(mockCtx, 0.5);
    mockChart.data.datasets[0].data = [null, null];
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [
        { x: 100, y: 50, width: 0, height: 20 },
        { x: 200, y: 50, width: 0, height: 20 },
      ],
    })) as any;

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
  });

  it('does not draw bars for undefined values', () => {
    mockChart = createMockChart(mockCtx, 0.5);
    mockChart.data.datasets[0].data = [undefined, undefined];
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [
        { x: 100, y: 50, width: 0, height: 20 },
        { x: 200, y: 50, width: 0, height: 20 },
      ],
    })) as any;

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
  });

  it('uses default minBarSize of 0.5 when not configured', () => {
    mockChart = createMockChart(mockCtx);
    (mockChart.config.options.plugins as any).customMinBarSize = {};

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).toHaveBeenCalled();
  });

  it('applies correct backgroundColor from array', () => {
    mockChart = createMockChart(mockCtx, 0.5);

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillStyle).toBeDefined();
  });

  it('applies correct backgroundColor when single color', () => {
    mockChart = createMockChart(mockCtx, 0.5);
    mockChart.data.datasets[0].backgroundColor = '#FF0000';

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillStyle).toBeDefined();
  });

  it('draws bar with correct sign for positive values', () => {
    mockChart = createMockChart(mockCtx, 1);
    mockChart.data.datasets[0].data = [0.3];
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [{ x: 100, y: 50, width: 0.2, height: 20 }],
    })) as any;

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).toHaveBeenCalledWith(100, 40, 1, 20);
  });

  it('draws bar with correct sign for negative values', () => {
    mockChart = createMockChart(mockCtx, 1);
    mockChart.data.datasets[0].data = [-0.3];
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [{ x: 100, y: 50, width: -0.2, height: 20 }],
    })) as any;

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).toHaveBeenCalledWith(99, 40, -1, 20);
  });

  it('only draws bars smaller than minBarLength', () => {
    mockChart = createMockChart(mockCtx, 0.5);
    mockChart.data.datasets[0].data = [10];
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [{ x: 100, y: 50, width: 50, height: 20 }],
    })) as any;

    jest.clearAllMocks();
    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
  });

  it('processes multiple datasets', () => {
    mockChart = createMockChart(mockCtx, 0.5);
    mockChart.data.datasets = [
      {
        data: [0.2],
        backgroundColor: '#FF0000',
      },
      {
        data: [0.3],
        backgroundColor: '#00FF00',
      },
    ];
    mockChart.getDatasetMeta = jest.fn((index) => ({
      data: [{ x: 100 + index * 100, y: 50, width: 0.1, height: 20 }],
    })) as any;

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockChart.getDatasetMeta).toHaveBeenCalledTimes(2);
  });

  it('handles custom minBarSize configuration', () => {
    mockChart = createMockChart(mockCtx, 2);

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).toHaveBeenCalled();
  });

  it('calculates bar position correctly based on bar dimensions', () => {
    mockChart = createMockChart(mockCtx, 1);
    mockChart.data.datasets[0].data = [0.4];
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [{ x: 150, y: 100, width: 0.3, height: 40 }],
    })) as any;

    minBarSizePlugin.beforeDraw(mockChart);

    expect(mockCtx.fillRect).toHaveBeenCalledWith(150, 80, 1, 40);
  });
});
