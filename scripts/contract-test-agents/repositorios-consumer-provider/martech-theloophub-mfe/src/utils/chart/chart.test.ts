import {
  getChartAxisLimits,
  getCurrentPeriod,
  getLabels,
  getQuarters,
} from './chart';

describe('chart utils', () => {
  describe('getLabels', () => {
    it('should return empty array when breakLine is false', () => {
      const labels = ['Label1', 'Label2'];
      const result = getLabels(labels, false);
      expect(result).toEqual([]);
    });

    it('should return empty array when breakLine is not provided', () => {
      const labels = ['Label1', 'Label2'];
      const result = getLabels(labels);
      expect(result).toEqual([]);
    });

    it('should break labels when breakLine is true', () => {
      const labels = ['Short', 'VeryLongLabel-WithDash'];
      const result = getLabels(labels, true);
      expect(result).toEqual(['Short', ['VeryLongLabel-', 'WithDash']]);
    });

    it('should handle labels with pipe character', () => {
      const labels = ['VeryLongLabelWith|PipeChar'];
      const result = getLabels(labels, true);
      expect(result).toEqual([['VeryLongLabelWith|', 'PipeChar']]);
    });

    it('should handle labels with parentheses', () => {
      const labels = ['VeryLongLabel(WithParens)'];
      const result = getLabels(labels, true);
      expect(result).toEqual([['VeryLongLabel', '(WithParens)']]);
    });

    it('should handle labels with "to"', () => {
      const labels = ['VeryLongLabeltoSecondPart'];
      const result = getLabels(labels, true);
      expect(result).toEqual([['VeryLongLabelto', 'SecondPart']]);
    });

    it('should handle labels with "TO"', () => {
      const labels = ['VeryLongLabelTOSecondPart'];
      const result = getLabels(labels, true);
      expect(result).toEqual([['VeryLongLabelTO', 'SecondPart']]);
    });

    it('should handle null/undefined labels', () => {
      const labels = [
        null as unknown as string,
        undefined as unknown as string,
      ];
      const result = getLabels(labels, true);
      expect(result).toEqual(['', '']);
    });

    it('should not break short labels', () => {
      const labels = ['Short'];
      const result = getLabels(labels, true);
      expect(result).toEqual(['Short']);
    });
  });

  describe('getCurrentPeriod', () => {
    it('should return array with month, year digits, full year, and quarter', () => {
      const result = getCurrentPeriod();
      expect(result).toHaveLength(4);
      expect(typeof result[0]).toBe('string');
      expect(typeof result[1]).toBe('string');
      expect(typeof result[2]).toBe('string');
    });

    it('should return correct year format when year is provided', () => {
      const result = getCurrentPeriod('2023');
      expect(result[1]).toBe('23');
      expect(result[2]).toBe('2023');
    });
  });

  describe('getQuarters', () => {
    it('should return all four quarters for a given year', () => {
      const result = getQuarters('2023');
      expect(result).toEqual(["Q1'23", "Q2'23", "Q3'23", "Q4'23"]);
    });

    it('should handle different year formats', () => {
      const result = getQuarters('2025');
      expect(result).toEqual(["Q1'25", "Q2'25", "Q3'25", "Q4'25"]);
    });
  });

  describe('getChartAxisLimits', () => {
    it('should return default values when data is null', () => {
      const result = getChartAxisLimits(null);
      expect(result).toEqual({ yMin: 0, yMax: null });
    });

    it('should return default values when data is undefined', () => {
      const result = getChartAxisLimits(undefined);
      expect(result).toEqual({ yMin: 0, yMax: null });
    });

    it('should return default values when min is null', () => {
      const result = getChartAxisLimits({ min: null, max: 100 });
      expect(result).toEqual({ yMin: 0, yMax: null });
    });

    it('should return default values when max is null', () => {
      const result = getChartAxisLimits({ min: 0, max: null });
      expect(result).toEqual({ yMin: 0, yMax: null });
    });

    it('should calculate axis limits for normal range', () => {
      const result = getChartAxisLimits({ min: 10, max: 100 });
      const range = 100 - 10;
      expect(result.yMin).toBe(10 - range * 0.3);
      expect(result.yMax).toBe(100 + range * 0.3);
    });

    it('should add extra padding for small range (less than 5)', () => {
      const result = getChartAxisLimits({ min: 10, max: 12 });
      const range = 12 - 10;
      expect(result.yMin).toBe(10 - range * 0.3 - 2.5);
      expect(result.yMax).toBe(12 + range * 0.3 + 2.5);
    });

    it('should handle zero range', () => {
      const result = getChartAxisLimits({ min: 50, max: 50 });
      expect(result.yMin).toBe(50 - 2.5);
      expect(result.yMax).toBe(50 + 2.5);
    });
  });
});
