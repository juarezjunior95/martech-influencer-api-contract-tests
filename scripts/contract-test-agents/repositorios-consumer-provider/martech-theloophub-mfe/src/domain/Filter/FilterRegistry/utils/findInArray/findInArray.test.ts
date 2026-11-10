import { findInArray } from './findInArray';

describe('findInArray', () => {
  describe('string arrays', () => {
    it('should find string in array of strings', () => {
      const arr = ['LATAM', 'APAC', 'EMEA'];

      expect(findInArray(arr, 'LATAM')).toBe(true);
    });

    it('should return false when string not found in array', () => {
      const arr = ['LATAM', 'APAC', 'EMEA'];

      expect(findInArray(arr, 'NAM')).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(findInArray([], 'LATAM')).toBe(false);
    });
  });

  describe('object arrays with default properties', () => {
    it('should find by value property', () => {
      const arr = [
        { value: 'BR', label: 'Brazil' },
        { value: 'US', label: 'United States' },
      ];

      expect(findInArray(arr, 'BR')).toBe(true);
    });

    it('should find by label property', () => {
      const arr = [
        { value: 'BR', label: 'Brazil' },
        { value: 'US', label: 'United States' },
      ];

      expect(findInArray(arr, 'Brazil')).toBe(true);
    });

    it('should find by code property', () => {
      const arr = [
        { code: 'BRL', name: 'Real' },
        { code: 'USD', name: 'Dollar' },
      ];

      expect(findInArray(arr, 'BRL')).toBe(true);
    });

    it('should find by name property', () => {
      const arr = [
        { code: 'BRL', name: 'Real' },
        { code: 'USD', name: 'Dollar' },
      ];

      expect(findInArray(arr, 'Real')).toBe(true);
    });

    it('should return false when value not found in any property', () => {
      const arr = [
        { value: 'BR', label: 'Brazil' },
        { value: 'US', label: 'United States' },
      ];

      expect(findInArray(arr, 'MX')).toBe(false);
    });
  });

  describe('object arrays with custom properties', () => {
    it('should find by custom property', () => {
      const arr = [
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' },
      ];

      expect(findInArray(arr, '1', ['id', 'title'])).toBe(true);
    });

    it('should not find if custom properties do not match', () => {
      const arr = [
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' },
      ];

      expect(findInArray(arr, 'Item 1', ['id'])).toBe(false);
    });

    it('should find in multiple custom properties', () => {
      const arr = [
        { id: '1', title: 'Item 1', category: 'A' },
        { id: '2', title: 'Item 2', category: 'B' },
      ];

      expect(findInArray(arr, 'A', ['id', 'category'])).toBe(true);
    });
  });

  describe('mixed arrays', () => {
    it('should handle mixed string and object arrays', () => {
      const arr = ['LATAM', { value: 'APAC', label: 'Asia Pacific' }];

      expect(findInArray(arr, 'LATAM')).toBe(true);
      expect(findInArray(arr, 'APAC')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined items gracefully', () => {
      const arr = [null, undefined, { value: 'BR' }];

      expect(findInArray(arr, 'BR')).toBe(true);
    });

    it('should handle objects without matching properties', () => {
      const arr = [{ id: '1' }, { id: '2' }];

      expect(findInArray(arr, 'BR')).toBe(false);
    });

    it('should return false when searching for empty string', () => {
      const arr = ['LATAM', 'APAC'];

      expect(findInArray(arr, '')).toBe(false);
    });
  });
});
