import { getDatalabelFont } from './getDatalabelFont';

describe('getDatalabelFont', () => {
  it('returns bold font for up direction', () => {
    const datasets = [
      { data: [100], directions: ['up'], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelFont(datasets, context);

    expect(result).toEqual({
      weight: 600,
      family: 'Work Sans',
    });
  });

  it('returns bold font for down direction', () => {
    const datasets = [
      { data: [100], directions: ['down'], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelFont(datasets, context);

    expect(result).toEqual({
      weight: 600,
      family: 'Work Sans',
    });
  });

  it('returns normal font for no direction', () => {
    const datasets = [
      { data: [100], directions: [], label: 'Dataset 1' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelFont(datasets, context);

    expect(result).toEqual({
      weight: 400,
      family: 'Work Sans',
    });
  });

  it('returns bold font for NWM segment (datasetIndex 0) on the AC row (dataIndex 1) with no direction', () => {
    const datasets = [
      { data: [100, 50], directions: ['', ''], label: 'NWM' },
    ] as any;
    const context = { dataIndex: 1, datasetIndex: 0 };

    const result = getDatalabelFont(datasets, context);

    expect(result).toEqual({
      weight: 600,
      family: 'Work Sans',
    });
  });

  it('returns normal font for non-NWM segments on the AC row', () => {
    const datasets = [
      { data: [100, 50], directions: ['', ''], label: 'NWM' },
      { data: [100, 50], directions: ['', ''], label: 'Sponsorship' },
    ] as any;
    const context = { dataIndex: 1, datasetIndex: 1 };

    const result = getDatalabelFont(datasets, context);

    expect(result).toEqual({
      weight: 400,
      family: 'Work Sans',
    });
  });

  it('returns normal font for NWM segment on the BU row (dataIndex 0)', () => {
    const datasets = [
      { data: [50, 100], directions: ['', ''], label: 'NWM' },
    ] as any;
    const context = { dataIndex: 0, datasetIndex: 0 };

    const result = getDatalabelFont(datasets, context);

    expect(result).toEqual({
      weight: 400,
      family: 'Work Sans',
    });
  });
});
