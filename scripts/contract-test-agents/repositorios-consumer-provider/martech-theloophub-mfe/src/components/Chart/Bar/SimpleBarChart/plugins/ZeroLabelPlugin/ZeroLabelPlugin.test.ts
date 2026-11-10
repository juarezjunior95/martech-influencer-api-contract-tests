import { Chart } from 'chart.js';

import { ZeroLabelPlugin } from './ZeroLabelPlugin';

jest.mock('../../constants/constants', () => ({
  COLORS: {
    BLACK: '#000000',
  },
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  zeroLabelOptions?: any,
): Chart =>
  ({
    ctx,
    config: {
      options: {
        suggestedMin: -10,
        display: true,
        plugins: {
          zeroLabel: zeroLabelOptions,
        },
      },
    },
    data: {
      datasets: [
        {
          data: [10, 0, 5, 0, -5],
        },
      ],
    },
    scales: {
      x: {
        getPixelForValue: jest.fn((value) => value * 50),
      },
      y: {
        getPixelForValue: jest.fn((value) => 400 - value * 10),
      },
    },
    getDatasetMeta: jest.fn(() => ({
      type: 'bar',
      data: [
        { x: 100, y: 200 },
        { x: 200, y: 400 },
        { x: 300, y: 250 },
        { x: 400, y: 400 },
        { x: 500, y: 450 },
      ],
    })),
  }) as unknown as Chart;

describe('ZeroLabelPlugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(ZeroLabelPlugin.id).toBe('zeroLabelPlugin');
  });

  it('draws labels for zero values when display is true', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '0',
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('does not draw when display is false', () => {
    mockChart = createMockChart(mockCtx, {
      display: false,
      suggestedMin: -10,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('does not draw when plugin options are not provided', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.config.options.plugins = {};

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('does not draw when y-scale is missing', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });
    mockChart.scales.y = undefined;

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('does not draw when x-scale is missing', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });
    mockChart.scales.x = undefined;

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('only draws labels for zero values', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledTimes(2);
  });

  it('does not draw for non-bar chart types', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'line',
      data: [],
    })) as any;

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('applies correct text styles', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.font).toBe("normal 12px 'Work Sans', sans-serif");
    expect(mockCtx.fillStyle).toBe('#000000');
    expect(mockCtx.textAlign).toBe('center');
    expect(mockCtx.textBaseline).toBe('bottom');
  });

  it('positions label at correct y coordinate using suggestedMin', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -15,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockChart.scales.y.getPixelForValue).toHaveBeenCalledWith(-15);
  });

  it('positions label at bar x coordinate', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith('0', 200, expect.any(Number));
  });

  it('applies y offset of -2 pixels', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    const yPos = mockChart.scales.y.getPixelForValue(-10);
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '0',
      expect.any(Number),
      yPos - 2,
    );
  });

  it('processes multiple datasets', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });
    mockChart.data.datasets = [{ data: [0, 5] }, { data: [10, 0] }];

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockChart.getDatasetMeta).toHaveBeenCalledTimes(2);
  });

  it('saves and restores canvas context', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('handles all non-zero values', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });
    mockChart.data.datasets[0].data = [10, 20, 30, -5, -10];

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('handles multiple zero values in dataset', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -10,
    });
    mockChart.data.datasets[0].data = [0, 0, 0, 0];
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'bar',
      data: [
        { x: 100, y: 400 },
        { x: 200, y: 400 },
        { x: 300, y: 400 },
        { x: 400, y: 400 },
      ],
    })) as any;

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledTimes(4);
  });

  it('uses suggestedMin from plugin config', () => {
    mockChart = createMockChart(mockCtx, {
      display: true,
      suggestedMin: -20,
    });

    ZeroLabelPlugin.afterDatasetsDraw(mockChart);

    expect(mockChart.scales.y.getPixelForValue).toHaveBeenCalledWith(-20);
  });
});
