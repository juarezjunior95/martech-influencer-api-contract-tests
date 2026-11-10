import { ResourceAllocationChart, ResourceAllocationData } from '../../types';
import { applyChartsConfigs, getChartLegends } from '../chartsUtils';

describe('chartsUtils', () => {
  describe('applyChartsConfigs', () => {
    it.each([
      ['undefined', undefined],
      ['null', null],
      ['empty object', {}],
    ])('handles %s content gracefully', (_, content) => {
      expect(() =>
        applyChartsConfigs(content as unknown as ResourceAllocationChart),
      ).not.toThrow();
    });

    it.each([
      {
        labels: ['2023', '2024', '2025'],
        expected: ['#F0D59E', '#EDCD20', '#D1A33C'],
        desc: '3 labels',
      },
      {
        labels: ['2023', '2024'],
        expected: ['#F0D59E', '#D1A33C'],
        desc: '2 labels',
      },
      {
        labels: ['2023'],
        expected: ['#F0D59E'],
        desc: '1 label',
      },
      {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        expected: ['#F0D59E', '#F0D59E', '#F0D59E', '#F0D59E', '#F0D59E'],
        desc: 'more than 3 labels',
      },
      {
        labels: [],
        expected: [],
        desc: 'empty labels',
      },
    ])('applies background colors for $desc', ({ labels, expected }) => {
      const content: ResourceAllocationChart = {
        total_per_year_full: {
          labels,
          datasets: [{ data: labels.map((_, i) => (i + 1) * 100) }],
        },
      } as unknown as ResourceAllocationChart;

      applyChartsConfigs(content);

      expect(content.total_per_year_full.backgroundColor).toEqual(expected);
    });

    it('applies striped pattern only for 3 labels', () => {
      const content: ResourceAllocationChart = {
        total_per_year_full: {
          labels: ['2023', '2024', '2025'],
          datasets: [{ data: [100, 200, 300] }],
        },
      } as unknown as ResourceAllocationChart;

      applyChartsConfigs(content);

      expect(content.total_per_year_full.datasets[0].pattern).toEqual({
        type: 'striped',
        flags: [1],
        params: {
          color: 'white',
          angle: 45,
          thickness: 3,
          spacing: 12,
        },
      });
    });

    it.each([
      { labels: ['2023', '2024'], desc: '2 labels' },
      { labels: ['2023'], desc: '1 label' },
      { labels: [], desc: 'empty labels' },
    ])('sets pattern to null for $desc', ({ labels }) => {
      const content: ResourceAllocationChart = {
        total_per_year_full: {
          labels,
          datasets: [{ data: labels.map((_, i) => (i + 1) * 100) }],
        },
      } as unknown as ResourceAllocationChart;

      applyChartsConfigs(content);

      expect(content.total_per_year_full.datasets[0].pattern).toBeNull();
    });
  });

  describe('getChartLegends', () => {
    it.each([
      ['undefined', undefined],
      ['null', null],
      ['empty object', {}],
    ])('returns empty array when data is %s', (_, data) => {
      const result = getChartLegends(data as unknown as ResourceAllocationData);
      expect(result).toEqual([]);
    });

    it('returns chart_legends from first item with total_per_year_full', () => {
      const mockLegends = ['Legend 1', 'Legend 2'];
      const data: ResourceAllocationData = {
        mediaSpend: {
          total_per_year_full: {
            labels: ['2023'],
            datasets: [],
            chart_legends: mockLegends,
          },
        },
      } as unknown as ResourceAllocationData;

      const result = getChartLegends(data);
      expect(result).toEqual(mockLegends);
    });

    it.each([
      {
        desc: 'no item has chart_legends',
        data: {
          mediaSpend: {
            total_per_year_full: {
              labels: ['2023'],
              datasets: [],
            },
          },
        },
      },
      {
        desc: 'item has no total_per_year_full',
        data: {
          mediaSpend: {
            other_key: {
              labels: ['2023'],
            },
          },
        },
      },
    ])('returns empty array when $desc', ({ data }) => {
      const result = getChartLegends(data as unknown as ResourceAllocationData);
      expect(result).toEqual([]);
    });

    it('returns legends from first item when multiple items exist', () => {
      const firstLegends = ['First Legend'];
      const secondLegends = ['Second Legend'];
      const data: ResourceAllocationData = {
        first: {
          total_per_year_full: {
            labels: ['2023'],
            datasets: [],
            chart_legends: firstLegends,
          },
        },
        second: {
          total_per_year_full: {
            labels: ['2024'],
            datasets: [],
            chart_legends: secondLegends,
          },
        },
      } as unknown as ResourceAllocationData;

      const result = getChartLegends(data);
      expect(result).toEqual(firstLegends);
    });
  });
});
