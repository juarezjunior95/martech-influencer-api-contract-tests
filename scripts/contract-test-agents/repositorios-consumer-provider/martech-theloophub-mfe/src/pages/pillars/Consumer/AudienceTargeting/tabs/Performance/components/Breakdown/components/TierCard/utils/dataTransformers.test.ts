import { IntlShape } from 'react-intl';

import { AudienceMetrics, BreakdownTier, TierAudiences } from '../../../types';
import {
  buildChartData,
  buildIndexData,
  buildIndexValues,
  buildYoYData,
  buildYoYValues,
  formatIndex,
  formatYoY,
  getIndexBadgeColor,
  getSuggestedMax,
  getYoYColor,
  getYoYTrend,
} from './dataTransformers';

jest.mock('theme', () => ({
  theme: { colors: { txt: { default: '#141414', secondary: '#67665F' } } },
}));

jest.mock('theme/colors/specificProperty', () => ({
  specificProperty: { successText: '#007800', errorText: '#BA0B0B' },
}));

jest.mock('../../../constants', () => ({
  CHART_CONFIG: { suggestedMaxPadding: 10 },
  NOT_APPLICABLE: 'N/A',
  EMPTY_DASH: '-',
  DEFAULT_SUGGESTED_MAX: 50,
  NEAR_ZERO_EPSILON: 1e-10,
  PERFORMANCE_INDEX_LOWER_BOUND: 95,
  PERFORMANCE_INDEX_UPPER_BOUND: 105,
  TIER_CHART_LABELS: { core: 'Core', halo: 'Halo', total: 'Total' },
  TIER_BAR_COLORS: {
    beer: '#e5b611',
    core_co: '#81b1d6',
    brand: '#42b88c',
    competitor: '#9399cc',
  },
}));

const mockFormatMessage: IntlShape['formatMessage'] = jest
  .fn()
  .mockImplementation(({ id }: { id: string }) => {
    const messages: Record<string, string> = {
      'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.title':
        'Comparison Index',
      'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.tooltip.title':
        'Comparison Index',
      'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.tooltip.text':
        'Compares the audience’s metric to the selected baseline (Category, Total Brand or Competitor).',
    };
    return messages[id] ?? id;
  }) as unknown as IntlShape['formatMessage'];

const buildAudiences = (
  overrides: Partial<TierAudiences> = {},
): TierAudiences => ({
  core: {
    value: '31.2',
    yoy_change: '0.2',
    yoy_direction: 'up',
    comparison_index: '111.0',
    performance_index: '111.0',
  },
  halo: {
    value: '29.5',
    yoy_change: '0.4',
    yoy_direction: 'up',
    comparison_index: '105.0',
    performance_index: '105.0',
  },
  total: {
    value: '28.0',
    yoy_change: '0.5',
    yoy_direction: 'up',
    comparison_index: null,
    performance_index: null,
  },
  ...overrides,
});

describe('formatYoY', () => {
  test('should return N/A when metrics is null', () => {
    expect(formatYoY(null)).toBe('N/A');
  });

  test('should return N/A when yoy_change is null', () => {
    const metrics: AudienceMetrics = {
      value: '31.2',
      yoy_change: null,
      yoy_direction: null,
      comparison_index: '111.0',
      performance_index: '111.0',
    };
    expect(formatYoY(metrics)).toBe('N/A');
  });

  test('should format positive yoy_change with pp suffix', () => {
    const metrics: AudienceMetrics = {
      value: '31.2',
      yoy_change: '0.2',
      yoy_direction: 'up',
      comparison_index: '111.0',
      performance_index: '111.0',
    };
    expect(formatYoY(metrics)).toBe('0.2pp');
  });

  test('should format negative yoy_change with pp suffix', () => {
    const metrics: AudienceMetrics = {
      value: '25.9',
      yoy_change: '-0.2',
      yoy_direction: 'down',
      comparison_index: '93.0',
      performance_index: '93.0',
    };
    expect(formatYoY(metrics)).toBe('-0.2pp');
  });

  test('should format zero yoy_change with pp suffix', () => {
    const metrics: AudienceMetrics = {
      value: '29.8',
      yoy_change: '0.0',
      yoy_direction: 'neutral',
      comparison_index: '100.0',
      performance_index: '100.0',
    };
    expect(formatYoY(metrics)).toBe('0.0pp');
  });
});

