import { mapBigNumbersResponse } from './mapBigNumbersResponse';

describe('mapBigNumbersResponse', () => {
  it('should map direction "up" to trend "positive"', () => {
    const input = [
      {
        title: 'Beer Volume',
        kpiKey: 'volume',
        dataTestId: 'beer-volume',
        emptyStateMessage: null,
        data: [
          {
            bigNumber: { value: '1.7', measure: '%', direction: 'up' as const },
            comparison: { label: 'vs', value: "25'FY" },
            secondaryInfo: { value: '148,817', measure: '[ k hl ]' },
          },
        ],
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].data[0].bigNumber).toEqual({
      value: '1.7',
      measure: '%',
      trend: 'positive',
      color: undefined,
    });
  });

  it('should map direction "down" to trend "negative"', () => {
    const input = [
      {
        title: 'Beer Participation',
        kpiKey: 'participation',
        dataTestId: 'beer-participation',
        emptyStateMessage: null,
        data: [
          {
            bigNumber: {
              value: '-2.3',
              measure: 'pp',
              direction: 'down' as const,
            },
            comparison: { label: 'vs', value: "25'FY" },
            secondaryInfo: { value: '44.0', measure: '[ % ]' },
          },
        ],
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].data[0].bigNumber).toEqual({
      value: '-2.3',
      measure: 'pp',
      trend: 'negative',
      color: undefined,
    });
  });

  it('should return undefined trend when direction is not provided', () => {
    const input = [
      {
        title: 'Test',
        kpiKey: 'volume',
        dataTestId: 'test',
        data: [
          {
            bigNumber: { value: '1.0', measure: '%' },
          },
        ],
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].data[0].bigNumber?.trend).toBeUndefined();
  });

  it('should preserve color and keep missing bigNumber as undefined', () => {
    const input = [
      {
        title: 'WMTBB',
        kpiKey: 'wmtbb',
        dataTestId: 'wmtbb',
        data: [
          {
            bigNumber: {
              value: '35.4',
              measure: '%',
              direction: 'up' as const,
              color: '#007800',
            },
          },
          {
            comparison: { label: 'vs', value: "25'FY" },
          },
        ],
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].data[0].bigNumber).toEqual({
      value: '35.4',
      measure: '%',
      trend: 'positive',
      color: '#007800',
    });
    expect(result[0].data[1].bigNumber).toBeUndefined();
  });

  it('should handle items with empty data arrays', () => {
    const input = [
      {
        title: 'WMTBB',
        kpiKey: 'wmtbb',
        dataTestId: 'wmtbb',
        data: [],
        emptyStateMessage: 'Data not avaliable',
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].data).toEqual([]);
    expect(result[0].emptyStateMessage).toBe('Data not avaliable');
  });

  it('should convert null emptyStateMessage to undefined', () => {
    const input = [
      {
        title: 'Beer Volume',
        kpiKey: 'volume',
        dataTestId: 'beer-volume',
        emptyStateMessage: null,
        data: [
          {
            bigNumber: { value: '1.0', measure: '%', direction: 'up' as const },
          },
        ],
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].emptyStateMessage).toBeUndefined();
  });

  it('should preserve comparison and secondaryInfo fields', () => {
    const input = [
      {
        title: 'Test',
        kpiKey: 'volume',
        dataTestId: 'test',
        data: [
          {
            bigNumber: { value: '1.0', direction: 'up' as const },
            comparison: { label: 'vs', value: "25'FY" },
            secondaryInfo: { value: '100', measure: '[ k hl ]' },
          },
        ],
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].data[0].comparison).toEqual({
      label: 'vs',
      value: "25'FY",
    });
    expect(result[0].data[0].secondaryInfo).toEqual({
      value: '100',
      measure: '[ k hl ]',
    });
  });

  it('should map multiple items correctly', () => {
    const input = [
      {
        title: 'Beer Volume',
        kpiKey: 'volume',
        dataTestId: 'beer-volume',
        emptyStateMessage: null,
        data: [
          {
            bigNumber: { value: '1.7', measure: '%', direction: 'up' as const },
          },
        ],
      },
      {
        title: 'BICL',
        kpiKey: 'icl',
        dataTestId: 'bicl',
        data: [],
        emptyStateMessage: 'Data not avaliable',
      },
      {
        title: 'Beer Participation',
        kpiKey: 'participation',
        dataTestId: 'beer-participation',
        emptyStateMessage: null,
        data: [
          {
            bigNumber: {
              value: '-2.3',
              measure: 'pp',
              direction: 'down' as const,
            },
          },
        ],
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result).toHaveLength(3);
    expect(result[0].data[0].bigNumber?.trend).toBe('positive');
    expect(result[1].data).toEqual([]);
    expect(result[1].emptyStateMessage).toBe('Data not avaliable');
    expect(result[2].data[0].bigNumber?.trend).toBe('negative');
  });

  it('should preserve kpiKey and dataTestId', () => {
    const input = [
      {
        title: 'Share of Throat',
        kpiKey: 'sot',
        dataTestId: 'share-of-throat',
        data: [],
        emptyStateMessage: 'Data not avaliable',
      },
    ];

    const result = mapBigNumbersResponse(input);

    expect(result[0].kpiKey).toBe('sot');
    expect(result[0].dataTestId).toBe('share-of-throat');
    expect(result[0].title).toBe('Share of Throat');
  });
});
