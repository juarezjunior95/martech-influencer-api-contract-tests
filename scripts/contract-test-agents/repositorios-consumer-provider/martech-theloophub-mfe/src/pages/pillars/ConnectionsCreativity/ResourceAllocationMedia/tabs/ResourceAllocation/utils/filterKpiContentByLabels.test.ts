import { KpiContent } from '../types';
import { filterKpiContentByLabels } from './filterKpiContentByLabels';

const mockContent: KpiContent = {
  labels: ['ZAF', 'CHN', 'BRA'],
  datasets: [
    {
      label: 'media',
      data: [28.5, 31.8],
      formattedData: ['28.5%', '31.8%'],
      directions: ['', 'up'],
    },
    {
      label: 'media',
      data: [40.8, 40.5],
      formattedData: ['40.8%', '40.5%'],
      directions: ['up', 'down'],
    },
    { label: 'media', data: [37.9, 32.8] },
  ],
  total_allocation: {
    unit: '$',
    value: [
      ['$20.6', '$20.4'],
      ['$43.8', '$40.8'],
      ['$117.2', '$113.9'],
    ],
  },
  caption_country_flag: {
    ZAF: { flag: 'zaf.png', label: 'ZAF' },
    CHN: { flag: 'chn.png', label: 'CHN' },
    BRA: { flag: 'bra.png', label: 'BRA' },
  },
};

