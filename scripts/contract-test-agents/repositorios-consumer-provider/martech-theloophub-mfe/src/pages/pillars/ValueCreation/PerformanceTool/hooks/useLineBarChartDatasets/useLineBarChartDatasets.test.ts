import { renderHook } from '@testing-library/react-hooks';

import { useLineBarChartDatasets } from './useLineBarChartDatasets';

jest.mock(
  'pages/pillars/ValueCreation/PerformanceTool/utils/getBarChartOptions',
  () => ({
    getBarChartOptionsFromDatasets: jest.fn(() => ({ mocked: true })),
  }),
);

const BASE_DATA = {
  legend: [{ label: 'Last Year' }, { label: 'Budget' }, { label: 'Current' }],
  lineChart: {
    suggestedMin: 100,
    suggestedMax: 500,
    labels: ['JAN', 'FEB', 'MAR'],
    datasets: [
      {
        label: 'Last Year',
        data: [1, 2, 3],
        borderColor: '',
        pointBackgroundColor: '',
      },
      {
        label: 'Budget',
        data: [4, 5, 6],
        borderColor: '#F1D715',
        pointBackgroundColor: '#F1D715',
      },
    ],
    highlightedIndexes: [0, 2],
    formattedData: [['1', '2', '3']],
  },
  barChart: {
    labels: ["YTD'25", "BU'26", "YTD'26"],
    datasets: [{ label: 'Volume', data: [100, 200, 300] }],
    stripedIndexes: [1],
    formattedData: [['100', '200', '300']],
  },
} as any;

describe('useLineBarChartDatasets', () => {
  describe('with undefined data', () => {
    it('returns empty arrays and mocked barOptions', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(undefined));
      expect(result.current.legendItems).toEqual([]);
      expect(result.current.lineDatasets).toEqual([]);
      expect(result.current.barDatasets).toEqual([]);
      expect(result.current.highlightedIndexes).toEqual([]);
      expect(result.current.barOptions).toEqual({ mocked: true });
    });
  });

  describe('legendItems', () => {
    it('returns empty array when legend is missing', () => {
      const { result } = renderHook(() =>
        useLineBarChartDatasets({ ...BASE_DATA, legend: undefined }),
      );
      expect(result.current.legendItems).toEqual([]);
    });

    it('maps legend labels to ChartLegendItems with correct colors', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      const items = result.current.legendItems;

      expect(items).toHaveLength(3);
      expect(items[0]).toMatchObject({
        label: 'Last Year',
        color: '#eddab1',
        shape: 'rectangle',
        size: 'small',
        decoration: 'none',
      });
      expect(items[1]).toMatchObject({
        label: 'Budget',
        color: '#f1d715',
        decoration: 'dash',
      });
      expect(items[2]).toMatchObject({
        label: 'Current',
        color: '#d1a33c',
        decoration: 'none',
      });
    });
  });

  describe('lineDatasets', () => {
    it('returns empty array when lineChart datasets is missing', () => {
      const { result } = renderHook(() =>
        useLineBarChartDatasets({ ...BASE_DATA, lineChart: undefined }),
      );
      expect(result.current.lineDatasets).toEqual([]);
    });

    it('preserves existing borderColor and pointBackgroundColor', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      const budgetDataset = result.current.lineDatasets[1];

      expect(budgetDataset.borderColor).toBe('#F1D715');
      expect(budgetDataset.pointBackgroundColor).toBe('#F1D715');
    });

    it('falls back to getColor when borderColor and pointBackgroundColor are empty strings', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      const lastYearDataset = result.current.lineDatasets[0];

      expect(lastYearDataset.borderColor).toBe('#eddab1');
      expect(lastYearDataset.pointBackgroundColor).toBe('#eddab1');
    });

    it('falls back to current color for unknown label', () => {
      const data = {
        ...BASE_DATA,
        lineChart: {
          ...BASE_DATA.lineChart,
          datasets: [
            {
              label: 'Unknown',
              data: [1],
              borderColor: undefined,
              pointBackgroundColor: undefined,
            },
          ],
        },
      };
      const { result } = renderHook(() => useLineBarChartDatasets(data));
      expect(result.current.lineDatasets[0].borderColor).toBe('#d1a33c');
      expect(result.current.lineDatasets[0].pointBackgroundColor).toBe(
        '#d1a33c',
      );
    });
  });

  describe('barDatasets', () => {
    it('returns empty array when barChart datasets is missing', () => {
      const { result } = renderHook(() =>
        useLineBarChartDatasets({ ...BASE_DATA, barChart: undefined }),
      );
      expect(result.current.barDatasets).toEqual([]);
    });

    it('assigns lastYear color to regular indexes', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      const colors = result.current.barDatasets[0].backgroundColor as string[];

      expect(colors[0]).toBe('#eddab1');
    });

    it('assigns budget color to stripedIndexes', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      const colors = result.current.barDatasets[0].backgroundColor as string[];

      expect(colors[1]).toBe('#f1d715');
    });

    it('assigns current color to the last index', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      const colors = result.current.barDatasets[0].backgroundColor as string[];

      expect(colors[2]).toBe('#d1a33c');
    });

    it('uses empty arrays when labels and stripedIndexes are absent', () => {
      const data = {
        ...BASE_DATA,
        barChart: {
          datasets: [{ label: 'Volume', data: [100] }],
        },
      };
      const { result } = renderHook(() => useLineBarChartDatasets(data));
      expect(result.current.barDatasets[0].backgroundColor).toEqual([]);
    });
  });

  describe('highlightedIndexes', () => {
    it('returns highlightedIndexes from lineChart', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      expect(result.current.highlightedIndexes).toEqual([0, 2]);
    });

    it('returns empty array when highlightedIndexes is undefined', () => {
      const data = {
        ...BASE_DATA,
        lineChart: { ...BASE_DATA.lineChart, highlightedIndexes: undefined },
      };
      const { result } = renderHook(() => useLineBarChartDatasets(data));
      expect(result.current.highlightedIndexes).toEqual([]);
    });
  });

  describe('barOptions', () => {
    it('returns the result of getBarChartOptionsFromDatasets', () => {
      const { result } = renderHook(() => useLineBarChartDatasets(BASE_DATA));
      expect(result.current.barOptions).toEqual({ mocked: true });
    });
  });
});
