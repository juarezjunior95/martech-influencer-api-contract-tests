import { Chart } from 'chart.js';

import { createRoundedCornersPlugin } from './RoundedCornersPlugin';

const createMockChart = (datasets: any[]): Chart<'bar'> =>
  ({
    data: { datasets },
  }) as unknown as Chart<'bar'>;

describe('RoundedCornersPlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns plugin with id "roundedCorners"', () => {
    const plugin = createRoundedCornersPlugin(8);
    expect(plugin.id).toBe('roundedCorners');
  });

  it('sets borderSkipped to false on all datasets', () => {
    const datasets = [
      { data: [10, 20], borderSkipped: undefined, borderRadius: undefined },
      { data: [30, 40], borderSkipped: undefined, borderRadius: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(8);

    plugin.beforeUpdate(chart);

    expect(datasets[0].borderSkipped).toBe(false);
    expect(datasets[1].borderSkipped).toBe(false);
  });

  it('applies topLeft borderRadius on first non-zero dataset, first bar', () => {
    const datasets = [
      { data: [10, 20], borderRadius: undefined, borderSkipped: undefined },
      { data: [30, 40], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(8);

    plugin.beforeUpdate(chart);

    const radiusFn = datasets[1].borderRadius;
    expect(typeof radiusFn).toBe('function');

    const result = radiusFn({ dataIndex: 0 });
    expect(result).toEqual({
      topLeft: 8,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    });
  });

  it('applies topRight borderRadius on last non-zero dataset, last bar', () => {
    const datasets = [
      { data: [10, 20], borderRadius: undefined, borderSkipped: undefined },
      { data: [30, 40], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(8);

    plugin.beforeUpdate(chart);

    const radiusFn = datasets[1].borderRadius;
    const result = radiusFn({ dataIndex: 1 });
    expect(result).toEqual({
      topLeft: 0,
      topRight: 8,
      bottomLeft: 0,
      bottomRight: 0,
    });
  });

  it('returns 0 borderRadius for non-corner bars', () => {
    const datasets = [
      { data: [10, 20, 30], borderRadius: undefined, borderSkipped: undefined },
      { data: [40, 50, 60], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(8);

    plugin.beforeUpdate(chart);

    const radiusFn = datasets[0].borderRadius;
    expect(radiusFn({ dataIndex: 1 })).toBe(0);
  });

  it('returns early when all datasets are all-zero', () => {
    const datasets = [
      { data: [0, 0], borderRadius: undefined, borderSkipped: undefined },
      { data: [0, 0], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(8);

    plugin.beforeUpdate(chart);

    expect(datasets[0].borderRadius).toBeUndefined();
    expect(datasets[0].borderSkipped).toBeUndefined();
  });

  it('identifies first non-zero dataset correctly when first dataset starts with zero', () => {
    const datasets = [
      { data: [0, 20], borderRadius: undefined, borderSkipped: undefined },
      { data: [10, 40], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(6);

    plugin.beforeUpdate(chart);

    const firstNonZeroRadiusFn = datasets[1].borderRadius;
    expect(firstNonZeroRadiusFn({ dataIndex: 0 })).toEqual({
      topLeft: 6,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    });
  });

  it('identifies last non-zero dataset correctly when last dataset ends with zero', () => {
    const datasets = [
      { data: [10, 20], borderRadius: undefined, borderSkipped: undefined },
      { data: [30, 0], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(6);

    plugin.beforeUpdate(chart);

    const lastNonZeroRadiusFn = datasets[0].borderRadius;
    expect(lastNonZeroRadiusFn({ dataIndex: 1 })).toEqual({
      topLeft: 0,
      topRight: 6,
      bottomLeft: 0,
      bottomRight: 0,
    });
  });

  it('uses the provided borderRadius value', () => {
    const datasets = [
      { data: [10, 20], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(12);

    plugin.beforeUpdate(chart);

    const radiusFn = datasets[0].borderRadius;
    expect(radiusFn({ dataIndex: 0 })).toEqual({
      topLeft: 12,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    });
  });

  it('handles single dataset with single bar', () => {
    const datasets = [
      { data: [10], borderRadius: undefined, borderSkipped: undefined },
    ];
    const chart = createMockChart(datasets);
    const plugin = createRoundedCornersPlugin(8);

    plugin.beforeUpdate(chart);

    const radiusFn = datasets[0].borderRadius;
    expect(radiusFn({ dataIndex: 0 })).toEqual({
      topLeft: 8,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0,
    });
  });
});
