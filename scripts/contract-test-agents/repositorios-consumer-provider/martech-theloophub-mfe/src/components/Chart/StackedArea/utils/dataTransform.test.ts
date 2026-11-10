import type { ResponsiveConfig, StackedAreaColumn } from '../types';
import { transformToChartData } from './dataTransform';

const makeColumns = (
  segmentValues: (number | string)[][],
  labels?: string[],
): StackedAreaColumn[] =>
  segmentValues.map((values, i) => ({
    label: labels?.[i] ?? `Col${i + 1}`,
    segments: values.map((value) => ({
      value,
    })) as StackedAreaColumn['segments'],
  }));

const defaultColors = ['#EFD328', '#D9AA4A', '#69ACE3', '#EC8AB0', '#7BC8A4'];

describe('transformToChartData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct number of datasets (equal to number of segments, reversed)', () => {
    const columns = makeColumns([
      [10, 20, 30],
      [15, 25, 35],
    ]);

    const result = transformToChartData(columns, defaultColors);

    expect(result).toHaveLength(3);
  });

  it('reverses segment order so last segment is first dataset', () => {
    const columns = makeColumns([[10, 20, 30]]);

    const result = transformToChartData(columns, defaultColors);

    expect(result[0].backgroundColor).toBe(defaultColors[2]);
    expect(result[1].backgroundColor).toBe(defaultColors[1]);
    expect(result[2].backgroundColor).toBe(defaultColors[0]);
  });

  it('applies colors in correct order', () => {
    const columns = makeColumns([[50, 50]]);
    const colors = ['#AAA', '#BBB'];

    const result = transformToChartData(columns, colors);

    expect(result[0].backgroundColor).toBe('#BBB');
    expect(result[1].backgroundColor).toBe('#AAA');
  });

  it('sets barThickness from responsiveConfig', () => {
    const columns = makeColumns([[50, 50]]);
    const config: ResponsiveConfig = {
      columnWidth: 80,
      columnSpacing: 16,
      fontSize: { label: 12, value: 12, variation: 12 },
      padding: { top: 50, right: 24, bottom: 40, left: 24 },
      borderRadius: 8,
      minCellHeight: 8,
    };

    const result = transformToChartData(
      columns,
      defaultColors,
      undefined,
      config,
    );

    expect(result[0].barThickness).toBe(80);
    expect(result[0].maxBarThickness).toBe(Math.round(80 * 1.33));
  });

  it('defaults barThickness to 60 when no responsiveConfig', () => {
    const columns = makeColumns([[50, 50]]);

    const result = transformToChartData(columns, defaultColors);

    expect(result[0].barThickness).toBe(60);
    expect(result[0].maxBarThickness).toBe(Math.round(60 * 1.33));
  });

  it('sets borderWidth differently for top/bottom/middle segments', () => {
    const columns = makeColumns([[10, 20, 30, 40]]);

    const result = transformToChartData(columns, defaultColors);

    const topDataset = result[0];
    const middleDataset = result[1];
    const bottomDataset = result[result.length - 1];

    expect(topDataset.borderWidth).toEqual({ top: 2 });
    expect(middleDataset.borderWidth).toEqual({ bottom: 2, top: 2 });
    expect(bottomDataset.borderWidth).toEqual({ bottom: 2 });
  });

  it('maps legend labels correctly', () => {
    const columns = makeColumns([[30, 70]]);
    const legends = ['Beer', 'Wine'];

    const result = transformToChartData(columns, defaultColors, legends);

    expect(result[0].label).toBe('Wine');
    expect(result[1].label).toBe('Beer');
  });

  it('falls back to "Area N" when legends are absent', () => {
    const columns = makeColumns([[30, 70]]);

    const result = transformToChartData(columns, defaultColors);

    expect(result[0].label).toBe('Area 2');
    expect(result[1].label).toBe('Area 1');
  });

  it('populates originalValues from original (non-normalized) columns', () => {
    const columns = makeColumns([[25, 75]]);

    const result = transformToChartData(columns, defaultColors);

    const ds = result[0] as any;
    expect(ds.originalValues).toBeDefined();
    expect(Number(ds.originalValues[0])).toBe(75);
  });

  it('populates showNumbers array', () => {
    const columns = makeColumns([[25, 75]]);

    const result = transformToChartData(columns, defaultColors);

    const ds = result[0] as any;
    expect(ds.showNumbers).toBeDefined();
    expect(Array.isArray(ds.showNumbers)).toBe(true);
  });

  it('sets borderColor to white', () => {
    const columns = makeColumns([[50, 50]]);

    const result = transformToChartData(columns, defaultColors);

    expect(result[0].borderColor).toBe('#ffffff');
  });

  it('uses fallback color #000 when color index is out of bounds', () => {
    const columns = makeColumns([[10, 20, 30]]);
    const colors = ['#AAA'];

    const result = transformToChartData(columns, colors);

    const lastDataset = result[result.length - 1];
    expect(lastDataset.backgroundColor).toBe('#AAA');

    const outOfBoundsDataset = result[0];
    expect(outOfBoundsDataset.backgroundColor).toBe('#000');
  });

  it('preserves string segment values in originalValues for display', () => {
    const columns = makeColumns([['25.0', '75.0']]);

    const result = transformToChartData(columns, defaultColors);

    expect(result).toHaveLength(2);
    const ds = result[0] as any;
    expect(ds.originalValues[0]).toBe('75.0');
  });

  it('preserves mixed string and number segment values in originalValues', () => {
    const columns = makeColumns([['40.0', 60]]);

    const result = transformToChartData(columns, defaultColors);

    const ds0 = result[0] as any;
    const ds1 = result[1] as any;
    expect(ds0.originalValues[0]).toBe(60);
    expect(ds1.originalValues[0]).toBe('40.0');
  });

  it('handles default chartHeight of 300', () => {
    const columns = makeColumns([[50, 50]]);

    const result = transformToChartData(columns, defaultColors);

    expect(result).toHaveLength(2);
  });

  it('handles 2 segments with correct border assignment', () => {
    const columns = makeColumns([[40, 60]]);

    const result = transformToChartData(columns, defaultColors);

    expect(result[0].borderWidth).toEqual({ top: 2 });
    expect(result[1].borderWidth).toEqual({ bottom: 2 });
  });

  it('treats non-numeric segment values as 0 in dataPoints', () => {
    const columns = makeColumns([['abc' as any, 100]]);

    const result = transformToChartData(columns, defaultColors);

    expect(result).toHaveLength(2);
    const topDs = result[0] as any;
    const bottomDs = result[1] as any;
    expect(topDs.data[0]).toBe(100);
    expect(bottomDs.data[0]).toBe(0);
  });
});
