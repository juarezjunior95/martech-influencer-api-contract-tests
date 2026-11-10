import { cardsOrder, sortGrowthLeversByDefaultOrder } from './index';

describe('CategoryGrowthLevers Utils', () => {
  describe('cardsOrder', () => {
    it('should have 5 items', () => {
      expect(cardsOrder).toHaveLength(5);
    });

    it('should have correct order of items', () => {
      expect(cardsOrder).toEqual([
        'Beer Participation',
        'Superior Core',
        'Lead Premium',
        'Balanced Choices',
        'Beyond Beer',
      ]);
    });

    it('should have Beer Participation as first item', () => {
      expect(cardsOrder[0]).toBe('Beer Participation');
    });

    it('should have Beyond Beer as last item', () => {
      expect(cardsOrder[4]).toBe('Beyond Beer');
    });
  });

  describe('sortGrowthLeversByDefaultOrder', () => {
    it('should sort items by cardsOrder', () => {
      const unsortedData = [
        { title: 'Beyond Beer', value: 5 },
        { title: 'Beer Participation', value: 1 },
        { title: 'Lead Premium', value: 3 },
        { title: 'Superior Core', value: 2 },
        { title: 'Balanced Choices', value: 4 },
      ];

      const result = sortGrowthLeversByDefaultOrder(unsortedData);

      expect(result).toEqual([
        { title: 'Beer Participation', value: 1 },
        { title: 'Superior Core', value: 2 },
        { title: 'Lead Premium', value: 3 },
        { title: 'Balanced Choices', value: 4 },
        { title: 'Beyond Beer', value: 5 },
      ]);
    });

    it('should return empty array when input is null', () => {
      const result = sortGrowthLeversByDefaultOrder(null as any);

      expect(result).toEqual([]);
    });

    it('should return empty array when input is undefined', () => {
      const result = sortGrowthLeversByDefaultOrder(undefined as any);

      expect(result).toEqual([]);
    });

    it('should return empty array when input is empty array', () => {
      const result = sortGrowthLeversByDefaultOrder([]);

      expect(result).toEqual([]);
    });

    it('should handle single item', () => {
      const singleItem = [{ title: 'Beer Participation', value: 1 }];

      const result = sortGrowthLeversByDefaultOrder(singleItem);

      expect(result).toEqual([{ title: 'Beer Participation', value: 1 }]);
    });

    it('should handle already sorted data', () => {
      const sortedData = [
        { title: 'Beer Participation', value: 1 },
        { title: 'Superior Core', value: 2 },
        { title: 'Lead Premium', value: 3 },
      ];

      const result = sortGrowthLeversByDefaultOrder(sortedData);

      expect(result).toEqual(sortedData);
    });

    it('should handle partially matching titles', () => {
      const partialData = [
        { title: 'Beyond Beer', value: 2 },
        { title: 'Beer Participation', value: 1 },
      ];

      const result = sortGrowthLeversByDefaultOrder(partialData);

      expect(result).toEqual([
        { title: 'Beer Participation', value: 1 },
        { title: 'Beyond Beer', value: 2 },
      ]);
    });

    it('should place unknown titles at the end (negative index)', () => {
      const dataWithUnknown = [
        { title: 'Unknown Title', value: 99 },
        { title: 'Beer Participation', value: 1 },
        { title: 'Superior Core', value: 2 },
      ];

      const result = sortGrowthLeversByDefaultOrder(dataWithUnknown);

      expect(result[0].title).toBe('Unknown Title');
      expect(result[1].title).toBe('Beer Participation');
      expect(result[2].title).toBe('Superior Core');
    });

    it('should not mutate the original array', () => {
      const originalData = [
        { title: 'Beyond Beer', value: 5 },
        { title: 'Beer Participation', value: 1 },
      ];
      const originalCopy = [...originalData];

      sortGrowthLeversByDefaultOrder(originalData);

      expect(originalData).toEqual(originalCopy);
    });

    it('should preserve additional properties in objects', () => {
      const dataWithExtraProps = [
        { title: 'Beyond Beer', value: 5, extra: 'data1', nested: { a: 1 } },
        {
          title: 'Beer Participation',
          value: 1,
          extra: 'data2',
          nested: { b: 2 },
        },
      ];

      const result = sortGrowthLeversByDefaultOrder(dataWithExtraProps);

      expect(result[0]).toEqual({
        title: 'Beer Participation',
        value: 1,
        extra: 'data2',
        nested: { b: 2 },
      });
      expect(result[1]).toEqual({
        title: 'Beyond Beer',
        value: 5,
        extra: 'data1',
        nested: { a: 1 },
      });
    });

    it('should handle all items from cardsOrder', () => {
      const allCardsReversed = [
        { title: 'Beyond Beer' },
        { title: 'Balanced Choices' },
        { title: 'Lead Premium' },
        { title: 'Superior Core' },
        { title: 'Beer Participation' },
      ];

      const result = sortGrowthLeversByDefaultOrder(allCardsReversed);

      expect(result.map((item) => item.title)).toEqual(cardsOrder);
    });

    it('should handle duplicate titles', () => {
      const duplicateData = [
        { title: 'Beer Participation', value: 1 },
        { title: 'Beer Participation', value: 2 },
        { title: 'Beyond Beer', value: 3 },
      ];

      const result = sortGrowthLeversByDefaultOrder(duplicateData);

      expect(result[0].title).toBe('Beer Participation');
      expect(result[1].title).toBe('Beer Participation');
      expect(result[2].title).toBe('Beyond Beer');
    });

    it('should handle mixed known and unknown titles', () => {
      const mixedData = [
        { title: 'Unknown 1', value: 1 },
        { title: 'Beyond Beer', value: 2 },
        { title: 'Unknown 2', value: 3 },
        { title: 'Beer Participation', value: 4 },
      ];

      const result = sortGrowthLeversByDefaultOrder(mixedData);

      const titles = result.map((item) => item.title);
      expect(titles.indexOf('Beer Participation')).toBeLessThan(
        titles.indexOf('Beyond Beer'),
      );
    });

    it('should work with generic type constraint', () => {
      interface CustomType {
        title: string;
        customProp: number;
      }

      const customData: CustomType[] = [
        { title: 'Beyond Beer', customProp: 100 },
        { title: 'Beer Participation', customProp: 200 },
      ];

      const result = sortGrowthLeversByDefaultOrder(customData);

      expect(result[0].customProp).toBe(200);
      expect(result[1].customProp).toBe(100);
    });
  });
});
