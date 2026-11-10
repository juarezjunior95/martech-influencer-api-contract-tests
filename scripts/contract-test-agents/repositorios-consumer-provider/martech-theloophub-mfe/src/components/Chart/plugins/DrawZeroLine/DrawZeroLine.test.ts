import { Chart } from 'chart.js';

import { DrawZeroLine, paintChartZeroLine } from './DrawZeroLine';

type DrawZeroLinePluginOptions = {
  display?: boolean;
  color?: string;
};

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
  drawZeroLineOptions?: DrawZeroLinePluginOptions,
): Chart =>
  ({
    ctx,
    chartArea: {
      left: 50,
      right: 750,
      top: 50,
      bottom: 550,
    },
    config: {
      options: {
        plugins: {
          drawZeroLine: drawZeroLineOptions,
        },
      },
    },
    scales: {
      y: {
        getPixelForValue: jest.fn((value: number) => 300 - value * 10),
      },
    },
  }) as unknown as Chart;

describe('DrawZeroLine Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(DrawZeroLine.id).toBe('drawZeroLine');
  });

  it('uses beforeDatasetsDraw so the line renders under bars', () => {
    expect(DrawZeroLine.beforeDatasetsDraw).toEqual(expect.any(Function));
  });

  it('beforeDatasetsDraw paints the zero line (same behavior as paintChartZeroLine)', () => {
    mockChart = createMockChart(mockCtx);

    DrawZeroLine.beforeDatasetsDraw?.(mockChart, { cancelable: true }, {});

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('draws zero line across chart', () => {
    mockChart = createMockChart(mockCtx);

    paintChartZeroLine(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('draws line at y=0 position', () => {
    mockChart = createMockChart(mockCtx);

    paintChartZeroLine(mockChart);

    const yScale = mockChart.scales.y as unknown as {
      getPixelForValue: jest.Mock;
    };
    expect(yScale.getPixelForValue).toHaveBeenCalledWith(0);
  });

  it('draws line from left to right of chart area', () => {
    mockChart = createMockChart(mockCtx);

    paintChartZeroLine(mockChart);

    const yZero = 300;

    expect(mockCtx.moveTo).toHaveBeenCalledWith(50, yZero);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(750, yZero);
  });

  it('applies default color when not specified', () => {
    mockChart = createMockChart(mockCtx);

    paintChartZeroLine(mockChart);

    expect(mockCtx.strokeStyle).toBe('#AAB4BE');
  });

  it('applies custom color when specified', () => {
    mockChart = createMockChart(mockCtx, {
      color: '#FF0000',
    });

    paintChartZeroLine(mockChart);

    expect(mockCtx.strokeStyle).toBe('#FF0000');
  });

  it('applies default line width of 1', () => {
    mockChart = createMockChart(mockCtx);

    paintChartZeroLine(mockChart);

    expect(mockCtx.lineWidth).toBe(1);
  });

  it('does not draw when display is false', () => {
    mockChart = createMockChart(mockCtx, {
      display: false,
    });

    paintChartZeroLine(mockChart);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('does not draw when y-scale is missing', () => {
    mockChart = createMockChart(mockCtx);
    (mockChart.scales as { y?: unknown }).y = undefined;

    paintChartZeroLine(mockChart);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('draws line when display is not specified (defaults to true)', () => {
    mockChart = createMockChart(mockCtx, {});

    paintChartZeroLine(mockChart);

    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('draws line when drawZeroLine options are not provided', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.config.options.plugins = {};

    paintChartZeroLine(mockChart);

    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.strokeStyle).toBe('#AAB4BE');
  });

  it('saves and restores canvas context', () => {
    mockChart = createMockChart(mockCtx);

    paintChartZeroLine(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('draws line with correct stroke style', () => {
    mockChart = createMockChart(mockCtx, {
      color: '#00FF00',
    });

    paintChartZeroLine(mockChart);

    expect(mockCtx.strokeStyle).toBe('#00FF00');
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('handles different y-scale values', () => {
    mockChart = createMockChart(mockCtx);
    const yScale = mockChart.scales.y as unknown as {
      getPixelForValue: jest.Mock;
    };
    yScale.getPixelForValue = jest.fn(() => 400);

    paintChartZeroLine(mockChart);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(50, 400);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(750, 400);
  });
});
