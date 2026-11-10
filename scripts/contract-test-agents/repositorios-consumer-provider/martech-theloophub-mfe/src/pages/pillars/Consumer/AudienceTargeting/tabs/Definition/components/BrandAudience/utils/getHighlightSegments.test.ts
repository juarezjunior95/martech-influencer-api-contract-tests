import { getHighlightSegmentsFromBrandAudienceCard } from './getHighlightSegments';

describe('getHighlightSegmentsFromBrandAudienceCard', () => {
  it('collects unique gender, age and income labels', () => {
    const segments = getHighlightSegmentsFromBrandAudienceCard({
      header: { title: 'Core Audience' },
      data: [
        {
          audience: {
            gender: ['Female'],
            age: ['25-34'],
            incomeBracket: ['Low'],
          },
        },
        {
          audience: {
            gender: ['Female'],
            age: ['35-44'],
          },
        },
      ],
    });

    expect(segments.sort()).toEqual(['25-34', '35-44', 'Female', 'Low'].sort());
  });

  it('returns empty array when no audience items', () => {
    expect(
      getHighlightSegmentsFromBrandAudienceCard({
        header: { title: 'X' },
        data: [],
      }),
    ).toEqual([]);
  });

  it('collects all three demographic categories from a single item', () => {
    const segments = getHighlightSegmentsFromBrandAudienceCard({
      header: { title: 'Core Audience' },
      data: [
        {
          audience: {
            gender: ['Male', 'Female'],
            age: ['LDA-24', '25-34', '35-44'],
            incomeBracket: ['High', 'Medium'],
          },
        },
      ],
    });

    expect(segments.sort()).toEqual(
      ['Male', 'Female', 'LDA-24', '25-34', '35-44', 'High', 'Medium'].sort(),
    );
  });

  it('skips items without audience field', () => {
    const segments = getHighlightSegmentsFromBrandAudienceCard({
      header: { title: 'Core Audience' },
      data: [
        { audience: { gender: ['Male'] } },
        { brandVolume: { value: '100', label: 'vol', measure: '%' } } as any,
      ],
    });

    expect(segments).toEqual(['Male']);
  });

  it('deduplicates segments across multiple items', () => {
    const segments = getHighlightSegmentsFromBrandAudienceCard({
      header: { title: 'Core Audience' },
      data: [
        { audience: { gender: ['Male'], age: ['25-34'] } },
        { audience: { gender: ['Male'], incomeBracket: ['High'] } },
      ],
    });

    expect(segments.sort()).toEqual(['25-34', 'High', 'Male'].sort());
  });
});
