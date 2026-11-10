import type { StackedAreaColumn } from '../types';
import { normalizeColumnsToPercentages } from './normalizeToPercentages';

describe('normalizeColumnsToPercentages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes segments to sum to 100%', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: 25 }, { value: 75 }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);
    const total = result[0].segments.reduce(
      (sum, seg) => sum + Number(seg.value),
      0,
    );

    expect(total).toBeCloseTo(100);
    expect(result[0].segments[0].value).toBeCloseTo(25);
    expect(result[0].segments[1].value).toBeCloseTo(75);
  });

  it('normalizes uneven values correctly', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: 10 }, { value: 4 }, { value: 6 }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0].segments[0].value).toBeCloseTo(50);
    expect(result[0].segments[1].value).toBeCloseTo(20);
    expect(result[0].segments[2].value).toBeCloseTo(30);
  });

  it('returns column unchanged when total is 0', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: 0 }, { value: 0 }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0]).toBe(columns[0]);
  });

  it('preserves additional segment properties (label, etc)', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [
          { value: 50, label: 'Beer' },
          { value: 50, label: 'Wine' },
        ],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0].segments[0].label).toBe('Beer');
    expect(result[0].segments[1].label).toBe('Wine');
  });

  it('returns empty array for empty input', () => {
    const result = normalizeColumnsToPercentages([]);
    expect(result).toEqual([]);
  });

  it('handles multiple columns independently', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: 30 }, { value: 70 }],
      },
      {
        label: 'Col2',
        segments: [{ value: 10 }, { value: 10 }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0].segments[0].value).toBeCloseTo(30);
    expect(result[0].segments[1].value).toBeCloseTo(70);
    expect(result[1].segments[0].value).toBeCloseTo(50);
    expect(result[1].segments[1].value).toBeCloseTo(50);
  });

  it('normalizes string values to percentages', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: '25' }, { value: '75' }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);
    const total = result[0].segments.reduce(
      (sum, seg) => sum + Number(seg.value),
      0,
    );

    expect(total).toBeCloseTo(100);
    expect(result[0].segments[0].value).toBeCloseTo(25);
    expect(result[0].segments[1].value).toBeCloseTo(75);
  });

  it('handles mixed string and number values', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: '40' }, { value: 60 }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0].segments[0].value).toBeCloseTo(40);
    expect(result[0].segments[1].value).toBeCloseTo(60);
  });

  it('preserves column label', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: '2024',
        segments: [{ value: 20 }, { value: 80 }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0].label).toBe('2024');
  });

  it('treats non-numeric string values as 0 instead of NaN', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: 'abc' as any }, { value: 100 }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0].segments[0].value).toBe(0);
    expect(result[0].segments[1].value).toBeCloseTo(100);
  });

  it('returns column unchanged when all values are non-numeric', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [{ value: 'abc' as any }, { value: 'def' as any }],
      },
    ];

    const result = normalizeColumnsToPercentages(columns);

    expect(result[0]).toBe(columns[0]);
  });
});
