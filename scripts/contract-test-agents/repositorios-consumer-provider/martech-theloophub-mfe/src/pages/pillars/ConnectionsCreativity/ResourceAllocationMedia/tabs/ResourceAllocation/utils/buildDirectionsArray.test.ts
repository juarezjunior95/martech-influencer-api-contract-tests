import { buildDirectionsArray } from './buildDirectionsArray';

describe('buildDirectionsArray', () => {
  it('returns empty string for the first element regardless of value', () => {
    const result = buildDirectionsArray([5, 20]);
    expect(result[0]).toBe('');
  });

  it('returns "down" when value is greater than 17', () => {
    const result = buildDirectionsArray([0, 18]);
    expect(result[1]).toBe('down');
  });

  it('returns empty string when value is 17 or less', () => {
    const result = buildDirectionsArray([0, 17]);
    expect(result[1]).toBe('');
  });

  it('returns empty string when value is 0', () => {
    const result = buildDirectionsArray([0, 0]);
    expect(result[1]).toBe('');
  });

  it('maps a full array correctly', () => {
    const result = buildDirectionsArray([10, 5, 20, 17]);
    expect(result).toEqual(['', '', 'down', '']);
  });

  it('returns an array with a single empty string for a single-element array', () => {
    const result = buildDirectionsArray([99]);
    expect(result).toEqual(['']);
  });

  it('returns an empty array for an empty input', () => {
    const result = buildDirectionsArray([]);
    expect(result).toEqual([]);
  });

  describe('when formattedData is provided', () => {
    it('uses formattedData value instead of raw data for threshold comparison', () => {
      const result = buildDirectionsArray([0, 10], ['0%', '48.9%']);
      expect(result[1]).toBe('down');
    });

    it('returns empty string when formattedData value is 17 or less', () => {
      const result = buildDirectionsArray([0, 50], ['0%', '17.0%']);
      expect(result[1]).toBe('');
    });

    it('always returns empty string for index 0 even with formattedData', () => {
      const result = buildDirectionsArray([99], ['99%']);
      expect(result[0]).toBe('');
    });

    it('falls back to raw value when formattedData entry is invalid', () => {
      const result = buildDirectionsArray([0, 20], ['0%', 'N/A']);
      expect(result[1]).toBe('down');
    });

    it('falls back to raw value when formattedData is shorter than data', () => {
      const result = buildDirectionsArray([0, 20], ['0%']);
      expect(result[1]).toBe('down');
    });
  });
});