describe('getYoYTrend', () => {
  test('should return positive for up', () => {
    expect(getYoYTrend('up')).toBe('positive');
  });

  test('should return negative for down', () => {
    expect(getYoYTrend('down')).toBe('negative');
  });

  test('should return undefined for neutral', () => {
    expect(getYoYTrend('neutral')).toBeUndefined();
  });

  test('should return undefined for null', () => {
    expect(getYoYTrend(null)).toBeUndefined();
  });
});

describe('getYoYColor', () => {
  test('should return success color for up', () => {
    expect(getYoYColor('up')).toBe('#007800');
  });

  test('should return error color for down', () => {
    expect(getYoYColor('down')).toBe('#BA0B0B');
  });

  test('should return secondary color for neutral', () => {
    expect(getYoYColor('neutral')).toBe('#67665F');
  });

  test('should return secondary color for null', () => {
    expect(getYoYColor(null)).toBe('#67665F');
  });
});

describe('getIndexBadgeColor', () => {
  test('should return neutral for null', () => {
    expect(getIndexBadgeColor(null)).toBe('neutral');
  });

  test('should return negative for values below 95', () => {
    expect(getIndexBadgeColor('90.0')).toBe('negative');
    expect(getIndexBadgeColor('94.0')).toBe('negative');
  });

  test('should return positive for values above 105', () => {
    expect(getIndexBadgeColor('106.0')).toBe('positive');
    expect(getIndexBadgeColor('120.0')).toBe('positive');
  });

  test('should return neutral for values between 95 and 105 inclusive', () => {
    expect(getIndexBadgeColor('95.0')).toBe('neutral');
    expect(getIndexBadgeColor('100.0')).toBe('neutral');
    expect(getIndexBadgeColor('105.0')).toBe('neutral');
  });

  test('should return neutral for N/A and invalid values', () => {
    expect(getIndexBadgeColor('N/A')).toBe('neutral');
    expect(getIndexBadgeColor('invalid')).toBe('neutral');
  });
});

describe('formatIndex', () => {
  test('should return dash for null', () => {
    expect(formatIndex(null)).toBe('-');
  });

  test('should return dash for undefined', () => {
    expect(formatIndex(undefined)).toBe('-');
  });

  test('should return one-decimal formatted strings for numeric values', () => {
    expect(formatIndex('111.0')).toBe('111.0');
    expect(formatIndex('111')).toBe('111.0');
    expect(formatIndex('0.0')).toBe('0.0');
  });

  test('should return dash for non-numeric values', () => {
    expect(formatIndex('N/A')).toBe('-');
    expect(formatIndex('invalid')).toBe('-');
  });
});

describe('buildYoYValues', () => {
  test('should return core and total values when showHalo is false', () => {
    const result = buildYoYValues(buildAudiences(), false);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('0.2pp');
    expect(result[1].value).toBe('0.5pp');
  });

  test('should return core, halo and total values when showHalo is true', () => {
    const result = buildYoYValues(buildAudiences(), true);
    expect(result).toHaveLength(3);
    expect(result[0].value).toBe('0.2pp');
    expect(result[1].value).toBe('0.4pp');
    expect(result[2].value).toBe('0.5pp');
  });

  test('should return N/A for halo when halo is null and showHalo is true', () => {
    const result = buildYoYValues(buildAudiences({ halo: null }), true);
    expect(result).toHaveLength(3);
    expect(result[1].value).toBe('N/A');
    expect(result[1].color).toBe('#67665F');
    expect(result[1].trend).toBeUndefined();
  });

  test('should return neutral grey for halo when yoy is zero', () => {
    const result = buildYoYValues(
      buildAudiences({
        halo: {
          value: '29.5',
          yoy_change: '0.0',
          yoy_direction: 'neutral',
          comparison_index: '105.0',
          performance_index: '105.0',
        },
      }),
      true,
    );

    expect(result).toHaveLength(3);
    expect(result[1].value).toBe('0.0pp');
    expect(result[1].color).toBe('#67665F');
    expect(result[1].trend).toBeUndefined();
  });
});

