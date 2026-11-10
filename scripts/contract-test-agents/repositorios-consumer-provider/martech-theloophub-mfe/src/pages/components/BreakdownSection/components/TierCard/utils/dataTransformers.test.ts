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
  theme: { colors: { txt: { default: '#141414' } } },
}));

jest.mock('theme/colors/specificProperty', () => ({
  specificProperty: { successText: '#007800', errorText: '#BA0B0B' },
}));

jest.mock('../../../constants', () => ({
  CHART_CONFIG: { suggestedMaxPadding: 10 },
  NOT_APPLICABLE: 'N/A',
  DEFAULT_SUGGESTED_MAX: 50,
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
    value: 31.2,
    yoy_change: 0.2,
    yoy_direction: 'up',
    comparison_index: 111,
    performance_index: 111,
  },
  halo: {
    value: 29.5,
    yoy_change: 0.4,
    yoy_direction: 'up',
    comparison_index: 105,
    performance_index: 105,
  },
  total: {
    value: 28.0,
    yoy_change: 0.5,
    yoy_direction: 'up',
    comparison_index: null,
    performance_index: null,
  },
  ...overrides,
});

describe('formatYoY', () => {
  it('should return N/A when metrics is null', () => {
    expect(formatYoY(null)).toBe('N/A');
  });

  it('should return N/A when yoy_change is null', () => {
    const metrics: AudienceMetrics = {
      value: 31.2,
      yoy_change: null,
      yoy_direction: null,
      comparison_index: 111,
      performance_index: 111,
    };
    expect(formatYoY(metrics)).toBe('N/A');
  });

  it('should format positive yoy_change with pp suffix', () => {
    const metrics: AudienceMetrics = {
      value: 31.2,
      yoy_change: 0.2,
      yoy_direction: 'up',
      comparison_index: 111,
      performance_index: 111,
    };
    expect(formatYoY(metrics)).toBe('0.2pp');
  });

  it('should format negative yoy_change with pp suffix', () => {
    const metrics: AudienceMetrics = {
      value: 25.9,
      yoy_change: -0.2,
      yoy_direction: 'down',
      comparison_index: 93,
      performance_index: 93,
    };
    expect(formatYoY(metrics)).toBe('-0.2pp');
  });

  it('should format zero yoy_change with pp suffix', () => {
    const metrics: AudienceMetrics = {
      value: 29.8,
      yoy_change: 0.0,
      yoy_direction: 'neutral',
      comparison_index: 100,
      performance_index: 100,
    };
    expect(formatYoY(metrics)).toBe('0pp');
  });
});

describe('getYoYTrend', () => {
  it('should return positive for up', () => {
    expect(getYoYTrend('up')).toBe('positive');
  });

  it('should return negative for down', () => {
    expect(getYoYTrend('down')).toBe('negative');
  });

  it('should return undefined for neutral', () => {
    expect(getYoYTrend('neutral')).toBeUndefined();
  });

  it('should return undefined for null', () => {
    expect(getYoYTrend(null)).toBeUndefined();
  });
});

describe('getYoYColor', () => {
  it('should return success color for up', () => {
    expect(getYoYColor('up')).toBe('#007800');
  });

  it('should return error color for down', () => {
    expect(getYoYColor('down')).toBe('#BA0B0B');
  });

  it('should return default color for neutral', () => {
    expect(getYoYColor('neutral')).toBe('#141414');
  });

  it('should return default color for null', () => {
    expect(getYoYColor(null)).toBe('#141414');
  });
});

describe('getIndexBadgeColor', () => {
  it('should return neutral for null', () => {
    expect(getIndexBadgeColor(null)).toBe('neutral');
  });

  it('should return negative for values below 95', () => {
    expect(getIndexBadgeColor(90)).toBe('negative');
    expect(getIndexBadgeColor(94)).toBe('negative');
  });

  it('should return positive for values above 105', () => {
    expect(getIndexBadgeColor(106)).toBe('positive');
    expect(getIndexBadgeColor(120)).toBe('positive');
  });

  it('should return neutral for values between 95 and 105 inclusive', () => {
    expect(getIndexBadgeColor(95)).toBe('neutral');
    expect(getIndexBadgeColor(100)).toBe('neutral');
    expect(getIndexBadgeColor(105)).toBe('neutral');
  });
});

