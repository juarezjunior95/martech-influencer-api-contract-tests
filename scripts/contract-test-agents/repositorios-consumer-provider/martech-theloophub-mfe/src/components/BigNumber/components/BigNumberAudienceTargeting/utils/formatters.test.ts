import { FALLBACK_VALUE } from './constants';
import { formatArray, formatAudienceField } from './formatters';

describe('formatters', () => {
  describe('formatArray', () => {
    describe('valid inputs', () => {
      it('should convert a single string to an array', () => {
        const result = formatArray('test value');

        expect(result).toEqual(['test value']);
      });

      it('should return array of valid strings', () => {
        const result = formatArray(['value1', 'value2', 'value3']);

        expect(result).toEqual(['value1', 'value2', 'value3']);
      });

      it('should filter out empty strings from array', () => {
        const result = formatArray(['valid', '', '  ', 'another']);

        expect(result).toEqual(['valid', 'another']);
      });

      it('should filter out non-string values from array', () => {
        const result = formatArray(['valid', 123, null, undefined, 'another']);

        expect(result).toEqual(['valid', 'another']);
      });

      it('should handle array with only valid strings', () => {
        const result = formatArray(['one', 'two']);

        expect(result).toEqual(['one', 'two']);
      });
    });

    describe('invalid inputs', () => {
      it('should return null for empty string', () => {
        const result = formatArray('');

        expect(result).toBeNull();
      });

      it('should return null for whitespace-only string', () => {
        const result = formatArray('   ');

        expect(result).toBeNull();
      });

      it('should return null for empty array', () => {
        const result = formatArray([]);

        expect(result).toBeNull();
      });

      it('should return null for array with only empty strings', () => {
        const result = formatArray(['', '  ', '   ']);

        expect(result).toBeNull();
      });

      it('should return null for array with only invalid values', () => {
        const result = formatArray([123, null, undefined, {}]);

        expect(result).toBeNull();
      });

      it('should return null for null input', () => {
        const result = formatArray(null);

        expect(result).toBeNull();
      });

      it('should return null for undefined input', () => {
        const result = formatArray(undefined);

        expect(result).toBeNull();
      });

      it('should return null for number input', () => {
        const result = formatArray(123);

        expect(result).toBeNull();
      });

      it('should return null for object input', () => {
        const result = formatArray({ key: 'value' });

        expect(result).toBeNull();
      });
    });
  });

  describe('formatAudienceField', () => {
    describe('array fields (age, gender, incomeBracket)', () => {
      const arrayFields = ['age', 'gender', 'incomeBracket'];

      arrayFields.forEach((field) => {
        describe(`${field} field`, () => {
          it('should format valid array correctly', () => {
            const result = formatAudienceField(field, ['value1', 'value2']);

            expect(result).toEqual({
              type: 'array',
              value: ['value1', 'value2'],
            });
          });

          it('should format valid string as array', () => {
            const result = formatAudienceField(field, 'single value');

            expect(result).toEqual({
              type: 'array',
              value: ['single value'],
            });
          });

          it('should return fallback for empty array', () => {
            const result = formatAudienceField(field, []);

            expect(result).toEqual({
              type: 'text',
              value: FALLBACK_VALUE,
            });
          });

          it('should return fallback for invalid values', () => {
            const result = formatAudienceField(field, null);

            expect(result).toEqual({
              type: 'text',
              value: FALLBACK_VALUE,
            });
          });

          it('should return fallback for empty string', () => {
            const result = formatAudienceField(field, '');

            expect(result).toEqual({
              type: 'text',
              value: FALLBACK_VALUE,
            });
          });
        });
      });
    });

    describe('text fields (non-array fields)', () => {
      it('should format string value as text', () => {
        const result = formatAudienceField('someField', 'text value');

        expect(result).toEqual({
          type: 'text',
          value: 'text value',
        });
      });

      it('should convert number to string', () => {
        const result = formatAudienceField('someField', 123);

        expect(result).toEqual({
          type: 'text',
          value: '123',
        });
      });

      it('should return fallback for null', () => {
        const result = formatAudienceField('someField', null);

        expect(result).toEqual({
          type: 'text',
          value: FALLBACK_VALUE,
        });
      });

      it('should return fallback for undefined', () => {
        const result = formatAudienceField('someField', undefined);

        expect(result).toEqual({
          type: 'text',
          value: FALLBACK_VALUE,
        });
      });

      it('should convert array to string for non-array fields', () => {
        const result = formatAudienceField('someField', ['a', 'b']);

        expect(result).toEqual({
          type: 'text',
          value: 'a,b',
        });
      });

      it('should use fallback for plain object values', () => {
        const result = formatAudienceField('someField', { key: 'value' });

        expect(result).toEqual({
          type: 'text',
          value: FALLBACK_VALUE,
        });
      });

      it('should handle empty string', () => {
        const result = formatAudienceField('someField', '');

        expect(result).toEqual({
          type: 'text',
          value: '',
        });
      });

      it('should handle boolean values', () => {
        const resultTrue = formatAudienceField('someField', true);
        const resultFalse = formatAudienceField('someField', false);

        expect(resultTrue).toEqual({
          type: 'text',
          value: 'true',
        });

        expect(resultFalse).toEqual({
          type: 'text',
          value: 'false',
        });
      });
    });
  });
});
