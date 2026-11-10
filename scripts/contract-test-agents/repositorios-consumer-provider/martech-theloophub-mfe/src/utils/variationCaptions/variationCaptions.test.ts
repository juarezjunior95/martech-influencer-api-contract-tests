import { processVariationCaptions } from './variationCaptions';

describe('variationCaptions', () => {
  describe('processVariationCaptions', () => {
    it('should return empty array when variationCaptions is not an array', () => {
      expect(processVariationCaptions(null)).toEqual([]);
      expect(processVariationCaptions(undefined)).toEqual([]);
      expect(processVariationCaptions({})).toEqual([]);
      expect(
        processVariationCaptions({ variationCaptions: 'not array' }),
      ).toEqual([]);
    });

    it('should process variation captions without portfolioType', () => {
      const data = {
        variationCaptions: [
          {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            data: [
              { value: 100, unit_of_measure: '%', color: 'green' },
              { value: 200, unit_of_measure: 'pts', color: 'red' },
            ],
          },
        ],
      };

      const result = processVariationCaptions(data);

      expect(result).toEqual([
        {
          title: 'Test Title',
          subtitle: 'Test Subtitle',
          data: [
            { value: '100', measure: '%', color: 'green' },
            { value: '200', measure: 'pts', color: 'red' },
          ],
        },
      ]);
    });

    it('should handle null value in data items', () => {
      const data = {
        variationCaptions: [
          {
            title: 'Test',
            subtitle: 'Sub',
            data: [{ value: null, unit_of_measure: '%', color: 'blue' }],
          },
        ],
      };

      const result = processVariationCaptions(data);

      expect(result[0].data[0].value).toBe('');
    });

    it('should handle missing unit_of_measure', () => {
      const data = {
        variationCaptions: [
          {
            title: 'Test',
            subtitle: 'Sub',
            data: [{ value: 50, color: 'blue' }],
          },
        ],
      };

      const result = processVariationCaptions(data);

      expect(result[0].data[0].measure).toBe('');
    });

    it('should process multiple variation captions', () => {
      const data = {
        variationCaptions: [
          {
            title: 'First',
            subtitle: 'First Sub',
            data: [{ value: 1, unit_of_measure: '%', color: 'green' }],
          },
          {
            title: 'Second',
            subtitle: 'Second Sub',
            data: [{ value: 2, unit_of_measure: 'pts', color: 'red' }],
          },
        ],
      };

      const result = processVariationCaptions(data);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('First');
      expect(result[1].title).toBe('Second');
    });

    it('should process variation captions with megabrands portfolioType', () => {
      const data = {
        variationCaptions: [
          {
            title: 'Original Title',
            subtitle: 'Test Subtitle',
            titles: {
              megabrands: 'Megabrands Title',
              expansion: 'Expansion Title',
            },
            data: [{ value: 100, unit_of_measure: '%', color: 'green' }],
          },
        ],
      };

      const result = processVariationCaptions(data, 'megabrands');

      expect(result[0].title).toBe('Megabrands Title');
    });

    it('should process variation captions with expansion portfolioType', () => {
      const data = {
        variationCaptions: [
          {
            title: 'Original Title',
            subtitle: 'Test Subtitle',
            titles: {
              megabrands: 'Megabrands Title',
              expansion: 'Expansion Title',
            },
            data: [{ value: 100, unit_of_measure: '%', color: 'green' }],
          },
        ],
      };

      const result = processVariationCaptions(data, 'expansion');

      expect(result[0].title).toBe('Expansion Title');
    });

    it('should return dash when portfolioType title not found', () => {
      const data = {
        variationCaptions: [
          {
            title: 'Original Title',
            subtitle: 'Test Subtitle',
            titles: {
              megabrands: 'Megabrands Title',
            },
            data: [{ value: 100, unit_of_measure: '%', color: 'green' }],
          },
        ],
      };

      const result = processVariationCaptions(data, 'sustain');

      expect(result[0].title).toBe('-');
    });
  });
});
