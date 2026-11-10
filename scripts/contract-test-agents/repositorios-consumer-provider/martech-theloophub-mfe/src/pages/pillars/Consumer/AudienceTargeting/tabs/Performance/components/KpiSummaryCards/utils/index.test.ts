import { KPI_SUMMARY_CARDS } from '../../../constants';
import { BigNumberItem } from '../types';
import {
  getKpiConfig,
  getVariationColor,
  getVariationTrend,
  transformBigNumberData,
} from './index';

describe('KpiSummaryCards Utils', () => {
  describe('getVariationColor', () => {
    it('should return green color for up variation', () => {
      const result = getVariationColor('up');

      expect(result).toBe(KPI_SUMMARY_CARDS.bigNumber.variation.up);
      expect(result).toBe('#007800');
    });

    it('should return red color for down variation', () => {
      const result = getVariationColor('down');

      expect(result).toBe(KPI_SUMMARY_CARDS.bigNumber.variation.down);
      expect(result).toBe('#BA0B0B');
    });

    it('should return gray color for neutral variation', () => {
      const result = getVariationColor('neutral');

      expect(result).toBe('#3D3D3D');
    });
  });

  describe('getVariationTrend', () => {
    it('should return positive for up variation', () => {
      const result = getVariationTrend('up');

      expect(result).toBe('positive');
    });

    it('should return negative for down variation', () => {
      const result = getVariationTrend('down');

      expect(result).toBe('negative');
    });

    it('should return negative for neutral variation', () => {
      const result = getVariationTrend('neutral');

      expect(result).toBe('negative');
    });
  });

  describe('transformBigNumberData', () => {
    const mockItems: BigNumberItem[] = [
      { id: 'core', value: '10%', measure: '%', variation: 'up' },
      { id: 'brand', value: '8%', measure: 'pp', variation: 'down' },
    ];

    it('should transform items to BigNumberData format', () => {
      const result = transformBigNumberData(mockItems);

      expect(result).toHaveLength(2);
    });

    it('should map value correctly', () => {
      const result = transformBigNumberData(mockItems);

      expect(result[0].bigNumber?.value).toBe('10%');
      expect(result[1].bigNumber?.value).toBe('8%');
    });

    it('should map measure correctly', () => {
      const result = transformBigNumberData(mockItems);

      expect(result[0].bigNumber?.measure).toBe('%');
      expect(result[1].bigNumber?.measure).toBe('pp');
    });

    it('should set correct color based on variation', () => {
      const result = transformBigNumberData(mockItems);

      expect(result[0].bigNumber?.color).toBe('#007800');
      expect(result[1].bigNumber?.color).toBe('#BA0B0B');
    });

    it('should set correct trend based on variation', () => {
      const result = transformBigNumberData(mockItems);

      expect(result[0].bigNumber?.trend).toBe('positive');
      expect(result[1].bigNumber?.trend).toBe('negative');
    });

    it('should set comparison label from KPI_SUMMARY_CARDS', () => {
      const result = transformBigNumberData(mockItems);

      expect(result[0].comparison?.label).toBe(
        KPI_SUMMARY_CARDS.comparison.core.name,
      );
      expect(result[1].comparison?.label).toBe(
        KPI_SUMMARY_CARDS.comparison.brand.name,
      );
    });

    it('should set comparison value from KPI_SUMMARY_CARDS', () => {
      const result = transformBigNumberData(mockItems);

      expect(result[0].comparison?.value).toBe(
        KPI_SUMMARY_CARDS.comparison.value,
      );
      expect(result[1].comparison?.value).toBe(
        KPI_SUMMARY_CARDS.comparison.value,
      );
    });

    it('should return empty array for empty input', () => {
      const result = transformBigNumberData([]);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle single item', () => {
      const singleItem: BigNumberItem[] = [
        { id: 'core', value: '5%', measure: '%', variation: 'neutral' },
      ];

      const result = transformBigNumberData(singleItem);

      expect(result).toHaveLength(1);
      expect(result[0].bigNumber?.value).toBe('5%');
      expect(result[0].bigNumber?.color).toBe('#3D3D3D');
      expect(result[0].bigNumber?.trend).toBe('negative');
    });

    it('should handle item with neutral variation', () => {
      const neutralItems: BigNumberItem[] = [
        { id: 'core', value: '0%', measure: '%', variation: 'neutral' },
      ];

      const result = transformBigNumberData(neutralItems);

      expect(result[0].bigNumber?.color).toBe('#3D3D3D');
      expect(result[0].bigNumber?.trend).toBe('negative');
    });
  });

  describe('getKpiConfig', () => {
    it('should return participation config', () => {
      const result = getKpiConfig('participation');

      expect(result).toEqual(KPI_SUMMARY_CARDS.kpis.participation);
      expect(result.measure).toBe('P4W %');
    });

    it('should return occasions config', () => {
      const result = getKpiConfig('occasions');

      expect(result).toEqual(KPI_SUMMARY_CARDS.kpis.occasions);
      expect(result.measure).toBe('P7W #');
    });

    it('should return brandPower config', () => {
      const result = getKpiConfig('brandPower');

      expect(result).toEqual(KPI_SUMMARY_CARDS.kpis.brandPower);
      expect(result.measure).toBe('%');
    });

    it('should return undefined for invalid kpiId', () => {
      const result = getKpiConfig('invalidKpi');

      expect(result).toBeUndefined();
    });
  });

  describe('Integration', () => {
    it('should correctly transform data using all utility functions', () => {
      const items: BigNumberItem[] = [
        { id: 'core', value: '15%', measure: '%', variation: 'up' },
        { id: 'brand', value: '-5%', measure: 'pp', variation: 'down' },
      ];

      const result = transformBigNumberData(items);

      expect(result[0]).toEqual({
        bigNumber: {
          value: '15%',
          measure: '%',
          color: '#007800',
          trend: 'positive',
        },
        comparison: {
          label: 'Core',
          value: 'vs LY',
        },
      });

      expect(result[1]).toEqual({
        bigNumber: {
          value: '-5%',
          measure: 'pp',
          color: '#BA0B0B',
          trend: 'negative',
        },
        comparison: {
          label: 'Brand',
          value: 'vs LY',
        },
      });
    });
  });
});