describe('filterKpiContentByLabels', () => {
  describe('when selectedLabels is null', () => {
    it('returns the original content object unchanged (referential equality)', () => {
      const result = filterKpiContentByLabels(mockContent, null);
      expect(result).toBe(mockContent);
    });
  });

  describe('when selectedLabels is an empty array', () => {
    it('returns an empty KpiContent so the chart area renders nothing', () => {
      const result = filterKpiContentByLabels(mockContent, []);
      expect(result.labels).toEqual([]);
      expect(result.datasets).toEqual([]);
      expect(result.total_allocation.value).toEqual([]);
      expect(result.caption_country_flag).toEqual({});
    });

    it('preserves total_allocation.unit on the empty result', () => {
      const result = filterKpiContentByLabels(mockContent, []);
      expect(result.total_allocation.unit).toBe('$');
    });
  });

  describe('when selectedLabels contains a subset of labels', () => {
    it('filters labels to only the selected ones', () => {
      const result = filterKpiContentByLabels(mockContent, ['CHN', 'BRA']);
      expect(result.labels).toEqual(['CHN', 'BRA']);
    });

    it('selects whole dataset objects — preserving both BU and AC columns', () => {
      const result = filterKpiContentByLabels(mockContent, ['CHN']);
      expect(result.datasets).toHaveLength(1);
      // data[0] = BU, data[1] = AC — both must survive the filter
      expect(result.datasets[0].data).toEqual([40.8, 40.5]);
    });

    it('does not slice dataset.data when only one country is selected', () => {
      const result = filterKpiContentByLabels(mockContent, ['ZAF']);
      expect(result.datasets[0].data).toEqual([28.5, 31.8]);
    });

    it('selects the correct dataset for each matched label', () => {
      const result = filterKpiContentByLabels(mockContent, ['ZAF', 'BRA']);
      expect(result.datasets[0].data).toEqual([28.5, 31.8]); // ZAF
      expect(result.datasets[1].data).toEqual([37.9, 32.8]); // BRA
    });

    it('preserves formattedData on selected datasets', () => {
      const result = filterKpiContentByLabels(mockContent, ['CHN']);
      expect(result.datasets[0].formattedData).toEqual(['40.8%', '40.5%']);
    });

    it('preserves directions on selected datasets', () => {
      const result = filterKpiContentByLabels(mockContent, ['ZAF', 'CHN']);
      expect(result.datasets[0].directions).toEqual(['', 'up']);
      expect(result.datasets[1].directions).toEqual(['up', 'down']);
    });

    it('filters total_allocation.value by matching country indices', () => {
      const result = filterKpiContentByLabels(mockContent, ['CHN', 'BRA']);
      expect(result.total_allocation.value).toEqual([
        ['$43.8', '$40.8'],
        ['$117.2', '$113.9'],
      ]);
    });

    it('preserves total_allocation.unit', () => {
      const result = filterKpiContentByLabels(mockContent, ['CHN']);
      expect(result.total_allocation.unit).toBe('$');
    });

    it('filters caption_country_flag to matching labels only', () => {
      const result = filterKpiContentByLabels(mockContent, ['ZAF', 'BRA']);
      expect(result.caption_country_flag).toEqual({
        ZAF: { flag: 'zaf.png', label: 'ZAF' },
        BRA: { flag: 'bra.png', label: 'BRA' },
      });
    });
  });

  describe('selection order', () => {
    it('renders charts in the order of selectedLabels, not API order', () => {
      // API order: ZAF(0), CHN(1), BRA(2)
      // User selects: BRA first, then ZAF → chart must show BRA, ZAF
      const result = filterKpiContentByLabels(mockContent, ['BRA', 'ZAF']);
      expect(result.labels).toEqual(['BRA', 'ZAF']);
      expect(result.datasets[0].data).toEqual([37.9, 32.8]); // BRA
      expect(result.datasets[1].data).toEqual([28.5, 31.8]); // ZAF
    });

    it('respects selection order for total_allocation.value', () => {
      const result = filterKpiContentByLabels(mockContent, ['BRA', 'ZAF']);
      expect(result.total_allocation.value).toEqual([
        ['$117.2', '$113.9'], // BRA
        ['$20.6', '$20.4'], // ZAF
      ]);
    });

    it('respects selection order for caption_country_flag entries', () => {
      const result = filterKpiContentByLabels(mockContent, ['CHN', 'ZAF']);
      const keys = Object.keys(result.caption_country_flag);
      expect(keys).toEqual(['CHN', 'ZAF']);
    });

    it('matches chip order: KOR selected first, CHN second', () => {
      const contentWithKorChn: KpiContent = {
        labels: ['ZAF', 'CHN', 'KOR', 'BRA'],
        datasets: [
          { label: 'media', data: [28.5, 31.8] },
          { label: 'media', data: [40.8, 40.5] },
          { label: 'media', data: [32.5, 22.2] },
          { label: 'media', data: [37.9, 32.8] },
        ],
        total_allocation: { value: [['$20'], ['$43'], ['$10'], ['$117']] },
        caption_country_flag: {
          ZAF: { flag: 'zaf.png', label: 'ZAF' },
          CHN: { flag: 'chn.png', label: 'CHN' },
          KOR: { flag: 'kor.png', label: 'KOR' },
          BRA: { flag: 'bra.png', label: 'BRA' },
        },
      };

      const result = filterKpiContentByLabels(contentWithKorChn, [
        'KOR',
        'CHN',
      ]);
      expect(result.labels).toEqual(['KOR', 'CHN']);
      expect(result.datasets[0].data).toEqual([32.5, 22.2]); // KOR first
      expect(result.datasets[1].data).toEqual([40.8, 40.5]); // CHN second
    });
  });

  describe('when selectedLabels contains all labels', () => {
    it('returns all labels', () => {
      const result = filterKpiContentByLabels(mockContent, [
        'ZAF',
        'CHN',
        'BRA',
      ]);
      expect(result.labels).toEqual(['ZAF', 'CHN', 'BRA']);
    });

    it('returns all datasets with data intact', () => {
      const result = filterKpiContentByLabels(mockContent, [
        'ZAF',
        'CHN',
        'BRA',
      ]);
      expect(result.datasets).toHaveLength(3);
      expect(result.datasets[0].data).toEqual([28.5, 31.8]);
      expect(result.datasets[1].data).toEqual([40.8, 40.5]);
      expect(result.datasets[2].data).toEqual([37.9, 32.8]);
    });
  });

  describe('when selectedLabels contains a label not in content', () => {
    it('ignores unknown labels and keeps only valid matches', () => {
      const result = filterKpiContentByLabels(mockContent, ['CHN', 'USA']);
      expect(result.labels).toEqual(['CHN']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).toEqual([40.8, 40.5]);
    });
  });

  describe('when a dataset has no formattedData or directions', () => {
    it('returns the dataset without those optional keys', () => {
      const result = filterKpiContentByLabels(mockContent, ['BRA']);
      expect('formattedData' in result.datasets[0]).toBe(false);
      expect('directions' in result.datasets[0]).toBe(false);
    });
  });
});
