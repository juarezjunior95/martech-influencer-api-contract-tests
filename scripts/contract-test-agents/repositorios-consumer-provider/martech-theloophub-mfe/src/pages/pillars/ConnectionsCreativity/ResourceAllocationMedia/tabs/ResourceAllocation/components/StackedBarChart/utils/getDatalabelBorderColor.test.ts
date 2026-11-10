import { getDatalabelBorderColor } from './getDatalabelBorderColor';

describe('getDatalabelBorderColor', () => {
  it('returns border color when pattern flag exists and value is valid', () => {
    const datasets = [
      { data: [100], pattern: { flags: [0] }, label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelBorderColor(datasets, context);

    expect(result).toBe('#1414141F');
  });

  it('returns null when pattern flag does not exist', () => {
    const datasets = [
      { data: [100], pattern: { flags: [1] }, label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelBorderColor(datasets, context);

    expect(result).toBeNull();
  });

  it('returns null when value is 0', () => {
    const datasets = [
      { data: [0], pattern: { flags: [0] }, label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelBorderColor(datasets, context);

    expect(result).toBeNull();
  });

  it('returns null when value is not finite', () => {
    const datasets = [
      { data: [Infinity], pattern: { flags: [0] }, label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelBorderColor(datasets, context);

    expect(result).toBeNull();
  });

  it('returns null when no pattern exists', () => {
    const datasets = [{ data: [100], label: 'Dataset 1' }] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelBorderColor(datasets, context);

    expect(result).toBeNull();
  });
});
