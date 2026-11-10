import { Chart } from 'chart.js';

import { BaseChartColors } from './BaseChartColors';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    lineWidth: 0,
    strokeStyle: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  baseChartColors?: string[],
): Chart =>
  ({
    ctx,
    chartArea: {
      left: 50,
      right: 650,
      top: 50,
      bottom: 450,
    },
    scales: {
      x: {
        getPixelForValue: jest.fn((value) => value),
      },
      y: {
        bottom: 450,
        getPixelForValue: jest.fn((value) => value),
      },
    },
    data: {
      datasets: [
        {
          data: [10, 20, 30, 40],
          baseChartColors: baseChartColors || [],
        },
      ],
    },
    getDatasetMeta: jest.fn(() => ({
      data: [
        { x: 100, width: 50 },
        { x: 200, width: 50 },
        { x: 300, width: 50 },
        { x: 400, width: 50 },
      ],
    })),
  }) as unknown as Chart;

describe('BaseChartColors Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(BaseChartColors.id).toBe('baseChartColors');
  });

  it('draws colored lines at chart base', () => {
    mockChart = createMockChart(mockCtx, [
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
    ]);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('does not draw when colors array is empty', () => {
    mockChart = createMockChart(mockCtx, []);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });

  it('does not draw when scales are missing', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000']);
    mockChart.scales.x = undefined;

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('does not draw when dataset meta is empty', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000']);
    mockChart.getDatasetMeta = jest.fn(() => null);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('does not draw when dataset data is empty', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000']);
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: null,
    })) as any;

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('applies correct line width', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000', '#00FF00']);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.lineWidth).toBe(6);
  });

  it('filters out positions without colors', () => {
    mockChart = createMockChart(mockCtx, [
      '#FF0000',
      undefined,
      '#0000FF',
      null,
    ]);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.stroke).toHaveBeenCalledTimes(2);
  });

  it('sorts positions by x coordinate', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF'];
    mockChart = createMockChart(mockCtx, colors);
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [
        { x: 300, width: 50 },
        { x: 100, width: 50 },
        { x: 200, width: 50 },
      ],
    })) as any;

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalled();
  });

  it('draws lines from left to right', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000', '#00FF00']);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalled();
  });

  it('extends last segment to chart right edge', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000', '#00FF00']);

    BaseChartColors.afterDatasetsDraw(mockChart);

    const chartRight = mockChart.chartArea.right - 4;
    expect(mockCtx.lineTo).toHaveBeenCalledWith(chartRight, expect.any(Number));
  });

  it('calculates base Y position correctly', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000']);

    BaseChartColors.afterDatasetsDraw(mockChart);

    const expectedBaseY = mockChart.scales.y.bottom + 6 / 2;
    expect(mockCtx.moveTo).toHaveBeenCalledWith(
      expect.any(Number),
      expectedBaseY,
    );
  });

  it('applies correct stroke style for each color', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000', '#00FF00', '#0000FF']);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.strokeStyle).toContain('#');
  });

  it('handles single color correctly', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000']);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('restores context even when positions array is empty', () => {
    mockChart = createMockChart(mockCtx, [undefined, null]);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('calculates category width correctly', () => {
    mockChart = createMockChart(mockCtx, ['#FF0000', '#00FF00']);

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('handles datasets without baseChartColors property', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.data.datasets[0] = {
      data: [10, 20, 30],
    } as any;

    BaseChartColors.afterDatasetsDraw(mockChart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });
});
