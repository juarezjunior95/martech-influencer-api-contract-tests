import { BrandAudiencesTargetingCardModel } from '../types';
import { stripBrandVolumeFromCards } from './stripBrandVolume';

describe('stripBrandVolumeFromCards', () => {
  test('should remove brandVolume from every item while keeping audience definitions', () => {
    const cards = [
      {
        header: { title: 'Core Audience' },
        data: [
          {
            audience: {
              gender: ['Male'],
              age: ['25-34'],
              incomeBracket: ['Medium'],
            },
            audienceType: 'core' as const,
            brandVolume: {
              value: '60.4',
              label: 'of Brand Volume',
              measure: '%',
              color: '#007800',
            },
          },
        ],
      },
      {
        header: { title: 'Halo Audience' },
        data: [
          {
            audience: {
              gender: ['Female'],
              age: ['LDA-24'],
              incomeBracket: ['Low'],
            },
            audienceType: 'halo' as const,
            brandVolume: {
              value: '',
              label: '',
              color: '#6B7280',
              emptyStateMessage: 'No R12M POS volume available',
            },
          },
        ],
      },
    ] as unknown as BrandAudiencesTargetingCardModel[];

    const result = stripBrandVolumeFromCards(cards);

    result.forEach((card) => {
      card.data.forEach((item) => {
        expect(item).not.toHaveProperty('brandVolume');
      });
    });

    const [core, halo] = result;
    expect(core.data[0]).toMatchObject({
      audience: { gender: ['Male'], age: ['25-34'], incomeBracket: ['Medium'] },
      audienceType: 'core',
    });
    expect(halo.data[0]).toMatchObject({
      audience: {
        gender: ['Female'],
        age: ['LDA-24'],
        incomeBracket: ['Low'],
      },
      audienceType: 'halo',
    });
  });

  test('should leave items without brandVolume unchanged', () => {
    const cards = [
      {
        header: { title: 'Core Audience' },
        data: [
          {
            audience: { gender: ['Male'] },
            audienceType: 'core' as const,
          },
        ],
      },
    ] as unknown as BrandAudiencesTargetingCardModel[];

    const result = stripBrandVolumeFromCards(cards);

    expect(result[0].data[0]).toEqual({
      audience: { gender: ['Male'] },
      audienceType: 'core',
    });
  });

  test('should preserve card header and handle empty data arrays', () => {
    const cards = [
      {
        header: {
          title: 'Halo Audience',
          subtitle: "Q4'25",
          emptyMessage: 'No data',
        },
        data: [],
      },
    ] as unknown as BrandAudiencesTargetingCardModel[];

    const result = stripBrandVolumeFromCards(cards);

    expect(result[0].header).toEqual({
      title: 'Halo Audience',
      subtitle: "Q4'25",
      emptyMessage: 'No data',
    });
    expect(result[0].data).toEqual([]);
  });

  test('should not introduce placeholder values when brandVolume is removed', () => {
    const cards = [
      {
        header: { title: 'Core Audience' },
        data: [
          {
            audience: { gender: ['Male'] },
            brandVolume: { value: '0', label: 'of Brand Volume', measure: '%' },
          },
        ],
      },
    ] as unknown as BrandAudiencesTargetingCardModel[];

    const result = stripBrandVolumeFromCards(cards);
    const item = result[0].data[0] as Record<string, unknown>;

    expect(item.brandVolume).toBeUndefined();
    expect(JSON.stringify(item)).not.toMatch(/brandVolume|0%|null/);
  });

  test('should ignore non-object items defensively', () => {
    const cards = [
      {
        header: { title: 'Core Audience' },
        data: [null as unknown, undefined as unknown, 'noop' as unknown],
      },
    ] as unknown as BrandAudiencesTargetingCardModel[];

    const result = stripBrandVolumeFromCards(cards);

    expect(result[0].data).toEqual([null, undefined, 'noop']);
  });
});
