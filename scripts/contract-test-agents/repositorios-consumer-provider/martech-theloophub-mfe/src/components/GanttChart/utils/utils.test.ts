import { isWeekDelimiter } from './utils';

describe('isWeekDelimiter', () => {
  it('should return false for index 0', () => {
    expect(isWeekDelimiter(0)).toBe(false);
  });

  it('should return false for index 1', () => {
    expect(isWeekDelimiter(1)).toBe(false);
  });

  it('should return false for index 2', () => {
    expect(isWeekDelimiter(2)).toBe(false);
  });

  it('should return true for index 3', () => {
    expect(isWeekDelimiter(3)).toBe(true);
  });

  it('should return false for index 4', () => {
    expect(isWeekDelimiter(4)).toBe(false);
  });

  it('should return false for index 5', () => {
    expect(isWeekDelimiter(5)).toBe(false);
  });

  it('should return false for index 6', () => {
    expect(isWeekDelimiter(6)).toBe(false);
  });

  it('should return true for index 7', () => {
    expect(isWeekDelimiter(7)).toBe(true);
  });

  it('should return true for index 11', () => {
    expect(isWeekDelimiter(11)).toBe(true);
  });

  it('should return true for index 15', () => {
    expect(isWeekDelimiter(15)).toBe(true);
  });

  it('should return false for index 51', () => {
    expect(isWeekDelimiter(51)).toBe(false);
  });

  it('should return true for index 47', () => {
    expect(isWeekDelimiter(47)).toBe(true);
  });

  it('should return false for negative index', () => {
    expect(isWeekDelimiter(-1)).toBe(false);
  });

  it('should follow pattern (index - 3) % 4 === 0 for index >= 3 and index !== 51', () => {
    // Valid delimiters: 3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47
    const validDelimiters = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47];

    validDelimiters.forEach((index) => {
      expect(isWeekDelimiter(index)).toBe(true);
    });
  });

  it('should return false for indices that do not match the pattern', () => {
    const invalidIndices = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 51];

    invalidIndices.forEach((index) => {
      expect(isWeekDelimiter(index)).toBe(false);
    });
  });
});
