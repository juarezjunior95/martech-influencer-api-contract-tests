import { BrandPowerData } from 'pages/pillars/PortfolioBrand/BrandAnalysis/types';

import { applyCompetitorConfigs } from './applyConfigs';

describe('applyCompetitorConfigs', () => {
  describe('null or undefined handling', () => {
    it('should return null when content is null', () => {
      const result = applyCompetitorConfigs(null, '2024');

      expect(result).toBeNull();
    });

    it('should return undefined when content is undefined', () => {
      const result = applyCompetitorConfigs(undefined, '2024');

      expect(result).toBeUndefined();
    });
  });

  describe('year processing', () => {
    it('should extract last 2 digits from year', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 2024', 'Q2 2024'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10, 20],
              type: 'line',
            },
          ],
          type: 'line',
        },
        yearly: undefined,
        ytd: undefined,
      };

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[0].backgroundColor).toContain(
        'rgba(209, 163, 60, 1)',
      );
    });

    it('should handle year with more than 4 digits', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 20245'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '20245');

      expect(result.quarterly.datasets[0].backgroundColor).toBeDefined();
    });
  });

  describe('backgroundColor assignment', () => {
    it('should apply gold color for first dataset when year matches', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 24'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[0].backgroundColor).toEqual([
        'rgba(209, 163, 60, 1)',
      ]);
    });

    it('should apply light gold color for first dataset when year does not match', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 23'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[0].backgroundColor).toEqual([
        'rgba(232, 209, 157, 1)',
      ]);
    });

    it('should apply dark gray color for second dataset when year matches', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 24'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10],
            },
            {
              label: 'Dataset 2',
              data: [20],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[1].backgroundColor).toEqual([
        'rgba(123, 145, 157, 1)',
      ]);
    });

    it('should apply light gray color for second dataset when year does not match', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 23'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10],
            },
            {
              label: 'Dataset 2',
              data: [20],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[1].backgroundColor).toEqual([
        'rgba(160, 174, 183, 1)',
      ]);
    });
  });

  describe('multiple labels', () => {
    it('should apply correct colors for mixed years', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 23', 'Q2 24', 'Q3 24'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10, 20, 30],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[0].backgroundColor).toEqual([
        'rgba(232, 209, 157, 1)', // Q1 23 - light gold
        'rgba(209, 163, 60, 1)', // Q2 24 - gold
        'rgba(209, 163, 60, 1)', // Q3 24 - gold
      ]);
    });

    it('should handle multiple datasets with mixed years', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 23', 'Q2 24'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10, 20],
            },
            {
              label: 'Dataset 2',
              data: [30, 40],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[0].backgroundColor).toEqual([
        'rgba(232, 209, 157, 1)',
        'rgba(209, 163, 60, 1)',
      ]);
      expect(result.quarterly.datasets[1].backgroundColor).toEqual([
        'rgba(160, 174, 183, 1)',
        'rgba(123, 145, 157, 1)',
      ]);
    });
  });

  describe('paddingTop property', () => {
    it('should set paddingTop to 20 for each data key', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 24'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.paddingTop).toBe(20);
    });

    it('should set paddingTop for multiple data keys', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 24'],
          datasets: [{ label: 'Dataset 1', data: [10] }],
        },
        yearly: {
          labels: ['2024'],
          datasets: [{ label: 'Dataset 2', data: [100] }],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.paddingTop).toBe(20);
      expect(result.yearly.paddingTop).toBe(20);
    });
  });

  describe('edge cases', () => {
    it('should handle empty datasets array', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 24'],
          datasets: [],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets).toHaveLength(0);
    });

    it('should handle empty labels array', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: [],
          datasets: [
            {
              label: 'Dataset 1',
              data: [],
            },
          ],
        },
      } as any;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[0].backgroundColor).toHaveLength(0);
    });

    it('should handle missing datasets property', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1 24'],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.paddingTop).toBe(20);
    });

    it('should handle label without year', () => {
      const content: BrandPowerData = {
        quarterly: {
          labels: ['Q1'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10],
            },
          ],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.quarterly.datasets[0].backgroundColor).toEqual([
        'rgba(232, 209, 157, 1)',
      ]);
    });

    it('should skip null data values', () => {
      const content: BrandPowerData = {
        quarterly: null,
        yearly: {
          labels: ['2024'],
          datasets: [{ label: 'Dataset', data: [100] }],
        },
      } as BrandPowerData;

      const result = applyCompetitorConfigs(content, '2024');

      expect(result.yearly.paddingTop).toBe(20);
      expect(result.quarterly).toBeNull();
    });
  });
});
