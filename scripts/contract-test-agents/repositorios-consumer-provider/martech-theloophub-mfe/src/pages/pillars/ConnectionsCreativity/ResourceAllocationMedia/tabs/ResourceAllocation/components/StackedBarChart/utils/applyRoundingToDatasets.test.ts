import { ChartData } from 'chart.js';

import { applyRoundingToDatasets } from './applyRoundingToDatasets';

jest.mock('utils/roundTo', () => ({
  roundNumbersTo: jest.fn((values: number[]) =>
    values.map((v) => Math.round(v)),
  ),
}));

jest.mock('../constants', () => ({
  MIN_SEGMENT_PERCENT: 5,
}));

describe('applyRoundingToDatasets', () => {
  it('clamps zero-value segments to MIN_SEGMENT_PERCENT and keeps bar sum = roundTo', () => {
    const mockData: ChartData<'bar'> = {
      labels: ['BU'],
      datasets: [
        { data: [0], label: 'Dataset 1' },
        { data: [32.5], label: 'Dataset 2' },
        { data: [60], label: 'Dataset 3' },
        { data: [7.5], label: 'Dataset 4' },
      ],
    } as ChartData<'bar'>;

    applyRoundingToDatasets(mockData, 100);

    const d0 = mockData.datasets[0].data[0] as number;
    const d1 = mockData.datasets[1].data[0] as number;
    const d2 = mockData.datasets[2].data[0] as number;
    const d3 = mockData.datasets[3].data[0] as number;

    expect(d0).toBe(5);
    expect(d1).toBeGreaterThanOrEqual(5);
    expect(d2).toBeGreaterThanOrEqual(5);
    expect(d3).toBeGreaterThanOrEqual(5);
    expect(d0 + d1 + d2 + d3).toBeCloseTo(100, 5);
  });

  it('clamps small non-zero segments to MIN_SEGMENT_PERCENT and keeps bar sum = roundTo', () => {
    const smallMock: ChartData<'bar'> = {
      labels: ['BU'],
      datasets: [
        { data: [32.5], label: 'Dataset 1' },
        { data: [64], label: 'Dataset 2' },
        { data: [3.5], label: 'Dataset 3' },
      ],
    } as ChartData<'bar'>;

    applyRoundingToDatasets(smallMock, 100);

    const d0 = smallMock.datasets[0].data[0] as number;
    const d1 = smallMock.datasets[1].data[0] as number;
    const d2 = smallMock.datasets[2].data[0] as number;

    expect(d2).toBe(5);
    expect(d0).toBeGreaterThanOrEqual(5);
    expect(d1).toBeGreaterThanOrEqual(5);
    expect(d0 + d1 + d2).toBeCloseTo(100, 5);
  });

  it('does not clamp segments already above MIN_SEGMENT_PERCENT', () => {
    const mockData: ChartData<'bar'> = {
      labels: ['AC'],
      datasets: [
        { data: [33.5], label: 'Dataset 1' },
        { data: [59.7], label: 'Dataset 2' },
        { data: [6.8], label: 'Dataset 3' },
      ],
    } as ChartData<'bar'>;

    applyRoundingToDatasets(mockData, 100);

    const d0 = mockData.datasets[0].data[0] as number;
    const d1 = mockData.datasets[1].data[0] as number;
    const d2 = mockData.datasets[2].data[0] as number;

    expect(d0).toBeGreaterThanOrEqual(5);
    expect(d1).toBeGreaterThanOrEqual(5);
    expect(d2).toBeGreaterThanOrEqual(5);
    expect(d0 + d1 + d2).toBeCloseTo(100, 5);
  });

  it('mutates the original data object in place', () => {
    const mockData: ChartData<'bar'> = {
      labels: ['Label 1'],
      datasets: [
        { data: [50], label: 'Dataset 1' },
        { data: [47], label: 'Dataset 2' },
        { data: [3], label: 'Dataset 3' },
      ],
    } as ChartData<'bar'>;

    const originalSmall = mockData.datasets[2].data[0];

    applyRoundingToDatasets(mockData, 100);

    expect(mockData.datasets[2].data[0]).not.toBe(originalSmall);
    expect(Number.isFinite(mockData.datasets[2].data[0] as number)).toBe(true);
  });

  it('distributes roundTo equally when all segments are below MIN_SEGMENT_PERCENT', () => {
    const mockData: ChartData<'bar'> = {
      labels: ['BU'],
      datasets: [
        { data: [0], label: 'Dataset 1' },
        { data: [0], label: 'Dataset 2' },
        { data: [0], label: 'Dataset 3' },
      ],
    } as ChartData<'bar'>;

    applyRoundingToDatasets(mockData, 100);

    const d0 = mockData.datasets[0].data[0] as number;
    const d1 = mockData.datasets[1].data[0] as number;
    const d2 = mockData.datasets[2].data[0] as number;

    expect(d0).toBeCloseTo(100 / 3, 5);
    expect(d1).toBeCloseTo(100 / 3, 5);
    expect(d2).toBeCloseTo(100 / 3, 5);
    expect(d0 + d1 + d2).toBeCloseTo(100, 5);
  });

  it('handles single dataset (full bar occupies 100% of roundTo)', () => {
    const mockData: ChartData<'bar'> = {
      labels: ['Label 1'],
      datasets: [{ data: [100], label: 'Dataset 1' }],
    } as ChartData<'bar'>;

    applyRoundingToDatasets(mockData, 100);

    expect(mockData.datasets[0].data[0]).toBeCloseTo(100, 5);
  });

  it('handles empty datasets gracefully', () => {
    const mockData: ChartData<'bar'> = {
      labels: [],
      datasets: [{ data: [], label: 'Dataset 1' }],
    } as ChartData<'bar'>;

    expect(() => applyRoundingToDatasets(mockData, 100)).not.toThrow();
  });

  it('skips rows where all dataset values are empty-string (N/A overlay rows)', () => {
    const mockData = {
      labels: ['BU', 'AC'],
      datasets: [
        { data: ['', '0.2'], label: 'media' },
        { data: ['', '85.5'], label: 'sponsorship' },
        { data: ['', '14.2'], label: 'nwm' },
      ],
    } as unknown as ChartData<'bar'>;

    applyRoundingToDatasets(mockData, 100);

    expect(mockData.datasets[0].data[0]).toBe('');
    expect(mockData.datasets[1].data[0]).toBe('');
    expect(mockData.datasets[2].data[0]).toBe('');

    const acSum =
      (mockData.datasets[0].data[1] as number) +
      (mockData.datasets[1].data[1] as number) +
      (mockData.datasets[2].data[1] as number);
    expect(acSum).toBeCloseTo(100, 5);
  });
});
