import { isDataEmpty } from './dataEmpty';

describe('dataEmpty', () => {
  describe('isDataEmpty', () => {
    it('should return true for null', () => {
      expect(isDataEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isDataEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isDataEmpty('')).toBe(true);
    });

    it('should return true for zero', () => {
      expect(isDataEmpty(0)).toBe(true);
    });

    it('should return true for false', () => {
      expect(isDataEmpty(false)).toBe(true);
    });

    it('should return true when data has #empty property set to true', () => {
      expect(isDataEmpty({ '#empty': true })).toBe(true);
    });

    it('should return true when data has empty property set to true', () => {
      expect(isDataEmpty({ empty: true })).toBe(true);
    });

    it('should return false for non-empty object', () => {
      expect(isDataEmpty({ value: 'test' })).toBe(false);
    });

    it('should return false for non-empty array', () => {
      expect(isDataEmpty([1, 2, 3])).toBe(false);
    });

    it('should return false when #empty is false', () => {
      expect(isDataEmpty({ '#empty': false })).toBe(false);
    });

    it('should return false when empty is false', () => {
      expect(isDataEmpty({ empty: false })).toBe(false);
    });

    it('should return false for truthy string', () => {
      expect(isDataEmpty('test')).toBe(false);
    });

    it('should return false for truthy number', () => {
      expect(isDataEmpty(123)).toBe(false);
    });

    it('should return false for true boolean', () => {
      expect(isDataEmpty(true)).toBe(false);
    });

    it('should return true when #empty is truthy string', () => {
      expect(isDataEmpty({ '#empty': 'yes' })).toBe(true);
    });

    it('should return true when empty is truthy number', () => {
      expect(isDataEmpty({ empty: 1 })).toBe(true);
    });
  });
});
