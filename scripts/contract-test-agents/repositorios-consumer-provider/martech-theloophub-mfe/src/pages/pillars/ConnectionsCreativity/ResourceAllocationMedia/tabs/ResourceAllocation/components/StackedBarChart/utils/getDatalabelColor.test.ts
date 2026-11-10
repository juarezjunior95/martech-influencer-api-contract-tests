import { getDatalabelColor } from './getDatalabelColor';

jest.mock('../constants', () => ({
  COLOR_MAP: {
    up: '#00FF00',
    down: '#FF0000',
    '': '#000000',
  },
}));

describe('getDatalabelColor', () => {
  it('returns color for up direction', () => {
    const datasets = [
      { data: [100], directions: ['up'], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelColor(datasets, context);

    expect(result).toBe('#00FF00');
  });

  it('returns color for down direction', () => {
    const datasets = [
      { data: [100], directions: ['down'], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelColor(datasets, context);

    expect(result).toBe('#FF0000');
  });

  it('returns default color when no direction', () => {
    const datasets = [
      { data: [100], directions: [], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelColor(datasets, context);

    expect(result).toBe('#000000');
  });

  it('handles missing directions array', () => {
    const datasets = [{ data: [100], label: 'Dataset 1' }] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelColor(datasets, context);

    expect(result).toBe('#000000');
  });
});
