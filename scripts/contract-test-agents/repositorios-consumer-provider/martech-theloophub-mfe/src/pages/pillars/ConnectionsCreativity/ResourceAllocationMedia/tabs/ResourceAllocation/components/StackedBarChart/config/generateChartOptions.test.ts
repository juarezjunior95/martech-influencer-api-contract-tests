import { generateChartOptions } from './generateChartOptions';

jest.mock('theme', () => ({
  theme: {
    colors: {
      txt: {
        default: '#000000',
      },
    },
    fonts: {
      body: {
        small: {
          size: 12,
          family: 'Arial',
        },
      },
    },
  },
}));

jest.mock('../constants', () => ({
  BAR_CATEGORY_PERCENTAGE: 0.96,
  CHART_CONFIG: {
    horizontalTotalLabelReservedWidth: 48,
  },
  CHART_LAYOUT_PADDING_Y: 4,
}));

describe('generateChartOptions', () => {
  const mockTotalAllocation = {
    value: [1000, 2000],
    unit: '$',
  };

  it('returns chart options with correct structure', () => {
    const result = generateChartOptions(mockTotalAllocation);

    expect(result).toBeDefined();
    expect(result.responsive).toBe(true);
    expect(result.maintainAspectRatio).toBe(false);
    expect(result.clip).toBe(false);
  });

  it('configures plugins correctly', () => {
    const result = generateChartOptions(mockTotalAllocation);

    expect(result.plugins?.legend?.display).toBe(false);
    expect(result.plugins?.tooltip?.enabled).toBe(false);
    expect((result.plugins as any)?.datalabels?.anchor).toBe('center');
    expect((result.plugins as any)?.datalabels?.align).toBe('center');
  });

  it('includes total allocation in plugins', () => {
    const result = generateChartOptions(mockTotalAllocation);

    expect(
      (result.plugins as any)?.totalAllocationDatalabel?.total_allocation,
    ).toEqual(mockTotalAllocation);
  });

  it('uses categoryPercentage to control bar size (no barThickness override)', () => {
    const result = generateChartOptions(mockTotalAllocation);

    expect(result.datasets?.bar?.barThickness).toBeUndefined();
    expect((result.datasets?.bar as any)?.categoryPercentage).toBeDefined();
  });

  it('uses indexAxis "y" (horizontal stacked bars)', () => {
    const result = generateChartOptions(mockTotalAllocation);

    expect(result.indexAxis).toBe('y');
  });

  it('reserves layout padding on the right for the total label', () => {
    const result = generateChartOptions(mockTotalAllocation);
    const padding = result.layout?.padding as any;

    expect(padding?.right).toBeGreaterThan(0);
    expect(padding?.left).toBe(0);
  });

  it('configures the value axis (x) as hidden with stacking', () => {
    const result = generateChartOptions(mockTotalAllocation);
    const xScale = result.scales?.x as any;

    expect(xScale?.display).toBe(false);
    expect(xScale?.stacked).toBe(true);
    expect(xScale?.beginAtZero).toBe(true);
    expect(xScale?.grid?.display).toBe(false);
  });

  it('configures the category axis (y) with stacking, ticks and reversed order', () => {
    const result = generateChartOptions(mockTotalAllocation);
    const yScale = result.scales?.y as any;

    expect(yScale?.stacked).toBe(true);
    expect(yScale?.beginAtZero).toBe(true);
    expect(yScale?.grid?.display).toBe(false);
    expect(yScale?.border?.display).toBe(false);
    expect(yScale?.ticks).toBeDefined();
    expect(yScale?.reverse).toBe(true);
  });

  it('passes emptyIndices to the emptyBarOverlay plugin', () => {
    const emptyIndices = new Set([0, 2]);
    const result = generateChartOptions(mockTotalAllocation, emptyIndices);

    expect((result.plugins as any)?.emptyBarOverlay?.emptyIndices).toBe(
      emptyIndices,
    );
  });

  it('defaults emptyIndices to an empty Set when not provided', () => {
    const result = generateChartOptions(mockTotalAllocation);

    expect(
      (result.plugins as any)?.emptyBarOverlay?.emptyIndices,
    ).toBeInstanceOf(Set);
    expect((result.plugins as any)?.emptyBarOverlay?.emptyIndices.size).toBe(0);
  });
});
