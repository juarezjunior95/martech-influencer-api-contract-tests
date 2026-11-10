import { roundNumbersTo } from './roundTo';

describe('roundTo', () => {
  describe('roundNumbersTo', () => {
    it('should round numbers to sum to 100 by default', () => {
      const result = roundNumbersTo([30, 30, 40]);
      const sum = result.reduce((acc, n) => acc + n, 0);
      expect(sum).toBeCloseTo(100, 1);
    });

    it('should round numbers to custom target', () => {
      const result = roundNumbersTo([25, 25, 50], 200);
      const sum = result.reduce((acc, n) => acc + n, 0);
      expect(sum).toBeCloseTo(200, 1);
    });

    it('should return array with same length', () => {
      const input = [10, 20, 30, 40];
      const result = roundNumbersTo(input);
      expect(result.length).toBe(input.length);
    });

    it('should handle empty array', () => {
      const result = roundNumbersTo([]);
      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const result = roundNumbersTo([100]);
      expect(result[0]).toBeCloseTo(100, 1);
    });

    it('should handle negative numbers', () => {
      const result = roundNumbersTo([-30, -30, -40]);
      result.forEach((n) => {
        expect(n).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return numbers with max 2 decimal places', () => {
      const result = roundNumbersTo([33.333, 33.333, 33.334]);
      result.forEach((n) => {
        const decimalPlaces = (n.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
      });
    });

    it('should handle numbers that already sum to target', () => {
      const result = roundNumbersTo([25, 25, 25, 25]);
      expect(result).toEqual([25, 25, 25, 25]);
    });

    it('should distribute adjustment proportionally', () => {
      const result = roundNumbersTo([10, 20, 30, 40]);
      expect(result[0]).toBeLessThan(result[1]);
      expect(result[1]).toBeLessThan(result[2]);
      expect(result[2]).toBeLessThan(result[3]);
    });

    it('should handle very small numbers', () => {
      const result = roundNumbersTo([0.001, 0.002, 0.003]);
      expect(result.length).toBe(3);
    });

    it('should handle zero in array', () => {
      const result = roundNumbersTo([0, 50, 50]);
      expect(result.length).toBe(3);
    });
  });
});
