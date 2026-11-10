import { getChartLegend } from '../ChartsView.utils';

jest.mock('../rankingUtils', () => ({
  getRankingLegendColor: jest.fn((legend: string) => {
    if (legend.includes('AC YTD')) return '#F0D59E';
    if (legend.includes('BU YTD')) return '#EBC04E';
    if (legend.includes('AC/LE YTD')) return '#D1A33C';
    if (legend.includes('Others')) return '#BADBF5';
    return '#F0D59E';
  }),
}));

describe('ChartsView.utils', () => {
  describe('getChartLegend', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      { legend: 'AC YTD 2024', color: '#F0D59E', label: 'AC YTD' },
      { legend: 'BU YTD 2024', color: '#EBC04E', label: 'BU YTD' },
      { legend: 'AC/LE YTD 2024', color: '#D1A33C', label: 'AC/LE YTD' },
      { legend: 'Others (5)', color: '#BADBF5', label: 'Others' },
    ])('returns correct color ($color) for $label', ({ legend, color }) => {
      const result = getChartLegend(legend);

      expect(result.label).toBe(legend);
      expect(result.color).toBe(color);
      expect(result.pointStyle).toBe('lineThicker');
      expect(result.fontWeight).toBe('bold');
    });

    it('returns striped pattern for BU legends', () => {
      const result = getChartLegend('BU YTD 2024');

      expect(result.pattern).toEqual({
        type: 'striped',
        params: {
          color: 'white',
          angle: -45,
        },
      });
    });

    it.each([['AC YTD 2024'], ['Others (5)'], ['Random Legend']])(
      'returns null pattern for non-BU legend: %s',
      (legend) => {
        const result = getChartLegend(legend);
        expect(result.pattern).toBeNull();
      },
    );

    it.each([['BU'], ['Value BU 2024'], ['Test BU Test']])(
      'detects BU pattern in legend: %s',
      (legend) => {
        const result = getChartLegend(legend);
        expect(result.pattern).not.toBeNull();
      },
    );

    it.each([
      {
        legend: 'AC YTD 2024',
        expected: {
          label: 'AC YTD 2024',
          color: '#F0D59E',
          pointStyle: 'lineThicker',
          fontWeight: 'bold',
          pattern: null,
        },
        desc: 'non-BU',
      },
      {
        legend: 'BU YTD 2024',
        expected: {
          label: 'BU YTD 2024',
          color: '#EBC04E',
          pointStyle: 'lineThicker',
          fontWeight: 'bold',
          pattern: {
            type: 'striped',
            params: {
              color: 'white',
              angle: -45,
            },
          },
        },
        desc: 'BU',
      },
      {
        legend: '',
        expected: {
          label: '',
          color: '#F0D59E',
          pointStyle: 'lineThicker',
          fontWeight: 'bold',
          pattern: null,
        },
        desc: 'empty string',
      },
    ])('returns complete legend object for $desc', ({ legend, expected }) => {
      const result = getChartLegend(legend);
      expect(result).toEqual(expected);
    });
  });
});