describe('buildChartData', () => {
  const baseTier: BreakdownTier = {
    tier_level: 'beer',
    tier_name: 'Beer',
    audiences: buildAudiences(),
  };

  test('should return N/A placeholder data when audiences is null (showHalo false)', () => {
    const result = buildChartData({ ...baseTier, audiences: null }, false);
    expect(result.chartData.labels).toEqual(['Core', 'Total']);
    expect(result.chartData.values).toEqual([null, null]);
    expect(result.naIndexes).toEqual([0, 1]);
  });

  test('should return N/A placeholder data when audiences is null (showHalo true)', () => {
    const result = buildChartData({ ...baseTier, audiences: null }, true);
    expect(result.chartData.labels).toEqual(['Core', 'Halo', 'Total']);
    expect(result.chartData.values).toEqual([null, null, null]);
    expect(result.naIndexes).toEqual([0, 1, 2]);
  });

  test('should return Core and Total when showHalo is false', () => {
    const result = buildChartData(baseTier, false);
    expect(result.chartData.labels).toEqual(['Core', 'Total']);
    expect(result.chartData.values).toEqual([31.2, 28.0]);
    expect(result.naIndexes).toEqual([]);
  });

  test('should return Core, Halo and Total when showHalo is true', () => {
    const result = buildChartData(baseTier, true);
    expect(result.chartData.labels).toEqual(['Core', 'Halo', 'Total']);
    expect(result.chartData.values).toEqual([31.2, 29.5, 28.0]);
  });

  test('should track naIndex when halo is null and showHalo is true', () => {
    const tier = { ...baseTier, audiences: buildAudiences({ halo: null }) };
    const result = buildChartData(tier, true);
    expect(result.naIndexes).toEqual([1]);
    expect(result.chartData.values).toContain(null);
  });

  test('should use brand colors as fallback for unknown tier_level', () => {
    const tier = { ...baseTier, tier_level: 'unknown' as any };
    const result = buildChartData(tier, false);
    expect(result.chartData.labels).toEqual(['Core', 'Total']);
  });

  test('should renders core as N/A when audiences.core is null', () => {
    const tier = { ...baseTier, audiences: buildAudiences({ core: null }) };
    const result = buildChartData(tier, false);
    expect(result.naIndexes).toEqual([0]);
    expect(result.chartData.values[0]).toBeNull();
    expect(result.chartData.labels).toEqual(['Core', 'Total']);
  });

  test('should renders total as N/A when audiences.total is null', () => {
    const tier = { ...baseTier, audiences: buildAudiences({ total: null }) };
    const result = buildChartData(tier, false);
    expect(result.naIndexes).toEqual([1]);
    expect(result.chartData.values[1]).toBeNull();
    expect(result.chartData.labels).toEqual(['Core', 'Total']);
  });

  test('should renders core and total as N/A when both are null', () => {
    const tier = {
      ...baseTier,
      audiences: buildAudiences({ core: null, total: null }),
    };
    const result = buildChartData(tier, false);
    expect(result.naIndexes).toEqual([0, 1]);
    expect(result.chartData.values).toEqual([null, null]);
  });

  test('should always includes Core and Total slots even when audiences.core is null (no slot skipping)', () => {
    const tier = { ...baseTier, audiences: buildAudiences({ core: null }) };
    const result = buildChartData(tier, false);
    expect(result.chartData.labels).toHaveLength(2);
    expect(result.chartData.labels[0]).toBe('Core');
    expect(result.chartData.labels[1]).toBe('Total');
  });
});

