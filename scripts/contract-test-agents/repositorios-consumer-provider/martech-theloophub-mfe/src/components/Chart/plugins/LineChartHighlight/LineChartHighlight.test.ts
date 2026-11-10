import { Chart } from 'chart.js';

import { LineChartHighlight } from './LineChartHighlight';

jest.mock('theme', () => ({
  theme: {
    colors: {
      charts: {
        primary: {
          default: '#DEB333',
        },
        bg: {
          neutrals: {
            40: '#AAB4BE',
          },
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
    arc: jest.fn(),
    fill: jest.fn(),
    fillRect: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    setLineDash: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    globalAlpha: 1,
  }) as unknown as CanvasRenderingContext2D;

const createMockDataPoint = (x: number, y: number) => ({
  getProps: jest.fn(() => ({ x, y })),
});

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  lineChartHighlightOptions?: any,
): Chart =>
  ({
    ctx,
    chartArea: {
      top: 50,
      bottom: 350,
      left: 50,
      right: 450,
    },
    scales: {
      x: {
        getPixelForValue: jest.fn((value) => 100 + value * 80),
        ticks: [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }],
      },
    },
    data: {
      labels: ['2018', '2019', '2020', '2021'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [100, 200, 150, 300],
        },
      ],
    },
    config: {
      options: {
        plugins: {
          lineChartHighlight: lineChartHighlightOptions,
        },
      },
    },
    getDatasetMeta: jest.fn((datasetIndex) => ({
      hidden: false,
      data: [
        createMockDataPoint(100, 100),
        createMockDataPoint(200, 200),
        createMockDataPoint(300, 150),
        createMockDataPoint(400, 300),
      ],
    })),
  }) as unknown as Chart;

describe('LineChartHighlight Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  describe('Plugin Configuration', () => {
    test('should have correct plugin id', () => {
      expect(LineChartHighlight.id).toBe('lineChartHighlight');
    });

    test('should not draw when display is false', () => {
      mockChart = createMockChart(mockCtx, {
        display: false,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.save).not.toHaveBeenCalled();
    });

    test('should not draw when plugin config is not provided', () => {
      mockChart = createMockChart(mockCtx);
      mockChart.config.options.plugins = {};

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });
  });

  describe('Highlight Area Drawing', () => {
    test('should highlight a vertical area when highlightIndex is provided', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    test('should use custom highlight color when provided', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
        highlightColor: '#FF0000',
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillStyle).toBe('#FF0000');
    });

    test('should use default highlight color when not specified', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillStyle).toBe('#FFF8DC');
    });

    test('should save and restore canvas context', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    test('should draw vertical rectangle for highlight with opacity', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(mockCtx.globalAlpha).toBe(1);
    });

    test('should cover full chart height from canvas top to chartArea bottom', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      const calls = (mockCtx.fillRect as jest.Mock).mock.calls;
      const [, y, , height] = calls[0];

      expect(y).toBe(0);
      expect(height).toBe(350);
    });

    test('should start highlight from canvas top', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 1,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      const calls = (mockCtx.fillRect as jest.Mock).mock.calls;
      const [, y] = calls[0];

      expect(y).toBe(0);
    });

    test('should clip highlight horizontally to chart area left-right boundaries', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.rect).toHaveBeenCalledWith(50, 0, 400, 350);
      expect(mockCtx.clip).toHaveBeenCalled();
    });

    test('should calculate highlight width as 80% of label spacing', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 1,
      });

      const expectedWidth = Math.floor((400 / 3) * 0.8);

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      const calls = (mockCtx.fillRect as jest.Mock).mock.calls;
      const [, , width] = calls[0];

      expect(Math.floor(width)).toBe(expectedWidth);
    });
  });

  describe('Integration with Border', () => {
    test('should align with canvas top to cover full height', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      const calls = (mockCtx.fillRect as jest.Mock).mock.calls;
      const [, y] = calls[0];

      expect(y).toBe(0);
    });

    test('should maintain highlight width consistency across all indices', () => {
      const testIndices = [0, 1, 2, 3];

      testIndices.forEach((index) => {
        jest.clearAllMocks();
        mockCtx = createMockCtx();
        mockChart = createMockChart(mockCtx, {
          highlightIndex: index,
        });

        LineChartHighlight.beforeDatasetsDraw(mockChart);

        const calls = (mockCtx.fillRect as jest.Mock).mock.calls;
        const [, , width] = calls[0];

        expect(width).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases - Invalid Inputs', () => {
    test('should not highlight when highlightIndex is negative', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: -1,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });

    test('should not highlight when highlightIndex is undefined', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: false,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });

    test('should not highlight when highlightIndex is out of bounds', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 10,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });

    test('should not highlight when chartArea is undefined', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });
      Object.defineProperty(mockChart, 'chartArea', {
        value: undefined,
        writable: true,
      });

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });

    test('should not highlight when xScale is undefined', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 2,
      });
      mockChart.scales.x = undefined as any;

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });

    test('should not highlight when labels array is empty', () => {
      mockChart = createMockChart(mockCtx, {
        highlightIndex: 0,
      });
      mockChart.data.labels = [];

      LineChartHighlight.beforeDatasetsDraw(mockChart);

      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });
  });

  describe('Comparison Line Drawing', () => {
    test('should draw comparison line when showComparisonLine is true', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: true,
      });

      LineChartHighlight.afterDatasetsDraw(mockChart);

      expect(mockCtx.moveTo).toHaveBeenCalled();
      expect(mockCtx.lineTo).toHaveBeenCalled();
      expect(mockCtx.stroke).toHaveBeenCalled();
      expect(mockCtx.setLineDash).toHaveBeenCalled();
    });

    test('should apply custom comparison line styles when provided', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: true,
        comparisonLineColor: '#00FF00',
        comparisonLineWidth: 3,
        comparisonLineDash: [4, 4],
      });

      LineChartHighlight.afterDatasetsDraw(mockChart);

      expect(mockCtx.strokeStyle).toBe('#00FF00');
      expect(mockCtx.lineWidth).toBe(3);
      expect(mockCtx.setLineDash).toHaveBeenCalledWith([4, 4]);
    });

    test('should use theme color for comparison line when not specified', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: true,
      });

      LineChartHighlight.afterDatasetsDraw(mockChart);

      expect(mockCtx.strokeStyle).toBe('#AAB4BE');
    });

    test('should reset line dash after drawing comparison line', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: true,
      });

      LineChartHighlight.afterDatasetsDraw(mockChart);

      const setLineDashCalls = (mockCtx.setLineDash as jest.Mock).mock.calls;
      expect(setLineDashCalls[setLineDashCalls.length - 1][0]).toEqual([]);
    });

    test('should not draw comparison line when dataset is empty', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: true,
      });
      mockChart.getDatasetMeta = jest.fn(() => ({
        hidden: false,
        data: [],
      })) as any;

      LineChartHighlight.afterDatasetsDraw(mockChart);

      expect(mockCtx.moveTo).not.toHaveBeenCalled();
    });

    test('should not draw comparison line with only one data point', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: true,
      });
      mockChart.data.labels = ['2025'];
      mockChart.getDatasetMeta = jest.fn(() => ({
        hidden: false,
        data: [createMockDataPoint(100, 100)],
      })) as any;

      LineChartHighlight.afterDatasetsDraw(mockChart);

      expect(mockCtx.moveTo).not.toHaveBeenCalled();
    });

    test('should not draw comparison line when labels array has less than 2 items', () => {
      mockChart = createMockChart(mockCtx, {
        showComparisonLine: true,
      });
      mockChart.data.labels = ['2025'];

      LineChartHighlight.afterDatasetsDraw(mockChart);

      expect(mockCtx.moveTo).not.toHaveBeenCalled();
    });
  });
});