describe('formatIndex', () => {
  it('should return N/A for null', () => {
    expect(formatIndex(null)).toBe('N/A');
  });

  it('should return string representation of number', () => {
    expect(formatIndex(111)).toBe('111');
    expect(formatIndex(0)).toBe('0');
  });
});

describe('buildYoYValues', () => {
  it('should return core and total values when showHalo is false', () => {
    const result = buildYoYValues(buildAudiences(), false);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('0.2pp');
    expect(result[1].value).toBe('0.5pp');
  });

  it('should return core, halo and total values when showHalo is true', () => {
    const result = buildYoYValues(buildAudiences(), true);
    expect(result).toHaveLength(3);
    expect(result[0].value).toBe('0.2pp');
    expect(result[1].value).toBe('0.4pp');
    expect(result[2].value).toBe('0.5pp');
  });

  it('should return N/A for halo when halo is null and showHalo is true', () => {
    const result = buildYoYValues(buildAudiences({ halo: null }), true);
    expect(result).toHaveLength(3);
    expect(result[1].value).toBe('N/A');
  });
});

describe('buildChartData', () => {
  const baseTier: BreakdownTier = {
    tier_level: 'beer',
    tier_name: 'Beer',
    audiences: buildAudiences(),
  };

  it('should return empty data when audiences is null', () => {
    const result = buildChartData({ ...baseTier, audiences: null }, false);
    expect(result.chartData.values).toEqual([]);
    expect(result.chartData.labels).toEqual([]);
    expect(result.naIndexes).toEqual([]);
  });

  it('should return Core and Total when showHalo is false', () => {
    const result = buildChartData(baseTier, false);
    expect(result.chartData.labels).toEqual(['Core', 'Total']);
    expect(result.chartData.values).toEqual([31.2, 28.0]);
    expect(result.naIndexes).toEqual([]);
  });

  it('should return Core, Halo and Total when showHalo is true', () => {
    const result = buildChartData(baseTier, true);
    expect(result.chartData.labels).toEqual(['Core', 'Halo', 'Total']);
    expect(result.chartData.values).toEqual([31.2, 29.5, 28.0]);
  });

  it('should track naIndex when halo is null and showHalo is true', () => {
    const tier = { ...baseTier, audiences: buildAudiences({ halo: null }) };
    const result = buildChartData(tier, true);
    expect(result.naIndexes).toEqual([1]);
    expect(result.chartData.values).toContain(0);
  });

  it('should use brand colors as fallback for unknown tier_level', () => {
    const tier = { ...baseTier, tier_level: 'unknown' as any };
    const result = buildChartData(tier, false);
    expect(result.chartData.labels).toEqual(['Core', 'Total']);
  });
});

