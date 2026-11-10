import { formatNumberWithSuffix } from 'utils/format';

import {
  findProximateValuesAtPoint,
  getDatalabelsConfig,
  getPositionByValueComparison,
} from './index';

jest.mock('theme', () => ({
  theme: {
    colors: {
      txt: {
        default: '#000000',
      },
    },
  },
}));

jest.mock('utils/format', () => ({
  formatNumberWithSuffix: jest.fn((value: number) => ({
    value: String(value),
    wasFormatted: false,
  })),
}));

describe('LineStacked utils', () => {
  const createMockChart = (scaleValues: Record<number, number> = {}) => {
    return {
      scales: {
        y: {
          getPixelForValue: jest.fn((value: number) => {
            return scaleValues[value] ?? value * 10;
          }),
        },
      },
    };
  };

  describe('findProximateValuesAtPoint', () => {
    it('should return empty array when no datasets', () => {
      const chart = createMockChart();
      const result = findProximateValuesAtPoint(chart as any, [], 0, 0, 100);

      expect(result).toEqual([]);
    });

    it('should skip current dataset index', () => {
      const chart = createMockChart({ 100: 1000, 105: 1050 });
      const datasets = [
        { type: 'line', data: [100, 200] },
        { type: 'line', data: [105, 250] },
      ];

      const result = findProximateValuesAtPoint(
        chart as any,
        datasets as any,
        0,
        0,
        100,
      );

      expect(result.length).toBe(1);
      expect(result[0].datasetType).toBe('line');
    });

    it('should return proximate values within threshold', () => {
      const chart = createMockChart({ 100: 1000, 105: 1050 });
      const datasets = [
        { type: 'line', data: [100] },
        { type: 'line', data: [105] },
      ];

      const result = findProximateValuesAtPoint(
        chart as any,
        datasets as any,
        0,
        0,
        100,
      );

      expect(result.length).toBe(1);
      expect(result[0].value).toBe(105);
    });

    it('should not return values beyond threshold', () => {
      const chart = createMockChart({ 100: 1000, 200: 3000 });
      const datasets = [
        { type: 'line', data: [100] },
        { type: 'line', data: [200] },
      ];

      const result = findProximateValuesAtPoint(
        chart as any,
        datasets as any,
        0,
        0,
        100,
      );

      expect(result).toEqual([]);
    });

    it('should handle undefined values', () => {
      const chart = createMockChart();
      const datasets = [
        { type: 'line', data: [100] },
        { type: 'line', data: [undefined] },
      ];

      const result = findProximateValuesAtPoint(
        chart as any,
        datasets as any,
        0,
        0,
        100,
      );

      expect(result).toEqual([]);
    });

    it('should handle null values', () => {
      const chart = createMockChart();
      const datasets = [
        { type: 'line', data: [100] },
        { type: 'line', data: [null] },
      ];

      const result = findProximateValuesAtPoint(
        chart as any,
        datasets as any,
        0,
        0,
        100,
      );

      expect(result).toEqual([]);
    });
  });

  describe('getPositionByValueComparison', () => {
    it('should return default position when no proximate values', () => {
      const result = getPositionByValueComparison(100, [], 0);

      expect(result).toEqual({ align: 'top', anchor: 'end', offset: 4 });
    });

    it('should return end position when current value is greater', () => {
      const proximateValues = [
        { pixelDifference: 10, datasetType: 'line', value: 50 },
      ];

      const result = getPositionByValueComparison(100, proximateValues, 0);

      expect(result).toEqual({ align: 'end', anchor: 'end', offset: 4 });
    });

    it('should return start position when current value is less', () => {
      const proximateValues = [
        { pixelDifference: 10, datasetType: 'line', value: 150 },
      ];

      const result = getPositionByValueComparison(100, proximateValues, 0);

      expect(result).toEqual({ align: 'start', anchor: 'start', offset: 4 });
    });

    it('should return end position when values are equal and pixelDifference is 0 and datasetIndex is 0', () => {
      const proximateValues = [
        { pixelDifference: 0, datasetType: 'line', value: 100 },
      ];

      const result = getPositionByValueComparison(100, proximateValues, 0);

      expect(result).toEqual({ align: 'end', anchor: 'end', offset: 4 });
    });

    it('should return end position when has bar and pixelDifference < 50 and value > 0', () => {
      const proximateValues = [
        { pixelDifference: 30, datasetType: 'bar', value: 50 },
      ];

      const result = getPositionByValueComparison(100, proximateValues, 1);

      expect(result).toEqual({ align: 'end', anchor: 'end', offset: 4 });
    });

    it('should return end position when pixelDifference is 0 and datasetIndex is 0', () => {
      const proximateValues = [
        { pixelDifference: 0, datasetType: 'line', value: 100 },
      ];

      const result = getPositionByValueComparison(100, proximateValues, 0);

      expect(result).toEqual({ align: 'end', anchor: 'end', offset: 4 });
    });

    it('should return closest value when multiple proximate values', () => {
      const proximateValues = [
        { pixelDifference: 50, datasetType: 'line', value: 150 },
        { pixelDifference: 10, datasetType: 'line', value: 50 },
      ];

      const result = getPositionByValueComparison(100, proximateValues, 0);

      expect(result).toEqual({ align: 'end', anchor: 'end', offset: 4 });
    });
  });

  describe('getDatalabelsConfig', () => {
    it('should return bar config when dataset type is bar', () => {
      const dataset = { type: 'bar', data: [100, 200] };
      const allDatasets = [dataset];

      const result = getDatalabelsConfig(dataset as any, allDatasets, 0);

      expect(result.display).toBe(true);
      expect(result.align).toBe('center');
      expect(result.anchor).toBe('center');
      expect(result.offset).toBe(4);
    });

    it('should return line config when dataset type is line', () => {
      const dataset = { type: 'line', data: [100, 200] };
      const allDatasets = [dataset];

      const result = getDatalabelsConfig(dataset as any, allDatasets, 0);

      expect(result.display).toBe(true);
      expect(typeof result.align).toBe('function');
      expect(typeof result.anchor).toBe('function');
      expect(typeof result.offset).toBe('function');
    });

    it('should use formattedData when available', () => {
      const dataset = {
        type: 'bar',
        data: [100, 200],
        formattedData: ['100k', '200k'],
      };
      const allDatasets = [dataset];
      const mockContext = { dataIndex: 0 };

      const result = getDatalabelsConfig(dataset as any, allDatasets, 0);
      const formatted = result.formatter(100, mockContext as any);

      expect(formatted).toBe('100k');
    });

    it('should use formatNumberWithSuffix when formattedData is not available', () => {
      jest.mocked(formatNumberWithSuffix).mockReturnValue({
        value: '100.0',
        wasFormatted: false,
      });

      const dataset = { type: 'bar', data: [100, 200] };
      const allDatasets = [dataset];
      const mockContext = { dataIndex: 0 };

      const result = getDatalabelsConfig(dataset as any, allDatasets, 0);
      const formatted = result.formatter(100, mockContext as any);

      expect(formatNumberWithSuffix).toHaveBeenCalledWith(100);
      expect(formatted).toBe('100.0');
    });

    it('should cache position for same context', () => {
      const chart = createMockChart();
      const dataset = { type: 'line', data: [100] };
      const allDatasets = [dataset];
      const mockContext = {
        chart,
        dataset: { data: [100] },
        dataIndex: 0,
      };

      const result = getDatalabelsConfig(dataset as any, allDatasets, 0);
      const alignFn = result.align as (context: any) => string;
      const anchorFn = result.anchor as (context: any) => string;
      const offsetFn = result.offset as (context: any) => number;
      const align1 = alignFn(mockContext as any);
      const align2 = alignFn(mockContext as any);
      const anchor1 = anchorFn(mockContext as any);
      const offset1 = offsetFn(mockContext as any);

      expect(align1).toBe(align2);
      expect(typeof anchor1).toBe('string');
      expect(typeof offset1).toBe('number');
    });
  });
});
