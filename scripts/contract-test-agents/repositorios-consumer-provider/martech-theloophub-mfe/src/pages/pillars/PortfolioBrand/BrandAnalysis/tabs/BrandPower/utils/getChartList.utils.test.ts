import { BrandPowerData } from 'pages/pillars/PortfolioBrand/BrandAnalysis/types';

import { getChartList } from './getChartList';

describe('getChartList', () => {
  describe('null or undefined data', () => {
    it('should return empty array when data is null', () => {
      const result = getChartList(null, 'quarter');

      expect(result).toEqual([]);
    });

    it('should return empty array when data is undefined', () => {
      const result = getChartList(undefined as any, 'quarter');

      expect(result).toEqual([]);
    });
  });

  describe('quarter selection', () => {
    it('should return quarterly and ytd data when quarterYearSelected is "quarter"', () => {
      const data: BrandPowerData = {
        quarterly: { labels: ['Q1'], datasets: [] } as any,
        ytd: { labels: ['YTD'], datasets: [] } as any,
        yearly: undefined,
      };

      const result = getChartList(data, 'quarter');

      expect(result).toHaveLength(2);
      expect(result[0].labels).toEqual(['Q1']);
      expect(result[1].labels).toEqual(['YTD']);
    });

    it('should handle missing quarterly data', () => {
      const data: BrandPowerData = {
        ytd: { labels: ['YTD'], datasets: [] } as any,
        quarterly: undefined,
        yearly: undefined,
      };

      const result = getChartList(data, 'quarter');

      expect(result).toEqual([]);
    });

    it('should handle missing ytd data', () => {
      const data: BrandPowerData = {
        quarterly: { labels: ['Q1'], datasets: [] } as any,
        yearly: undefined,
        ytd: undefined,
      };

      const result = getChartList(data, 'quarter');

      expect(result).toEqual([]);
    });
  });

  describe('year selection', () => {
    it('should return only yearly data when quarterYearSelected is "year"', () => {
      const data: BrandPowerData = {
        yearly: { labels: ['2024'], datasets: [] } as any,
        quarterly: undefined,
        ytd: undefined,
      };

      const result = getChartList(data, 'year');

      expect(result).toHaveLength(1);
      expect(result[0].labels).toEqual(['2024']);
    });

    it('should handle missing yearly data', () => {
      const data: BrandPowerData = {
        quarterly: undefined,
        yearly: undefined,
        ytd: undefined,
      };

      const result = getChartList(data, 'year');

      expect(result).toEqual([]);
    });
  });

  describe('label normalization', () => {
    it('should convert string label to array for quarterly data', () => {
      const data: BrandPowerData = {
        quarterly: { labels: 'Q1' as any, datasets: [] } as any,
        ytd: { labels: ['YTD'], datasets: [] } as any,
        yearly: undefined,
      };

      const result = getChartList(data, 'quarter');

      expect(Array.isArray(result[0].labels)).toBe(true);
      expect(result[0].labels).toEqual(['Q1']);
    });

    it('should convert string label to array for ytd data', () => {
      const data: BrandPowerData = {
        quarterly: { labels: ['Q1'], datasets: [] } as any,
        ytd: { labels: 'YTD' as any, datasets: [] } as any,
        yearly: undefined,
      };

      const result = getChartList(data, 'quarter');

      expect(Array.isArray(result[1].labels)).toBe(true);
      expect(result[1].labels).toEqual(['YTD']);
    });

    it('should convert string label to array for yearly data', () => {
      const data: BrandPowerData = {
        yearly: { labels: '2024' as any, datasets: [] } as any,
        quarterly: undefined,
        ytd: undefined,
      };

      const result = getChartList(data, 'year');

      expect(Array.isArray(result[0].labels)).toBe(true);
      expect(result[0].labels).toEqual(['2024']);
    });

    it('should keep array labels unchanged', () => {
      const data: BrandPowerData = {
        yearly: { labels: ['2023', '2024'], datasets: [] } as any,
        quarterly: undefined,
        ytd: undefined,
      };

      const result = getChartList(data, 'year');

      expect(result[0].labels).toEqual(['2023', '2024']);
    });

    it('should handle labels with multiple string values normalized', () => {
      const data: BrandPowerData = {
        quarterly: { labels: 'Q1' as any, datasets: [] } as any,
        ytd: { labels: 'YTD Total' as any, datasets: [] } as any,
        yearly: undefined,
      };

      const result = getChartList(data, 'quarter');

      expect(result[0].labels).toEqual(['Q1']);
      expect(result[1].labels).toEqual(['YTD Total']);
    });
  });

  describe('data immutability', () => {
    it('should not modify original data object', () => {
      const originalData: BrandPowerData = {
        quarterly: { labels: ['Q1'], datasets: [] } as any,
        ytd: { labels: ['YTD'], datasets: [] } as any,
        yearly: undefined,
      };

      const originalQuarterlyLabels = originalData.quarterly.labels;
      const originalYtdLabels = originalData.ytd.labels;

      getChartList(originalData, 'quarter');

      expect(originalData.quarterly.labels).toBe(originalQuarterlyLabels);
      expect(originalData.ytd.labels).toBe(originalYtdLabels);
    });

    it('should create new objects when normalizing', () => {
      const originalData: BrandPowerData = {
        yearly: { labels: 'Q1' as any, datasets: [] } as any,
        quarterly: undefined,
        ytd: undefined,
      };

      const result = getChartList(originalData, 'year');

      expect(result[0].labels).toEqual(['Q1']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty object as data', () => {
      const data: BrandPowerData = {
        quarterly: undefined,
        yearly: undefined,
        ytd: undefined,
      };

      const resultQuarter = getChartList(data, 'quarter');
      const resultYear = getChartList(data, 'year');

      expect(resultQuarter).toEqual([]);
      expect(resultYear).toEqual([]);
    });

    it('should handle missing labels property', () => {
      const data: BrandPowerData = {
        yearly: { datasets: [] } as any,
        quarterly: undefined,
        ytd: undefined,
      };

      const result = getChartList(data, 'year');

      expect(result).toHaveLength(1);
      expect(result[0].labels).toEqual([]);
    });

    it('should handle complete chart data structure', () => {
      const data: BrandPowerData = {
        quarterly: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            { label: 'Brand A', data: [10, 20, 30, 40] },
            { label: 'Brand B', data: [15, 25, 35, 45] },
          ],
        } as any,
        ytd: {
          labels: ['YTD'],
          datasets: [{ label: 'Total', data: [100] }],
        } as any,
        yearly: undefined,
      };

      const result = getChartList(data, 'quarter');

      expect(result).toHaveLength(2);
      expect(result[0].labels).toHaveLength(4);
      expect(result[0].datasets).toHaveLength(2);
      expect(result[1].labels).toHaveLength(1);
      expect(result[1].datasets).toHaveLength(1);
    });
  });
});
