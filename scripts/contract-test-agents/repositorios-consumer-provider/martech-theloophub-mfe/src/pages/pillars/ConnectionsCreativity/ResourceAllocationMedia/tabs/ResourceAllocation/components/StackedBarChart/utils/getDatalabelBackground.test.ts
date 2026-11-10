import { getDatalabelBackground } from './getDatalabelBackground';

describe('getDatalabelBackground', () => {
  it('always returns fallback color (#D5DADD) for datasetIndex 0, regardless of rowColors', () => {
    const datasets = [
      { data: [100], pattern: { flags: [0] }, label: 'Dataset 1' },
    ] as any;

    expect(
      getDatalabelBackground(datasets, {
        dataIndex: 0,
        datasetIndex: 0,
      } as any),
    ).toBe('#D5DADD');

    expect(
      getDatalabelBackground(
        datasets,
        { dataIndex: 0, datasetIndex: 0 } as any,
        ['#E2D4BB', '#99D6FF', '#FFDE70'],
      ),
    ).toBe('#D5DADD');
  });

  it('returns rowColors[datasetIndex] for datasetIndex > 0 when rowColors are provided', () => {
    const datasets = [
      { data: [100], pattern: { flags: [0] }, label: 'Dataset 1' },
      { data: [200], pattern: { flags: [0] }, label: 'Dataset 2' },
      { data: [300], pattern: { flags: [0] }, label: 'Dataset 3' },
    ] as any;
    const rowColors = ['#E2D4BB', '#99D6FF', '#FFDE70'];

    expect(
      getDatalabelBackground(
        datasets,
        { dataIndex: 0, datasetIndex: 1 } as any,
        rowColors,
      ),
    ).toBe('#99D6FF');

    expect(
      getDatalabelBackground(
        datasets,
        { dataIndex: 0, datasetIndex: 2 } as any,
        rowColors,
      ),
    ).toBe('#FFDE70');
  });

  it('returns undefined when pattern flag does not exist for this dataIndex', () => {
    const datasets = [
      { data: [100], pattern: { flags: [1] }, label: 'Dataset 1' },
    ] as any;

    expect(
      getDatalabelBackground(datasets, {
        dataIndex: 0,
        datasetIndex: 0,
      } as any),
    ).toBeUndefined();
  });

  it('returns undefined when value is 0 or not finite', () => {
    const datasetsZero = [
      { data: [0], pattern: { flags: [0] }, label: 'Dataset 1' },
    ] as any;
    const datasetsNaN = [
      { data: [NaN], pattern: { flags: [0] }, label: 'Dataset 1' },
    ] as any;

    expect(
      getDatalabelBackground(datasetsZero, {
        dataIndex: 0,
        datasetIndex: 0,
      } as any),
    ).toBeUndefined();

    expect(
      getDatalabelBackground(datasetsNaN, {
        dataIndex: 0,
        datasetIndex: 0,
      } as any),
    ).toBeUndefined();
  });
});