describe('getSuggestedMax', () => {
  it('should return 50 for empty values', () => {
    expect(getSuggestedMax([])).toBe(50);
  });

  it('should round up to nearest 10 and add padding', () => {
    expect(getSuggestedMax([31.2, 28.0])).toBe(50);
    expect(getSuggestedMax([45])).toBe(60);
  });

  describe('buildIndexValues', () => {
    it('should return core and total badge values when showHalo is false', () => {
      const result = buildIndexValues(
        buildAudiences(),
        'performance_index',
        false,
      );
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe('111');
      expect(result[0].variant).toBe('badge');
      expect(result[0].badgeColor).toBe('positive');
      expect(result[1].value).toBe('N/A');
      expect(result[1].variant).toBe('badge');
      expect(result[1].badgeColor).toBe('neutral');
    });

    it('should return core, halo and total badge values when showHalo is true', () => {
      const result = buildIndexValues(
        buildAudiences(),
        'performance_index',
        true,
      );
      expect(result).toHaveLength(3);
      expect(result[0].value).toBe('111');
      expect(result[0].badgeColor).toBe('positive');
      expect(result[1].value).toBe('105');
      expect(result[1].badgeColor).toBe('neutral');
      expect(result[2].value).toBe('N/A');
      expect(result[2].badgeColor).toBe('neutral');
    });

    it('should use comparison_index field', () => {
      const result = buildIndexValues(
        buildAudiences(),
        'comparison_index',
        false,
      );
      expect(result[0].value).toBe('111');
    });

    it('should return N/A for halo when halo is null and showHalo is true', () => {
      const result = buildIndexValues(
        buildAudiences({ halo: null }),
        'performance_index',
        true,
      );
      expect(result).toHaveLength(3);
      expect(result[1].value).toBe('N/A');
      expect(result[1].badgeColor).toBe('neutral');
    });

    it('should correctly determine badge colors based on index values', () => {
      const audiences: TierAudiences = {
        core: {
          value: 31.2,
          yoy_change: 0.2,
          yoy_direction: 'up',
          comparison_index: 90,
          performance_index: 90,
        },
        halo: {
          value: 29.5,
          yoy_change: 0.4,
          yoy_direction: 'up',
          comparison_index: 120,
          performance_index: 120,
        },
        total: {
          value: 28.0,
          yoy_change: 0.5,
          yoy_direction: 'up',
          comparison_index: 100,
          performance_index: 100,
        },
      };

      const result = buildIndexValues(audiences, 'performance_index', true);
      expect(result[0].badgeColor).toBe('negative');
      expect(result[1].badgeColor).toBe('positive');
      expect(result[2].badgeColor).toBe('neutral');
    });

    it('should all values have variant badge', () => {
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
    it('should return array with single comparison line object', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result).toHaveLength(1);
    });

    it('should have correct title', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].title).toBe('vs LY');
    });

    it('should have data property with comparison values', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].data).toBeDefined();
      expect(Array.isArray(result[0].data)).toBe(true);
    });

    it('should return core and total values when showHalo is false', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].data).toHaveLength(2);
      expect(result[0].data[0].value).toBe('0.2pp');
      expect(result[0].data[1].value).toBe('0.5pp');
    });

    it('should return core, halo and total values when showHalo is true', () => {
      const result = buildYoYData(buildAudiences(), true);
      expect(result[0].data).toHaveLength(3);
      expect(result[0].data[0].value).toBe('0.2pp');
      expect(result[0].data[1].value).toBe('0.4pp');
      expect(result[0].data[2].value).toBe('0.5pp');
    });

    it('should not have tooltip property', () => {
      const result = buildYoYData(buildAudiences(), false);
      expect(result[0].tooltip).toBeUndefined();
    });
  });

  describe('buildIndexData', () => {
    it('should return array with one comparison line object', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result).toHaveLength(1);
    });

    it('should have Comparison Index title', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].title).toBe('Comparison Index');
    });

    it('should have tooltip for Comparison Index', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].tooltip).toBeDefined();
      expect(result[0].tooltip?.title).toBe('Comparison Index');
      expect(result[0].tooltip?.text).toContain('baseline');
    });

    it('should have data property with badge values when showHalo is false', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].data).toBeDefined();
      expect(Array.isArray(result[0].data)).toBe(true);
      expect(result[0].data).toHaveLength(2);
      result[0].data.forEach((value) => {
        expect(value.variant).toBe('badge');
      });
    });

    it('should have data property with badge values when showHalo is true', () => {
      const result = buildIndexData(buildAudiences(), true, mockFormatMessage);
      expect(result[0].data).toHaveLength(3);
      result[0].data.forEach((value) => {
        expect(value.variant).toBe('badge');
      });
    });

    it('should use comparison_index field', () => {
      const result = buildIndexData(buildAudiences(), false, mockFormatMessage);
      expect(result[0].data[0].value).toBe('111');
    });

    it('should call formatMessage with the comparison index i18n keys', () => {
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
