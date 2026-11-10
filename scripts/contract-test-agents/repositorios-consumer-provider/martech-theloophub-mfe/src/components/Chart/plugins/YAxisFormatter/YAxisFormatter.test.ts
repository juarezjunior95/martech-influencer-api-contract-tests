import { Chart } from 'chart.js';

import { YAxisFormatter } from './YAxisFormatter';

const createMockChart = (yAxisFormat?: 'number' | 'percentage'): Chart =>
  ({
    data: {
      datasets: [
        {
          data: [10, 20, 30],
          yAxisFormat,
        },
      ],
    },
    options: {
      scales: {},
    },
  }) as unknown as Chart;

describe('YAxisFormatter Plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(YAxisFormatter.id).toBe('yAxisFormatter');
  });

  it('adds percentage formatter when yAxisFormat is percentage', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    expect(mockChart.options.scales.y).toBeDefined();
    expect(mockChart.options.scales.y.ticks).toBeDefined();
    expect(mockChart.options.scales.y.ticks.callback).toBeDefined();
    expect(typeof mockChart.options.scales.y.ticks.callback).toBe('function');
  });

  it('does not modify chart when yAxisFormat is number', () => {
    const mockChart = createMockChart('number');

    YAxisFormatter.beforeUpdate(mockChart);

    expect(mockChart.options.scales.y?.ticks?.callback).toBeUndefined();
  });

  it('does not modify chart when yAxisFormat is not provided', () => {
    const mockChart = createMockChart();

    YAxisFormatter.beforeUpdate(mockChart);

    expect(mockChart.options.scales.y?.ticks?.callback).toBeUndefined();
  });

  it('creates scales object if not exists', () => {
    const mockChart = createMockChart('percentage');
    mockChart.options.scales = undefined;

    YAxisFormatter.beforeUpdate(mockChart);

    expect(mockChart.options.scales).toBeDefined();
  });

  it('creates y scale if not exists', () => {
    const mockChart = createMockChart('percentage');
    mockChart.options.scales = {};

    YAxisFormatter.beforeUpdate(mockChart);

    expect(mockChart.options.scales.y).toBeDefined();
  });

  it('creates ticks object if not exists', () => {
    const mockChart = createMockChart('percentage');
    mockChart.options.scales = { y: {} };

    YAxisFormatter.beforeUpdate(mockChart);

    expect(mockChart.options.scales.y.ticks).toBeDefined();
  });

  it('formatter adds percentage sign to numeric values', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    const callback = mockChart.options.scales.y.ticks.callback;
    const result = callback.call({}, 50, 0, []);

    expect(result).toBe('50%');
  });

  it('formatter does not add percentage if already present', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    mockChart.options.scales.y.ticks.callback = function (value, index, ticks) {
      return '75%';
    };
    YAxisFormatter.beforeUpdate(mockChart);

    const newCallback = mockChart.options.scales.y.ticks.callback;
    const result = newCallback.call({}, 75, 0, []);

    expect(result).toBe('75%');
  });

  it('formatter handles empty string', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    const originalCallback = () => '';
    mockChart.options.scales.y.ticks.callback = originalCallback;
    YAxisFormatter.beforeUpdate(mockChart);

    const newCallback = mockChart.options.scales.y.ticks.callback;
    const result = newCallback.call({}, 0, 0, []);

    expect(result).toBe('');
  });

  it('formatter calls original callback if exists', () => {
    const mockChart = createMockChart('percentage');
    const originalCallback = jest.fn((value) => value * 2);

    mockChart.options.scales = {
      y: {
        ticks: {
          callback: originalCallback,
        },
      },
    };

    YAxisFormatter.beforeUpdate(mockChart);

    const callback = mockChart.options.scales.y.ticks.callback;
    callback.call({}, 25, 0, []);

    expect(originalCallback).toHaveBeenCalledWith(25, 0, []);
  });

  it('formatter uses value directly if no original callback', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    const callback = mockChart.options.scales.y.ticks.callback;
    const result = callback.call({}, 100, 0, []);

    expect(result).toBe('100%');
  });

  it('formatter handles negative values', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    const callback = mockChart.options.scales.y.ticks.callback;
    const result = callback.call({}, -25, 0, []);

    expect(result).toBe('-25%');
  });

  it('formatter handles decimal values', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    const callback = mockChart.options.scales.y.ticks.callback;
    const result = callback.call({}, 33.33, 0, []);

    expect(result).toBe('33.33%');
  });

  it('formatter handles zero', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    const callback = mockChart.options.scales.y.ticks.callback;
    const result = callback.call({}, 0, 0, []);

    expect(result).toBe('0%');
  });

  it('formatter converts non-string values to string', () => {
    const mockChart = createMockChart('percentage');

    YAxisFormatter.beforeUpdate(mockChart);

    const callback = mockChart.options.scales.y.ticks.callback;
    const result = callback.call({}, 42, 0, []);

    expect(typeof result).toBe('string');
    expect(result).toBe('42%');
  });

  it('handles datasets array with multiple datasets', () => {
    const mockChart = {
      data: {
        datasets: [
          { data: [10, 20], yAxisFormat: 'percentage' as const },
          { data: [30, 40], yAxisFormat: 'number' as const },
        ],
      },
      options: { scales: {} },
    } as unknown as Chart;

    YAxisFormatter.beforeUpdate(mockChart);

    expect(mockChart.options.scales.y.ticks.callback).toBeDefined();
  });

  it('handles empty datasets array', () => {
    const mockChart = {
      data: {
        datasets: [],
      },
      options: { scales: {} },
    } as unknown as Chart;

    expect(() => {
      YAxisFormatter.beforeUpdate(mockChart);
    }).not.toThrow();
  });
});