describe('getSuggestedMax', () => {
  test('should return 50 for empty values', () => {
    expect(getSuggestedMax([])).toBe(50);
  });

  test('should return default when all values are near zero', () => {
    expect(getSuggestedMax([0])).toBe(50);
    expect(getSuggestedMax([1e-11])).toBe(50);
  });

  test('should round up to nearest 10 and add padding', () => {
    expect(getSuggestedMax([31.2, 28.0])).toBe(50);
    expect(getSuggestedMax([45])).toBe(60);
  });

  describe('buildIndexValues', () => {
    test('should return core and total badge values when showHalo is false', () => {
      const result = buildIndexValues(
        buildAudiences(),
        'performance_index',
        false,
      );
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe('111.0');
      expect(result[0].variant).toBe('badge');
      expect(result[0].badgeColor).toBe('positive');
      expect(result[1].value).toBe('-');
      expect(result[1].variant).toBe('badge');
      expect(result[1].badgeColor).toBe('neutral');
    });

    test('should return core, halo and total badge values when showHalo is true', () => {
      const result = buildIndexValues(
        buildAudiences(),
        'performance_index',
        true,
      );
      expect(result).toHaveLength(3);
      expect(result[0].value).toBe('111.0');
      expect(result[0].badgeColor).toBe('positive');
      expect(result[1].value).toBe('105.0');
      expect(result[1].badgeColor).toBe('neutral');
      expect(result[2].value).toBe('-');
      expect(result[2].badgeColor).toBe('neutral');
    });

    test('should use comparison_index field', () => {
      const result = buildIndexValues(
        buildAudiences(),
        'comparison_index',
        false,
      );
      expect(result[0].value).toBe('111.0');
    });

    test('should return dash for halo when halo is null and showHalo is true', () => {
      const result = buildIndexValues(
        buildAudiences({ halo: null }),
        'performance_index',
        true,
      );
      expect(result).toHaveLength(3);
      expect(result[1].value).toBe('-');
      expect(result[1].badgeColor).toBe('neutral');
    });

    test('should correctly determine badge colors based on index values', () => {
      const audiences: TierAudiences = {
        core: {
          value: '31.2',
          yoy_change: '0.2',
          yoy_direction: 'up',
          comparison_index: '90.0',
          performance_index: '90.0',
        },
        halo: {
          value: '29.5',
          yoy_change: '0.4',
          yoy_direction: 'up',
          comparison_index: '120.0',
          performance_index: '120.0',
        },
        total: {
          value: '28.0',
          yoy_change: '0.5',
          yoy_direction: 'up',
          comparison_index: '100.0',
          performance_index: '100.0',
        },
      };

      const result = buildIndexValues(audiences, 'performance_index', true);
      expect(result[0].badgeColor).toBe('negative');
      expect(result[1].badgeColor).toBe('positive');
      expect(result[2].badgeColor).toBe('neutral');
    });

    test('should all values have variant badge', () => {
      const result = buildIndexValues(
        buildAudiences(),
        'performance_index',
        true,
      );
      result.forEach((value) => {
        expect(value.variant).toBe('badge');
      });
    });
  });

  describe('buildYoYData', () => {
    test('should return array with single comparison line object', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result).toHaveLength(1);
    });

    test('should have correct title', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].title).toBe('vs LY');
    });

    test('should have data property with comparison values', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].data).toBeDefined();
      expect(Array.isArray(result[0].data)).toBe(true);
    });

    test('should return core and total values when showHalo is false', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].data).toHaveLength(2);
      expect(result[0].data[0].value).toBe('0.2pp');
      expect(result[0].data[1].value).toBe('0.5pp');
    });

    test('should return core, halo and total values when showHalo is true', () => {
      const result = buildYoYData(buildAudiences(), true);
      expect(result[0].data).toHaveLength(3);
      expect(result[0].data[0].value).toBe('0.2pp');
      expect(result[0].data[1].value).toBe('0.4pp');
      expect(result[0].data[2].value).toBe('0.5pp');
    });

    test('should not have tooltip property', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].tooltip).toBeUndefined();
    });
  });

  describe('buildIndexData', () => {
    test('should return array with one comparison line object', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result).toHaveLength(1);
    });

    test('should have Comparison Index title', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].title).toBe('Comparison Index');
    });

    test('should have tooltip for Comparison Index', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].tooltip).toBeDefined();
      expect(result[0].tooltip?.title).toBe('Comparison Index');
      expect(result[0].tooltip?.text).toContain('baseline');
    });

    test('should have data property with badge values when showHalo is false', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].data).toBeDefined();
      expect(Array.isArray(result[0].data)).toBe(true);
      expect(result[0].data).toHaveLength(2);
      result[0].data.forEach((value) => {
        expect(value.variant).toBe('badge');
      });
    });

    test('should have data property with badge values when showHalo is true', () => {
      const result = buildIndexData(buildAudiences(), true, mockFormatMessage);
      expect(result[0].data).toHaveLength(3);
      result[0].data.forEach((value) => {
        expect(value.variant).toBe('badge');
      });
    });

    test('should use comparison_index field', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].data[0].value).toBe('111.0');
    });

    test('should call formatMessage with the comparison index i18n keys', () => {
      buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.title',
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.tooltip.text',
      });
    });
  });
});
