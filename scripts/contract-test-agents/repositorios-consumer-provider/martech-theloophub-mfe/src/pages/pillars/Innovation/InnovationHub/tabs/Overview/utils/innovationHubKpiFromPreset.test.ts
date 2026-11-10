import {
  getNavigableOverviewCardIdsFromKpisPreset,
  getOrderedOverviewCardIdsFromKpisPreset,
  normalizeInnovationHubKpiTokens,
  overviewCardIdToPresetKpiValue,
  presetKpiValueToOverviewCardId,
} from './innovationHubKpiFromPreset';

describe('presetKpiValueToOverviewCardId', () => {
  it('maps snake_case maco_margin to macoMargin', () => {
    expect(presetKpiValueToOverviewCardId('maco_margin')).toBe('macoMargin');
  });

  it('passes through simple ids', () => {
    expect(presetKpiValueToOverviewCardId('volume')).toBe('volume');
    expect(presetKpiValueToOverviewCardId('nr')).toBe('nr');
  });

  it('maps hyphenated tokens', () => {
    expect(presetKpiValueToOverviewCardId('net-revenue')).toBe('netRevenue');
  });

  it('returns null for blank', () => {
    expect(presetKpiValueToOverviewCardId('')).toBeNull();
    expect(presetKpiValueToOverviewCardId('   ')).toBeNull();
  });

  it('trims surrounding whitespace before mapping', () => {
    expect(presetKpiValueToOverviewCardId('  volume  ')).toBe('volume');
    expect(presetKpiValueToOverviewCardId('  maco_margin  ')).toBe(
      'macoMargin',
    );
  });
});

describe('overviewCardIdToPresetKpiValue', () => {
  it('serializes macoMargin for BFF-style payloads', () => {
    expect(overviewCardIdToPresetKpiValue('macoMargin')).toBe('maco_margin');
  });

  it('passes through volume', () => {
    expect(overviewCardIdToPresetKpiValue('volume')).toBe('volume');
  });
});

describe('getOrderedOverviewCardIdsFromKpisPreset', () => {
  it('preserves order and maps values', () => {
    expect(
      getOrderedOverviewCardIdsFromKpisPreset({
        values: [
          { value: 'volume', label: 'Volume' },
          { value: 'maco_margin', label: 'MACO Margin' },
          { value: 'nr', label: 'Net Revenue' },
        ],
        default: { value: 'volume', label: 'Volume' },
        enabled: true,
      }),
    ).toEqual(['volume', 'macoMargin', 'nr']);
  });

  it('returns empty when values missing', () => {
    expect(getOrderedOverviewCardIdsFromKpisPreset(undefined)).toEqual([]);
    expect(
      getOrderedOverviewCardIdsFromKpisPreset({
        values: [],
        default: { value: 'volume', label: 'Volume' },
        enabled: true,
      }),
    ).toEqual([]);
  });

  it('dedupes duplicate preset values mapping to the same card id', () => {
    expect(
      getOrderedOverviewCardIdsFromKpisPreset({
        values: [
          { value: 'volume', label: 'Volume' },
          { value: 'volume', label: 'Volume duplicate' },
          { value: 'nr', label: 'Net Revenue' },
        ],
        default: { value: 'volume', label: 'Volume' },
        enabled: true,
      }),
    ).toEqual(['volume', 'nr']);
  });
});

describe('getNavigableOverviewCardIdsFromKpisPreset', () => {
  it('returns enabled ids in order', () => {
    expect(
      getNavigableOverviewCardIdsFromKpisPreset({
        values: [
          { value: 'volume', label: 'Volume' },
          { value: 'maco_margin', label: 'MACO Margin', isDisabled: true },
          { value: 'nr', label: 'Net Revenue' },
        ],
        default: { value: 'volume', label: 'Volume' },
        enabled: true,
      }),
    ).toEqual(['volume', 'nr']);
  });

  it('returns empty when values missing', () => {
    expect(getNavigableOverviewCardIdsFromKpisPreset(undefined)).toEqual([]);
  });

  it('returns empty when every option is disabled', () => {
    expect(
      getNavigableOverviewCardIdsFromKpisPreset({
        values: [
          { value: 'volume', label: 'Volume', isDisabled: true },
          { value: 'nr', label: 'Net Revenue', isDisabled: true },
        ],
        default: { value: 'volume', label: 'Volume' },
        enabled: true,
      }),
    ).toEqual([]);
  });
});

describe('normalizeInnovationHubKpiTokens', () => {
  it('keeps valid tokens from array', () => {
    expect(normalizeInnovationHubKpiTokens(['volume', 'nr'])).toEqual([
      'volume',
      'nr',
    ]);
  });

  it('maps snake_case entries', () => {
    expect(normalizeInnovationHubKpiTokens(['maco_margin', 'volume'])).toEqual([
      'macoMargin',
      'volume',
    ]);
  });

  it('wraps non-empty string when valid', () => {
    expect(normalizeInnovationHubKpiTokens('volume')).toEqual(['volume']);
  });

  it('returns empty array for empty string', () => {
    expect(normalizeInnovationHubKpiTokens('')).toEqual([]);
  });

  it('returns empty array for null, undefined, number', () => {
    expect(normalizeInnovationHubKpiTokens(null)).toEqual([]);
    expect(normalizeInnovationHubKpiTokens(undefined)).toEqual([]);
    expect(normalizeInnovationHubKpiTokens(42)).toEqual([]);
  });
});
