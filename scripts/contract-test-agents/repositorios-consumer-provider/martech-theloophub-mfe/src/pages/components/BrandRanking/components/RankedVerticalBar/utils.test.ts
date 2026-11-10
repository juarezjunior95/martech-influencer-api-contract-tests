import { getBarColors } from './utils';

jest.mock('theme', () => ({
  theme: {
    colors: {
      charts: {
        bg: {
          comparison: {
            primary: {
              low: '#primary-low',
            },
            secondary: {
              low: '#secondary-low',
            },
          },
        },
      },
    },
  },
}));

describe('getBarColors', () => {
  it('should return primary color for non-comp sources', () => {
    const result = getBarColors(['brand1']);

    expect(result).toEqual(['#primary-low']);
  });

  it('should return secondary color for "comp" source', () => {
    const result = getBarColors(['comp']);

    expect(result).toEqual(['#secondary-low']);
  });

  it('should return secondary color for "COMP" uppercase source', () => {
    const result = getBarColors(['COMP']);

    expect(result).toEqual(['#secondary-low']);
  });

  it('should return secondary color for "Comp" mixed case source', () => {
    const result = getBarColors(['Comp']);

    expect(result).toEqual(['#secondary-low']);
  });

  it('should return mixed colors for mixed source array', () => {
    const result = getBarColors(['brand1', 'comp', 'brand2']);

    expect(result).toEqual(['#primary-low', '#secondary-low', '#primary-low']);
  });

  it('should return default array with one primary color when source is undefined', () => {
    const result = getBarColors(undefined as unknown as string[]);

    expect(result).toEqual(['#primary-low']);
  });

  it('should return default array with one primary color when source is null', () => {
    const result = getBarColors(null as unknown as string[]);

    expect(result).toEqual(['#primary-low']);
  });

  it('should return empty array when source is empty', () => {
    const result = getBarColors([]);

    expect(result).toEqual([]);
  });

  it('should handle multiple comp values', () => {
    const result = getBarColors(['comp', 'comp', 'comp']);

    expect(result).toEqual([
      '#secondary-low',
      '#secondary-low',
      '#secondary-low',
    ]);
  });
});
