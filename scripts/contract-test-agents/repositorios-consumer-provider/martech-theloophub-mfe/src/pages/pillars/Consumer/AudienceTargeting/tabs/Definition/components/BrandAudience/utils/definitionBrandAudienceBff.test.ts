import { BRAND_VOLUME_UNAVAILABLE_MESSAGE } from '../constants/brandVolumeDefinition';
import { BrandAudiencesTargetingCardModel } from '../types';
import {
  canonicalAudienceCardTitle,
  extractBrandAudienceCardsFromBff,
  normalizeDefinitionBrandAudienceCards,
} from './definitionBrandAudienceBff';

describe('definitionBrandAudienceBff', () => {
  const sampleCard = {
    header: { title: 'Core Audience', tooltip: 'Core tooltip' },
    data: [
      {
        audience: {
          gender: ['Male'],
          age: ['25-34'],
          incomeBracket: ['Medium'],
        },
        audienceType: 'core' as const,
        brandVolume: {
          value: '51.2',
          label: 'of Brand Volume',
          measure: '%',
        },
      },
    ],
  };

  describe('extractBrandAudienceCardsFromBff', () => {
    test('should returns empty array when bffData is null', () => {
      expect(extractBrandAudienceCardsFromBff(null)).toEqual([]);
    });

    test('should reads cards from audience-cards.card key', () => {
      const bff = {
        'audience-cards': { card: [sampleCard] },
      };
      expect(extractBrandAudienceCardsFromBff(bff)).toEqual([sampleCard]);
    });

    test('should reads cards from the definition brand audience component key', () => {
      const bff = {
        'consumer_audience-targeting_definition_brand-audience': [sampleCard],
      };
      expect(extractBrandAudienceCardsFromBff(bff)).toEqual([sampleCard]);
    });

    test('should falls back to first top-level array with header+data shape', () => {
      const bff = {
        other: [sampleCard],
      };
      expect(extractBrandAudienceCardsFromBff(bff)).toEqual([sampleCard]);
    });

    test('should finds cards nested one level deep under an unknown component id', () => {
      const bff = {
        'some-other-component-id': {
          cards: [sampleCard],
        },
      };
      expect(extractBrandAudienceCardsFromBff(bff)).toEqual([sampleCard]);
    });
  });

  describe('canonicalAudienceCardTitle', () => {
    test('should normalizes core and halo titles to canonical casing', () => {
      expect(canonicalAudienceCardTitle('core audience')).toBe('Core Audience');
      expect(canonicalAudienceCardTitle('Halo Audience ')).toBe(
        'Halo Audience',
      );
      expect(canonicalAudienceCardTitle('Other')).toBe('Other');
    });
  });

  describe('normalizeDefinitionBrandAudienceCards', () => {
    test('should uses empty state fallback when brandVolume has only { empty: true }', () => {
      const haloCard = {
        header: { title: 'Halo Audience', tooltip: 'Halo tooltip' },
        data: [
          {
            audience: {
              gender: ['Female'],
              age: ['LDA-24'],
              incomeBracket: ['Low'],
            },
            audienceType: 'halo' as const,
            brandVolume: { empty: true },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        haloCard as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as {
        brandVolume?: { emptyStateMessage?: string; value: string };
      };
      expect(row.brandVolume?.emptyStateMessage).toBe(
        BRAND_VOLUME_UNAVAILABLE_MESSAGE,
      );
      expect(row.brandVolume?.value).toBe('');
      expect(row).toMatchObject({
        audienceType: 'halo',
        audience: haloCard.data[0].audience,
      });
    });

    test('should does not include brandVolume when the BFF omits the key', () => {
      const haloCard = {
        header: { title: 'Halo Audience', tooltip: '' },
        data: [
          {
            audience: {
              gender: ['Female'],
              age: ['LDA-24'],
              incomeBracket: ['Low'],
            },
            audienceType: 'halo' as const,
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([haloCard]);
      expect(out.data[0]).not.toHaveProperty('brandVolume');
    });

    test('should calculates color for core audience when color is absent from BFF', () => {
      const [out] = normalizeDefinitionBrandAudienceCards([
        sampleCard as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as {
        brandVolume?: { value: string; color: string; label: string };
      };
      expect(row.brandVolume?.color).toBeTruthy();
      expect(row.brandVolume?.value).toBe('51.2');
    });

    test('should preserves color provided by BFF instead of recalculating it', () => {
      const withColor = {
        ...sampleCard,
        data: [
          {
            ...sampleCard.data[0],
            brandVolume: {
              value: '40',
              color: '#CUSTOM',
              label: 'of Brand Volume',
            },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([withColor]);
      const row = out.data[0] as { brandVolume?: { color: string } };
      expect(row.brandVolume?.color).toBe('#CUSTOM');
    });

    test('should maps snake_case audience and brand_volume fields from BFF', () => {
      const bffRow = {
        audience: {
          gender: ['Male'],
          age: ['25-34'],
          income_bracket: ['Medium'],
        },
        audience_type: 'core',
        brand_volume: { value: '51.2', label: 'of Brand Volume', measure: '%' },
      };
      const card = {
        header: { title: 'Core Audience', tooltip: '' },
        data: [bffRow],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        card as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as BrandAudiencesCardItemLike;
      expect(row.audience?.incomeBracket).toEqual(['Medium']);
      expect(row.brandVolume?.value).toBe('51.2');
      expect(row.audienceType).toBe('core');
    });
  });

  describe('brandVolume with empty flag and non-empty value', () => {
    test('should shows brand volume percentage when value is present even if empty flag is true', () => {
      const card = {
        header: { title: 'Halo Audience', tooltip: '' },
        data: [
          {
            audience: {
              gender: ['Female'],
              age: ['25-34'],
              incomeBracket: ['High'],
            },
            audienceType: 'halo',
            brandVolume: {
              value: '5',
              label: 'of Brand Volume',
              empty: true,
            },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        card as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as { brandVolume?: { value: string } };
      expect(row.brandVolume?.value).toBe('5');
    });
  });

  describe('audience demographic parsing', () => {
    test('should wraps a plain string demographic value in a single-element array', () => {
      const card = {
        header: { title: 'Core Audience', tooltip: '' },
        data: [
          {
            audience: {
              gender: 'Male',
              age: '25-34',
              incomeBracket: 'Medium',
            },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        card as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as {
        audience?: { gender?: string[]; age?: string[] };
      };
      expect(row.audience?.gender).toEqual(['Male']);
      expect(row.audience?.age).toEqual(['25-34']);
    });

    test('should ignores blank string demographic values', () => {
      const card = {
        header: { title: 'Core Audience', tooltip: '' },
        data: [
          {
            audience: {
              gender: '   ',
              age: ['25-34'],
            },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        card as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as { audience?: { gender?: string[] } };
      expect(row.audience?.gender).toBeUndefined();
    });
  });

  describe('audience type resolution from card title', () => {
    test('should infers core audience type from card title when audienceType field is absent', () => {
      const card = {
        header: { title: 'Core Audience', tooltip: '' },
        data: [
          {
            audience: { gender: ['Male'] },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        card as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as { audienceType?: string };
      expect(row.audienceType).toBe('core');
    });

    test('should infers halo audience type from card title when audienceType field is absent', () => {
      const card = {
        header: { title: 'Halo Audience', tooltip: '' },
        data: [
          {
            audience: { gender: ['Female'] },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        card as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as { audienceType?: string };
      expect(row.audienceType).toBe('halo');
    });

    test('should returns undefined audience type when field is absent and card title is unrecognized', () => {
      const card = {
        header: { title: 'Unknown Audience', tooltip: '' },
        data: [
          {
            audience: { gender: ['Male'] },
          },
        ],
      };
      const [out] = normalizeDefinitionBrandAudienceCards([
        card as unknown as BrandAudiencesTargetingCardModel,
      ]);
      const row = out.data[0] as { audienceType?: string };
      expect(row.audienceType).toBeUndefined();
    });
  });
});

type BrandAudiencesCardItemLike = {
  audience?: { incomeBracket?: string[] };
  brandVolume?: { value: string };
  audienceType?: string;
};
