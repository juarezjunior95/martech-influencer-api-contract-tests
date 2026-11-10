import {
  filterAbiRows,
  filterCompetitorRows,
  mergeRowsInPairs,
} from './mergeRowsInPairs';

describe('mergeRowsInPairs utils', () => {
  describe('filterAbiRows', () => {
    it('should return empty header and rows when data is null', () => {
      const result = filterAbiRows(null as any);

      expect(result).toEqual({ header: [], rows: [] });
    });

    it('should return empty header and rows when rows is not array', () => {
      const result = filterAbiRows({ rows: 'invalid' } as any);

      expect(result).toEqual({ header: [], rows: [] });
    });

    it('should filter only competitor rows excluding Competitor Brands header', () => {
      const data = {
        header: [{ field: 'id' }],
        rows: [
          [
            { type: { value: 'competitor' }, id: { value: 'Brand A' } },
            {
              type: { value: 'competitor' },
              id: { value: 'Competitor Brands' },
            },
            { type: { value: 'abi' }, id: { value: 'Brand B' } },
          ],
        ],
      };

      const result = filterAbiRows(data as any);

      expect(result.rows[0]).toHaveLength(1);
      expect(result.rows[0][0].id.value).toBe('Brand A');
    });

    it('should preserve header', () => {
      const data = {
        header: [{ field: 'id' }, { field: 'name' }],
        rows: [[{ type: { value: 'competitor' }, id: { value: 'Brand A' } }]],
      };

      const result = filterAbiRows(data as any);

      expect(result.header).toEqual([{ field: 'id' }, { field: 'name' }]);
    });

    it('should handle multiple groups', () => {
      const data = {
        header: [],
        rows: [
          [{ type: { value: 'competitor' }, id: { value: 'Brand A' } }],
          [{ type: { value: 'competitor' }, id: { value: 'Brand B' } }],
        ],
      };

      const result = filterAbiRows(data as any);

      expect(result.rows).toHaveLength(2);
    });
  });

  describe('filterCompetitorRows', () => {
    it('should return empty header and rows when data is null', () => {
      const result = filterCompetitorRows(null as any);

      expect(result).toEqual({ header: [], rows: [] });
    });

    it('should return empty header and rows when rows is not array', () => {
      const result = filterCompetitorRows({ rows: 'invalid' } as any);

      expect(result).toEqual({ header: [], rows: [] });
    });

    it('should filter out competitor rows', () => {
      const data = {
        header: [{ field: 'id' }],
        rows: [
          [
            { type: { value: 'competitor' }, id: { value: 'Brand A' } },
            { type: { value: 'abi' }, id: { value: 'Brand B' } },
            { type: { value: 'abi' }, id: { value: 'Brand C' } },
          ],
        ],
      };

      const result = filterCompetitorRows(data as any);

      expect(result.rows[0]).toHaveLength(2);
      expect(result.rows[0][0].id.value).toBe('Brand B');
      expect(result.rows[0][1].id.value).toBe('Brand C');
    });

    it('should preserve header', () => {
      const data = {
        header: [{ field: 'id' }, { field: 'name' }],
        rows: [[{ type: { value: 'abi' }, id: { value: 'Brand A' } }]],
      };

      const result = filterCompetitorRows(data as any);

      expect(result.header).toEqual([{ field: 'id' }, { field: 'name' }]);
    });
  });

  describe('mergeRowsInPairs', () => {
    it('should return empty array for empty input', () => {
      const result = mergeRowsInPairs([]);

      expect(result).toEqual([]);
    });

    it('should return single row if only one row exists', () => {
      const rows = [{ id: { value: 'Brand A' }, name: { value: 'Test' } }];

      const result = mergeRowsInPairs(rows);

      expect(result).toHaveLength(1);
    });

    it('should not merge rows with different ids', () => {
      const rows = [
        { id: { value: 'Brand A' }, name: { value: 'Test A' } },
        { id: { value: 'Brand B' }, name: { value: 'Test B' } },
      ];

      const result = mergeRowsInPairs(rows);

      expect(result).toHaveLength(2);
    });

    it('should merge rows with same ids', () => {
      const rows = [
        {
          id: { value: 'Brand A', unitMeasure: '%', variationDirection: 'up' },
        },
        {
          id: {
            value: 'Brand A',
            unitMeasure: 'pp',
            variationDirection: 'down',
          },
        },
      ];

      const result = mergeRowsInPairs(rows);

      expect(result).toHaveLength(1);
      expect(result[0].id.value).toBe('Brand A');
      expect(result[0].id.value2).toBe('Brand A');
      expect(result[0].id.unitMeasure).toBe('%');
      expect(result[0].id.unitMeasure2).toBe('pp');
    });

    it('should merge chartData from both rows', () => {
      const rows = [
        {
          id: { value: 'Brand A' },
          chart: {
            value: 10,
            chartData: {
              data: [1, 2],
              backgroundColor: ['red'],
              secondaryBackgroundColor: ['lightred'],
            },
          },
        },
        {
          id: { value: 'Brand A' },
          chart: {
            value: 20,
            chartData: {
              data: [3, 4],
              backgroundColor: ['blue'],
              secondaryBackgroundColor: ['lightblue'],
            },
          },
        },
      ];

      const result = mergeRowsInPairs(rows);

      expect(result[0].chart.chartData.data).toEqual([1, 2, 3, 4]);
      expect(result[0].chart.chartData.backgroundColor).toEqual([
        'red',
        'blue',
      ]);
      expect(result[0].chart.chartData.secondaryBackgroundColor).toEqual([
        'lightred',
        'lightblue',
      ]);
    });

    it('should handle missing secondaryBackgroundColor', () => {
      const rows = [
        {
          id: { value: 'Brand A' },
          chart: {
            value: 10,
            chartData: {
              data: [1],
              backgroundColor: ['red'],
            },
          },
        },
        {
          id: { value: 'Brand A' },
          chart: {
            value: 20,
            chartData: {
              data: [2],
              backgroundColor: ['blue'],
            },
          },
        },
      ];

      const result = mergeRowsInPairs(rows);

      expect(result[0].chart.chartData.secondaryBackgroundColor).toEqual([]);
    });

    it('should preserve variationDirection from both rows', () => {
      const rows = [
        {
          id: { value: 'Brand A', variationDirection: 'up' },
        },
        {
          id: { value: 'Brand A', variationDirection: 'down' },
        },
      ];

      const result = mergeRowsInPairs(rows);

      expect(result[0].id.variationDirection).toBe('up');
      expect(result[0].id.variationDirection2).toBe('down');
    });

    it('should handle null chartData', () => {
      const rows = [
        {
          id: { value: 'Brand A' },
          field: { value: 10, chartData: null },
        },
        {
          id: { value: 'Brand A' },
          field: { value: 20, chartData: null },
        },
      ];

      const result = mergeRowsInPairs(rows);

      expect(result[0].field.chartData).toBeFalsy();
    });
  });
});
