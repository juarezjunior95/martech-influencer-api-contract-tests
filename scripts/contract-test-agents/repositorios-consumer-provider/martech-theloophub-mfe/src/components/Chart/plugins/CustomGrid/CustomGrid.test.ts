import { Chart } from 'chart.js';

import { CustomGrid } from './CustomGrid';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    strokeStyle: '',
    lineWidth: 0,
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  indexAxis: 'x' | 'y' = 'x',
  customGridOptions?: any,
): Chart =>
  ({
    ctx,
    width: 800,
    height: 600,
    config: {
      options: {
        indexAxis,
        plugins: {
          customGrid: customGridOptions,
        },
      },
    },
    scales: {
      x: {
        left: 50,
        right: 750,
        ticks: [
          { value: 0, label: '0' },
          { value: 1, label: '1' },
          { value: 2, label: '2' },
        ],
        getPixelForTick: jest.fn((index) => 100 + index * 100),
      },
      y: {
        top: 50,
        bottom: 550,
        ticks: [
          { value: 0, label: '0' },
          { value: 10, label: '10' },
          { value: 20, label: '20' },
        ],
        getPixelForTick: jest.fn((index) => 500 - index * 150),
      },
    },
  }) as unknown as Chart;

describe('CustomGrid Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(CustomGrid.id).toBe('customGrid');
  });

  it('draws horizontal grid lines for x-axis charts', () => {
    mockChart = createMockChart(mockCtx, 'x');

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(3);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(3);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('draws vertical grid lines for y-axis charts', () => {
    mockChart = createMockChart(mockCtx, 'y');

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(3);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(3);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('applies default grid color when not specified', () => {
    mockChart = createMockChart(mockCtx, 'x');

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.strokeStyle).toBe('#E4E7EA');
  });

  it('applies custom grid color when specified', () => {
    mockChart = createMockChart(mockCtx, 'x', {
      color: '#FF0000',
    });

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.strokeStyle).toBe('#FF0000');
  });

  it('applies default line width when not specified', () => {
    mockChart = createMockChart(mockCtx, 'x');

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.lineWidth).toBe(1);
  });

  it('applies custom line width when specified', () => {
    mockChart = createMockChart(mockCtx, 'x', {
      width: 3,
    });

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.lineWidth).toBe(3);
  });

  it('does not draw grid when display is false', () => {
    mockChart = createMockChart(mockCtx, 'x', {
      display: false,
    });

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('does not draw grid when x-axis is missing', () => {
    mockChart = createMockChart(mockCtx, 'x');
    mockChart.scales.x = undefined;

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('does not draw grid when y-axis is missing', () => {
    mockChart = createMockChart(mockCtx, 'x');
    mockChart.scales.y = undefined;

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('draws horizontal lines for each y-axis tick', () => {
    mockChart = createMockChart(mockCtx, 'x');

    CustomGrid.beforeDraw(mockChart);

    expect(mockChart.scales.y.getPixelForTick).toHaveBeenCalledTimes(3);
    expect(mockChart.scales.y.getPixelForTick).toHaveBeenCalledWith(0);
    expect(mockChart.scales.y.getPixelForTick).toHaveBeenCalledWith(1);
    expect(mockChart.scales.y.getPixelForTick).toHaveBeenCalledWith(2);
  });

  it('draws vertical lines for each x-axis tick', () => {
    mockChart = createMockChart(mockCtx, 'y');

    CustomGrid.beforeDraw(mockChart);

    expect(mockChart.scales.x.getPixelForTick).toHaveBeenCalledTimes(3);
    expect(mockChart.scales.x.getPixelForTick).toHaveBeenCalledWith(0);
    expect(mockChart.scales.x.getPixelForTick).toHaveBeenCalledWith(1);
    expect(mockChart.scales.x.getPixelForTick).toHaveBeenCalledWith(2);
  });

  it('draws horizontal lines from left to chart width for x-axis', () => {
    mockChart = createMockChart(mockCtx, 'x');

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(50, expect.any(Number));
    expect(mockCtx.lineTo).toHaveBeenCalledWith(800, expect.any(Number));
  });

  it('draws vertical lines from top to bottom for y-axis', () => {
    mockChart = createMockChart(mockCtx, 'y');

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(expect.any(Number), 50);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(expect.any(Number), 550);
  });

  it('uses default config when customGrid options are not provided', () => {
    mockChart = createMockChart(mockCtx, 'x');
    mockChart.config.options.plugins = {};

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.strokeStyle).toBe('#E4E7EA');
    expect(mockCtx.lineWidth).toBe(1);
  });

  it('saves and restores canvas context', () => {
    mockChart = createMockChart(mockCtx, 'x');

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('handles empty ticks array for x-axis', () => {
    mockChart = createMockChart(mockCtx, 'x');
    mockChart.scales.y.ticks = [];

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });

  it('handles empty ticks array for y-axis', () => {
    mockChart = createMockChart(mockCtx, 'y');
    mockChart.scales.x.ticks = [];

    CustomGrid.beforeDraw(mockChart);

    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });
});
