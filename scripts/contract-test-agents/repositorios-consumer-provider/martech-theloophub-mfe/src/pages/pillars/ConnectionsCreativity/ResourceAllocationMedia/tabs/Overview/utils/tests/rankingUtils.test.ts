import {
  ResourceAllocationChart,
  VariationData,
  VariationGroup,
} from '../../types';
import {
  applyRankingConfigs,
  getRankingLegendColor,
  processVariationCaptionData,
  variationsGroupToVariationValueData,
} from '../rankingUtils';

jest.mock('utils/getColor', () => ({
  getVariationColor: jest.fn((direction: string) => `color-${direction}`),
}));

describe('rankingUtils', () => {
  describe('applyRankingConfigs', () => {
    it('does not modify content without total_per_year_full', () => {
      const content = {} as ResourceAllocationChart;
      applyRankingConfigs(content);
      expect(content).toEqual({});
    });

    it.each([
      { datasets: undefined, desc: 'undefined datasets' },
      { datasets: [], desc: 'empty datasets' },
    ])('applies default background color when $desc', ({ datasets }) => {
      const content: ResourceAllocationChart = {
        total_per_year_full: {
          labels: ['Label1'],
          datasets: datasets as any,
        },
      } as ResourceAllocationChart;

      applyRankingConfigs(content);

      expect(content.total_per_year_full.backgroundColor).toEqual(['#F0D59E']);
    });

    it.each([
      {
        legend: ['Country A', 'Country B', 'Country C'],
        expected: ['#F0D59E', '#F0D59E', '#F0D59E'],
        desc: 'default color without "Others"',
      },
      {
        legend: ['Country A', 'Country B', 'Others (5)'],
        expected: ['#F0D59E', '#F0D59E', '#BADBF5'],
        desc: '"others" color for "Others" legend',
      },
      {
        legend: ['Country A', 'Others', 'Country C', 'Others Region'],
        expected: ['#F0D59E', '#BADBF5', '#F0D59E', '#BADBF5'],
        desc: 'mixed labels with and without "Others"',
      },
      {
        legend: [],
        expected: [],
        desc: 'empty labels array',
      },
    ])('applies $desc', ({ legend, expected }) => {
      const content = {
        total_per_year_full: {
          labels: legend.map((_, i) => `Label${i + 1}`),
          datasets: [
            {
              data: legend.map((_, i) => (i + 1) * 100),
              legend,
            },
          ],
        },
      } as ResourceAllocationChart;

      applyRankingConfigs(content);

      expect(content.total_per_year_full.backgroundColor).toEqual(expected);
    });

    it('handles undefined legend in dataset', () => {
      const content = {
        total_per_year_full: {
          labels: ['Label1', 'Label2'],
          datasets: [{ data: [100, 200] }],
        },
      } as ResourceAllocationChart;

      applyRankingConfigs(content);

      expect(content.total_per_year_full.backgroundColor).toEqual([
        '#F0D59E',
        '#F0D59E',
      ]);
    });
  });

  describe('getRankingLegendColor', () => {
    it.each([
      { legend: 'AC YTD', color: '#F0D59E', type: 'AC YTD' },
      { legend: 'Value AC YTD 2024', color: '#F0D59E', type: 'AC YTD' },
      { legend: 'BU YTD', color: '#EBC04E', type: 'BU YTD' },
      { legend: 'Value BU YTD 2024', color: '#EBC04E', type: 'BU YTD' },
      { legend: 'AC/LE YTD', color: '#D1A33C', type: 'AC/LE YTD' },
      { legend: 'Value AC/LE YTD 2024', color: '#D1A33C', type: 'AC/LE YTD' },
      { legend: 'Others', color: '#BADBF5', type: 'Others' },
      { legend: 'Others (10)', color: '#BADBF5', type: 'Others' },
    ])('returns $color for "$legend" ($type)', ({ legend, color }) => {
      expect(getRankingLegendColor(legend)).toBe(color);
    });

    it.each([
      ['Unknown'],
      [''],
      ['Some Random Text'],
      ['ac ytd'],
      ['bu ytd'],
      ['others'],
    ])('returns default color for unknown/lowercase: "%s"', (legend) => {
      expect(getRankingLegendColor(legend)).toBe('#F0D59E');
    });
  });

  describe('variationsGroupToVariationValueData', () => {
    it('maps variation group to variation value data', () => {
      const variationsGroup: VariationGroup[] = [
        { variation: '10.5', unitMeasure: '%', direction: 'up' },
        { variation: '-5.2', unitMeasure: 'pts', direction: 'down' },
      ];

      const result = variationsGroupToVariationValueData(variationsGroup);

      expect(result).toEqual([
        { value: '10.5', unit_of_measure: '%', color: 'color-up' },
        { value: '-5.2', unit_of_measure: 'pts', color: 'color-down' },
      ]);
    });

    it('handles missing unitMeasure with empty string', () => {
      const variationsGroup: VariationGroup[] = [
        { variation: '10.5', direction: 'up' },
      ];

      const result = variationsGroupToVariationValueData(variationsGroup);

      expect(result).toEqual([
        { value: '10.5', unit_of_measure: '', color: 'color-up' },
      ]);
    });

    it('handles missing direction with empty color', () => {
      const variationsGroup: VariationGroup[] = [
        { variation: '10.5', unitMeasure: '%' },
      ];

      const result = variationsGroupToVariationValueData(variationsGroup);

      expect(result).toEqual([
        { value: '10.5', unit_of_measure: '%', color: '' },
      ]);
    });

    it('handles empty array', () => {
      const result = variationsGroupToVariationValueData([]);
      expect(result).toEqual([]);
    });
  });

  describe('processVariationCaptionData', () => {
    it('processes variation caption data', () => {
      const value: VariationData[] = [
        {
          variationsGroup: [
            { variation: '10.5', unitMeasure: '%', direction: 'up' },
            { variation: '-5.2', unitMeasure: 'pts', direction: 'down' },
          ],
        },
        {
          variationsGroup: [
            { variation: '3.1', unitMeasure: '%', direction: '' },
          ],
        },
      ];

      const result = processVariationCaptionData(value);

      expect(result).toEqual([
        [
          { value: '10.5', unit_of_measure: '%', color: 'color-up' },
          { value: '-5.2', unit_of_measure: 'pts', color: 'color-down' },
        ],
        [{ value: '3.1', unit_of_measure: '%', color: '' }],
      ]);
    });

    it('handles non-array variationsGroup', () => {
      const value: VariationData[] = [
        { variationsGroup: null as any },
        { variationsGroup: {} as any },
      ];

      const result = processVariationCaptionData(value);

      expect(result).toEqual([[], []]);
    });

    it('handles null value', () => {
      const result = processVariationCaptionData(null as any);
      expect(result).toEqual([]);
    });

    it('handles undefined value', () => {
      const result = processVariationCaptionData(undefined as any);
      expect(result).toEqual([]);
    });

    it('handles empty array', () => {
      const result = processVariationCaptionData([]);
      expect(result).toEqual([]);
    });
  });
});
