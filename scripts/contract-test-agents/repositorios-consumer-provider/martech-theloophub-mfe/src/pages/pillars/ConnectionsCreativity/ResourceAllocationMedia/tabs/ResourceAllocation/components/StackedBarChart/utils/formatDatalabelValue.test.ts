import { formatDatalabelValue } from './formatDatalabelValue';

describe('formatDatalabelValue', () => {
  it('returns formatted data when available', () => {
    const datasets = [
      { data: [100], formattedData: ['$100'], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 } as any;

    const result = formatDatalabelValue(datasets, 100, context);

    expect(result).toBe('$100');
  });

  it('returns original value when formatted data is not available', () => {
    const datasets = [{ data: [100], label: 'Dataset 1' }] as any;
    const context = { dataIndex: 0, datasetIndex: 0 } as any;

    const result = formatDatalabelValue(datasets, 100, context);

    expect(result).toBe(100);
  });

  it('returns original value when formatted data index is out of bounds', () => {
    const datasets = [
      { data: [100, 200], formattedData: ['$100'], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 1, datasetIndex: 0 } as any;

    const result = formatDatalabelValue(datasets, 200, context);

    expect(result).toBe(200);
  });
});
